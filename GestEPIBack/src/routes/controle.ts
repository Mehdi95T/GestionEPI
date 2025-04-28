import { Router } from "express";
import { authenticateJWT, AuthRequest } from "../middleware/authMiddleware";
import { pool } from "../db";
import { RowDataPacket } from "mysql2";

export const controleRouter = Router();

// POST /api/controles : Créer un contrôle (gestionnaire uniquement)
controleRouter.post("/", authenticateJWT, async (req: AuthRequest, res) => {
  if (req.user.role !== "gestionnaire") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const { dateControle, epiId, statut, remarques } = req.body;
    const query = `
      INSERT INTO Controle (dateControle, epiId, statut, remarques)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [dateControle, epiId, statut, remarques]);
    // Ici, vous pouvez ajouter la logique de mise à jour de l'état de l'EPI (isConforme et dateProchainControle)
    res.status(201).json({ id: (result as any).insertId, dateControle, epiId, statut, remarques });
  } catch (err) {
    res.status(500).json({ message: "Error creating controle", error: err });
  }
});

// GET /api/controles : Récupérer la liste de tous les contrôles (avec option de filtrer par epiId)
controleRouter.get("/", authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { epiId } = req.query;
    let query = "SELECT * FROM Controle";
    let params: any[] = [];
    if (epiId) {
      query += " WHERE epiId = ?";
      params.push(epiId);
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching controles", error: err });
  }
});

// GET /api/controles/:id : Détails d’un contrôle
controleRouter.get("/:id", authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Controle WHERE id = ?", [id]);
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: "Controle not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching controle", error: err });
  }
});
