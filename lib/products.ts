import products from "../data/products.json";

export type Product = {
  id: number;
  code: string;
  name: string;
  type: string;
  price: number;
  amount: number;
  description?: string;
  date: string;
  image: string;
};

export default products as Product[];