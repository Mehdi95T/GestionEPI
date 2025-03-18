// src/pages/ControleListPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { getControles } from "../api";
import { useUserRole } from "../utils/auth";

const ControleListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const epiId = searchParams.get("epiId");
  const [controles, setControles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const role = useUserRole();

  useEffect(() => {
    const id = epiId ? parseInt(epiId) : undefined;
    getControles(id)
      .then(data => setControles(data))
      .catch(err => setError(err.message));
  }, [epiId]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Liste des Contrôles
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      {role === "gestionnaire" && (
      <Button variant="contained" onClick={() => navigate("/controles/new")} sx={{ mb: 2 }}>
        Ajouter un contrôle
      </Button>
      )}

      <List>
        {controles.map((ctrl) => (
          <ListItem
            key={ctrl.id}
            button
            onClick={() => navigate(`/controles/${ctrl.id}`)}
          >
            <ListItemText
              primary={`Contrôle #${ctrl.id} - EPI #${ctrl.epiId}`}
              secondary={`Date : ${ctrl.dateControle} | Statut : ${ctrl.statut}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ControleListPage;
