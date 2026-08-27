/*
  Warnings:

  - You are about to drop the column `website_url` on the `companies` table. All the data in the column will be lost.
  - Added the required column `person_type` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('INDIVIDUAL', 'LEGAL_ENTITY');

-- AlterEnum
ALTER TYPE "CompanyStatus" ADD VALUE 'SUSPENDED';

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "website_url",
ADD COLUMN     "person_type" "PersonType" NOT NULL;
