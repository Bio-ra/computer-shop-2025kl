// ...transcription of the image...
import * as PrismaPkg from '@prisma/client';

// Support different module export styles across Prisma versions / build setups.
const PrismaClientCtor = (PrismaPkg as any).PrismaClient ?? (PrismaPkg as any).default ?? (PrismaPkg as any);

type PrismaClientType = InstanceType<typeof PrismaClientCtor> | any;

const globalForPrisma = global as unknown as { prisma?: PrismaClientType };

const prisma = globalForPrisma.prisma || new (PrismaClientCtor as any)();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;