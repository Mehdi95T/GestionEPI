// src/pages/ControleNewPage.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createControle, getEpisDisponibles } from "../api";

const ControleNewPage: React.FC = () => {
  const navigate = useNavigate();

  // Champs requis pour un contrôle
  const [dateControle, setDateControle] = useState("");
  const [statut, setStatut] = useState("OPERATIONNEL");
  const [remarques, setRemarques] = useState("");

  // Liste des EPI disponibles
  const [epis, setEpis] = useState<any[]>([]);
  // Sélection de l'EPI via son id
  const [selectedEpiId, setSelectedEpiId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Charger la liste des EPI disponibles
    getEpisDisponibles()
      .then(data => {
        setEpis(data);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!selectedEpiId) {
      setError("Veuillez sélectionner un EPI");
      setLoading(false);
      return;
    }

    try {
      await createControle({
        dateControle,
        epiId: selectedEpiId,
        statut,
        remarques
      });
      navigate("/controles"); // redirection vers la liste
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du contrôle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Créer un nouveau Contrôle
        </Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          {/* Sélecteur pour l'EPI */}
          <TextField
            select
            label="Sélectionnez un EPI"
            value={selectedEpiId ?? ""}
            onChange={(e) => setSelectedEpiId(parseInt(e.target.value))}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="">-- Sélectionnez un EPI --</MenuItem>
            {epis.map((epi) => (
              <MenuItem key={epi.id} value={epi.id}>
                {epi.identifiant} - {epi.marque} {epi.modele} (ID: {epi.id})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Date du contrôle"
            type="date"
            value={dateControle}
            onChange={(e) => setDateControle(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            select
            label="Statut après contrôle"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="OPERATIONNEL">OPÉRATIONNEL</MenuItem>
            <MenuItem value="A_REPARER">À RÉPARER</MenuItem>
            <MenuItem value="MIS_AU_REBUT">MIS AU REBUT</MenuItem>
          </TextField>

          <TextField
            label="Remarques"
            value={remarques}
            onChange={(e) => setRemarques(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? "Création en cours..." : "Créer le Contrôle"}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ControleNewPage;
