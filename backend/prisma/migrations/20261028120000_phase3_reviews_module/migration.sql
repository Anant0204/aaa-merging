-- Phase 3 Reviews & Reputation Module Additive Migration
-- Database Engine: MariaDB 10.4+ / MySQL 8.0+
-- Prepared for Prisma Migrate: 20261028120000_phase3_reviews_module

-- CreateTable reviews
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `provider` ENUM('GOOGLE', 'META', 'CLUTCH', 'TRUSTPILOT', 'MANUAL') NOT NULL,
    `externalReviewId` VARCHAR(191) NULL,
    `authorName` VARCHAR(191) NOT NULL DEFAULT 'Anonymous',
    `authorEmail` VARCHAR(191) NULL,
    `authorPhotoUrl` TEXT NULL,
    `projectType` VARCHAR(191) NULL,
    `rating` INTEGER NOT NULL,
    `reviewText` TEXT NULL,
    `reviewDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sentiment` ENUM('POSITIVE', 'NEUTRAL', 'NEGATIVE') NOT NULL DEFAULT 'POSITIVE',
    `responseStatus` ENUM('UNRESPONDED', 'RESPONDED', 'NOT_REQUIRED') NOT NULL DEFAULT 'UNRESPONDED',
    `responseText` TEXT NULL,
    `respondedAt` DATETIME(3) NULL,
    `respondedById` VARCHAR(191) NULL,
    `status` ENUM('PUBLISHED', 'HIDDEN', 'FLAGGED') NOT NULL DEFAULT 'PUBLISHED',
    `isDemo` BOOLEAN NOT NULL DEFAULT false,
    `originalUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `reviews_provider_idx`(`provider`),
    INDEX `reviews_rating_idx`(`rating`),
    INDEX `reviews_sentiment_idx`(`sentiment`),
    INDEX `reviews_responseStatus_idx`(`responseStatus`),
    INDEX `reviews_isDemo_idx`(`isDemo`),
    UNIQUE INDEX `provider_external_id`(`provider`, `externalReviewId`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable review_provider_configs
CREATE TABLE `review_provider_configs` (
    `id` VARCHAR(191) NOT NULL,
    `provider` ENUM('GOOGLE', 'META', 'CLUTCH', 'TRUSTPILOT', 'MANUAL') NOT NULL,
    `status` ENUM('CONNECTED', 'DISCONNECTED', 'ERROR', 'CONFIG_REQUIRED', 'MANUAL_ONLY') NOT NULL DEFAULT 'CONFIG_REQUIRED',
    `accountIdentifier` VARCHAR(191) NULL,
    `encryptedApiKey` TEXT NULL,
    `encryptedApiSecret` TEXT NULL,
    `autoSyncEnabled` BOOLEAN NOT NULL DEFAULT false,
    `lastSyncAt` DATETIME(3) NULL,
    `lastSyncStatus` VARCHAR(191) NULL,
    `lastErrorMessage` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `review_provider_configs_provider_key`(`provider`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_respondedById_fkey` FOREIGN KEY (`respondedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

