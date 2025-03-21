// src/components/LogoutButton.tsx
import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function logout() {
  localStorage.removeItem("token");
}

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirection vers la page login
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Se déconnecter
    </Button>
  );
};

export default LogoutButton;
