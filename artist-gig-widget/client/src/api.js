// client/src/api.js

function getQueryParam(name) {
  if (typeof window === "undefined") return null;
  return new URL(window.location.href).searchParams.get(name);
}

// Build base API URL
let base =
  getQueryParam("api") ||
  window.GIG_WIDGET_API ||
  import.meta.env.VITE_API_URL ||
  "https://artist-gig-widget-server.onrender.com/api";

// Ensure correct trailing /api
if (!base.endsWith("/api")) {
  base = base.replace(/\/$/, "") + "/api";
}

console.log("API_URL:", base);

// ---- Central API wrapper ----
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Read body ONCE
  let data;
  try {
    data = await res.json();
  } catch {
    data = null; // No JSON body
  }

  // Handle errors
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("artist");
      localStorage.removeItem("admin");
      window.location.href = "/login";
    }

    const message =
      data?.error ||
      data?.message ||
      "API request failed";

    throw new Error(message);
  }

  return data;
}

// ---- Convenience wrappers ----
export const fetchAllGigs    = () => apiFetch("/gigs");
export const fetchGigs       = () => apiFetch("/gigs/all");
export const fetchMyGigs     = () => apiFetch("/gigs/mine");
export const fetchArtistGigs = (id) => apiFetch(`/artists/${id}/gigs`);
export const createGig       = (gig) => apiFetch("/gigs", { method: "POST", body: JSON.stringify(gig) });
export const updateGig       = (id, updates) => apiFetch(`/gigs/${id}`, { method: "PUT", body: JSON.stringify(updates) });
export const deleteGig       = (id) => apiFetch(`/gigs/${id}`, { method: "DELETE" });
export const fetchArtist     = (id) => apiFetch(`/artists/${id}`);
export const fetchPublicGigs = () => apiFetch("/gigs/public");

export const register        = (artist) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(artist) });
export const login           = (creds)  => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(creds) });
export const adminLogin      = (creds)  => apiFetch("/admin/login", { method: "POST", body: JSON.stringify(creds) });
export const logout          = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("artist");
  window.location.href = "/login";
  console.log("Fetching:", `${base}${path}`);
};
