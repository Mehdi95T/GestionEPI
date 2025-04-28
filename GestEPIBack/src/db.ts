// src/db.ts
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",        // Hôte de la base
  user: "root",             // Utilisateur 
  password: "",             // Mot de passe 
  database: "gestionepi",   // Le nom de la base de données créée
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
