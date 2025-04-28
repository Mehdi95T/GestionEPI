import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { authRouter } from "./routes/auth";
import { epiRouter } from "./routes/epi";
import { controleRouter } from "./routes/controle";
import * as middlewares from "./middlewares";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Exemple de route racine
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API GestEPI !");
});

// Routes de l'API
app.use("/api/auth", authRouter);
app.use("/api/epis", epiRouter);
app.use("/api/controles", controleRouter);

// Middleware pour les routes non trouvées
app.use(middlewares.notFound);
// Middleware de gestion d'erreurs
app.use(middlewares.errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
