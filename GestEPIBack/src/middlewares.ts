//********** Imports **********//
import { NextFunction, Request, Response } from "express";  // Importation des types Express pour la gestion des requêtes, réponses et middlewares
import jwt from "jsonwebtoken";  // Importation de la librairie pour la gestion des JSON Web Tokens (JWT)

import ErrorResponse from "./pages/interfaces/ErrorResponse";  // Importation d'un type pour la gestion des erreurs

//********** Middlewares **********//

// Middleware pour gérer les routes non trouvées (404)
export const notFound = (
  request: Request,  // Requête entrante
  response: Response,  // Réponse sortante
  nextFunction: NextFunction  // Fonction pour passer au middleware suivant
) => {
  response.status(404);  // Définit le statut HTTP 404 (Not Found)
  const error = new Error(`Not found - ${request.originalUrl}`);  // Crée une nouvelle erreur avec l'URL d'origine de la requête
  nextFunction(error);  // Passe l'erreur au prochain middleware d'erreur
};

// Middleware pour gérer les erreurs (comme un gestionnaire global d'erreurs)
export const errorHandler = (
  error: Error,  // L'objet d'erreur capturé
  request: Request,  // Requête entrante
  response: Response<ErrorResponse>,  // Réponse sortante, avec un type spécifique pour l'erreur
  nextFunction: NextFunction  // Fonction pour passer au middleware suivant
) => {
  const statusCode = response.statusCode !== 200 ? response.statusCode : 500;  // Si le code de statut n'est pas défini (pas 200), on attribue 500 par défaut
  response  // Envoie la réponse avec le statut et le message d'erreur
    .status(statusCode)
    .json({ message: error.message, stack: error.stack });  // Détails de l'erreur (message et pile d'exécution)
};

// Interface personnalisée pour les requêtes avec un utilisateur (authentifié)
export interface AuthRequest extends Request {
  user?: any;  // L'utilisateur est facultatif dans la requête
}

// Middleware pour authentifier les utilisateurs via JWT
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;  // Récupère l'en-tête Authorization

  if (authHeader) {  // Si l'en-tête Authorization existe
    const token = authHeader.split(" ")[1];  // Le token est après "Bearer"
    jwt.verify(token, "SECRET_KEY", (err, user) => {  // Vérification du token JWT avec la clé secrète
      if (err) {  // Si le token est invalide
        return res.sendStatus(403);  // Accès refusé (403)
      }
      req.user = user;  // L'utilisateur décodé est attaché à la requête
      next();  // Passe à la suite du traitement
    });
  } else {
    res.sendStatus(401);  // Si le token est manquant, retourne un accès non autorisé (401)
  }
};
