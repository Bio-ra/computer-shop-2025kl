import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Client } from "pg";
import { randomUUID } from "crypto";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

type Product = {
  code: string;
  name: string;
  description?: string | null;
  price: number | string;
  amount?: number;
  image?: string | null;
  type: string;
};

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set in environment");
  process.exit(1);
}

const client = new Client({ connectionString: DATABASE_URL });

async function main() {
  const dataPath = path.resolve(process.cwd(), "data", "products.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const products: Product[] = JSON.parse(raw) as Product[];

  await client.connect();
  try {
    await client.query("BEGIN");

    // Upsert categories
    const categoryNames = Array.from(new Set(products.map((p: any) => p.type)));
    const categoryMap: Record<string, number> = {};

    for (const name of categoryNames) {
      await client.query(
        "INSERT INTO categories(name) VALUES($1) ON CONFLICT (name) DO NOTHING",
        [name]
      );
      const res = await client.query(
        "SELECT id FROM categories WHERE name = $1",
        [name]
      );
      categoryMap[name] = res.rows[0].id;
    }

    // Upsert products
    for (const p of products) {
      const imagePath =
        typeof p.image === "string" ? p.image.replace(/^public\//, "") : null;
      const price =
        typeof p.price === "number" ? p.price.toString() : String(p.price);

      await client.query(
        `INSERT INTO products(code, name, description, price, stock, image, "categoryId", "createdAt", "updatedAt") \
         VALUES($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
         ON CONFLICT (code) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           price = EXCLUDED.price,
           stock = EXCLUDED.stock,
           image = EXCLUDED.image,
           "categoryId" = EXCLUDED."categoryId",
           "updatedAt" = NOW()`,
        [
          p.code,
          p.name,
          p.description ?? null,
          price,
          p.amount ?? 0,
          imagePath,
          categoryMap[p.type],
        ]
      );
    }

    // Create a sample user to own cart and orders — adapt to actual users table
    const colsRes = await client.query(
      "SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'users'"
    );
    const cols = colsRes.rows.reduce((acc: any, r: any) => {
      acc[r.column_name] = r;
      return acc;
    }, {} as Record<string, any>);

    const seedEmail = "seed@example.com";
    const seedName = "Seed User";
    const seedPassword = "password";

    const insertCols: string[] = [];
    const insertVals: any[] = [];
    const placeholders: string[] = [];
    let idx = 1;

    // id: if there's no default, we must provide one (DB was migrated to TEXT id without default)
    if (cols["id"]) {
      const hasDefault = !!cols["id"].column_default;
      if (!hasDefault) {
        insertCols.push('"id"');
        placeholders.push(`$${idx++}`);
        insertVals.push(randomUUID());
      }
    }

    if (cols["email"]) {
      insertCols.push('"email"');
      placeholders.push(`$${idx++}`);
      insertVals.push(seedEmail);
    }

    // prefer `name` (Auth.js) over legacy `fullName`
    if (cols["name"]) {
      insertCols.push('"name"');
      placeholders.push(`$${idx++}`);
      insertVals.push(seedName);
    } else if (cols["fullName"]) {
      insertCols.push('"fullName"');
      placeholders.push(`$${idx++}`);
      insertVals.push(seedName);
    }

    if (cols["password"]) {
      insertCols.push('"password"');
      placeholders.push(`$${idx++}`);
      insertVals.push(seedPassword);
    }

    // timestamps: use NOW() where present (no placeholder needed)
    if (cols["createdAt"]) {
      insertCols.push('"createdAt"');
      placeholders.push("NOW()");
    }
    if (cols["updatedAt"]) {
      insertCols.push('"updatedAt"');
      placeholders.push("NOW()");
    }

    if (insertCols.length === 0) {
      throw new Error("No suitable columns found on users table to insert seed user");
    }

    const insertSql = `INSERT INTO users(${insertCols.join(",")}) VALUES(${placeholders.join(",")}) ON CONFLICT (email) DO NOTHING`;
    await client.query(insertSql, insertVals);

    const userRes = await client.query("SELECT id FROM users WHERE email = $1", [seedEmail]);
    const userId = userRes.rows[0].id;

    // Create a sample cart (if not exists)
    await client.query(
      `INSERT INTO carts("userId", "createdAt", "updatedAt") VALUES($1,NOW(),NOW()) ON CONFLICT ("userId") DO NOTHING`,
      [userId]
    );
    const cartRes = await client.query(
      'SELECT id FROM carts WHERE "userId" = $1',
      [userId]
    );
    const cartId = cartRes.rows[0].id;

    // Helper to get product info by code
    async function getProduct(code: string) {
      const r = await client.query(
        "SELECT id, name, code, price FROM products WHERE code = $1",
        [code]
      );
      return r.rows[0];
    }

    // Add some items to the cart
    const cartItems = [
      { code: "WYSAH5E3SY", qty: 1 },
      { code: "BZFIXFDLRY", qty: 2 },
    ];
    for (const it of cartItems) {
      const prod = await getProduct(it.code);
      if (!prod) continue;
      await client.query(
        `INSERT INTO cart_items("cartId","productId",quantity,"createdAt","updatedAt") VALUES($1,$2,$3,NOW(),NOW()) ON CONFLICT ("cartId","productId") DO UPDATE SET quantity = EXCLUDED.quantity, "updatedAt" = NOW()`,
        [cartId, prod.id, it.qty]
      );
    }

    // Create at least 4 past orders with items
    const ordersData = [
      {
        status: "DELIVERED",
        items: [
          { code: "BRHY512AZT", qty: 1 },
          { code: "HOP0IEYG9X", qty: 1 },
        ],
        daysAgo: 40,
      },
      {
        status: "SHIPPED",
        items: [
          { code: "4LRNO0JDI9", qty: 1 },
          { code: "F68YVL40SW", qty: 3 },
        ],
        daysAgo: 28,
      },
      {
        status: "CANCELLED",
        items: [{ code: "LB7WUGPZT1", qty: 2 }],
        daysAgo: 15,
      },
      {
        status: "PROCESSING",
        items: [
          { code: "ZP7AE0E9WF", qty: 1 },
          { code: "16HC7H70P7", qty: 1 },
        ],
        daysAgo: 7,
      },
    ];

    for (const o of ordersData) {
      // compute total
      let total = 0;
      const itemRows: Array<any> = [];
      for (const it of o.items) {
        const prod = await getProduct(it.code);
        if (!prod) continue;
        const price = parseFloat(prod.price);
        total += price * it.qty;
        itemRows.push({
          productId: prod.id,
          qty: it.qty,
          price: price.toFixed(2),
          name: prod.name,
          code: prod.code,
        });
      }

      const createdAt = `NOW() - INTERVAL '${o.daysAgo} days'`;
      const orderNumber = randomUUID();
      const orderRes = await client.query(
        `INSERT INTO orders("orderNumber", status, total, "userId", "createdAt", "updatedAt") VALUES($1,$2,$3,$4,${createdAt},${createdAt}) RETURNING id`,
        [orderNumber, o.status, total.toFixed(2), userId]
      );
      const orderId = orderRes.rows[0].id;

      for (const ir of itemRows) {
        await client.query(
          `INSERT INTO order_items("orderId","productId",quantity,price,\"productName\",\"productCode\") VALUES($1,$2,$3,$4,$5,$6)`,
          [orderId, ir.productId, ir.qty, ir.price, ir.name, ir.code]
        );
      }
    }

    await client.query("COMMIT");

    const countRes = await client.query(
      "SELECT COUNT(*)::int AS count FROM products"
    );
    console.log(`Seed finished — products in DB: ${countRes.rows[0].count}`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error("Seeding failed:", e);
  process.exitCode = 1;
});
