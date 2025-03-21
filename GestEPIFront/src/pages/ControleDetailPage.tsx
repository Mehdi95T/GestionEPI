// src/pages/ControleDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import { getControleById } from "../api";

const ControleDetailPage: React.FC = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL (/controles/:id)
  const [controle, setControle] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const ctrlId = parseInt(id);
    getControleById(ctrlId)
      .then(data => setControle(data))
      .catch(err => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!controle) {
    return (
      <Container>
        <Typography>Chargement du contrôle...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Détail du Contrôle #{controle.id}
        </Typography>
        <Typography>Date du contrôle : {controle.dateControle}</Typography>
        <Typography>EPI concerné (epiId) : {controle.epiId}</Typography>
        <Typography>Statut : {controle.statut}</Typography>
        <Typography>Remarques : {controle.remarques}</Typography>
      </Box>
    </Container>
  );
};

export default ControleDetailPage;
