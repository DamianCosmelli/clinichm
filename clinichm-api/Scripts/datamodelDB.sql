CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    ALTER DATABASE CHARACTER SET utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `AgendaMedica` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `FechaInicio` datetime(6) NOT NULL,
        `MedicoId` int NOT NULL,
        `SucursalId` int NOT NULL,
        `FechaFin` datetime(6) NOT NULL,
        CONSTRAINT `PK_AgendaMedica` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `CategoriaProd` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Nombre` longtext CHARACTER SET utf8mb4 NOT NULL,
        CONSTRAINT `PK_CategoriaProd` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `CierreCaja` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `FechaHora` datetime(6) NOT NULL,
        `MontoEfectivo` decimal(65,30) NOT NULL,
        `MontoTarjetaCredito` decimal(65,30) NOT NULL,
        `MontoDebito` decimal(65,30) NOT NULL,
        `MontoTransferencia` decimal(65,30) NOT NULL,
        `MontoDolar` decimal(65,30) NOT NULL,
        `TotalEfectivo` decimal(65,30) NOT NULL,
        `TotalCuentaClinichm` decimal(65,30) NOT NULL,
        `IdSucursal` int NOT NULL,
        `TotalRetiro` decimal(65,30) NOT NULL,
        `TotalVoucher` decimal(65,30) NOT NULL,
        `CantVoucher` int NOT NULL,
        CONSTRAINT `PK_CierreCaja` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `Empleado` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Nombre` longtext CHARACTER SET utf8mb4 NULL,
        `Apellido` longtext CHARACTER SET utf8mb4 NULL,
        `DNI` varchar(255) CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_Empleado` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `EstadosTurnos` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Estado` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
        `Descripcion` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Color` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_EstadosTurnos` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `Medicos` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Nombre` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Apellido` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Matricula` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
        `SucursalId` int NOT NULL,
        `RoleId` int NOT NULL,
        CONSTRAINT `PK_Medicos` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `MedicoTratamiento` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `MedicoId` int NOT NULL,
        `TratamientoId` int NOT NULL,
        CONSTRAINT `PK_MedicoTratamiento` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `MedioDePago` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `MedioPago` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        CONSTRAINT `PK_MedioDePago` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `MovimientosCaja` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `IdMedico` int NOT NULL,
        `IdPaciente` int NOT NULL,
        `IdTratamiento` int NOT NULL,
        `IdProducto` int NOT NULL,
        `CantidadProducto` int NOT NULL,
        `CotizacionDolar` decimal(65,30) NOT NULL,
        `NumeroFactura` longtext CHARACTER SET utf8mb4 NULL,
        `IdMedioPago` int NOT NULL,
        `Monto` decimal(65,30) NOT NULL,
        `TipoMovimiento` longtext CHARACTER SET utf8mb4 NOT NULL,
        `FechaHora` datetime(6) NOT NULL,
        `FechaHoraTransf` longtext CHARACTER SET utf8mb4 NULL,
        `IdSucursal` int NOT NULL,
        `IdCierreCaja` int NOT NULL,
        `IdEmpleado` int NULL,
        `DescripcionRetiro` longtext CHARACTER SET utf8mb4 NULL,
        `Voucher` decimal(65,30) NOT NULL,
        CONSTRAINT `PK_MovimientosCaja` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `Pacientes` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Nombre` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Apellido` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Celular` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Email` longtext CHARACTER SET utf8mb4 NOT NULL,
        `DNI` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
        `Direccion` longtext CHARACTER SET utf8mb4 NOT NULL,
        `CodigoPostal` longtext CHARACTER SET utf8mb4 NOT NULL,
        `MedioPublicidad` longtext CHARACTER SET utf8mb4 NOT NULL,
        `SoloConsulto` tinyint(1) NOT NULL,
        `FechaDeRecontacto` longtext CHARACTER SET utf8mb4 NULL,
        `FechaNac` date NULL,
        CONSTRAINT `PK_Pacientes` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `PagoDeComisiones` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `MedicoId` int NOT NULL,
        `FechaDePago` datetime(6) NOT NULL,
        `MetodoDePago` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `Monto` decimal(65,30) NOT NULL,
        `CierreDeCajaId` int NOT NULL,
        CONSTRAINT `PK_PagoDeComisiones` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `Producto` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `CategoriaProdId` int NOT NULL,
        `Nombre` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Cantidad` decimal(65,30) NOT NULL,
        `DosisUnidad` decimal(65,30) NOT NULL,
        CONSTRAINT `PK_Producto` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `RecepcionPacientes` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `PacienteId` int NOT NULL,
        `TratamientoId` int NOT NULL,
        `MedicoId` int NOT NULL,
        `HoraIngreso` datetime(6) NOT NULL,
        `HoraAnestesia` datetime(6) NULL,
        `EstadoRecepcion` longtext CHARACTER SET utf8mb4 NOT NULL,
        `EsConsulta` tinyint(1) NOT NULL,
        `Piso` int NOT NULL,
        `SucursalId` int NOT NULL,
        `EsRetoque` tinyint(1) NOT NULL,
        `MotivoConsulta` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_RecepcionPacientes` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `Rol` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Nombre` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
        `Descripcion` longtext CHARACTER SET utf8mb4 NOT NULL,
        CONSTRAINT `PK_Rol` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `RoleComision` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Role` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        CONSTRAINT `PK_RoleComision` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `Sucursales` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Nombre` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
        `Direccion` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Ciudad` longtext CHARACTER SET utf8mb4 NOT NULL,
        `CodigoPostal` longtext CHARACTER SET utf8mb4 NOT NULL,
        CONSTRAINT `PK_Sucursales` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `TipoMovimiento` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Descripcion` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_TipoMovimiento` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `Tratamientos` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `NombreTratamiento` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
        `Descripcion` longtext CHARACTER SET utf8mb4 NOT NULL,
        `SucursalId` int NOT NULL,
        `PrecioEfectivo` decimal(65,30) NOT NULL,
        `PrecioOtrosMediosDePago` decimal(65,30) NOT NULL,
        `Comision` decimal(65,30) NOT NULL,
        `ComisionEncargado` decimal(65,30) NOT NULL,
        CONSTRAINT `PK_Tratamientos` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `Turnos` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `FechaHora` datetime(6) NOT NULL,
        `MedicoId` int NOT NULL,
        `SucursalId` int NOT NULL,
        `PacienteId` int NOT NULL,
        `TratamientoId` int NOT NULL,
        `UsuarioRegistroId` int NOT NULL,
        `Confirmado` tinyint(1) NULL,
        `FechaHoraConfirmacion` datetime(6) NULL,
        `Reprogramado` tinyint(1) NULL,
        `NuevoTurnoId` int NULL,
        `Asistio` tinyint(1) NOT NULL,
        `Cancelado` tinyint(1) NOT NULL,
        `NoEncontrado` tinyint(1) NOT NULL,
        CONSTRAINT `PK_Turnos` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `Usuario` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `UserName` varchar(255) CHARACTER SET utf8mb4 NULL,
        `Nombre` longtext CHARACTER SET utf8mb4 NULL,
        `Apellido` longtext CHARACTER SET utf8mb4 NULL,
        `Password` longtext CHARACTER SET utf8mb4 NULL,
        `RolId` int NOT NULL,
        `Celular` longtext CHARACTER SET utf8mb4 NULL,
        `SucursalID` int NOT NULL,
        CONSTRAINT `PK_Usuario` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE TABLE `UsuarioAudit` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `UsuarioId` int NOT NULL,
        `LoginTime` datetime(6) NULL,
        `LogoutTime` datetime(6) NULL,
        `Ip` longtext CHARACTER SET utf8mb4 NULL,
        `Navegador` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_UsuarioAudit` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    INSERT INTO `CategoriaProd` (`Id`, `Nombre`)
    VALUES (1, 'Hialuronico'),
    (2, 'Toxina Botulinica'),
    (3, 'Bioestimulador'),
    (4, 'Enzimas'),
    (5, 'Insumo');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    INSERT INTO `EstadosTurnos` (`Id`, `Color`, `Descripcion`, `Estado`)
    VALUES (1, 'Verde', 'Turno Confirmado Por Paciente', 'Confirmado'),
    (2, 'Celeste', 'Turno Sin Confirmar', 'Sin Confirmar'),
    (3, 'Violeta', 'Turno Cancelado', 'Cancelado'),
    (4, 'Azul', 'Turno Reprogramado', 'Reprogramado'),
    (5, 'Rosa', 'Numero De Celular No Encontrado', 'Numero No Encontrado');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    INSERT INTO `Medicos` (`Id`, `Apellido`, `Matricula`, `Nombre`, `RoleId`, `SucursalId`)
    VALUES (1, 'Medico', '0', 'Equipo', 0, 0);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    INSERT INTO `MedioDePago` (`Id`, `MedioPago`)
    VALUES (1, 'Efectivo Peso'),
    (2, 'Efectivo Dolar'),
    (3, 'Tarjeta De Debito'),
    (4, 'Tarjeta De Credito'),
    (5, 'Transferencia');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    INSERT INTO `Rol` (`Id`, `Descripcion`, `Nombre`)
    VALUES (1, '', 'Admin'),
    (2, '', 'Recepcion'),
    (3, '', 'Turnos'),
    (4, '', 'Caja');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    INSERT INTO `RoleComision` (`Id`, `Role`)
    VALUES (1, 'Comision'),
    (2, 'Encargado');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    INSERT INTO `Sucursales` (`Id`, `Ciudad`, `CodigoPostal`, `Direccion`, `Nombre`)
    VALUES (1, 'Caba', '1416', 'Av. Gaona 3707', 'Flores'),
    (2, 'Lomas De Zamora', '1400', 'Av. Rivadavia 5000', 'Lomas');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    INSERT INTO `TipoMovimiento` (`Id`, `Descripcion`)
    VALUES (1, 'Cobro'),
    (2, 'Retiro');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE UNIQUE INDEX `IX_Empleado_DNI` ON `Empleado` (`DNI`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE UNIQUE INDEX `IX_EstadosTurnos_Estado` ON `EstadosTurnos` (`Estado`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE UNIQUE INDEX `IX_Medicos_Matricula` ON `Medicos` (`Matricula`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE UNIQUE INDEX `IX_MedioDePago_MedioPago` ON `MedioDePago` (`MedioPago`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE UNIQUE INDEX `IX_Pacientes_DNI` ON `Pacientes` (`DNI`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE UNIQUE INDEX `IX_Rol_Nombre` ON `Rol` (`Nombre`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE UNIQUE INDEX `IX_RoleComision_Role` ON `RoleComision` (`Role`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE UNIQUE INDEX `IX_Sucursales_Nombre` ON `Sucursales` (`Nombre`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE UNIQUE INDEX `IX_Tratamientos_NombreTratamiento` ON `Tratamientos` (`NombreTratamiento`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    CREATE UNIQUE INDEX `IX_Usuario_UserName` ON `Usuario` (`UserName`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250527183711_Inicial') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250527183711_Inicial', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250606134610_Inicial01') THEN

    ALTER TABLE `Tratamientos` ADD `ComisionEspecial` decimal(65,30) NOT NULL DEFAULT 0.0;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250606134610_Inicial01') THEN

    INSERT INTO `RoleComision` (`Id`, `Role`)
    VALUES (3, 'Especial');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250606134610_Inicial01') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250606134610_Inicial01', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250609123948_Inicial02') THEN

    ALTER TABLE `Producto` DROP COLUMN `Cantidad`;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250609123948_Inicial02') THEN

    ALTER TABLE `Producto` DROP COLUMN `DosisUnidad`;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250609123948_Inicial02') THEN

    ALTER TABLE `Producto` ADD `AutoDescontable` tinyint(1) NOT NULL DEFAULT FALSE;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250609123948_Inicial02') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250609123948_Inicial02', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250609130645_Inicial03') THEN

    ALTER TABLE `Producto` RENAME COLUMN `AutoDescontable` TO `NoAutoDescontable`;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250609130645_Inicial03') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250609130645_Inicial03', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250619131456_Inicial04') THEN

    INSERT INTO `Rol` (`Id`, `Descripcion`, `Nombre`)
    VALUES (5, '', 'Stock');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250619131456_Inicial04') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250619131456_Inicial04', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250619131733_Inicial05') THEN

    CREATE TABLE `TurnosAfectados` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `TurnoId` int NOT NULL,
        `ConResolucion` tinyint(1) NOT NULL,
        `Accion` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_TurnosAfectados` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250619131733_Inicial05') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250619131733_Inicial05', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250625145129_Inicial06') THEN

    ALTER TABLE `MovimientosCaja` DROP COLUMN `CantidadProducto`;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250625145129_Inicial06') THEN

    ALTER TABLE `MovimientosCaja` DROP COLUMN `IdProducto`;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250625145129_Inicial06') THEN

    ALTER TABLE `MovimientosCaja` DROP COLUMN `Voucher`;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250625145129_Inicial06') THEN

    ALTER TABLE `MovimientosCaja` RENAME COLUMN `IdTratamiento` TO `MovRelation`;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250625145129_Inicial06') THEN

    CREATE TABLE `CobroProductos` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `ProductoId` int NOT NULL,
        `Nombre` longtext CHARACTER SET utf8mb4 NULL,
        `Cantidad` int NOT NULL,
        `MovId` int NOT NULL,
        `IdCierreCaja` int NULL,
        CONSTRAINT `PK_CobroProductos` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250625145129_Inicial06') THEN

    CREATE TABLE `CobroTratamientos` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `TratamientoId` int NOT NULL,
        `Precio` int NULL,
        `conComision` tinyint(1) NOT NULL,
        `MovId` int NOT NULL,
        `IdCierreCaja` int NULL,
        CONSTRAINT `PK_CobroTratamientos` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250625145129_Inicial06') THEN

    CREATE TABLE `Vouchers` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Voucher` decimal(65,30) NOT NULL,
        `Total` decimal(65,30) NOT NULL,
        `MovId` int NOT NULL,
        `IdCierreCaja` int NULL,
        CONSTRAINT `PK_Vouchers` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250625145129_Inicial06') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250625145129_Inicial06', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250627144359_Inicial07') THEN

    ALTER TABLE `CobroTratamientos` MODIFY COLUMN `Precio` decimal(65,30) NULL;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250627144359_Inicial07') THEN

    ALTER TABLE `CobroProductos` MODIFY COLUMN `Cantidad` decimal(65,30) NOT NULL;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250627144359_Inicial07') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250627144359_Inicial07', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250627155437_Inicial08') THEN

    ALTER TABLE `CobroTratamientos` ADD `MedicoId` int NOT NULL DEFAULT 0;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250627155437_Inicial08') THEN

    ALTER TABLE `CobroProductos` ADD `MedicoId` int NOT NULL DEFAULT 0;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250627155437_Inicial08') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250627155437_Inicial08', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250630180726_Inicial09') THEN

    INSERT INTO `MedioDePago` (`Id`, `MedioPago`)
    VALUES (6, 'Sin Cargo');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250630180726_Inicial09') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250630180726_Inicial09', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250701200834_Inicial10') THEN

    CREATE TABLE `AuditStock` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Fecha` datetime(6) NOT NULL,
        `IdRegistro` int NOT NULL,
        `CantPrevia` decimal(65,30) NOT NULL,
        `CantNueva` decimal(65,30) NOT NULL,
        `TipoMovimiento` longtext CHARACTER SET utf8mb4 NOT NULL,
        `UsuarioId` int NOT NULL,
        CONSTRAINT `PK_AuditStock` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250701200834_Inicial10') THEN

    CREATE TABLE `Stock` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `ProductoId` int NOT NULL,
        `Lote` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Vencimiento` date NOT NULL,
        `CantidadIngreso` decimal(65,30) NOT NULL,
        `CantidadExistente` decimal(65,30) NOT NULL,
        `FechaIngreso` date NOT NULL,
        `Deposito` longtext CHARACTER SET utf8mb4 NOT NULL,
        CONSTRAINT `PK_Stock` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250701200834_Inicial10') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250701200834_Inicial10', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250702173056_Inicial11') THEN

    ALTER TABLE `CierreCaja` ADD `TotalSinCargo` decimal(65,30) NOT NULL DEFAULT 0.0;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250702173056_Inicial11') THEN

    ALTER TABLE `CierreCaja` ADD `TotalVuelto` decimal(65,30) NOT NULL DEFAULT 0.0;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250702173056_Inicial11') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250702173056_Inicial11', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250704132713_Inicial12') THEN

    ALTER TABLE `Stock` ADD `TipoOperacion` longtext CHARACTER SET utf8mb4 NULL;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250704132713_Inicial12') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250704132713_Inicial12', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250707162158_Inicial13') THEN

    CREATE TABLE `CobroNotas` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `MovId` int NOT NULL,
        `Notas` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_CobroNotas` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250707162158_Inicial13') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250707162158_Inicial13', '8.0.3');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

