(function () {
  // Prevent double init
  if (window.__GIG_WIDGET_INIT__) return;
  window.__GIG_WIDGET_INIT__ = true;

  const createdButtons = {};

  function init() {
    const containers = document.querySelectorAll("[data-gig-widget]");

    const script =
      document.currentScript ||
      document.querySelector('script[src*="embed.js"]');
    const origin = "https://artist-gig-widget-server.onrender.com";
    const scriptApi =
      script?.getAttribute("data-api") ||
      script?.dataset?.api ||
      window.GIG_WIDGET_API;

    containers.forEach(function (el) {
      /*const apiOrigin =
        el.getAttribute("data-api") ||
        scriptApi ||
        origin.replace(/\/$/, "") + "/api";*/
        

      const type = el.getAttribute("data-type") || "public"; // "public" or "artist"
      const artistId = el.getAttribute("data-artist-id") || "";
      const view = el.getAttribute("data-view") || "card";

      // Unique button key
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
          button.style.transition = "transform 0.3s ease";
          button.innerHTML = key === "public" ? "🎶" : "🎤";
          document.body.appendChild(button);

          // Bounce/pulse animation loop
          let pulseInterval = setInterval(() => {
            button.style.transform = "scale(1.2)";
            setTimeout(() => {
              button.style.transform = "scale(0.9)";
              setTimeout(() => {
                button.style.transform = "scale(1)";
              }, 150);
            }, 150);
          }, 4000);

          // Badge
          if (count > 0) {
            const badge = document.createElement("div");
            badge.innerText = count;
            badge.style.position = "absolute";
            badge.style.top = "-6px";       // pull it outside button
            badge.style.right = "-6px";     // pull it outside button
            badge.style.background = "#ff4757";
            badge.style.color = "#fff";
            badge.style.fontSize = "12px";
            badge.style.fontWeight = "bold";
            badge.style.padding = "2px 6px";
            badge.style.borderRadius = "12px";
            badge.style.transition = "transform 0.2s ease";
            badge.style.zIndex = "10000";   // make sure it’s on top
            button.appendChild(badge);

            // Badge hover animation (fully out)
            badge.addEventListener("mouseenter", () => {
              badge.style.transform = "translateX(12px) scale(1.1)"; // further out
            });
            badge.addEventListener("mouseleave", () => {
              badge.style.transform = "translateX(0) scale(1)";
            });
          }


          // Modal overlay
          const modal = document.createElement("div");
          modal.style.position = "fixed";
          modal.style.top = "0";
          modal.style.left = "0";
          modal.style.width = "100%";
          modal.style.height = "100%";
          modal.style.background = "rgba(0,0,0,0.2)";
          modal.style.display = "none";
          modal.style.justifyContent = "center";
          modal.style.alignItems = "center";
          modal.style.zIndex = "9999";
          modal.style.transition = "opacity 0.3s ease";
          modal.style.opacity = "0";

          // Card container
          const card = document.createElement("div");
          card.style.position = "relative";
          card.style.width = "90%";
          card.style.maxWidth = "800px";
          card.style.height = "auto"; // let height adjust
          card.style.background = "#fff";
          card.style.borderRadius = "12px";
          card.style.overflow = "hidden";
          card.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
          card.style.transform = "translateY(40px) scale(0.95)";
          card.style.transition =
            "transform 0.3s ease, opacity 0.3s ease";
          card.style.opacity = "0";

          // Close button
          const closeBtn = document.createElement("div");
          closeBtn.innerHTML = "&times;";
          closeBtn.style.position = "absolute";
          closeBtn.style.top = "10px";
          closeBtn.style.right = "15px";
          closeBtn.style.fontSize = "28px";
          closeBtn.style.fontWeight = "bold";
          closeBtn.style.cursor = "pointer";
          closeBtn.style.color = "#333";
          closeBtn.addEventListener("click", () => {
            modal.style.opacity = "0";
            card.style.opacity = "0";
            card.style.transform = "translateY(40px) scale(0.95)";
            setTimeout(() => (modal.style.display = "none"), 300);
          });

          // Iframe
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
          iframe.style.width = "100%";
          iframe.style.height = "auto"; // initial height
          iframe.style.border = "0";
          iframe.style.borderRadius = "12px";

          // 🔑 Auto-resize listener
          window.addEventListener("message", (event) => {
            if (event.data?.type === "resizeWidget") {
              const newHeight = event.data.height;
              iframe.style.height = newHeight + "px";
            }
          });

          card.appendChild(closeBtn);
          card.appendChild(iframe);
          modal.appendChild(card);
          document.body.appendChild(modal);

          // Open modal with animation
          button.addEventListener("click", () => {
            // stop pulse
            if (pulseInterval) {
              clearInterval(pulseInterval);
              pulseInterval = null;
              button.style.transform = "scale(1)"; // reset
            }

            modal.style.display = "flex";
            setTimeout(() => {
              modal.style.opacity = "1";
              card.style.opacity = "1";
              card.style.transform = "translateY(0) scale(1.05)";
              setTimeout(() => {
                card.style.transform = "translateY(0) scale(1)";
              }, 200);
            }, 20);
          });

          // Close when clicking outside
          modal.addEventListener("click", (e) => {
            if (e.target === modal) {
              modal.style.opacity = "0";
              card.style.opacity = "0";
              card.style.transform = "translateY(40px) scale(0.95)";
              setTimeout(() => (modal.style.display = "none"), 300);
            }
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
