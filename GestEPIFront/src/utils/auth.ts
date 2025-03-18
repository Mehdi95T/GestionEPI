import { useState, useEffect } from "react";
import JwtDecode, { jwtDecode } from "jwt-decode";

export const login = async (username: string, password: string) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      throw new Error("Login failed");
    }
    const data = await response.json();
    localStorage.setItem("token", data.token);
  };
  
  export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
  };
  
  interface JWTPayload {
    id: number;
    username: string;
    role: string;
    iat: number;
    exp: number;
  }
  
  export function useUserRole() {
    const [role, setRole] = useState<string | null>(null);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }, []);
  
    return role;
  }