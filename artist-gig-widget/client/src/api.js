// client/src/api.js

// Helper to get query param from iframe URL
function getQueryParam(name) {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// API URL priority
const API_URL =
  getQueryParam("api") ||
  window.GIG_WIDGET_API ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

// ---- Central API wrapper ----
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    // handle expired login
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("artist");
      window.location.href = "/login";
    }

    let message;
    try {
      message = (await res.json()).error;
    } catch {
      message = await res.text();
    }
    throw new Error(message || "API request failed");
  }

  return res.json();
}

// ---- Convenience wrappers ----
export const fetchAllGigs   = () => apiFetch("/gigs");
export const fetchMyGigs    = () => apiFetch("/gigs/my");
export const fetchArtistGigs = (id) => apiFetch(`/artists/${id}/gigs`);
export const createGig      = (gig) => apiFetch("/gigs", { method: "POST", body: JSON.stringify(gig) });
export const updateGig      = (id, updates) => apiFetch(`/gigs/${id}`, { method: "PUT", body: JSON.stringify(updates) });
export const deleteGig      = (id) => apiFetch(`/gigs/${id}`, { method: "DELETE" });
export const fetchArtist    = (id) => apiFetch(`/artists/${id}`);

export const register       = (artist) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(artist) });
export const login          = (creds)  => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(creds) });
export const logout         = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("artist");
  window.location.href = "/login";
};