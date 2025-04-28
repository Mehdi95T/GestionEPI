import { Request, Response, NextFunction } from "express";  // Importation des types pour les requêtes Express
import jwt from "jsonwebtoken";  // Importation de la librairie JWT pour gérer les tokens

export interface AuthRequest extends Request {  // Extension de la requête Express pour inclure un attribut user optionnel
  user?: any;
}

// Middleware pour authentifier le JWT
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;  // Récupère l'en-tête Authorization

  if (authHeader) {  // Si l'en-tête Authorization existe
    const token = authHeader.split(" ")[1];  // Le token JWT est après "Bearer"
    jwt.verify(token, "SECRET_KEY", (err, user) => {  // Vérification du token avec la clé secrète
      if (err) {  // Si le token est invalide
        return res.sendStatus(403);  // Accès refusé
      }
      req.user = user;  // Attache l'utilisateur décodé à la requête
      next();  // Passe à la suite du traitement
    });
  } else {
    res.sendStatus(401);  // Si aucun token n'est présent, accès non autorisé
  }
};

