import { PrismaClient } from "../../generated/prisma/client.js";

interface CreateTestCompanyUsernameHistoryOptions {
  companyId: string;
  username?: string;
  releasedAt?: Date;
  cooldownUntil?: Date;
  claimedByCompanyId?: string | null;
  claimedAt?: Date | null;
}

export async function createTestCompanyUsernameHistory(
  prisma: PrismaClient,
  options: CreateTestCompanyUsernameHistoryOptions,
) {
  const releasedAt = options.releasedAt ?? new Date();
  const cooldownUntil =
    options.cooldownUntil ??
    new Date(releasedAt.getTime() + 30 * 24 * 60 * 60 * 1000);

  return prisma.companyUsernameHistory.create({
    data: {
      companyId: options.companyId,
      username:
        options.username ?? `history_${crypto.randomUUID().slice(0, 8)}`,
      releasedAt,
      cooldownUntil,
      claimedByCompanyId: options.claimedByCompanyId ?? null,
      claimedAt: options.claimedAt ?? null,
    },
  });
}
