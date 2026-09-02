import { PrismaService } from "../../database/prisma.service.js";

export async function cleanDatabase(prisma: PrismaService) {
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.media.deleteMany();
}
