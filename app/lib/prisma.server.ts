import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";


const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate())
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

let prisma: PrismaClientSingleton;

declare global {
  var prisma: PrismaClientSingleton;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = prismaClientSingleton();
} else {
  if (!global.prisma) {
    global.prisma = prismaClientSingleton();
  }
  prisma = global.prisma;
  prisma.$connect();
}

export { prisma };