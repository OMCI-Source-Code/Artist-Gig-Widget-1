(function () {
  function init() {
    const containers = document.querySelectorAll("[data-gig-widget]");
    containers.forEach(function (el) {
      const type = el.getAttribute("data-type") || "artist";
      const artistId = el.getAttribute("data-artist-id") || "";
      const view = el.getAttribute("data-view") || "list";

      // Auto-detect origin of this embed.js
      const script =
        document.currentScript ||
        document.querySelector('script[src*="embed.js"]');
      const origin = new URL(script.src).origin;

      // API endpoint: either provided by host page or default to same origin /api
      const apiOrigin =
        window.GIG_WIDGET_API ||
        origin.replace(/\/$/, "") + "/api";

      // Construct iframe src with API included
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
      iframe.loading = "lazy";
      iframe.setAttribute("scrolling", "no");
      iframe.style.minHeight = "420px";

      el.innerHTML = "";
      el.appendChild(iframe);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
