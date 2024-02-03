/*
  Warnings:

  - The values [DAYLY,YEARLLY] on the enum `RepeatInterval` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `Importent` on the `Task` table. All the data in the column will be lost.
  - Added the required column `listId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RepeatInterval_new" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'YEARLY', 'MONTHLY');
ALTER TABLE "Task" ALTER COLUMN "repeatInterval" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "repeatInterval" TYPE "RepeatInterval_new" USING ("repeatInterval"::text::"RepeatInterval_new");
ALTER TYPE "RepeatInterval" RENAME TO "RepeatInterval_old";
ALTER TYPE "RepeatInterval_new" RENAME TO "RepeatInterval";
DROP TYPE "RepeatInterval_old";
ALTER TABLE "Task" ALTER COLUMN "repeatInterval" SET DEFAULT 'NONE';
COMMIT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "Importent",
ADD COLUMN     "createAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "important" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "listId" TEXT NOT NULL,
ADD COLUMN     "order" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "dueDate" DROP NOT NULL,
ALTER COLUMN "dueDate" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
