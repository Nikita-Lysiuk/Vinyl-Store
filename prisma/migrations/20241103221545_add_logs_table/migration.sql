/*
  Warnings:

  - Added the required column `endpoint` to the `Logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Logs` ADD COLUMN `endpoint` VARCHAR(191) NOT NULL,
    ADD COLUMN `method` VARCHAR(191) NOT NULL;
