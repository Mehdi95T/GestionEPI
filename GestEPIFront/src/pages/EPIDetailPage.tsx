// src/pages/EpiDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import { getEpiById } from "../api";
import { useUserRole } from "../utils/auth";

const EpiDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [epi, setEpi] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const role = useUserRole();

  useEffect(() => {
    if (!id) return;
    getEpiById(parseInt(id))
      .then((data) => setEpi(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!epi) {
    return (
      <Container>
        <Typography>Chargement...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Détail de l'EPI
      </Typography>
      <Typography>Identifiant : {epi.identifiant}</Typography>
      <Typography>Marque : {epi.marque}</Typography>
      <Typography>Modèle : {epi.modele}</Typography>
      <Typography>Numéro de série : {epi.numeroSerie}</Typography>
      <Typography>Date d'achat : {epi.dateAchat}</Typography>
      <Typography>Date de mise en service : {epi.dateMiseEnService}</Typography>
      {/* etc. Affichez les champs utiles */}

      <Box mt={2}>
        <Button
          variant="contained"
          onClick={() => navigate(`/controles?epiId=${epi.id}`)}
        >
          Voir les contrôles
        </Button>
      </Box>

      {role === "gestionnaire" && (
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/controles/new")} // exemple si vous prévoyez un formulaire
        >
          Ajouter un contrôle
        </Button>
      </Box>
      )}
    </Container>
  );
};

export default EpiDetailPage;
