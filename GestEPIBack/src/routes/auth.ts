import { Router } from "express";  // Importation de Router d'Express pour créer des routes
import jwt from "jsonwebtoken";  // Importation de la librairie JWT
import bcrypt from "bcryptjs";  // Librairie pour le hachage des mots de passe
import { pool } from "../db";  // Connexion à la base de données

export const authRouter = Router();  // Déclaration du routeur d'authentification

// Route pour la connexion
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;  // Récupération des identifiants de l'utilisateur
  try {
    const [rows] = await pool.query("SELECT * FROM Utilisateur WHERE username = ?", [username]);  // Recherche de l'utilisateur dans la base
    const users = rows as any[];
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });  // Utilisateur non trouvé
    }
    const user = users[0];
    const isMatch = bcrypt.compareSync(password, user.password);  // Vérification du mot de passe
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });  // Si le mot de passe est incorrect
    }
    const token = jwt.sign(  // Création du token JWT
      { id: user.id, username: user.username, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1h" }  // Expiration du token dans 1 heure
    );
    res.json({ token });  // Envoi du token JWT
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });  // Erreur serveur
  }
});

// Route pour l'inscription
authRouter.post("/signup", async (req, res) => {
  try {
    const { username, password, name, lastName, mail } = req.body;  // Récupération des données d'inscription
    const [rows] = await pool.query("SELECT * FROM Utilisateur WHERE username = ?", [username]);  // Vérification si l'utilisateur existe déjà
    if ((rows as any[]).length > 0) {
      return res.status(400).json({ message: "Username already taken" });  // Si le nom d'utilisateur existe déjà
    }
    const hashed = bcrypt.hashSync(password, 10);  // Hachage du mot de passe
    await pool.query(`  // Insertion de l'utilisateur dans la base de données
      INSERT INTO Utilisateur (username, password, role, name, lastName, mail)
      VALUES (?, ?, 'cordiste', ?, ?, ?)
    `, [username, hashed, name, lastName, mail]);
    res.status(201).json({ message: "User created successfully" });  // Utilisateur créé avec succès
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });  // Erreur serveur
  }
});

// Pour débogage : Hachage d'un mot de passe test
const hashed = bcrypt.hashSync("test", 10);
console.log("Mot de passe haché :", hashed);
