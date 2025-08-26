(function () {
  // Make sure we only initialize once
  if (window.__GIG_WIDGET_INIT__) return;
  window.__GIG_WIDGET_INIT__ = true;

  const createdButtons = {};

  function init() {
    const containers = document.querySelectorAll("[data-gig-widget]");

    const script =
      document.currentScript ||
      document.querySelector('script[src*="embed.js"]');
    const origin = new URL(script.src).origin;

    containers.forEach(function (el) {
      const apiOrigin =
        el.getAttribute("data-api") ||
        window.GIG_WIDGET_API ||
        origin.replace(/\/$/, "") + "/api";

      const type = el.getAttribute("data-type") || "public"; // "public" or "artist"
      const artistId = el.getAttribute("data-artist-id") || "";
      const view = el.getAttribute("data-view") || "card";

      // Unique key (only one button per type/artistId)
      const key = type === "artist" ? `artist-${artistId}` : "public";
      if (createdButtons[key]) return;
      createdButtons[key] = true;

      // API URL
      let apiUrl;
      if (type === "artist") {
        if (!artistId) {
          console.error("Artist widget requires data-artist-id");
          return;
        }
        apiUrl = `${apiOrigin}/artists/${encodeURIComponent(artistId)}/gigs`;
      } else {
        apiUrl = `${apiOrigin}/gigs/public`;
      }

      // Fetch gigs
      fetch(apiUrl)
        .then((res) => {
          if (!res.ok) throw new Error("API request failed: " + res.status);
          return res.json();
        })
        .then((gigs) => {
          const now = new Date();
          const upcoming = gigs.filter((g) => new Date(g.date_time) >= now);
          const count = upcoming.length;

          // Floating button
          const button = document.createElement("div");
          button.style.position = "fixed";
          button.style.bottom = key === "public" ? "20px" : "90px";
          button.style.right = "20px";
          button.style.width = "56px";
          button.style.height = "56px";
          button.style.borderRadius = "50%";
          button.style.background = key === "public" ? "#007bff" : "#28a745";
          button.style.color = "#fff";
          button.style.display = "flex";
          button.style.alignItems = "center";
          button.style.justifyContent = "center";
          button.style.cursor = "pointer";
          button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
          button.style.fontSize = "24px";
          button.innerHTML = key === "public" ? "🎶" : "🎤";
          document.body.appendChild(button);

          // Badge
          if (count > 0) {
            const badge = document.createElement("div");
            badge.innerText = count;
            badge.style.position = "absolute";
            badge.style.top = "8px";
            badge.style.right = "8px";
            badge.style.background = "#ff4757";
            badge.style.color = "#fff";
            badge.style.fontSize = "12px";
            badge.style.fontWeight = "bold";
            badge.style.padding = "2px 6px";
            badge.style.borderRadius = "12px";
            button.style.position = "relative";
            button.appendChild(badge);
          }

          // Modal
          const modal = document.createElement("div");
          modal.style.position = "fixed";
          modal.style.top = "0";
          modal.style.left = "0";
          modal.style.width = "100%";
          modal.style.height = "100%";
          modal.style.background = "rgba(0,0,0,0.6)";
          modal.style.display = "none";
          modal.style.justifyContent = "center";
          modal.style.alignItems = "center";
          modal.style.zIndex = "9999";

          const iframe = document.createElement("iframe");
          iframe.src =
            type === "artist"
              ? `${origin}/#/widget/artist?artistId=${encodeURIComponent(
                  artistId
                )}&view=${encodeURIComponent(view)}&api=${encodeURIComponent(
                  apiOrigin
                )}`
              : `${origin}/#/widget/global?view=${encodeURIComponent(
                  view
                )}&api=${encodeURIComponent(apiOrigin)}`;
          iframe.style.width = "90%";
          iframe.style.maxWidth = "800px";
          iframe.style.height = "45%";
          iframe.style.border = "0";
          iframe.style.borderRadius = "12px";
          modal.appendChild(iframe);

          document.body.appendChild(modal);

          button.addEventListener("click", () => {
            modal.style.display = "flex";
          });

          modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
          });
        })
        .catch((err) => console.error("Failed to load gigs:", err));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
