import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createEpi } from "../api";

const EpiNewPage: React.FC = () => {
  const navigate = useNavigate();

  const [identifiant, setIdentifiant] = useState("");
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [type, setType] = useState("");
  const [taille, setTaille] = useState("");
  const [couleur, setCouleur] = useState("");
  const [dateAchat, setDateAchat] = useState("");
  const [dateFabrication, setDateFabrication] = useState("");
  const [dateMiseEnService, setDateMiseEnService] = useState("");
  const [periodiciteControle, setPeriodiciteControle] = useState<number>(365);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createEpi({
        identifiant,
        marque,
        modele,
        numeroSerie,
        type,
        taille: taille || null,
        couleur: couleur || null,
        dateAchat,
        dateFabrication,
        dateMiseEnService,
        periodiciteControle
      });
      // En cas de succès, on redirige vers la liste des EPI
      navigate("/epis");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de l'EPI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Créer un nouvel EPI
        </Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Identifiant"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Marque"
            value={marque}
            onChange={(e) => setMarque(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Modèle"
            value={modele}
            onChange={(e) => setModele(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Numéro de série"
            value={numeroSerie}
            onChange={(e) => setNumeroSerie(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          {/* Sélection du type (CORDE, SANGLE, LONGE, BAUDRIER, CASQUE, MOUSQUETON) */}
          <TextField
            select
            label="Type d'EPI"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="CORDE">CORDE</MenuItem>
            <MenuItem value="SANGLE">SANGLE</MenuItem>
            <MenuItem value="LONGE">LONGE</MenuItem>
            <MenuItem value="BAUDRIER">BAUDRIER</MenuItem>
            <MenuItem value="CASQUE">CASQUE</MenuItem>
            <MenuItem value="MOUSQUETON">MOUSQUETON</MenuItem>
          </TextField>

          {/* Taille et couleur (optionnels) */}
          <TextField
            label="Taille (optionnel)"
            value={taille}
            onChange={(e) => setTaille(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Couleur (optionnel)"
            value={couleur}
            onChange={(e) => setCouleur(e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Date d'achat"
            type="date"
            value={dateAchat}
            onChange={(e) => setDateAchat(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Date de fabrication"
            type="date"
            value={dateFabrication}
            onChange={(e) => setDateFabrication(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Date de mise en service"
            type="date"
            value={dateMiseEnService}
            onChange={(e) => setDateMiseEnService(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            label="Périodicité de contrôle (en jours)"
            type="number"
            value={periodiciteControle}
            onChange={(e) => setPeriodiciteControle(parseInt(e.target.value))}
            fullWidth
            margin="normal"
            required
          />

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? "Création en cours..." : "Créer l'EPI"}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default EpiNewPage;