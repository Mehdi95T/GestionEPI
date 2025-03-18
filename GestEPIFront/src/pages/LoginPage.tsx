import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";

const LoginPage: React.FC = () => {
  const history = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      history("/epis", );
    } catch (err) {
      setError("Identifiants invalides");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Connexion
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom d'utilisateur"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Se connecter
        </Button>
      </form>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="body2" color="textSecondary">
          Pas de compte ?
        </Typography>
        <Button variant="text" onClick={() => history("/signup")}>
          S'inscrire
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
