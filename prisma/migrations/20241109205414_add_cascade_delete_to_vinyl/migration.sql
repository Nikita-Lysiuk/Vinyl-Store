-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_vinylId_fkey`;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_vinylId_fkey` FOREIGN KEY (`vinylId`) REFERENCES `Vinyl`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
