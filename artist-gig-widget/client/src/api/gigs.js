import { api } from "../api.js"; // keep your central api wrapper

// ✅ get gigs for logged-in artist
export async function fetchMyGigs() {
  return api("/gigs/mine", { token: true }); // we'll hit /gigs/mine (server side filters by req.user.id)
}

// ✅ create gig
export async function createGig(body) {
  return api("/gigs", { method: "POST", body, token: true });
}

// ✅ update gig
export async function updateGig(id, body) {
  return api(`/gigs/${id}`, { method: "PUT", body, token: true });
}

// ✅ delete gig
export async function deleteGig(id) {
  return api(`/gigs/${id}`, { method: "DELETE", token: true });
}
