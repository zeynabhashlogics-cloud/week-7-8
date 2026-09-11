import "dotenv/config";

import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.tasks.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("12345678", 10);

  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    },
  });

  await prisma.tasks.createMany({
    data: [
      {
        title: "Learn Prisma",
        description: "Learn Prisma models and migrations.",
        status: "pending",
        priority: "high",
        dueDate: new Date("2026-09-15"),
        userId: user.id,
      },
      {
        title: "Build API",
        description: "Test the task management API.",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2026-09-18"),
        userId: user.id,
      },
      {
        title: "Test database",
        description: "Test database operations.",
        status: "completed",
        priority: "low",
        dueDate: new Date("2026-09-10"),
        userId: user.id,
      },
    ],
  });

  console.log("Database seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });