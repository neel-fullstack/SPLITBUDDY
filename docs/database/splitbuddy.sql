-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 13, 2025 at 05:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `splitbuddy`
--

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expense_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `paid_by` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `settled` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expense_id`, `group_id`, `paid_by`, `description`, `category`, `amount`, `currency`, `created_at`, `settled`) VALUES
(66, 27, 9, 'hhh', NULL, 5500, 'USD', '2025-09-17 12:02:49', 0),
(67, 27, 15, 'lolly', NULL, 700, 'INR', '2025-09-17 12:06:43', 0),
(68, 27, 10, 'breakfast', NULL, 4000, 'INR', '2025-09-17 12:28:58', 0),
(69, 27, 15, 'tea', NULL, 800, 'INR', '2025-09-17 12:44:03', 0),
(70, 27, 8, 'papad', NULL, 800, 'INR', '2025-09-17 12:44:44', 0),
(71, 27, 8, 'ganpati visarjan', NULL, 7890, 'INR', '2025-09-17 16:56:47', 0),
(72, 27, 15, 'laddu', NULL, 5000, 'INR', '2025-09-18 09:47:32', 0),
(75, 28, 14, 'lunch', NULL, 500, 'INR', '2025-09-18 11:50:18', 0),
(76, 28, 9, 'break fast', NULL, 10000, 'INR', '2025-09-18 11:50:49', 0),
(88, 28, 8, 'lunch with friend', NULL, 1500, 'INR', '2025-09-19 20:34:14', 0),
(89, 28, 8, 'kashmir', NULL, 5000, 'INR', '2025-09-20 04:34:31', 0),
(91, 33, 14, 'test', NULL, 5000, 'INR', '2025-09-20 05:30:21', 0),
(95, 28, 14, 'ganpati', NULL, 10000, 'INR', '2025-09-23 07:40:14', 0),
(98, 31, 15, 'road trip', NULL, 4000, 'INR', '2025-09-23 07:47:40', 0),
(99, 33, 10, 'icce cream', NULL, 5641, 'INR', '2025-09-23 07:49:51', 0),
(100, 31, 12, 'navratri passes', NULL, 9588, 'INR', '2025-09-23 20:05:58', 0),
(101, 31, 9, 'passes day 4', NULL, 8654, 'INR', '2025-09-23 20:11:13', 0),
(102, 28, 9, 'navratri', NULL, 9999, 'INR', '2025-09-23 20:47:35', 0),
(103, 28, 10, 'yyyy', NULL, 95848, 'INR', '2025-09-23 20:48:10', 0),
(104, 28, 8, 'kkk', NULL, 87878, 'INR', '2025-09-23 20:51:07', 0),
(107, 28, 15, 'prtyyy', NULL, 808978, 'INR', '2025-09-24 05:47:51', 0),
(108, 33, 9, 'nvratri', NULL, 5000, 'INR', '2025-09-24 05:50:26', 0),
(109, 33, 10, 'holi', NULL, 80000, 'INR', '2025-09-24 05:50:53', 0),
(110, 33, 14, 'lolly', NULL, 8796, 'INR', '2025-09-24 06:02:04', 0),
(111, 33, 10, 'rass lila', NULL, 8754, 'INR', '2025-09-24 06:06:14', 0),
(112, 33, 10, 'garba', NULL, 10000, 'INR', '2025-09-24 06:06:51', 0),
(113, 42, 25, 'petrol', NULL, 3500, 'INR', '2025-10-06 07:01:35', 0),
(114, 42, 10, 'petrolll', NULL, 145200, 'INR', '2025-10-06 07:06:31', 0),
(115, 42, 25, 'jndfnjdf', NULL, 1452, 'INR', '2025-10-06 07:12:16', 0),
(116, 42, 25, 'vyyufyf', NULL, 21465245, 'INR', '2025-10-06 07:12:48', 0),
(117, 42, 30, 'ffrgrg', NULL, 2746343, 'INR', '2025-10-06 07:28:59', 0),
(118, 43, 10, 'Petrol', NULL, 10000, 'INR', '2025-10-06 07:47:51', 0),
(121, 43, 26, 'bdsjvb', NULL, 52000, 'INR', '2025-10-06 08:20:39', 0),
(126, 44, 25, 'Rides', NULL, 5000, 'INR', '2025-10-10 16:30:34', 0),
(127, 44, 25, 'vdk', NULL, 2000, 'INR', '2025-10-10 16:49:18', 0),
(128, 44, 25, 'dhjdf', NULL, 50, 'INR', '2025-10-10 17:02:20', 0),
(129, 44, 28, ' kdwjb', NULL, 442, 'INR', '2025-10-10 17:02:37', 0),
(130, 45, 26, 'kolapur', NULL, 87524, 'INR', '2025-10-13 06:47:08', 0),
(131, 46, 22, 'heloi', NULL, 5789, 'INR', '2025-10-13 06:48:16', 0),
(132, 47, 21, 'laundry', NULL, 5789, 'EUR', '2025-10-13 07:02:52', 0),
(133, 48, 8, 'police', NULL, 58975, 'USD', '2025-10-13 07:14:37', 0),
(134, 49, 14, 'kerala', NULL, 5874, 'JPY', '2025-10-13 08:12:42', 0),
(135, 50, 26, 'fhyf', NULL, 25, 'USD', '2025-10-13 08:58:31', 0);

-- --------------------------------------------------------

--
-- Table structure for table `expense_splits`
--

CREATE TABLE `expense_splits` (
  `split_id` int(11) NOT NULL,
  `expense_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `share_amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expense_splits`
--

INSERT INTO `expense_splits` (`split_id`, `expense_id`, `user_id`, `share_amount`) VALUES
(78, 66, 15, 1375),
(79, 66, 10, 1375),
(80, 66, 9, 1375),
(81, 66, 8, 1375),
(82, 67, 9, 175),
(83, 67, 10, 175),
(84, 67, 15, 175),
(85, 67, 8, 175),
(86, 68, 8, 1000),
(87, 68, 9, 1000),
(88, 68, 10, 1000),
(89, 68, 15, 1000),
(90, 69, 9, 200),
(91, 69, 8, 200),
(92, 69, 10, 200),
(93, 69, 15, 200),
(94, 70, 9, 400),
(95, 70, 10, 400),
(96, 71, 8, 1972),
(97, 71, 9, 1972),
(98, 71, 10, 1972),
(99, 71, 15, 1972),
(100, 72, 8, 1250),
(101, 72, 9, 1250),
(102, 72, 10, 1250),
(103, 72, 15, 1250),
(111, 75, 14, 100),
(112, 75, 8, 100),
(113, 75, 9, 100),
(114, 75, 10, 100),
(115, 75, 15, 100),
(116, 76, 14, 2000),
(117, 76, 8, 2000),
(118, 76, 9, 2000),
(119, 76, 10, 2000),
(120, 76, 15, 2000),
(140, 88, 14, 500),
(141, 88, 8, 500),
(142, 88, 9, 500),
(143, 89, 8, 1000),
(144, 89, 14, 1000),
(145, 89, 9, 1000),
(146, 89, 10, 1000),
(147, 89, 15, 1000),
(150, 91, 9, 1667),
(151, 91, 14, 1667),
(152, 91, 10, 1667),
(166, 95, 9, 3333),
(167, 95, 10, 3333),
(168, 95, 15, 3333),
(177, 98, 12, 1333),
(178, 98, 10, 1333),
(179, 98, 9, 1333),
(180, 99, 14, 2820),
(181, 99, 9, 2820),
(182, 100, 14, 1918),
(183, 100, 8, 1918),
(184, 100, 15, 1918),
(185, 100, 12, 1918),
(186, 100, 10, 1918),
(187, 101, 14, 1731),
(188, 101, 8, 1731),
(189, 101, 15, 1731),
(190, 101, 12, 1731),
(191, 101, 10, 1731),
(192, 102, 8, 2000),
(193, 102, 9, 2000),
(194, 102, 14, 2000),
(195, 102, 10, 2000),
(196, 102, 15, 2000),
(197, 103, 9, 19170),
(198, 103, 10, 19170),
(199, 103, 15, 19170),
(200, 103, 14, 19170),
(201, 103, 8, 19170),
(202, 104, 9, 17576),
(203, 104, 10, 17576),
(204, 104, 15, 17576),
(205, 104, 14, 17576),
(206, 104, 8, 17576),
(217, 107, 14, 161796),
(218, 107, 8, 161796),
(219, 107, 9, 161796),
(220, 107, 10, 161796),
(221, 107, 15, 161796),
(222, 108, 14, 1667),
(223, 108, 9, 1667),
(224, 108, 10, 1667),
(225, 109, 14, 26667),
(226, 109, 9, 26667),
(227, 109, 10, 26667),
(228, 110, 9, 2932),
(229, 110, 10, 2932),
(230, 110, 14, 2932),
(231, 111, 14, 2918),
(232, 111, 9, 2918),
(233, 111, 10, 2918),
(234, 112, 14, 3333),
(235, 112, 9, 3333),
(236, 112, 10, 3333),
(237, 113, 25, 3500),
(238, 114, 25, 29040),
(239, 114, 10, 29040),
(240, 114, 30, 29040),
(241, 114, 8, 29040),
(242, 114, 29, 29040),
(243, 115, 10, 363),
(244, 115, 25, 363),
(245, 115, 30, 363),
(246, 115, 8, 363),
(247, 116, 25, 5366311),
(248, 116, 30, 5366311),
(249, 116, 10, 5366311),
(250, 116, 8, 5366311),
(251, 117, 10, 686586),
(252, 117, 25, 686586),
(253, 117, 8, 686586),
(254, 117, 29, 686586),
(255, 118, 31, 2500),
(256, 118, 26, 2500),
(257, 118, 10, 2500),
(258, 118, 20, 2500),
(264, 121, 26, 17333),
(265, 121, 31, 17333),
(266, 121, 8, 17333),
(280, 126, 25, 2500),
(281, 126, 26, 2500),
(282, 127, 25, 1000),
(283, 127, 26, 1000),
(284, 128, 25, 10),
(285, 128, 26, 10),
(286, 128, 28, 10),
(287, 128, 29, 10),
(288, 128, 22, 10),
(289, 129, 25, 88),
(290, 129, 26, 88),
(291, 129, 28, 88),
(292, 129, 29, 88),
(293, 129, 22, 88),
(294, 130, 14, 17505),
(295, 130, 22, 17505),
(296, 130, 26, 17505),
(297, 130, 10, 17505),
(298, 130, 29, 17505),
(299, 131, 14, 965),
(300, 131, 22, 965),
(301, 131, 26, 965),
(302, 131, 10, 965),
(303, 131, 8, 965),
(304, 131, 9, 965),
(305, 132, 14, 1158),
(306, 132, 21, 1158),
(307, 132, 25, 1158),
(308, 132, 29, 1158),
(309, 132, 31, 1158),
(310, 133, 14, 11795),
(311, 133, 8, 11795),
(312, 133, 10, 11795),
(313, 133, 9, 11795),
(314, 133, 12, 11795),
(315, 134, 14, 839),
(316, 134, 10, 839),
(317, 134, 12, 839),
(318, 134, 22, 839),
(319, 134, 25, 839),
(320, 134, 26, 839),
(321, 134, 29, 839),
(322, 135, 14, 6),
(323, 135, 30, 6),
(324, 135, 31, 6),
(325, 135, 26, 6);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL,
  `group_name` varchar(100) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `currency` varchar(8) DEFAULT 'INR'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`group_id`, `group_name`, `created_by`, `created_at`, `currency`) VALUES
(27, 'pizza party', 15, '2025-09-17 12:02:16', 'INR'),
(28, 'college', 14, '2025-09-18 11:49:54', 'INR'),
(31, 'Happy', 14, '2025-09-19 18:14:41', 'INR'),
(33, 'testt', 14, '2025-09-20 05:27:16', 'INR'),
(34, 'hello', 20, '2025-09-23 08:24:13', 'INR'),
(40, 'laundry', 24, '2025-09-23 19:43:43', 'INR'),
(41, 'rass lila', 14, '2025-09-24 06:05:32', 'INR'),
(42, 'Sarangpur', 25, '2025-10-06 07:01:13', 'INR'),
(43, 'sarangpur', 31, '2025-10-06 07:46:08', 'INR'),
(44, 'Ladakh', 25, '2025-10-10 15:42:14', 'INR'),
(45, 'thailanddd', 14, '2025-10-13 06:46:20', 'EUR'),
(46, 'jaipurrr', 14, '2025-10-13 06:47:37', 'USD'),
(47, 'holiday', 14, '2025-10-13 07:02:28', 'EUR'),
(48, 'kashmir', 14, '2025-10-13 07:14:00', 'USD'),
(49, 'karnataka', 14, '2025-10-13 08:12:08', 'JPY'),
(50, 'New York', 14, '2025-10-13 08:57:58', 'USD');

-- --------------------------------------------------------

--
-- Table structure for table `group_chat`
--

CREATE TABLE `group_chat` (
  `message_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group_members`
--

CREATE TABLE `group_members` (
  `member_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `group_members`
--

INSERT INTO `group_members` (`member_id`, `group_id`, `user_id`, `joined_at`) VALUES
(91, 27, 15, '2025-09-17 12:02:16'),
(93, 27, 9, '2025-09-17 12:02:36'),
(94, 27, 8, '2025-09-17 12:02:36'),
(98, 28, 14, '2025-09-18 11:49:54'),
(99, 28, 8, '2025-09-18 11:50:03'),
(100, 28, 9, '2025-09-18 11:50:03'),
(101, 28, 10, '2025-09-18 11:50:03'),
(102, 28, 15, '2025-09-18 11:50:03'),
(111, 31, 14, '2025-09-19 18:14:41'),
(114, 33, 14, '2025-09-20 05:27:16'),
(115, 33, 9, '2025-09-20 05:27:37'),
(116, 33, 10, '2025-09-20 05:29:35'),
(117, 31, 8, '2025-09-23 07:46:21'),
(118, 31, 15, '2025-09-23 07:46:21'),
(119, 31, 12, '2025-09-23 07:46:21'),
(120, 31, 10, '2025-09-23 07:46:21'),
(121, 31, 9, '2025-09-23 07:46:21'),
(122, 34, 20, '2025-09-23 08:24:13'),
(129, 34, 24, '2025-09-23 19:37:43'),
(130, 27, 24, '2025-09-23 19:37:48'),
(131, 40, 24, '2025-09-23 19:43:43'),
(132, 41, 14, '2025-09-24 06:05:32'),
(133, 42, 25, '2025-10-06 07:01:13'),
(134, 42, 10, '2025-10-06 07:05:57'),
(135, 42, 30, '2025-10-06 07:05:57'),
(136, 42, 8, '2025-10-06 07:05:57'),
(137, 42, 29, '2025-10-06 07:05:57'),
(138, 42, 22, '2025-10-06 07:05:57'),
(139, 43, 31, '2025-10-06 07:46:08'),
(140, 43, 26, '2025-10-06 07:46:21'),
(141, 43, 8, '2025-10-06 07:46:47'),
(142, 43, 10, '2025-10-06 07:46:47'),
(143, 43, 20, '2025-10-06 07:46:47'),
(144, 43, 21, '2025-10-06 07:46:47'),
(145, 43, 27, '2025-10-06 07:46:47'),
(146, 44, 25, '2025-10-10 15:42:14'),
(147, 44, 26, '2025-10-10 15:42:29'),
(148, 44, 28, '2025-10-10 15:42:29'),
(149, 44, 29, '2025-10-10 15:42:47'),
(150, 44, 22, '2025-10-10 15:43:07'),
(151, 45, 14, '2025-10-13 06:46:20'),
(152, 45, 22, '2025-10-13 06:46:47'),
(153, 45, 26, '2025-10-13 06:46:47'),
(154, 45, 10, '2025-10-13 06:46:47'),
(155, 45, 29, '2025-10-13 06:46:47'),
(156, 46, 14, '2025-10-13 06:47:37'),
(157, 46, 22, '2025-10-13 06:47:52'),
(158, 46, 26, '2025-10-13 06:47:52'),
(159, 46, 8, '2025-10-13 06:47:52'),
(160, 46, 10, '2025-10-13 06:47:52'),
(161, 46, 9, '2025-10-13 06:47:52'),
(162, 47, 14, '2025-10-13 07:02:28'),
(163, 47, 21, '2025-10-13 07:02:36'),
(164, 47, 25, '2025-10-13 07:02:36'),
(165, 47, 29, '2025-10-13 07:02:36'),
(166, 47, 31, '2025-10-13 07:02:36'),
(167, 48, 14, '2025-10-13 07:14:00'),
(168, 48, 8, '2025-10-13 07:14:10'),
(169, 48, 10, '2025-10-13 07:14:10'),
(170, 48, 9, '2025-10-13 07:14:10'),
(171, 48, 12, '2025-10-13 07:14:10'),
(172, 49, 14, '2025-10-13 08:12:08'),
(173, 49, 10, '2025-10-13 08:12:19'),
(174, 49, 12, '2025-10-13 08:12:19'),
(175, 49, 22, '2025-10-13 08:12:19'),
(176, 49, 25, '2025-10-13 08:12:19'),
(177, 49, 26, '2025-10-13 08:12:19'),
(178, 49, 29, '2025-10-13 08:12:19'),
(179, 49, 30, '2025-10-13 08:12:19'),
(180, 50, 14, '2025-10-13 08:57:58'),
(181, 50, 30, '2025-10-13 08:58:08'),
(182, 50, 31, '2025-10-13 08:58:08'),
(183, 50, 26, '2025-10-13 08:58:14');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `user_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`user_id`, `message`, `is_read`, `created_at`, `type`) VALUES
(NULL, 'New group created: Sarangpur by virat kohli', 0, '2025-10-06 07:01:13', 'group'),
(31, 'Welcome Nilkanth Patel!', 0, '2025-10-06 07:45:31', 'user'),
(NULL, 'New group created: sarangpur by Nilkanth Patel', 0, '2025-10-06 07:46:08', 'group'),
(NULL, 'New group created: Ladakh by virat kohli', 0, '2025-10-10 15:42:14', 'group'),
(NULL, 'New group created: thailanddd by isha soni', 0, '2025-10-13 06:46:20', 'group'),
(NULL, 'New group created: jaipurrr by isha soni', 0, '2025-10-13 06:47:37', 'group'),
(NULL, 'New group created: holiday by isha soni', 0, '2025-10-13 07:02:28', 'group'),
(NULL, 'New group created: kashmir by isha soni', 0, '2025-10-13 07:14:00', 'group'),
(NULL, 'New group created: karnataka by isha soni', 0, '2025-10-13 08:12:08', 'group'),
(NULL, 'New group created: New York by isha soni', 0, '2025-10-13 08:57:58', 'group');

-- --------------------------------------------------------

--
-- Table structure for table `queries`
--

CREATE TABLE `queries` (
  `query_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category` enum('bug','payment','general') DEFAULT 'general',
  `message` text NOT NULL,
  `status` enum('open','resolved') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `queries`
--

INSERT INTO `queries` (`query_id`, `user_id`, `category`, `message`, `status`, `created_at`) VALUES
(3, 27, '', 'abcd\n', '', '2025-09-26 13:49:55'),
(4, 27, 'bug', 'xyz', 'resolved', '2025-09-26 13:58:11'),
(5, 25, 'payment', 'how may i pay??', '', '2025-09-26 14:16:53'),
(6, 27, 'payment', 'abcd', '', '2025-09-26 19:01:02'),
(7, 27, 'payment', 'hyyyy', '', '2025-09-27 11:31:46'),
(8, 26, 'payment', 'Hy', '', '2025-09-27 12:16:43'),
(9, 26, 'bug', '1234', 'open', '2025-09-27 12:19:17'),
(10, 26, 'payment', 'bdiifgw', '', '2025-09-27 12:25:54'),
(11, 26, 'bug', 'abcd', '', '2025-09-27 12:30:09'),
(12, 27, 'general', 'hy', '', '2025-09-27 16:18:17'),
(13, 27, 'bug', 'ancdefg', '', '2025-09-28 13:04:03'),
(14, 27, 'payment', 'xyz', '', '2025-09-28 13:09:06'),
(15, 25, 'general', 'abcd', '', '2025-09-28 13:43:49'),
(16, 25, 'payment', 'abcd', '', '2025-09-30 05:16:17'),
(17, 28, 'payment', 'Hello...!!', '', '2025-09-30 06:39:28'),
(18, 25, 'bug', 'Noooo', '', '2025-09-30 12:10:08'),
(19, 25, 'payment', 'abcd   efgh   ijklmnop   qrstuv   wxyz abcd   efgh   ijklmnop   qrstuv   wxyz abcd   efgh   ijklmnop   qrstuv   wxyz abcd   efgh   ijklmnop   qrstuv   wxyz ', '', '2025-09-30 12:17:30'),
(20, 29, 'general', 'I have one query\ni can\'t get payment Page', '', '2025-09-30 12:42:55'),
(21, 30, 'bug', 'I have bug issue', '', '2025-09-30 12:45:12'),
(22, 25, 'payment', 'abcde....', 'resolved', '2025-10-06 05:32:49'),
(23, 25, 'bug', 'there is a bug', 'open', '2025-10-06 06:16:11'),
(24, 25, 'general', 'hy', 'resolved', '2025-10-06 06:24:50'),
(25, 25, 'payment', 'Huhhh', 'open', '2025-10-06 06:30:14'),
(26, 31, 'payment', 'There is a bug in payment process.', 'resolved', '2025-10-06 08:15:30'),
(27, 31, 'bug', 'dhvbjr', 'resolved', '2025-10-06 08:21:36');

-- --------------------------------------------------------

--
-- Table structure for table `settlements`
--

CREATE TABLE `settlements` (
  `settlement_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `from_user` int(11) NOT NULL,
  `to_user` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `status` enum('pending','completed') DEFAULT 'pending',
  `settled_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settlements`
--

INSERT INTO `settlements` (`settlement_id`, `group_id`, `from_user`, `to_user`, `amount`, `status`, `settled_at`) VALUES
(333, 27, 9, 8, 997, 'pending', NULL),
(334, 27, 10, 8, 1372, 'pending', NULL),
(335, 27, 15, 8, 347, 'completed', NULL),
(336, 27, 10, 9, 375, 'pending', NULL),
(337, 27, 9, 15, 250, 'pending', NULL),
(338, 27, 10, 15, 625, 'pending', NULL),
(814, 28, 14, 8, 1500, 'completed', NULL),
(815, 28, 14, 9, 3000, 'completed', NULL),
(816, 28, 14, 10, 1070, 'completed', NULL),
(848, 33, 14, 9, 16667, 'completed', NULL),
(849, 33, 14, 10, 2820, 'completed', NULL),
(855, 31, 14, 12, 1918, 'completed', NULL),
(869, 31, 14, 9, 1731, 'completed', NULL),
(870, 31, 8, 9, 1731, 'pending', NULL),
(871, 31, 8, 12, 1918, 'pending', NULL),
(872, 31, 15, 9, 398, 'pending', NULL),
(873, 31, 10, 9, 1731, 'pending', NULL),
(874, 31, 10, 12, 1918, 'pending', NULL),
(875, 31, 10, 15, 1333, 'pending', NULL),
(876, 31, 12, 9, 1731, 'pending', NULL),
(877, 31, 15, 12, 585, 'pending', NULL),
(893, 28, 14, 10, 15737, 'completed', NULL),
(918, 28, 14, 8, 17476, 'completed', NULL),
(944, 28, 14, 9, 19493, 'completed', NULL),
(963, 28, 8, 9, 6850, 'pending', NULL),
(964, 28, 8, 10, 1664, 'pending', NULL),
(965, 28, 8, 15, 143220, 'pending', NULL),
(966, 28, 10, 9, 5686, 'pending', NULL),
(967, 28, 9, 15, 135870, 'pending', NULL),
(968, 28, 10, 15, 141556, 'pending', NULL),
(969, 28, 14, 15, 158363, 'completed', NULL),
(973, 33, 14, 10, 25000, 'completed', NULL),
(981, 33, 9, 10, 17404, 'pending', NULL),
(982, 33, 9, 14, 2932, 'pending', NULL),
(983, 33, 14, 10, 3319, 'completed', NULL),
(1036, 42, 8, 10, 29040, 'pending', NULL),
(1037, 42, 8, 25, 5366674, 'pending', NULL),
(1038, 42, 8, 30, 686586, 'pending', NULL),
(1039, 42, 10, 25, 5337634, 'pending', NULL),
(1040, 42, 10, 30, 657546, 'pending', NULL),
(1041, 42, 30, 25, 4680088, 'pending', NULL),
(1042, 42, 29, 10, 29040, 'pending', NULL),
(1043, 42, 29, 30, 686586, 'pending', NULL),
(1064, 43, 8, 26, 17333, 'pending', NULL),
(1065, 43, 20, 10, 2500, 'pending', NULL),
(1066, 43, 26, 10, 2500, 'pending', NULL),
(1067, 43, 31, 10, 2500, 'pending', NULL),
(1068, 43, 31, 26, 17333, 'pending', NULL),
(1072, 47, 14, 21, 1158, 'pending', NULL),
(1073, 47, 25, 21, 1158, 'pending', NULL),
(1074, 47, 29, 21, 1158, 'pending', NULL),
(1075, 47, 31, 21, 1158, 'pending', NULL),
(1076, 49, 10, 14, 839, 'pending', NULL),
(1077, 49, 12, 14, 839, 'pending', NULL),
(1078, 49, 22, 14, 839, 'pending', NULL),
(1079, 49, 25, 14, 839, 'pending', NULL),
(1080, 49, 26, 14, 839, 'pending', NULL),
(1081, 49, 29, 14, 839, 'pending', NULL),
(1082, 50, 14, 26, 6, 'pending', NULL),
(1083, 50, 30, 26, 6, 'pending', NULL),
(1084, 50, 31, 26, 6, 'pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `profile_photo` varchar(255) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `timezone` varchar(50) DEFAULT 'Asia/Kolkata',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `role`, `profile_photo`, `currency`, `timezone`, `created_at`) VALUES
(8, 'Manan', 'manan@gmail.com', '$2b$10$Ky7klFpYdMlaPDfWZES2w.NwGDhOH2R32E61SNaYHTpwNc3H6vXfy', 'user', NULL, NULL, NULL, '2025-08-28 06:03:29'),
(9, 'Abhi', 'abhi@123gmail.com', '$2b$10$ofYMWZj4YnLqqgvW0INDe.kkr33E8YVPEfLT8hhYdzJ7J5kQzTzTW', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-08-29 17:04:15'),
(10, 'Neeludhanawla', 'neel@gmail.com', ' $2b$10$CAFNukk32Oso48k/1szgN.kxEI5rqp9pJRSfg/6GkeK2R2bSGYxu2', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-08-30 05:06:16'),
(12, 'Vruti', 'vruti@gmail.com', '$2b$10$eAedVDSwrV1DDeWmq1sssOH6DmiW9P8yYwaxO8LqxRA/qO9QoAKGe', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-11 06:15:06'),
(14, 'isha soni', 'isha@gmail.com', '$2b$10$/ZfuV/0kniZoL8itMx2aPuxx6AfBgfQTxcePC0EhP0F8EP3zpUsEq', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-17 09:02:50'),
(15, 'bhavya shah', 'bhavya@gmail.com', '$2b$10$2XiMyWQNBHAK3mWUneV4CeJxN2fZYIycXdiDQbwsx/m6RZf9GSc3e', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-17 11:28:20'),
(19, 'Admin', 'Admin@splitbuddy.com', '$2b$10$Nv2BKKnaco/I5ClD.ZZMheU0eqLF9YiPd8tg273QhD/i5UartPiNe', 'admin', NULL, 'INR', 'Asia/Kolkata', '2025-09-19 20:48:03'),
(20, 'parth patel', 'parth@gmail.com', '$2b$10$Ophw8xqPBoigzHsJYmdt4.j5b0o6xAfjoIdQfCkPFVicNLfraKaWG', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-23 08:23:50'),
(21, 'krish shah', 'krish@gmail.com', '$2b$10$bXc9fOR22G4se62/2.Cv8Op1t5dGthFCr4mEZj3jwcCW84TP2Vdte', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-23 08:26:04'),
(22, 'Nandani chauhan', 'nandani@gmail.com', '$2b$10$hd74vrkG5Xtok2r5Y2EsdORUF0augguTerQpFYn5k2.dXBwyxdiQC', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-23 10:50:28'),
(23, 'darshan madleywala', 'darshan@gmail.com', '$2b$10$oxK6So4PBGWPC9N31qeXx.joYX/6QZA4lc4Z/vHCMjD3QSiYtWv.q', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-23 10:58:25'),
(24, 'rohit sharma', 'rohit@gmail.com', '$2b$10$HP0a5PmYsNDxrOrPPptDJOL6uRmjUJy/HygyW6G5vrvXmKwGWr.3y', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-23 19:01:54'),
(25, 'virat kohli', '24msit101@charusat.edu.in', '$2b$10$PFPRiMqRD6JJriqKfwzPP.Fp2DiFggaX5dnEv2olSeLLaJRZ/l4Jm', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-24 06:04:35'),
(26, 'Nidhi Patel', 'splitbuddy2025@gmail.com', '$2b$10$6mZ2j0JKIIEFZdh7DYbD1OlljPqhQ9oddwm07dXR0PdFz.PpFE7vK', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-25 18:19:46'),
(27, 'Dev Patel', 'patel.nidhi03.2203@gmail.com', '$2b$10$lQVy1ZZmWYJAr1BmSLg5.epLh5vqsfAnCVEEi1k4YGkwoe4E1aMRC', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-26 12:45:56'),
(28, 'Jenil Patel', 'jenil@gmail.com', '$2b$10$h9bahEB5r0U6.DksiJ/PtuSCnx986yY9nQI4JoClF5ThDqDdRF.N.', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-30 06:39:02'),
(29, 'Manan Kansara', '24msit041@charusat.edu.in', '$2b$10$giUVp26fQopQ7uMRA0AKDuhwRvkSMIQDGKvAU1GoLBG2malbUyyaa', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-30 12:42:25'),
(30, 'Neel Udhanawala', '24msit182@charusat.edu.in', '$2b$10$a3EXrNQxqcHte5qGS6h2DeaUL/WL5ggRri/D.yWvxaoUFpOiU47Zu', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-09-30 12:44:52'),
(31, 'Nilkanth Patel', '3290neeludhanawala@gmail.com', '$2b$10$N4UUKeyfxIjsWAUoNnjQYuAKWk4SsITMzxuI0eqHw/54ve6Rg0ncq', 'user', NULL, 'INR', 'Asia/Kolkata', '2025-10-06 07:45:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expense_id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `paid_by` (`paid_by`);

--
-- Indexes for table `expense_splits`
--
ALTER TABLE `expense_splits`
  ADD PRIMARY KEY (`split_id`),
  ADD KEY `expense_id` (`expense_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `group_chat`
--
ALTER TABLE `group_chat`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`member_id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `queries`
--
ALTER TABLE `queries`
  ADD PRIMARY KEY (`query_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `settlements`
--
ALTER TABLE `settlements`
  ADD PRIMARY KEY (`settlement_id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `from_user` (`from_user`),
  ADD KEY `to_user` (`to_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expense_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT for table `expense_splits`
--
ALTER TABLE `expense_splits`
  MODIFY `split_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=326;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `group_chat`
--
ALTER TABLE `group_chat`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `group_members`
--
ALTER TABLE `group_members`
  MODIFY `member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=184;

--
-- AUTO_INCREMENT for table `queries`
--
ALTER TABLE `queries`
  MODIFY `query_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `settlements`
--
ALTER TABLE `settlements`
  MODIFY `settlement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1085;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`paid_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `expense_splits`
--
ALTER TABLE `expense_splits`
  ADD CONSTRAINT `expense_splits_ibfk_1` FOREIGN KEY (`expense_id`) REFERENCES `expenses` (`expense_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expense_splits_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `group_chat`
--
ALTER TABLE `group_chat`
  ADD CONSTRAINT `group_chat_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_chat_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `queries`
--
ALTER TABLE `queries`
  ADD CONSTRAINT `queries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `settlements`
--
ALTER TABLE `settlements`
  ADD CONSTRAINT `settlements_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `settlements_ibfk_2` FOREIGN KEY (`from_user`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `settlements_ibfk_3` FOREIGN KEY (`to_user`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
