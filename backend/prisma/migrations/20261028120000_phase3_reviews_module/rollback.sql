-- Phase 3 Reviews & Reputation Module Rollback Script
-- WARNING: Executing this script will permanently DROP the `reviews` and `review_provider_configs` tables.
-- Any review records, client ratings, and responses created post-migration will be permanently deleted.
-- Pre-existing tables (users, leads, clients, consultations, settings) are NOT dropped or modified.

-- 1. Drop foreign key constraint on reviews table
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_respondedById_fkey`;

-- 2. Drop reviews table
DROP TABLE IF EXISTS `reviews`;

-- 3. Drop review_provider_configs table
DROP TABLE IF EXISTS `review_provider_configs`;

