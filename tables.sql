-- MySQL dump 10.13  Distrib 5.7.16, for Linux (x86_64)
--
-- Host: localhost    Database: plugin
-- ------------------------------------------------------
-- Server version	5.7.16-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access`
--

DROP TABLE IF EXISTS `access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(15) unsigned NOT NULL,
  `login` varchar(64) NOT NULL,
  `level` int(2) unsigned NOT NULL,
  `clan` varchar(64) NOT NULL,
  `align` float NOT NULL DEFAULT '0',
  `lastip` varchar(16) NOT NULL,
  `lastuse` bigint(255) NOT NULL,
  `iplist` text NOT NULL,
  `access` tinyint(2) unsigned NOT NULL DEFAULT '0' COMMENT '0=blocked,1=user,2=developer',
  `password` varchar(255) NOT NULL,
  `vip` bigint(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`),
  UNIQUE KEY `login` (`login`),
  KEY `level` (`level`),
  KEY `lastuse` (`lastuse`)
) ENGINE=InnoDB AUTO_INCREMENT=2532 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `actions`
--

DROP TABLE IF EXISTS `actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actions` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `who` int(255) NOT NULL,
  `atime` bigint(255) NOT NULL,
  `what` varchar(255) NOT NULL,
  `whom` bigint(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `who` (`who`,`atime`,`whom`)
) ENGINE=InnoDB AUTO_INCREMENT=2109 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vip`
--

DROP TABLE IF EXISTS `vip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vip` (
  `uid` int(15) unsigned NOT NULL,
  `login` varchar(64) NOT NULL,
  `level` int(2) unsigned NOT NULL DEFAULT '1',
  `clan` varchar(64) NOT NULL DEFAULT '',
  `align` float NOT NULL DEFAULT '0',
  `lastip` varchar(16) NOT NULL DEFAULT '',
  `firstuse` bigint(255) NOT NULL,
  `lastuse` bigint(255) NOT NULL,
  `iplists` text NOT NULL,
  `access` tinyint(2) unsigned NOT NULL DEFAULT '0' COMMENT '0=blocked,1=user,2=developer',
  `password` varchar(255) NOT NULL DEFAULT '',
  `vip` bigint(255) NOT NULL DEFAULT '0',
  `silver` varchar(32) NOT NULL DEFAULT '',
  `bid` bigint(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uid` (`uid`),
  UNIQUE KEY `login` (`login`),
  KEY `level` (`level`),
  KEY `lastuse` (`lastuse`),
  KEY `silver` (`silver`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-12-20 13:07:15
