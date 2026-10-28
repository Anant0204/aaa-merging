-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: aaa-db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `aaa-db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `aaa-db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `aaa-db`;

--
-- Table structure for table `agent_schedules`
--

DROP TABLE IF EXISTS `agent_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agent_schedules` (
  `id` varchar(191) NOT NULL,
  `agentId` varchar(191) NOT NULL,
  `dayOfWeek` int(11) NOT NULL,
  `startTime` varchar(191) NOT NULL,
  `endTime` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agent_schedules`
--

LOCK TABLES `agent_schedules` WRITE;
/*!40000 ALTER TABLE `agent_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `agent_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_cycles`
--

DROP TABLE IF EXISTS `application_cycles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application_cycles` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) NOT NULL,
  `originalSubmissionDate` datetime(3) DEFAULT NULL,
  `refusalDate` datetime(3) DEFAULT NULL,
  `refusalReason` text DEFAULT NULL,
  `changesMade` text DEFAULT NULL,
  `resubmissionDate` datetime(3) DEFAULT NULL,
  `submissionReference` varchar(191) DEFAULT NULL,
  `submissionNotes` text DEFAULT NULL,
  `submissionReceiptUrl` varchar(191) DEFAULT NULL,
  `submittedById` varchar(191) DEFAULT NULL,
  `submittedAt` datetime(3) DEFAULT NULL,
  `lawyerAssigned` varchar(191) DEFAULT NULL,
  `appealSubmissionDate` datetime(3) DEFAULT NULL,
  `appealDeadline` datetime(3) DEFAULT NULL,
  `governmentDecision` text DEFAULT NULL,
  `governmentDecisionDate` datetime(3) DEFAULT NULL,
  `closureReason` text DEFAULT NULL,
  `closedById` varchar(191) DEFAULT NULL,
  `closedAt` datetime(3) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Resubmission in Progress',
  `serviceType` varchar(191) DEFAULT NULL,
  `type` varchar(191) DEFAULT 'resubmission',
  `appealDocuments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`appealDocuments`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `application_cycles_clientId_fkey` (`clientId`),
  CONSTRAINT `application_cycles_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_cycles`
--

LOCK TABLES `application_cycles` WRITE;
/*!40000 ALTER TABLE `application_cycles` DISABLE KEYS */;
/*!40000 ALTER TABLE `application_cycles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` varchar(191) NOT NULL,
  `leadId` varchar(191) DEFAULT NULL,
  `clientId` varchar(191) DEFAULT NULL,
  `documentId` varchar(191) DEFAULT NULL,
  `applicationId` varchar(191) DEFAULT NULL,
  `actorId` varchar(191) DEFAULT NULL,
  `actorName` varchar(191) DEFAULT NULL,
  `actorRole` varchar(191) DEFAULT NULL,
  `action` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `previousState` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`previousState`)),
  `newState` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`newState`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `audit_logs_applicationId_fkey` (`applicationId`),
  CONSTRAINT `audit_logs_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `application_cycles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blacklisted_clients`
--

DROP TABLE IF EXISTS `blacklisted_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blacklisted_clients` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `blacklisted_clients_email_key` (`email`),
  UNIQUE KEY `blacklisted_clients_phone_key` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklisted_clients`
--

LOCK TABLES `blacklisted_clients` WRITE;
/*!40000 ALTER TABLE `blacklisted_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `blacklisted_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_sessions`
--

DROP TABLE IF EXISTS `chat_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_sessions` (
  `id` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `currentState` varchar(191) NOT NULL DEFAULT 'START',
  `selectedVisa` varchar(191) DEFAULT NULL,
  `applicantsCount` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `chat_sessions_phone_key` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_sessions`
--

LOCK TABLES `chat_sessions` WRITE;
/*!40000 ALTER TABLE `chat_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` varchar(191) NOT NULL,
  `clientCode` varchar(191) DEFAULT NULL,
  `firstName` varchar(191) NOT NULL,
  `lastName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) DEFAULT NULL,
  `isTemporaryPassword` tinyint(1) NOT NULL DEFAULT 1,
  `phone` varchar(191) NOT NULL,
  `nationality` varchar(191) DEFAULT NULL,
  `countryOfResidence` varchar(191) DEFAULT NULL,
  `preferredLanguage` varchar(191) DEFAULT 'English',
  `serviceType` varchar(191) DEFAULT NULL,
  `packageId` varchar(191) DEFAULT NULL,
  `applicantsCount` varchar(191) DEFAULT 'Main Only',
  `status` varchar(191) NOT NULL DEFAULT 'Waiting for Payment',
  `visaStatus` varchar(191) NOT NULL DEFAULT 'Not Started',
  `documentUploadAllowed` tinyint(1) NOT NULL DEFAULT 0,
  `profileSummary` text DEFAULT NULL,
  `dependentsDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dependentsDetails`)),
  `caseComments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`caseComments`)),
  `sourceLanguage` varchar(191) DEFAULT NULL,
  `targetLanguage` varchar(191) DEFAULT NULL,
  `wordCount` int(11) DEFAULT NULL,
  `deviceFingerprint` varchar(191) DEFAULT NULL,
  `isBlocked` tinyint(1) NOT NULL DEFAULT 0,
  `googleReviewSubmitted` tinyint(1) NOT NULL DEFAULT 0,
  `preferableArea` varchar(191) DEFAULT NULL,
  `budget` varchar(191) DEFAULT NULL,
  `aiNotes` text DEFAULT NULL,
  `isAiFlagged` tinyint(1) NOT NULL DEFAULT 0,
  `flagReason` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `assignedToId` varchar(191) DEFAULT NULL,
  `assignedAt` datetime(3) DEFAULT NULL,
  `assignedHandlerId` varchar(191) DEFAULT NULL,
  `assignedHandlerName` varchar(191) DEFAULT NULL,
  `nextFollowUpDate` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_email_key` (`email`),
  UNIQUE KEY `clients_clientCode_key` (`clientCode`),
  KEY `clients_createdAt_idx` (`createdAt`),
  KEY `clients_assignedToId_fkey` (`assignedToId`),
  CONSTRAINT `clients_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES ('CL2001',NULL,'Elena','Petrova','elena@aaaconsultancy.com','$2b$10$8cR7wDfyNYLjDp9dMg8dZOZmP6HabAaGOtLdcSdmOjXjdG/t0aleq',0,'+971500000001',NULL,NULL,'English',NULL,NULL,'Main Only','Under Process','Under Process',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL,'2026-10-28 09:06:16.020','2026-10-28 09:06:16.020',NULL,NULL,NULL,NULL,NULL),('CL2002',NULL,'Chloe','Dupont','chloe@aaaconsultancy.com','$2b$10$8cR7wDfyNYLjDp9dMg8dZOZmP6HabAaGOtLdcSdmOjXjdG/t0aleq',0,'+971500000002',NULL,NULL,'English',NULL,NULL,'Main Only','Under Process','Under Process',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL,'2026-10-28 09:06:16.027','2026-10-28 09:06:16.027',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commission_rate_histories`
--

DROP TABLE IF EXISTS `commission_rate_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commission_rate_histories` (
  `id` varchar(191) NOT NULL,
  `agentId` varchar(191) NOT NULL,
  `oldRate` double NOT NULL,
  `newRate` double NOT NULL,
  `changedById` varchar(191) NOT NULL,
  `revenueAtChange` double NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `commission_rate_histories_agentId_fkey` (`agentId`),
  KEY `commission_rate_histories_changedById_fkey` (`changedById`),
  CONSTRAINT `commission_rate_histories_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `commission_rate_histories_changedById_fkey` FOREIGN KEY (`changedById`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commission_rate_histories`
--

LOCK TABLES `commission_rate_histories` WRITE;
/*!40000 ALTER TABLE `commission_rate_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `commission_rate_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `communication_logs`
--

DROP TABLE IF EXISTS `communication_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `communication_logs` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `name` varchar(191) DEFAULT NULL,
  `channel` varchar(191) NOT NULL,
  `direction` varchar(191) NOT NULL,
  `messageId` varchar(191) DEFAULT NULL,
  `externalProviderId` varchar(191) DEFAULT NULL,
  `deliveryStatus` varchar(191) NOT NULL,
  `readStatus` tinyint(1) NOT NULL DEFAULT 0,
  `failureReason` text DEFAULT NULL,
  `content` text NOT NULL,
  `respondedByUserId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `communication_logs_messageId_key` (`messageId`),
  KEY `communication_logs_clientId_fkey` (`clientId`),
  KEY `communication_logs_respondedByUserId_fkey` (`respondedByUserId`),
  CONSTRAINT `communication_logs_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `communication_logs_respondedByUserId_fkey` FOREIGN KEY (`respondedByUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `communication_logs`
--

LOCK TABLES `communication_logs` WRITE;
/*!40000 ALTER TABLE `communication_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `communication_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_settings`
--

DROP TABLE IF EXISTS `company_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company_settings` (
  `id` varchar(191) NOT NULL,
  `companyName` varchar(191) NOT NULL DEFAULT 'AAA Business Consultancy LLC',
  `phone` varchar(191) NOT NULL DEFAULT '+971 50 955 4142',
  `email` varchar(191) NOT NULL DEFAULT 'info@aaabusinessconsultancy.com',
  `address` varchar(191) NOT NULL DEFAULT 'Business Village, Block B, 4th Floor, Office F09, Deira, Dubai, UAE',
  `vatRate` double NOT NULL DEFAULT 5,
  `vatId` varchar(191) NOT NULL DEFAULT 'VAT-AE-2026-9932',
  `website` varchar(191) NOT NULL DEFAULT 'https://aaabusinessconsultancy.com',
  `incorporationDate` varchar(191) NOT NULL DEFAULT '2018-05-12',
  `autoAssignConsultant` tinyint(1) NOT NULL DEFAULT 1,
  `recordingStorage` varchar(191) NOT NULL DEFAULT 'cloud',
  `swornTranslationRates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`swornTranslationRates`)),
  `leadStages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`leadStages`)),
  `routingRules` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`routingRules`)),
  `refundGuaranteePercentage` double NOT NULL DEFAULT 50,
  `enableStripeRefunds` tinyint(1) NOT NULL DEFAULT 1,
  `enableManualBankPayouts` tinyint(1) NOT NULL DEFAULT 1,
  `lockClientRefundTab` tinyint(1) NOT NULL DEFAULT 1,
  `requireMeetingAcceptance` tinyint(1) NOT NULL DEFAULT 1,
  `customRefundTerms` text DEFAULT NULL,
  `customizationSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customizationSettings`)),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_settings`
--

LOCK TABLES `company_settings` WRITE;
/*!40000 ALTER TABLE `company_settings` DISABLE KEYS */;
INSERT INTO `company_settings` VALUES ('76f16cda-309e-437d-b556-917f0d85ab75','AAA Business Consultancy LLC','+971 50 955 4142','info@aaabusinessconsultancy.com','Business Village, Block B, 4th Floor, Office F09, Deira, Dubai, UAE',5,'VAT-AE-2026-9932','https://aaabusinessconsultancy.com','2018-05-12',1,'cloud',NULL,NULL,NULL,50,1,1,1,1,NULL,NULL,'2026-10-28 10:49:56.362');
/*!40000 ALTER TABLE `company_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultations`
--

DROP TABLE IF EXISTS `consultations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `consultations` (
  `id` varchar(191) NOT NULL,
  `date` varchar(191) NOT NULL,
  `timeSlot` varchar(191) NOT NULL,
  `durationMinutes` int(11) NOT NULL DEFAULT 20,
  `meetingLink` varchar(191) DEFAULT NULL,
  `zoomMeetingId` varchar(191) DEFAULT NULL,
  `recordingUrl` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Scheduled',
  `eligibility` varchar(191) DEFAULT NULL,
  `recommendedService` varchar(191) DEFAULT NULL,
  `recommendedPackageId` varchar(191) DEFAULT NULL,
  `internalNotes` text DEFAULT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'eligibility',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `leadId` varchar(191) DEFAULT NULL,
  `clientId` varchar(191) DEFAULT NULL,
  `consultantId` varchar(191) DEFAULT NULL,
  `assignedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `consultations_leadId_fkey` (`leadId`),
  KEY `consultations_clientId_fkey` (`clientId`),
  KEY `consultations_consultantId_fkey` (`consultantId`),
  CONSTRAINT `consultations_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `consultations_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `consultations_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultations`
--

LOCK TABLES `consultations` WRITE;
/*!40000 ALTER TABLE `consultations` DISABLE KEYS */;
/*!40000 ALTER TABLE `consultations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_codes`
--

DROP TABLE IF EXISTS `discount_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discount_codes` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `discountPercent` double NOT NULL DEFAULT 10,
  `expiryDate` datetime(3) NOT NULL,
  `isUsed` tinyint(1) NOT NULL DEFAULT 0,
  `usedAt` datetime(3) DEFAULT NULL,
  `usedByClientId` varchar(191) DEFAULT NULL,
  `usedInPaymentId` varchar(191) DEFAULT NULL,
  `clientId` varchar(191) DEFAULT NULL,
  `createdById` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `discount_codes_code_key` (`code`),
  KEY `discount_codes_code_idx` (`code`),
  KEY `discount_codes_isUsed_idx` (`isUsed`),
  KEY `discount_codes_expiryDate_idx` (`expiryDate`),
  KEY `discount_codes_clientId_fkey` (`clientId`),
  KEY `discount_codes_createdById_fkey` (`createdById`),
  CONSTRAINT `discount_codes_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `discount_codes_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_codes`
--

LOCK TABLES `discount_codes` WRITE;
/*!40000 ALTER TABLE `discount_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `discount_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `documents` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) NOT NULL,
  `applicationId` varchar(191) DEFAULT NULL,
  `checklistItemId` varchar(191) DEFAULT NULL,
  `version` int(11) NOT NULL DEFAULT 1,
  `name` text NOT NULL,
  `category` varchar(191) NOT NULL,
  `url` text NOT NULL,
  `translatedUrl` text DEFAULT NULL,
  `size` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Pending Verification',
  `comment` text DEFAULT NULL,
  `reviewedById` varchar(191) DEFAULT NULL,
  `reviewedAt` datetime(3) DEFAULT NULL,
  `uploadedDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `belongsTo` varchar(191) DEFAULT NULL,
  `wordCount` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `documents_checklistItemId_version_key` (`checklistItemId`,`version`),
  KEY `documents_clientId_fkey` (`clientId`),
  KEY `documents_applicationId_fkey` (`applicationId`),
  KEY `documents_reviewedById_fkey` (`reviewedById`),
  CONSTRAINT `documents_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `application_cycles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `documents_checklistItemId_fkey` FOREIGN KEY (`checklistItemId`) REFERENCES `resubmission_checklist_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `documents_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `documents_reviewedById_fkey` FOREIGN KEY (`reviewedById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leads` (
  `id` varchar(191) NOT NULL,
  `firstName` varchar(191) NOT NULL,
  `lastName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `nationality` varchar(191) DEFAULT NULL,
  `countryOfResidence` varchar(191) DEFAULT NULL,
  `preferredLanguage` varchar(191) DEFAULT 'English',
  `serviceType` varchar(191) DEFAULT NULL,
  `applicantsCount` varchar(191) DEFAULT 'Main Only',
  `source` varchar(191) DEFAULT NULL,
  `campaignId` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'New Lead',
  `notes` text DEFAULT NULL,
  `timeline` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`timeline`)),
  `qualificationData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`qualificationData`)),
  `dependentsDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dependentsDetails`)),
  `meetingPreferredDate` varchar(191) DEFAULT NULL,
  `meetingPreferredTime` varchar(191) DEFAULT NULL,
  `meetingPreferredLanguage` varchar(191) DEFAULT NULL,
  `meetingNotes` text DEFAULT NULL,
  `formSubmittedAt` datetime(3) DEFAULT NULL,
  `preferableArea` varchar(191) DEFAULT NULL,
  `budget` varchar(191) DEFAULT NULL,
  `sourceLanguage` varchar(191) DEFAULT NULL,
  `targetLanguage` varchar(191) DEFAULT NULL,
  `wordCount` int(11) DEFAULT NULL,
  `aiNotes` text DEFAULT NULL,
  `isAiFlagged` tinyint(1) NOT NULL DEFAULT 0,
  `flagReason` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `assignedToId` varchar(191) DEFAULT NULL,
  `assignedAt` datetime(3) DEFAULT NULL,
  `nextFollowUpDate` datetime(3) DEFAULT NULL,
  `clientId` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `leads_clientId_key` (`clientId`),
  KEY `leads_createdAt_idx` (`createdAt`),
  KEY `leads_assignedToId_fkey` (`assignedToId`),
  CONSTRAINT `leads_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `leads_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marketing_spend`
--

DROP TABLE IF EXISTS `marketing_spend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marketing_spend` (
  `id` varchar(191) NOT NULL,
  `channel` varchar(191) NOT NULL,
  `amount` double NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `marketing_spend_channel_key` (`channel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marketing_spend`
--

LOCK TABLES `marketing_spend` WRITE;
/*!40000 ALTER TABLE `marketing_spend` DISABLE KEYS */;
/*!40000 ALTER TABLE `marketing_spend` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'new_document',
  `title` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `clientId` varchar(191) DEFAULT NULL,
  `documentId` varchar(191) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) NOT NULL,
  `applicationId` varchar(191) DEFAULT NULL,
  `amount` double NOT NULL,
  `discount` double NOT NULL DEFAULT 0,
  `totalPaid` double NOT NULL DEFAULT 0,
  `commissionRate` double DEFAULT 0,
  `status` varchar(191) NOT NULL DEFAULT 'Pending',
  `refundStatus` varchar(191) DEFAULT 'None',
  `refundEligibility` tinyint(1) NOT NULL DEFAULT 0,
  `refundAmount` double DEFAULT 0,
  `refundReason` text DEFAULT NULL,
  `refundRejectionReason` text DEFAULT NULL,
  `refundProcessedAt` datetime(3) DEFAULT NULL,
  `refundProcessedBy` varchar(191) DEFAULT NULL,
  `paymentMethod` varchar(191) DEFAULT NULL,
  `transactionId` varchar(191) DEFAULT NULL,
  `gatewayId` varchar(191) DEFAULT NULL,
  `invoiceNumber` varchar(191) DEFAULT NULL,
  `billingDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `dueDate` datetime(3) NOT NULL,
  `packageType` varchar(191) DEFAULT NULL,
  `paymentPurpose` varchar(191) DEFAULT NULL,
  `additionalApplicants` int(11) DEFAULT 0,
  `assessmentCreditUsed` tinyint(1) NOT NULL DEFAULT 0,
  `creditReservedForPaymentId` varchar(191) DEFAULT NULL,
  `creditReservedUntil` datetime(3) DEFAULT NULL,
  `paidAt` datetime(3) DEFAULT NULL,
  `invoiceSnapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`invoiceSnapshot`)),
  `discountCodeId` varchar(191) DEFAULT NULL,
  `discountCode` varchar(191) DEFAULT NULL,
  `discountPercent` double DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_clientId_fkey` (`clientId`),
  KEY `payments_applicationId_fkey` (`applicationId`),
  CONSTRAINT `payments_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `application_cycles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payments_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refund_requests`
--

DROP TABLE IF EXISTS `refund_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refund_requests` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `reason` text DEFAULT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Pending Review',
  `proofUrl` varchar(191) DEFAULT NULL,
  `bankAccountName` varchar(191) DEFAULT NULL,
  `bankIban` varchar(191) DEFAULT NULL,
  `bankSwift` varchar(191) DEFAULT NULL,
  `payoutMethod` varchar(191) DEFAULT NULL,
  `transactionRef` varchar(191) DEFAULT NULL,
  `adminNotes` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `refund_requests_clientId_fkey` (`clientId`),
  CONSTRAINT `refund_requests_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refund_requests`
--

LOCK TABLES `refund_requests` WRITE;
/*!40000 ALTER TABLE `refund_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `refund_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relocation_packages`
--

DROP TABLE IF EXISTS `relocation_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relocation_packages` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `price` double NOT NULL,
  `additionalApplicantPrice` double DEFAULT 500,
  `isRecommended` tinyint(1) NOT NULL DEFAULT 0,
  `isFixedPrice` tinyint(1) NOT NULL DEFAULT 0,
  `isRefundable` tinyint(1) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `includes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`includes`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `relocation_packages_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relocation_packages`
--

LOCK TABLES `relocation_packages` WRITE;
/*!40000 ALTER TABLE `relocation_packages` DISABLE KEYS */;
/*!40000 ALTER TABLE `relocation_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reminder_logs`
--

DROP TABLE IF EXISTS `reminder_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reminder_logs` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `sentAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminder_logs`
--

LOCK TABLES `reminder_logs` WRITE;
/*!40000 ALTER TABLE `reminder_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `reminder_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resubmission_checklist_items`
--

DROP TABLE IF EXISTS `resubmission_checklist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resubmission_checklist_items` (
  `id` varchar(191) NOT NULL,
  `applicationId` varchar(191) NOT NULL,
  `templateKey` varchar(191) NOT NULL,
  `belongsTo` varchar(191) NOT NULL DEFAULT 'Main Applicant',
  `category` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `isMandatory` tinyint(1) NOT NULL DEFAULT 1,
  `dueDate` datetime(3) DEFAULT NULL,
  `clientInstructions` text DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'MISSING',
  `sourceDocumentId` varchar(191) DEFAULT NULL,
  `activeDocumentId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rci_appId_tmplKey_belongsTo_key` (`applicationId`,`templateKey`,`belongsTo`),
  UNIQUE KEY `resubmission_checklist_items_activeDocumentId_key` (`activeDocumentId`),
  KEY `resubmission_checklist_items_applicationId_idx` (`applicationId`),
  KEY `resubmission_checklist_items_status_idx` (`status`),
  KEY `resubmission_checklist_items_sourceDocumentId_idx` (`sourceDocumentId`),
  CONSTRAINT `resubmission_checklist_items_activeDocumentId_fkey` FOREIGN KEY (`activeDocumentId`) REFERENCES `documents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `resubmission_checklist_items_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `application_cycles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `resubmission_checklist_items_sourceDocumentId_fkey` FOREIGN KEY (`sourceDocumentId`) REFERENCES `documents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resubmission_checklist_items`
--

LOCK TABLES `resubmission_checklist_items` WRITE;
/*!40000 ALTER TABLE `resubmission_checklist_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `resubmission_checklist_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `templates` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL DEFAULT 'Template',
  `type` varchar(191) NOT NULL DEFAULT 'QUICK_REPLY',
  `category` varchar(191) NOT NULL DEFAULT 'QUICK_REPLY',
  `subject` varchar(191) DEFAULT NULL,
  `body` text NOT NULL,
  `contentSid` varchar(191) DEFAULT NULL,
  `twilioAccountSid` varchar(191) DEFAULT NULL,
  `approvalStatus` varchar(191) NOT NULL DEFAULT 'APPROVED',
  `language` varchar(191) NOT NULL DEFAULT 'en',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdBy` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` VALUES ('17eaf0da-66b3-411d-93f7-566b5f0ef9f3','Booking & Assessment Form','QUICK_REPLY','QUICK_REPLY',NULL,'Hello! 🇪🇸✈️ Thank you for connecting with AAA Business Consultancy LLC.\n\nTo check your full eligibility for Spain Visa & Residency (Digital Nomad, NLV, Golden Visa) and schedule your consultation, please complete our quick assessment form here:\n👉 https://aaa-crm-service.netlify.app/#/public/lead-form?source=Social_Comment\n\nOur team looks forward to assisting you!',NULL,NULL,'APPROVED','en',1,NULL,'2026-10-28 10:25:57.177','2026-10-28 10:25:57.177'),('c830cef9-b46c-4bcf-b48f-750ec2b98797','Greet','QUICK_REPLY','QUICK_REPLY',NULL,'Hello👋 \n\nWelcome to AAA Business Consultancy Services! \n\nWe’re here to help you with your Spain Visa, Residency & Relocation requirements. \n\nReply Hi to get started.',NULL,NULL,'APPROVED','en',1,NULL,'2026-10-28 10:25:57.177','2026-10-28 10:25:57.177');
/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `hotlineNumber` varchar(191) DEFAULT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'consultant',
  `spokenLanguages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`spokenLanguages`)),
  `nationalities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`nationalities`)),
  `commissionRate` double DEFAULT 0,
  `commissionType` varchar(191) DEFAULT '10%',
  `commissionPaid` double DEFAULT 0,
  `immigrationBio` text DEFAULT NULL,
  `customPermissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customPermissions`)),
  `visaExpertise` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`visaExpertise`)),
  `isPropertySpecialist` tinyint(1) NOT NULL DEFAULT 0,
  `languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`languages`)),
  `specialties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specialties`)),
  `isSenior` tinyint(1) NOT NULL DEFAULT 0,
  `maxCapacity` int(11) NOT NULL DEFAULT 20,
  `avatar` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdById` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  KEY `users_createdById_fkey` (`createdById`),
  CONSTRAINT `users_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('24732134-87b3-46b1-b643-12a0565fd3f7','Emily Finance','finance@aaaconsultancy.com','$2b$10$8cR7wDfyNYLjDp9dMg8dZOZmP6HabAaGOtLdcSdmOjXjdG/t0aleq',NULL,'finance',NULL,NULL,0,'10%',0,NULL,NULL,NULL,0,NULL,NULL,0,20,NULL,'2026-10-28 09:06:16.002','2026-10-28 09:06:16.002',NULL),('2d8910c2-ebdd-4d7e-bd9c-fe7fc5046375','Jessica Marketing','marketing@aaaconsultancy.com','$2b$10$8cR7wDfyNYLjDp9dMg8dZOZmP6HabAaGOtLdcSdmOjXjdG/t0aleq',NULL,'marketing',NULL,NULL,0,'10%',0,NULL,NULL,NULL,0,NULL,NULL,0,20,NULL,'2026-10-28 09:06:16.013','2026-10-28 09:06:16.013',NULL),('9ceeef69-d395-41e7-beb4-a12717226cca','Sarah Admin','admin@aaaconsultancy.com','$2b$10$8cR7wDfyNYLjDp9dMg8dZOZmP6HabAaGOtLdcSdmOjXjdG/t0aleq',NULL,'admin',NULL,NULL,0,'10%',0,NULL,NULL,NULL,0,NULL,NULL,0,20,NULL,'2026-10-28 09:06:15.987','2026-10-28 09:06:15.987',NULL),('b202a896-95c3-4792-b1df-73f0b873cb2a','John SuperAdmin','superadmin@aaaconsultancy.com','$2b$10$8cR7wDfyNYLjDp9dMg8dZOZmP6HabAaGOtLdcSdmOjXjdG/t0aleq',NULL,'super_admin',NULL,NULL,0,'10%',0,NULL,NULL,NULL,0,NULL,NULL,0,20,NULL,'2026-10-28 09:06:15.977','2026-10-28 09:06:15.977',NULL),('b44f78d1-4f67-4af3-a49a-298319a02991','Mark Operations','operations@aaaconsultancy.com','$2b$10$8cR7wDfyNYLjDp9dMg8dZOZmP6HabAaGOtLdcSdmOjXjdG/t0aleq',NULL,'operations',NULL,NULL,0,'10%',0,NULL,NULL,NULL,0,NULL,NULL,0,20,NULL,'2026-10-28 09:06:16.008','2026-10-28 09:06:16.008',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visa_services`
--

DROP TABLE IF EXISTS `visa_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visa_services` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `basePrice` double NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visa_services`
--

LOCK TABLES `visa_services` WRITE;
/*!40000 ALTER TABLE `visa_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `visa_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'aaa-db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-28 17:29:13
