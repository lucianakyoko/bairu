import { PrismaService } from "../database/prisma.service.js";

describe("Test database", () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("connects to the test database", async () => {
    const result = await prisma.$queryRaw<
      Array<{ current_database: string }>
    >`SELECT current_database()`;

    expect(result[0]?.current_database).toBe("bairu_test");
  });
});
