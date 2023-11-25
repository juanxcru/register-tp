-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-11-2023 a las 18:31:19
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `register`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_rec_segun_type` (IN `type` VARCHAR(15), IN `id_acc_from` INT, IN `id_acc_to` INT, IN `reg_date` DATETIME, IN `amount` DOUBLE, IN `category` VARCHAR(30), IN `id_usr` INT)   BEGIN
    DECLARE valid_ins INT;

   
    SET valid_ins = 0;

    -- Verifica las condiciones basadas en el tipo
    IF type = 'Spent' AND id_acc_to IS NULL AND EXISTS (SELECT 1 FROM accounts WHERE id = id_acc_from AND id_user = id_usr) THEN
        SET valid_ins = 1;
    ELSEIF type = 'Income' AND id_acc_from IS NULL AND EXISTS (SELECT 1 FROM accounts WHERE id = id_acc_to AND id_user = id_usr) THEN
        SET valid_ins = 1;
    ELSEIF type = 'Move' AND id_acc_from IS NOT NULL AND id_acc_to IS NOT NULL AND
    EXISTS (SELECT 1 FROM accounts WHERE id = id_acc_from AND id_user = id_usr) AND
    EXISTS (SELECT 1 FROM accounts WHERE id = id_acc_to AND id_user = id_usr) THEN
        SET valid_ins = 1;
    END IF;

    IF valid_ins = 1 THEN
        INSERT INTO reg (type, id_acc_from, id_acc_to, reg_date, amount, category, id_user_reg)
        VALUES (type, id_acc_from, id_acc_to, reg_date, amount, category, id_usr);
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `name` varchar(12) NOT NULL,
  `currency` varchar(3) NOT NULL,
  `description` varchar(50) NOT NULL,
  `balance` double NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `accounts`
--

INSERT INTO `accounts` (`id`, `name`, `currency`, `description`, `balance`, `id_user`) VALUES
(1, 'Savings', 'ARS', 'BBVA', 21, 1),
(2, 'Cheking', 'ARS', 'BSTN', 0, 1),
(5, 'Ahorros USD', 'USD', 'Ahorro', 1, 1),
(7, 'Ahorros ARS', 'ARS', 'Ahorro', 0, 1),
(11, 'Savings', 'ARS', 'RBTS', 321, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reg`
--

CREATE TABLE `reg` (
  `id` int(11) NOT NULL,
  `type` varchar(15) NOT NULL,
  `reg_date` datetime NOT NULL,
  `amount` double NOT NULL,
  `category` varchar(30) NOT NULL,
  `id_acc_from` int(11) DEFAULT NULL,
  `id_acc_to` int(11) DEFAULT NULL,
  `id_user_reg` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `reg`
--

INSERT INTO `reg` (`id`, `type`, `reg_date`, `amount`, `category`, `id_acc_from`, `id_acc_to`, `id_user_reg`) VALUES
(40, 'Income', '0000-00-00 00:00:00', 1, 'Transport', NULL, 1, 1),
(41, 'Income', '0000-00-00 00:00:00', 4, 'Bill', NULL, 2, 1),
(42, 'Income', '0000-00-00 00:00:00', 1.2, 'Transport', NULL, 2, 1),
(43, 'Income', '0000-00-00 00:00:00', 2, 'Bill', NULL, 1, 1),
(44, 'Move', '0000-00-00 00:00:00', 1, 'Bill', 1, 2, 1),
(45, 'Income', '2023-11-11 02:06:02', 1, 'Bill', NULL, 1, 1),
(46, 'Move', '2023-11-11 02:11:27', 0.0000000000001, '', 1, 2, 1),
(47, 'Spent', '2023-11-10 23:16:07', 123, '', 1, NULL, 1),
(48, 'Income', '2023-11-10 23:24:25', 1, 'Bill', NULL, 2, 1),
(49, 'Income', '2023-11-11 15:12:04', 1, 'Bill', NULL, 1, 1),
(50, 'Income', '2023-11-11 15:13:52', 3, 'Bill', NULL, 1, 1),
(51, 'Spent', '2023-11-11 15:16:10', 3, 'Bill', 1, NULL, 1),
(52, 'Income', '2023-11-11 15:17:05', 3, 'Bill', NULL, 1, 1),
(53, 'Income', '2023-11-11 15:22:13', 1, 'Bill', NULL, 1, 1),
(54, 'Income', '2023-11-11 15:22:22', 9, 'Party', NULL, 1, 1),
(55, 'Income', '2023-11-11 15:25:47', 1, 'Bill', NULL, 1, 1),
(56, 'Income', '2023-11-11 15:28:18', 9, 'Bill', NULL, 1, 1),
(57, 'Income', '2023-11-11 15:28:28', 7, 'Party', NULL, 2, 1),
(58, 'Spent', '2023-11-11 15:28:38', 600, 'Gift', 2, NULL, 1),
(59, 'Move', '2023-11-11 15:28:56', 45, 'Sports', 1, 2, 1),
(60, 'Move', '2023-11-11 15:29:24', 645, 'Gift', 1, 2, 1),
(61, 'Spent', '2023-11-11 15:29:46', 760, 'Gift', 2, NULL, 1),
(62, 'Income', '2023-11-11 15:31:04', 1, 'Bill', NULL, 1, 1),
(63, 'Income', '2023-11-11 15:31:55', 1, 'Bill', NULL, 1, 1),
(64, 'Income', '2023-11-11 15:33:28', 1, 'Bill', NULL, 1, 1),
(65, 'Income', '2023-11-11 15:34:26', 1, 'Bill', NULL, 1, 1),
(66, 'Income', '2023-11-11 15:35:25', 300, 'Bill', NULL, 5, 1),
(67, 'Spent', '2023-11-11 15:35:48', 600, 'Gift', 5, NULL, 1),
(68, 'Spent', '2023-11-11 15:36:05', 400, 'Gift', 7, NULL, 1),
(69, 'Spent', '2023-11-11 15:36:24', 4, 'Gift', 1, NULL, 1),
(70, 'Spent', '2023-11-11 15:36:32', 16, '', 2, NULL, 1),
(71, 'Income', '2023-11-11 15:36:41', 1, 'Bill', NULL, 1, 1),
(72, 'Income', '2023-11-11 15:37:30', 1, 'Bill', NULL, 1, 1),
(73, 'Income', '2023-11-11 15:39:23', 1, 'Bill', NULL, 1, 1),
(74, 'Income', '2023-11-11 15:52:50', 3, 'Bill', NULL, 1, 1),
(75, 'Income', '2023-11-11 15:54:53', 1, 'Bill', NULL, 1, 1),
(76, 'Income', '2023-11-11 15:55:48', 1, 'Bill', NULL, 1, 1),
(77, 'Income', '2023-11-11 15:56:48', 1, 'Health', NULL, 1, 1),
(78, 'Income', '2023-11-11 15:57:25', 1, 'Bill', NULL, 1, 1),
(79, 'Income', '2023-11-11 15:58:40', 1, 'Bill', NULL, 1, 1),
(80, 'Income', '2023-11-11 16:00:04', 1, 'Bill', NULL, 1, 1),
(81, 'Income', '2023-11-11 16:00:37', 1, 'Bill', NULL, 1, 1),
(82, 'Income', '2023-11-11 16:00:55', 1, 'Bill', NULL, 1, 1),
(83, 'Income', '2023-11-11 16:09:33', 1, 'Bill', NULL, 1, 1),
(84, 'Income', '2023-11-11 16:14:19', 1, 'Bill', NULL, 1, 1),
(85, 'Income', '2023-11-11 16:15:28', 1, 'Bill', NULL, 1, 1),
(86, 'Income', '2023-11-11 16:17:59', 1, 'Bill', NULL, 1, 1),
(87, 'Income', '2023-11-11 16:19:13', 1, 'Bill', NULL, 1, 1),
(88, 'Income', '2023-11-11 16:19:47', 1, 'Bill', NULL, 1, 1),
(89, 'Income', '2023-11-11 16:24:02', 1, 'Bill', NULL, 1, 1),
(90, 'Income', '2023-11-11 16:25:47', 1, 'Bill', NULL, 1, 1),
(91, 'Income', '2023-11-11 16:26:04', 1, 'Bill', NULL, 5, 1),
(92, 'Spent', '2023-11-11 16:26:19', 1, 'Bill', 1, NULL, 1),
(93, 'Income', '2023-11-11 18:59:56', 1.4, 'Bill', NULL, 1, 1),
(94, 'Move', '2023-11-11 19:00:09', 1.4, 'Gift', 1, 2, 1),
(95, 'Spent', '2023-11-11 19:00:20', 1.4, 'Party', 2, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(1) NOT NULL,
  `role` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `role`) VALUES
(1, 'admin'),
(2, 'user');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `lastname` varchar(30) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(1) NOT NULL DEFAULT 2
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `name`, `lastname`, `email`, `password`, `role`) VALUES
(1, 'juan', 'perez', 'juanperez@gmail.com', 'juanperez', 2),
(3, 'Mario', 'Santos', 'earlgray@gmail.com', 'mariosantos', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `reg`
--
ALTER TABLE `reg`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_acc_from` (`id_acc_from`,`id_acc_to`),
  ADD KEY `id_acc_to` (`id_acc_to`),
  ADD KEY `id_user_reg` (`id_user_reg`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role` (`role`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `reg`
--
ALTER TABLE `reg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `reg`
--
ALTER TABLE `reg`
  ADD CONSTRAINT `reg_ibfk_1` FOREIGN KEY (`id_acc_from`) REFERENCES `accounts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `reg_ibfk_2` FOREIGN KEY (`id_acc_to`) REFERENCES `accounts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `reg_ibfk_3` FOREIGN KEY (`id_user_reg`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
