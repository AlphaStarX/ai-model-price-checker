-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "consecutiveScrapeFailures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastScrapeFailedAt" TIMESTAMP(3);
