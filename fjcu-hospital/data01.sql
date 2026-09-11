-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: fjcu_hospital
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `patient_id` varchar(20) NOT NULL COMMENT '病歷號',
  `name` varchar(50) NOT NULL COMMENT '姓名',
  `gender` char(1) DEFAULT NULL COMMENT '性別 (M:男, F:女)',
  `age` varchar(10) NOT NULL COMMENT '歲數 (Y:歲, M:月, D:天)',
  `birth_date` date DEFAULT NULL COMMENT '出生年月日',
  PRIMARY KEY (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES ('001122334H','趙子龍','M','14D','2026-08-22'),('001248831A','王大明','M','45Y','1981-01-01'),('002233445E','李雅婷','F','28Y','1998-07-22'),('004561239B','林梅','F','82Y','1944-01-01'),('005544332G','黃阿嬌','F','75Y','1951-05-05'),('007766554D','張建國','M','60Y','1966-03-15'),('008899112F','吳宇軒','M','3Y','2023-01-01'),('009988223C','陳小寶','M','3M','2026-06-05');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `triage_records`
--

DROP TABLE IF EXISTS `triage_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `triage_records` (
  `triage_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '檢傷紀錄ID',
  `patient_id` varchar(20) NOT NULL COMMENT '病歷號 (關聯patients表)',
  `triage_level` int(11) NOT NULL COMMENT '檢傷級數 (1-5級)',
  `chief_complaint` text DEFAULT NULL COMMENT '護理主訴摘要',
  PRIMARY KEY (`triage_id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `triage_records_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `triage_records`
--

LOCK TABLES `triage_records` WRITE;
/*!40000 ALTER TABLE `triage_records` DISABLE KEYS */;
INSERT INTO `triage_records` VALUES (1,'001248831A',2,'胸痛，壓迫感，延伸至左臂，伴隨冒冷汗。持續約30分鐘未緩解。'),(2,'009988223C',3,'發燒兩天，最高至39.5度，食慾下降，有輕微咳嗽。家屬表示早上有熱痙攣情形約1分鐘。'),(3,'004561239B',1,'意識不清，叫喚無反應，家屬發現倒臥於浴室。GCS E1V1M4。'),(4,'007766554D',4,'主訴昨日騎車自摔，右側手肘與膝蓋擦傷，今覺紅腫疼痛來院換藥。無發燒。'),(5,'002233445E',2,'嚴重下腹痛，伴隨噁心嘔吐。家屬表示懷孕約8週，且陰道有些微出血，需排除子宮外孕。'),(6,'008899112F',5,'喉嚨痛、流鼻水三天，無發燒、無胸悶，自行步入急診要求開立感冒藥。'),(7,'005544332G',1,'119送入，家屬表示進食噎到，到院前心肺功能停止(OHCA)，持續CPR中。'),(8,'001122334H',3,'新生兒發燒38.2度，活力稍差、奶量減少，家屬帶至急診評估。');
/*!40000 ALTER TABLE `triage_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vital_signs`
--

DROP TABLE IF EXISTS `vital_signs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vital_signs` (
  `vital_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '生命徵象紀錄ID',
  `patient_id` varchar(20) NOT NULL COMMENT '病歷號 (關聯patients表)',
  `measured_at` datetime NOT NULL COMMENT '量測時間',
  `temperature` decimal(4,1) DEFAULT NULL COMMENT '體溫 (°C)',
  `heart_rate` int(11) DEFAULT NULL COMMENT '心跳 (bpm)',
  `respiratory_rate` int(11) DEFAULT NULL COMMENT '呼吸頻率 (次/分)',
  `systolic_bp` int(11) DEFAULT NULL COMMENT '收縮壓 (mmHg)',
  `diastolic_bp` int(11) DEFAULT NULL COMMENT '舒張壓 (mmHg)',
  `spo2` int(11) DEFAULT NULL COMMENT '血氧飽和度 (%)',
  PRIMARY KEY (`vital_id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `vital_signs_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vital_signs`
--

LOCK TABLES `vital_signs` WRITE;
/*!40000 ALTER TABLE `vital_signs` DISABLE KEYS */;
INSERT INTO `vital_signs` VALUES (1,'001248831A','2026-09-05 13:20:00',36.8,115,24,180,95,92),(2,'009988223C','2026-09-05 13:45:00',39.2,140,30,95,60,97),(3,'004561239B','2026-09-05 14:05:00',35.5,45,8,80,40,88),(4,'007766554D','2026-09-05 14:30:00',37.1,82,18,130,80,99),(5,'002233445E','2026-09-05 14:45:00',37.5,105,20,100,60,98),(6,'008899112F','2026-09-05 15:00:00',36.6,100,22,98,62,100),(7,'005544332G','2026-09-05 15:15:00',35.0,0,0,0,0,0),(8,'001122334H','2026-09-05 15:30:00',38.2,155,42,75,45,98);
/*!40000 ALTER TABLE `vital_signs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-11 23:22:38
