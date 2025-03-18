-- Créer la base de données
CREATE DATABASE gestionepi;
USE gestionepi;

-- Table EPI
CREATE TABLE EPI (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifiant VARCHAR(100) NOT NULL,
    marque VARCHAR(100) NOT NULL,
    modele VARCHAR(100) NOT NULL,
    numeroSerie VARCHAR(100) NOT NULL,
    type ENUM('CORDE','SANGLE','LONGE','BAUDRIER','CASQUE','MOUSQUETON') NOT NULL,
    taille VARCHAR(50),
    couleur VARCHAR(50),
    dateAchat DATE NOT NULL,
    dateFabrication DATE NOT NULL,
    dateMiseEnService DATE NOT NULL,
    periodiciteControle INT NOT NULL,
    dateProchainControle DATE NOT NULL,
    isConforme BOOLEAN NOT NULL DEFAULT TRUE,
    isExpired BOOLEAN NOT NULL DEFAULT FALSE,
    isDeleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Table Controle
CREATE TABLE Controle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dateControle DATE NOT NULL,
    epiId INT NOT NULL,
    statut ENUM('OPERATIONNEL','A_REPARER','MIS_AU_REBUT') NOT NULL,
    remarques TEXT NOT NULL,
    FOREIGN KEY (epiId) REFERENCES EPI(id)
);

-- Table User
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    mail VARCHAR(100) NOT NULL UNIQUE
    role ENUM('gestionnaire','cordiste') NOT NULL
);
