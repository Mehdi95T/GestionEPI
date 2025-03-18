// src/pages/CritiquePage.tsx
import React, { useEffect, useState } from "react";
import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";
import { getCritique } from "../api";

const CritiquePage: React.FC = () => {
  const [epis, setEpis] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCritique()
      .then(data => setEpis(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        EPI en Retard (Critique)
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      {epis.length === 0 ? (
        <Typography>Aucun EPI en retard</Typography>
      ) : (
        <List>
          {epis.map(epi => (
            <ListItem key={epi.id}>
              <ListItemText
                primary={`EPI : ${epi.identifiant}`}
                secondary={`Date de prochain contrôle dépassée : ${epi.dateProchainControle}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default CritiquePage;
