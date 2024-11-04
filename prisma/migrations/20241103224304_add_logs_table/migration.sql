/*
  Warnings:

  - You are about to alter the column `method` on the `Logs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Logs` MODIFY `method` ENUM('POST', 'PUT', 'DELETE') NOT NULL;
