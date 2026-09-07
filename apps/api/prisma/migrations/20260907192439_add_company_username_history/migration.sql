-- CreateTable
CREATE TABLE "company_username_history" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "released_at" TIMESTAMPTZ(6) NOT NULL,
    "cooldown_until" TIMESTAMPTZ(6) NOT NULL,
    "claimed_by_company_id" UUID,
    "claimed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_username_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "company_username_history_company_id_idx" ON "company_username_history"("company_id");

-- CreateIndex
CREATE INDEX "company_username_history_username_idx" ON "company_username_history"("username");

-- CreateIndex
CREATE INDEX "company_username_history_claimed_by_company_id_idx" ON "company_username_history"("claimed_by_company_id");

-- AddForeignKey
ALTER TABLE "company_username_history" ADD CONSTRAINT "company_username_history_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_username_history" ADD CONSTRAINT "company_username_history_claimed_by_company_id_fkey" FOREIGN KEY ("claimed_by_company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
