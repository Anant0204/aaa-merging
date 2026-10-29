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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-29 12:15:42
