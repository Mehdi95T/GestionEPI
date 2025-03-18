// src/api.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

/**
 * Récupère les headers d'authentification avec le token JWT stocké dans le localStorage.
 */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

/*===============================
  Authentification
================================*/

export async function login(username: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
  // Stocker le token pour les requêtes futures
  localStorage.setItem("token", data.token);
  console.log(localStorage.getItem("token"));

}

export async function signup(userData: {
    username: string;
    password: string;
    name: string;
    lastName: string;
    mail: string;
  }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sign up failed");
    }
  }

/*===============================
  Gestion des EPI
================================*/

/**
 * Récupère la liste de tous les EPI (filtrés côté back selon le rôle).
 */
export async function getEpis(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/epis`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Failed to fetch EPIs");
  }
  return response.json();
}

/**
 * Récupère un EPI par son ID.
 */
export async function getEpiById(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/epis/${id}`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Failed to fetch EPI by id");
  }
  return response.json();
}

/**
 * Crée un nouvel EPI.
 * Le back calcule automatiquement la date du prochain contrôle à partir de la date de mise en service et de la périodicité.
 */
export async function createEpi(epiData: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/epis`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(epiData)
  });
  if (!response.ok) {
    throw new Error("Failed to create EPI");
  }
  return response.json();
}

/**
 * Met à jour un EPI existant.
 */
export async function updateEpi(id: number, updateData: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/epis/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData)
  });
  if (!response.ok) {
    throw new Error("Failed to update EPI");
  }
  return response.json();
}

/**
 * Effectue un soft-delete d’un EPI.
 */
export async function deleteEpi(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/epis/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Failed to delete EPI");
  }
  return response.json();
}

/**
 * Réactive un EPI soft-deleted.
 */
export async function reactivateEpi(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/epis/${id}/reactivate`, {
    method: "POST",
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Failed to reactivate EPI");
  }
  return response.json();
}

/**
 * Récupère la liste des EPI dont le prochain contrôle est imminent (alerte).
 */
export async function getAlerts(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/epis/alertes`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }
  return response.json();
}

/**
 * Récupère la liste des EPI dont la date de contrôle est déjà dépassée (critique),
 * en excluant les textiles expirés (au-delà de 10 ans).
 */
export async function getCritique(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/epis/critique`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Failed to fetch critique EPIs");
  }
  return response.json();
}

/*===============================
  Gestion des Contrôles
================================*/

/**
 * Récupère la liste de tous les contrôles.
 * Si epiId est fourni, filtre les contrôles pour un EPI spécifique.
 */
export async function getControles(epiId?: number): Promise<any[]> {
  let url = `${API_BASE_URL}/controles`;
  if (epiId !== undefined) {
    url += `?epiId=${epiId}`;
  }
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Failed to fetch controles");
  }
  return response.json();
}

/**
 * Récupère les détails d'un contrôle par son ID.
 */
export async function getControleById(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/controles/${id}`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Failed to fetch controle by id");
  }
  return response.json();
}

/**
 * Crée un nouveau contrôle pour un EPI (gestionnaire uniquement).
 */
export async function createControle(controleData: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/controles`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(controleData)
  });
  if (!response.ok) {
    throw new Error("Failed to create controle");
  }
  return response.json();
}
