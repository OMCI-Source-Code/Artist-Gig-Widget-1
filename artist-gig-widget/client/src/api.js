
function getQueryParam(name) {
  if (typeof window === "undefined") return null;
  return new URL(window.location.href).searchParams.get(name);
}

let base =
  getQueryParam("api") ||
  window.GIG_WIDGET_API ||
  import.meta.env.VITE_API_URL ||
  "https://artist-gig-widget-server.onrender.com/api";

console.log("API_URL:", base);

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

  let data;
  try {
    data = await res.json();
  } catch {
    data = null; // No JSON body
  }

  if (!res.ok) {
    if (res.status === 401) {
  localStorage.removeItem("token");
  throw new Error("Unauthorized");
}

    const message =
      data?.error ||
      data?.message ||
      "API request failed";

    throw new Error(message);
  }

  return data;
}

export const fetchAllGigs    = () => apiFetch("/gigs");
export const fetchGigs       = () => apiFetch("/gigs/all");
export const fetchMyGigs     = () => apiFetch("/gigs/mine");
export const fetchArtistGigs = (id) => apiFetch(`/users/gigs/${id}`);
export const createGig       = (gig) => apiFetch("/gigs", { method: "POST", body: JSON.stringify(gig) });
export const updateGig       = (id, updates) => apiFetch(`/gigs/${id}`, { method: "PUT", body: JSON.stringify(updates) });
export const deleteGig       = (id) => apiFetch(`/gigs/${id}`, { method: "DELETE" });
export const fetchArtist     = (id) => apiFetch(`/artists/${id}`);
export const fetchPublicGigs = () => apiFetch("/gigs/public");


export const fetchMe         = () => apiFetch("/auth/me");
export const register        = (artist) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(artist) });
export const login           = (creds)  => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(creds) });

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
