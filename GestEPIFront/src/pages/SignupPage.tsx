// src/pages/SignUpPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { signup } from "../api";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mail, setMail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup({ username, password, name, lastName, mail });
      // Une fois inscrit, rediriger vers la page de login
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inscription
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom d'utilisateur"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Mot de passe"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Prénom"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Nom"
            variant="outlined"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            label="Adresse mail"
            variant="outlined"
            type="email"
            fullWidth
            margin="normal"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? "Création du compte..." : "S'inscrire"}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default SignUpPage;
