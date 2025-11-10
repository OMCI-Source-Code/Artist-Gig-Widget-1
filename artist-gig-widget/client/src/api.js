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

queryThing = getQueryParam("api");
windowThing = window.GIG_WIDGET_API;
envVar = import.meta.env.VITE_API_URL;

console.log("queryThing:", queryThing);
console.log("windowThing:", windowThing);
console.log("envVar:", envVar);



// Ensure it ends with /api
if (!base.endsWith("/api")) {
  base = base.replace(/\/$/, "") + "/api";
}
if (base == "http://localhost:4000/api"){
  base = "https://artist-gig-widget-server.onrender.com/api";
}
console.log("bad api url:", base);

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

  if (!res.ok) {
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
export const fetchAllGigs    = () => apiFetch("/gigs");
export const fetchMyGigs     = () => apiFetch("/gigs/mine");
export const fetchArtistGigs = (id) => apiFetch(`/artists/${id}/gigs`);
export const createGig       = (gig) => apiFetch("/gigs", { method: "POST", body: JSON.stringify(gig) });
export const updateGig       = (id, updates) => apiFetch(`/gigs/${id}`, { method: "PUT", body: JSON.stringify(updates) });
export const deleteGig       = (id) => apiFetch(`/gigs/${id}`, { method: "DELETE" });
export const fetchArtist     = (id) => apiFetch(`/artists/${id}`);
export const fetchPublicGigs = () => apiFetch("/gigs/public");

export const register        = (artist) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(artist) });
export const login           = (creds)  => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(creds) });
export const logout          = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("artist");
  window.location.href = "/login";
  console.log("Fetching:", `${base}${path}`);
};
