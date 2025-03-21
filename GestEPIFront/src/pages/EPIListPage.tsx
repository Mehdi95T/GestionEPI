// src/pages/EPIListPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { getEpis } from "../api";
import { useUserRole } from "../utils/auth";
import LogoutButton from "../components/LogoutButton";

const EPIListPage: React.FC = () => {
  const navigate = useNavigate();
  const [epis, setEpis] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const role = useUserRole();

  useEffect(() => {
    getEpis()
      .then(data => setEpis(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Liste des EPI
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <LogoutButton />

      {error && <Typography color="error">{error}</Typography>}

      {role === "gestionnaire" && (
        <Button
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => navigate("/epis/new")}
        >
            Ajouter un EPI
        </Button>
      )}
      <List>
        {epis.map((epi) => (
          <ListItem
            key={epi.id}
            button
            onClick={() => navigate(`/epis/${epi.id}`)}
          >
            <ListItemText
              primary={`${epi.identifiant} - ${epi.marque} ${epi.modele}`}
              secondary={`Numéro de série : ${epi.numeroSerie}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default EPIListPage;
