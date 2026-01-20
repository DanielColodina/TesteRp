-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: rp_empreendimentos
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Admin Padrão','admin@empresa.com','$2a$10$aP4ruFadminsHIzLCaPI4SLYQhbegiPDsXrxOvVc3YSq3czaL1KwK','2026-01-20 00:14:52','2026-01-20 00:14:52'),(2,'Admin Teste','test@example.com','$2b$10$.pAiiWunVYIyQzqbUtUF1.sGGdWG/XxGxZ463WLoUxT61kxt.vuNC','2026-01-20 02:35:32','2026-01-20 02:35:32'),(3,'Admin Sistema','admin@rp.com','$2b$10$dMfytZSwsw/XClkqKuZRceHO4XuP3S6LHeq83G85I8/4DATQ91ptq','2026-01-20 23:32:39','2026-01-20 23:32:39');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `acao` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valor_anterior` text COLLATE utf8mb4_unicode_ci,
  `valor_novo` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin` (`admin_id`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `centro_custo`
--

DROP TABLE IF EXISTS `centro_custo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `centro_custo` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `obra_id` bigint DEFAULT NULL,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `centro_custo`
--

LOCK TABLES `centro_custo` WRITE;
/*!40000 ALTER TABLE `centro_custo` DISABLE KEYS */;
/*!40000 ALTER TABLE `centro_custo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checklist_usuarios`
--

DROP TABLE IF EXISTS `checklist_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checklist_usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `uso_solo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `licenca` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `condominio` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `habite_se` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `averbacao` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `vistoria` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `observacoes` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `checklist_usuarios_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checklist_usuarios`
--

LOCK TABLES `checklist_usuarios` WRITE;
/*!40000 ALTER TABLE `checklist_usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `checklist_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checklists`
--

DROP TABLE IF EXISTS `checklists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checklists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `obra_id` int NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descricao` text,
  `progresso` int DEFAULT '0',
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `obra_id` (`obra_id`),
  CONSTRAINT `checklists_ibfk_1` FOREIGN KEY (`obra_id`) REFERENCES `obras` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checklists`
--

LOCK TABLES `checklists` WRITE;
/*!40000 ALTER TABLE `checklists` DISABLE KEYS */;
/*!40000 ALTER TABLE `checklists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estoque_movimentacoes`
--

DROP TABLE IF EXISTS `estoque_movimentacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estoque_movimentacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_id` int DEFAULT NULL,
  `tipo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantidade` decimal(10,2) DEFAULT NULL,
  `obra_id` int DEFAULT NULL,
  `motivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_material` (`material_id`),
  KEY `obra_id` (`obra_id`),
  CONSTRAINT `estoque_movimentacoes_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materiais` (`id`) ON DELETE CASCADE,
  CONSTRAINT `estoque_movimentacoes_ibfk_2` FOREIGN KEY (`obra_id`) REFERENCES `obras` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estoque_movimentacoes`
--

LOCK TABLES `estoque_movimentacoes` WRITE;
/*!40000 ALTER TABLE `estoque_movimentacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `estoque_movimentacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etapas_obra`
--

DROP TABLE IF EXISTS `etapas_obra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etapas_obra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `obra_id` int DEFAULT NULL,
  `etapa_nome` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_termino` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_obra` (`obra_id`),
  CONSTRAINT `etapas_obra_ibfk_1` FOREIGN KEY (`obra_id`) REFERENCES `obras` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etapas_obra`
--

LOCK TABLES `etapas_obra` WRITE;
/*!40000 ALTER TABLE `etapas_obra` DISABLE KEYS */;
/*!40000 ALTER TABLE `etapas_obra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financeiro`
--

DROP TABLE IF EXISTS `financeiro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financeiro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` text COLLATE utf8mb4_unicode_ci,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `valor` double DEFAULT NULL,
  `data` text COLLATE utf8mb4_unicode_ci,
  `obra_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financeiro`
--

LOCK TABLES `financeiro` WRITE;
/*!40000 ALTER TABLE `financeiro` DISABLE KEYS */;
/*!40000 ALTER TABLE `financeiro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fornecedores`
--

DROP TABLE IF EXISTS `fornecedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornecedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cnpj` varchar(20) DEFAULT NULL,
  `contato` varchar(255) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `endereco` text,
  `ativo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornecedores`
--

LOCK TABLES `fornecedores` WRITE;
/*!40000 ALTER TABLE `fornecedores` DISABLE KEYS */;
/*!40000 ALTER TABLE `fornecedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionarios`
--

DROP TABLE IF EXISTS `funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text COLLATE utf8mb4_unicode_ci,
  `funcao` text COLLATE utf8mb4_unicode_ci,
  `salario` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionarios`
--

LOCK TABLES `funcionarios` WRITE;
/*!40000 ALTER TABLE `funcionarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `funcionarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historico`
--

DROP TABLE IF EXISTS `historico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `admin_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `historico_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico`
--

LOCK TABLES `historico` WRITE;
/*!40000 ALTER TABLE `historico` DISABLE KEYS */;
/*!40000 ALTER TABLE `historico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lancamento_custo`
--

DROP TABLE IF EXISTS `lancamento_custo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lancamento_custo` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `centro_custo_id` bigint DEFAULT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `valor` decimal(15,2) DEFAULT NULL,
  `data` date DEFAULT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `centro_custo_id` (`centro_custo_id`),
  CONSTRAINT `lancamento_custo_ibfk_1` FOREIGN KEY (`centro_custo_id`) REFERENCES `centro_custo` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lancamento_custo`
--

LOCK TABLES `lancamento_custo` WRITE;
/*!40000 ALTER TABLE `lancamento_custo` DISABLE KEYS */;
/*!40000 ALTER TABLE `lancamento_custo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materiais`
--

DROP TABLE IF EXISTS `materiais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materiais` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `unidade` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preco_unitario` decimal(10,2) DEFAULT NULL,
  `estoque_minimo` decimal(10,2) DEFAULT NULL,
  `fornecedor_padrao` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materiais`
--

LOCK TABLES `materiais` WRITE;
/*!40000 ALTER TABLE `materiais` DISABLE KEYS */;
/*!40000 ALTER TABLE `materiais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materiais_construtora`
--

DROP TABLE IF EXISTS `materiais_construtora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materiais_construtora` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` text COLLATE utf8mb4_unicode_ci,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `unidade` text COLLATE utf8mb4_unicode_ci,
  `quantidade` double DEFAULT NULL,
  `preco_medio` double DEFAULT NULL,
  `estoque_minimo` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materiais_construtora`
--

LOCK TABLES `materiais_construtora` WRITE;
/*!40000 ALTER TABLE `materiais_construtora` DISABLE KEYS */;
/*!40000 ALTER TABLE `materiais_construtora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materiais_obra`
--

DROP TABLE IF EXISTS `materiais_obra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materiais_obra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `obra_id` int DEFAULT NULL,
  `material_id` int DEFAULT NULL,
  `quantidade_estimada` decimal(10,2) DEFAULT NULL,
  `quantidade_inicial` decimal(10,2) DEFAULT NULL,
  `saldo_atual` decimal(10,2) DEFAULT NULL,
  `fase_obra` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_obra` (`obra_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `materiais_obra_ibfk_1` FOREIGN KEY (`obra_id`) REFERENCES `obras` (`id`) ON DELETE CASCADE,
  CONSTRAINT `materiais_obra_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materiais` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materiais_obra`
--

LOCK TABLES `materiais_obra` WRITE;
/*!40000 ALTER TABLE `materiais_obra` DISABLE KEYS */;
/*!40000 ALTER TABLE `materiais_obra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensagens`
--

DROP TABLE IF EXISTS `mensagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensagens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `de` text COLLATE utf8mb4_unicode_ci,
  `para` text COLLATE utf8mb4_unicode_ci,
  `mensagem` text COLLATE utf8mb4_unicode_ci,
  `data` text COLLATE utf8mb4_unicode_ci,
  `obra_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensagens`
--

LOCK TABLES `mensagens` WRITE;
/*!40000 ALTER TABLE `mensagens` DISABLE KEYS */;
/*!40000 ALTER TABLE `mensagens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obra_financeiro`
--

DROP TABLE IF EXISTS `obra_financeiro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obra_financeiro` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome_cliente` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endereco` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_obra` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valor_total` decimal(15,2) DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_finalizacao` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obra_financeiro`
--

LOCK TABLES `obra_financeiro` WRITE;
/*!40000 ALTER TABLE `obra_financeiro` DISABLE KEYS */;
/*!40000 ALTER TABLE `obra_financeiro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obras`
--

DROP TABLE IF EXISTS `obras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nome_obra` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `obras_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obras`
--

LOCK TABLES `obras` WRITE;
/*!40000 ALTER TABLE `obras` DISABLE KEYS */;
/*!40000 ALTER TABLE `obras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obras_construtora`
--

DROP TABLE IF EXISTS `obras_construtora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obras_construtora` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text COLLATE utf8mb4_unicode_ci,
  `endereco` text COLLATE utf8mb4_unicode_ci,
  `cliente` text COLLATE utf8mb4_unicode_ci,
  `orcamento` double DEFAULT NULL,
  `data_inicio` text COLLATE utf8mb4_unicode_ci,
  `data_fim` text COLLATE utf8mb4_unicode_ci,
  `status` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obras_construtora`
--

LOCK TABLES `obras_construtora` WRITE;
/*!40000 ALTER TABLE `obras_construtora` DISABLE KEYS */;
/*!40000 ALTER TABLE `obras_construtora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagamento`
--

DROP TABLE IF EXISTS `pagamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagamento` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lancamento_custo_id` bigint DEFAULT NULL,
  `valor` decimal(15,2) DEFAULT NULL,
  `data_pagamento` date DEFAULT NULL,
  `metodo_pagamento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lancamento_custo_id` (`lancamento_custo_id`),
  CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`lancamento_custo_id`) REFERENCES `lancamento_custo` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagamento`
--

LOCK TABLES `pagamento` WRITE;
/*!40000 ALTER TABLE `pagamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relatorios`
--

DROP TABLE IF EXISTS `relatorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relatorios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` text COLLATE utf8mb4_unicode_ci,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `tipo` text COLLATE utf8mb4_unicode_ci,
  `data` text COLLATE utf8mb4_unicode_ci,
  `obra_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relatorios`
--

LOCK TABLES `relatorios` WRITE;
/*!40000 ALTER TABLE `relatorios` DISABLE KEYS */;
/*!40000 ALTER TABLE `relatorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_financeiro`
--

DROP TABLE IF EXISTS `usuario_financeiro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_financeiro` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_financeiro`
--

LOCK TABLES `usuario_financeiro` WRITE;
/*!40000 ALTER TABLE `usuario_financeiro` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_financeiro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endereco` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `obra` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_obra` (`obra`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Daniel','admin@empresa.com','11999999999','Rua A, 100','Obra A',1,'2026-01-20 00:14:52','2026-01-20 00:14:52'),(2,'Daniel','teste@teste.com','11888888888','Rua B, 200','Obra B',1,'2026-01-20 00:14:52','2026-01-20 00:14:52'),(3,'Arroz','silvasktnj@gmail.com','11777777777','Rua C, 300','Obra C',1,'2026-01-20 00:14:52','2026-01-20 00:14:52'),(4,'Daniel','danielassuncao1129@gmail.com','11666666666','Rua D, 400','Obra D',1,'2026-01-20 00:14:52','2026-01-20 00:14:52'),(5,'MARIA ANTONIA SANTOS OLIVEIRA','teste2@teste.com','11555555555','Rua E, 500','Obra E',1,'2026-01-20 00:14:52','2026-01-20 00:14:52');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-20 20:33:19
