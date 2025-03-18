// src/pages/AlertPage.tsx
import React, { useEffect, useState } from "react";
import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";
import { getAlerts } from "../api";

const AlertPage: React.FC = () => {
  const [epis, setEpis] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAlerts()
      .then(data => setEpis(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        EPI en alerte
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      {epis.length === 0 ? (
        <Typography>Aucun EPI en alerte</Typography>
      ) : (
        <List>
          {epis.map(epi => (
            <ListItem key={epi.id}>
              <ListItemText
                primary={`EPI : ${epi.identifiant}`}
                secondary={`Prochain contrôle : ${epi.dateProchainControle}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default AlertPage;
