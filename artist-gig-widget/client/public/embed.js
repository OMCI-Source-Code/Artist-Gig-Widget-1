(function () {
  function init() {
    const containers = document.querySelectorAll("[data-gig-widget]");
    containers.forEach(function (el) {
      const type = el.getAttribute("data-type") || "artist";
      const artistId = el.getAttribute("data-artist-id") || "";
      const view = el.getAttribute("data-view") || "card";

      const script =
        document.currentScript ||
        document.querySelector('script[src*="embed.js"]');
      const origin = new URL(script.src).origin;

      const apiOrigin =
        window.GIG_WIDGET_API || origin.replace(/\/$/, "") + "/api";

      const src =
        type === "artist"
          ? `${origin}/#/widget/artist?artistId=${encodeURIComponent(
              artistId
            )}&view=${encodeURIComponent(view)}&api=${encodeURIComponent(
              apiOrigin
            )}`
          : `${origin}/#/widget/global?view=${encodeURIComponent(
              view
            )}&api=${encodeURIComponent(apiOrigin)}`;

      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.style.width = "100%";
      iframe.style.border = "0";
      iframe.style.minHeight = "350px";
      iframe.style.height = "auto"; 
      iframe.style.borderRadius = "12px";
      iframe.style.overflow = "hidden"; // prevent double scrollbar
      iframe.style.transition = "all 0.3s ease";
      iframe.loading = "lazy";

      el.innerHTML = "";
      el.appendChild(iframe);

      // Listen for resize messages from iframe
      window.addEventListener("message", (event) => {
        if (event.origin !== origin) return;
        if (event.data.type === "resize" && event.data.height) {
          iframe.style.height = event.data.height + "px";
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// Send height to parent
function postHeight() {
  const height = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: "resize", height }, "*");
}

// Trigger on load + resize
window.addEventListener("load", postHeight);
window.addEventListener("resize", postHeight);
setInterval(postHeight, 500); // fallback if content changes dynamically
