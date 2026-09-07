/*
  Warnings:

  - You are about to drop the column `slug` on the `companies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "companies_slug_key";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "slug",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companies_username_key" ON "companies"("username");
