import { Router } from "express";
import { authenticateJWT, AuthRequest } from "../middleware/authMiddleware";
import { EPIType } from "gestepiinterfaces-mdi";
import { pool } from "../db";
import { RowDataPacket } from "mysql2";

export const epiRouter = Router();

// GET /api/epis/alertes : Récupérer les EPI en alerte (prochain contrôle proche ou expiré pour les textiles)
epiRouter.get("/alertes", authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM EPI WHERE isDeleted = false");  // Récupération des EPI non supprimés
    let epis = rows as any[];
    const now = new Date();
    const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);  // Date actuelle + 30 jours
    epis = epis.filter(e => {
      // Logique pour les EPI textiles expirés ou dont le prochain contrôle est proche
      if ([EPIType.CORDE, EPIType.SANGLE, EPIType.LONGE, EPIType.BAUDRIER].includes(e.type) && e.isExpired) {
        return true;
      }
      const nextControl = new Date(e.dateProchainControle);
      return (nextControl >= now && nextControl <= oneMonthLater);
    });
    res.json(epis);  // Envoi des EPI en alerte
  } catch (err) {
    res.status(500).json({ message: "Error fetching alerts", error: err });  // Erreur serveur
  }
});

// GET /api/epis/critique : Récupérer les EPI critiques (prochain contrôle expiré sans les textiles)
epiRouter.get("/critique", authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user.role !== "gestionnaire") {
        return res.status(403).json({ message: "Access denied" });
      }
    try {
      // Récupération de tous les EPI non supprimés
      const [rows] = await pool.query("SELECT * FROM EPI WHERE isDeleted = false");
      let epis = rows as any[];
  
      const now = new Date();
  
      // Filtrer pour garder seulement ceux dont la dateProchainControle est déjà passée
      // en excluant les textiles expirés
      epis = epis.filter(e => {
        // Si EPI textile expiré => exclu
        const isTextile = ["CORDE","SANGLE","LONGE","BAUDRIER"].includes(e.type);
        if (isTextile && e.isExpired) {
          return false;
        }
  
        // Sinon, on compare dateProchainControle à now
        const nextControl = new Date(e.dateProchainControle);
        return nextControl < now;
      });
  
      res.json(epis);
    } catch (err) {
      res.status(500).json({ message: "Error fetching critical EPIs", error: err });
    }
  });

  epiRouter.get("/disponibles", authenticateJWT, async (req: AuthRequest, res) => {
    // Seul un gestionnaire peut lister les EPI disponibles
    if (req.user.role !== "gestionnaire") {
      return res.status(403).json({ message: "Access denied" });
    }
  
    try {
      // Récupérer tous les EPI non supprimés
      const [rows] = await pool.query("SELECT * FROM EPI WHERE isDeleted = false");
      let epis = rows as any[];
  
      const now = new Date();
  
      // Filtrer pour exclure les textiles de + de 10 ans
      epis = epis.filter(e => {
        // Vérifier si c’est un textile
        const isTextile = ["CORDE", "SANGLE", "LONGE", "BAUDRIER"].includes(e.type);
        console.log("EPI:", e.id, e.identifiant, e.type, "miseEnService =", e.dateMiseEnService);
        if (isTextile) {
          // Calculer la différence en années entre dateMiseEnService et now
          const miseEnService = new Date(e.dateMiseEnService);
          const diffTime = now.getTime() - miseEnService.getTime();
          // 10 ans en ms => 10 * 365 * 24 * 60 * 60 * 1000 = 315360000000 (environ)
          if (diffTime > 315360000000) {
            return false; // exclure
          }
        }
        return true; // Garder dans la liste
      });
  
      res.json(epis);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching disponibles EPI", error: err });
    }
  });
  
  

// GET /api/epis : Récupérer la liste des EPI non supprimés
epiRouter.get("/", authenticateJWT, async (req: AuthRequest, res) => {
    console.log("=== ROUTE /api/epis CALLED ===");
  try {
    const [rows] = await pool.query("SELECT * FROM EPI WHERE isDeleted = false");
    let epis = rows as any[];
    // Filtrer les EPI textiles expirés pour les cordistes
    if (req.user.role === "cordiste") {
      epis = epis.filter(e => {
        if ([EPIType.CORDE, EPIType.SANGLE, EPIType.LONGE, EPIType.BAUDRIER].includes(e.type)) {
          return !e.isExpired;
        }
        return true;
      });
    }
    res.json(epis);
  } catch (err) {
    res.status(500).json({ message: "Error fetching EPIs", error: err });
  }
});

// POST /api/epis : Créer un nouvel EPI (gestionnaire uniquement)
epiRouter.post("/", authenticateJWT, async (req: AuthRequest, res) => {
  if (req.user.role !== "gestionnaire") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const {
      identifiant,
      marque,
      modele,
      numeroSerie,
      type,
      taille,
      couleur,
      dateAchat,
      dateFabrication,
      dateMiseEnService,
      periodiciteControle
    } = req.body;

    // Calcul du prochain contrôle : dateMiseEnService + periodiciteControle (en jours)
    const dateMise = new Date(dateMiseEnService);
    const dateProchainControle = new Date(dateMise.getTime() + periodiciteControle * 24 * 60 * 60 * 1000);

    const query = `
      INSERT INTO EPI 
      (identifiant, marque, modele, numeroSerie, type, taille, couleur, dateAchat, dateFabrication, dateMiseEnService, periodiciteControle, dateProchainControle, isConforme, isExpired, isDeleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, false, false)
    `;
    const [result] = await pool.query(query, [
      identifiant,
      marque,
      modele,
      numeroSerie,
      type,
      taille || null,
      couleur || null,
      dateAchat,
      dateFabrication,
      dateMiseEnService,
      periodiciteControle,
      dateProchainControle.toISOString().slice(0, 10)
    ]);
    res.status(201).json({ id: (result as any).insertId, ...req.body, dateProchainControle });
  } catch (err) {
    res.status(500).json({ message: "Error creating EPI", error: err });
  }
});

// GET /api/epis/:id : Détails d’un EPI
epiRouter.get("/:id", authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM EPI WHERE id = ? AND isDeleted = false", [id]);
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: "EPI not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching EPI", error: err });
  }
});

// PUT /api/epis/:id : Mise à jour d’un EPI (gestionnaire uniquement)
epiRouter.put("/:id", authenticateJWT, async (req: AuthRequest, res) => {
  if (req.user.role !== "gestionnaire") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const { id } = req.params;
    const updateData = req.body;
    // Si on met à jour la dateMiseEnService ou periodiciteControle, recalculer la dateProchainControle
    if (updateData.dateMiseEnService || updateData.periodiciteControle) {
      const dateMise = new Date(updateData.dateMiseEnService || undefined);
      const periodicite = updateData.periodiciteControle;
      if (dateMise && periodicite) {
        updateData.dateProchainControle = new Date(dateMise.getTime() + periodicite * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
      }
    }
    // Construction dynamique de la requête de mise à jour
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    const setClause = fields.map(field => `${field} = ?`).join(", ");
    const query = `UPDATE EPI SET ${setClause} WHERE id = ?`;
    await pool.query(query, [...values, id]);
    res.json({ message: "EPI updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating EPI", error: err });
  }
});

// DELETE /api/epis/:id : Soft-delete d’un EPI (gestionnaire uniquement)
epiRouter.delete("/:id", authenticateJWT, async (req: AuthRequest, res) => {
  if (req.user.role !== "gestionnaire") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const { id } = req.params;
    await pool.query("UPDATE EPI SET isDeleted = true WHERE id = ?", [id]);
    res.json({ message: "EPI soft-deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting EPI", error: err });
  }
});

// POST /api/epis/:id/reactivate : Réactivation d’un EPI (gestionnaire uniquement)
epiRouter.post("/:id/reactivate", authenticateJWT, async (req: AuthRequest, res) => {
  if (req.user.role !== "gestionnaire") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const { id } = req.params;
    await pool.query("UPDATE EPI SET isDeleted = false WHERE id = ?", [id]);
    res.json({ message: "EPI reactivated" });
  } catch (err) {
    res.status(500).json({ message: "Error reactivating EPI", error: err });
  }
});


