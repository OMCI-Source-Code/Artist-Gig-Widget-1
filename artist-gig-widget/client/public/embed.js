(function () {
  // Prevent double initialization
  if (window.__GIG_WIDGET_INIT__) return;
  window.__GIG_WIDGET_INIT__ = true;

  function init() {
    const containers = document.querySelectorAll("[data-gig-widget]");

    const script =
      document.currentScript ||
      document.querySelector('script[src*="embed.js"]');

    const origin =
  script?.src
    ? new URL(script.src).origin
    : window.location.origin;

    const scriptApi =
      script?.getAttribute("data-api") ||
      script?.dataset?.api ||
      window.GIG_WIDGET_API;

    containers.forEach(function (el, index) {


      const apiOrigin =
        el.getAttribute("data-api") ||
        scriptApi ||
        "https://api.gigboard.canadianmusicians.coop/api";

      const type = el.getAttribute("data-type") || "public";

      const artistUId =
        el.getAttribute("data-user-id") || "";

      const view =
        el.getAttribute("data-view") || "card";


      const display =
        el.getAttribute("data-display") || "popup";




      let iframeSrc;

      if (view === "calendar") {
        iframeSrc =
          `${origin}/widget/calendar` +
          `?api=${encodeURIComponent(apiOrigin)}`;
      } else if (type === "artist") {
        if (!artistUId) {
          console.error(
            "Artist widget requires data-user-id"
          );
          return;
        }

        iframeSrc =
          `${origin}/widget/artist` +
          `?artistUId=${encodeURIComponent(artistUId)}` +
          `&view=${encodeURIComponent(view)}` +
          `&api=${encodeURIComponent(apiOrigin)}`;
      } else {
        iframeSrc =
          `${origin}/widget/global` +
          `?view=${encodeURIComponent(view)}` +
          `&api=${encodeURIComponent(apiOrigin)}`;
      }


  

      if (display === "inline") {
        const iframe = document.createElement("iframe");

        iframe.src = iframeSrc;

        iframe.style.width = "100%";
        iframe.style.height = "600px";
        iframe.style.display = "block";
        iframe.style.border = "none";
        iframe.style.margin = "0";
        iframe.style.padding = "0";
        iframe.style.overflow = "hidden";

   
        iframe.setAttribute("scrolling", "no");


        el.appendChild(iframe);


        function handleResize(event) {
          if (
            event.data?.type === "resizeWidget" &&
            event.source === iframe.contentWindow
          ) {
            const newHeight = Number(event.data.height);

            if (!Number.isNaN(newHeight)) {
              iframe.style.height = `${newHeight}px`;
            }
          }
        }

        window.addEventListener("message", handleResize);


        const observer = new MutationObserver(() => {
          if (!document.body.contains(el)) {
            window.removeEventListener("message", handleResize);
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        return;
      }



      fetch(
        type === "artist"
          ? `${apiOrigin}/gigs/user/${encodeURIComponent(
              artistUId
            )}`
          : `${apiOrigin}/gigs/public`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              "API request failed: " + res.status
            );
          }

          return res.json();
        })
        .then((gigs) => {
          const now = new Date();

          const upcoming = gigs.filter(
            (g) => new Date(g.date_time) >= now
          );

          const count = upcoming.length;


  
          const button = document.createElement("div");

          button.style.position = "fixed";
          button.style.bottom =
            type === "public" ? "20px" : "90px";

          button.style.right = "20px";

          button.style.width = "56px";
          button.style.height = "56px";

          button.style.borderRadius = "50%";

          button.style.background =
            type === "public"
              ? "#000000ff"
              : "white";

          button.style.color = "#fff";

          button.style.display = "flex";
          button.style.alignItems = "center";
          button.style.justifyContent = "center";

          button.style.cursor = "pointer";

          button.style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.3)";

          button.style.fontSize = "24px";

          button.style.transition =
            "transform 0.3s ease";

          button.style.zIndex = "9998";

          button.innerHTML =
            type === "public"
              ? "🎶"
              : "🎤";

          document.body.appendChild(button);


          let pulseInterval = setInterval(() => {
            button.style.transform = "scale(1.2)";

            setTimeout(() => {
              button.style.transform = "scale(0.9)";

              setTimeout(() => {
                button.style.transform = "scale(1)";
              }, 150);

            }, 150);

          }, 4000);




          if (count > 0) {
            const badge =
              document.createElement("div");

            badge.innerText = count;

            badge.style.position = "absolute";
            badge.style.top = "-6px";
            badge.style.right = "-6px";

            badge.style.background = "#ff4757";
            badge.style.color = "#fff";

            badge.style.fontSize = "12px";
            badge.style.fontWeight = "bold";

            badge.style.padding = "2px 6px";

            badge.style.borderRadius = "12px";

            badge.style.transition =
              "transform 0.2s ease";

            badge.style.zIndex = "10000";

            button.appendChild(badge);


            badge.addEventListener(
              "mouseenter",
              () => {
                badge.style.transform =
                  "translateX(12px) scale(1.1)";
              }
            );

            badge.addEventListener(
              "mouseleave",
              () => {
                badge.style.transform =
                  "translateX(0) scale(1)";
              }
            );
          }



          const modal =
            document.createElement("div");

          modal.style.position = "fixed";
          modal.style.top = "0";
          modal.style.left = "0";

          modal.style.width = "100%";
          modal.style.height = "100%";

          modal.style.background =
            "rgba(0,0,0,0.2)";

          modal.style.display = "none";

          modal.style.justifyContent = "center";
          modal.style.alignItems = "center";

          modal.style.zIndex = "9999";

          modal.style.transition =
            "opacity 0.3s ease";

          modal.style.opacity = "0";




          const card =
            document.createElement("div");

          card.style.width = "90%";
          card.style.maxWidth = "800px";

          card.style.background = "#000";

          card.style.borderRadius = "12px";

          card.style.overflow = "hidden";

          card.style.border = "none";

          card.style.padding = "0";
          card.style.margin = "0";

          card.style.boxShadow =
            "0 8px 24px rgba(0,0,0,.3)";

          card.style.display = "flex";
          card.style.flexDirection = "column";

          card.style.transform =
            "translateY(40px) scale(.95)";

          card.style.transition =
            "transform .3s ease, opacity .3s ease";

          card.style.opacity = "0";



          const header =
            document.createElement("div");

          header.style.height = "56px";

          header.style.display = "flex";
          header.style.alignItems = "center";
          header.style.justifyContent =
            "space-between";

          header.style.padding = "0 16px";

          header.style.background = "#111";

          header.style.borderBottom =
            "1px solid #222";

          header.style.borderRadius =
            "12px 12px 0 0";



          const title =
            document.createElement("div");

          title.innerText = "Upcoming Gigs";

          title.style.color = "#d9ae4c";

          title.style.fontSize = "18px";

          title.style.fontWeight = "700";

          title.style.letterSpacing = "0.5px";



          const closeBtn =
            document.createElement("button");

          closeBtn.innerHTML = "&times;";

          closeBtn.style.background =
            "transparent";

          closeBtn.style.border = "none";
          closeBtn.style.outline = "none";
          closeBtn.style.boxShadow = "none";

          closeBtn.style.appearance = "none";
          closeBtn.style.webkitAppearance =
            "none";

          closeBtn.style.borderRadius = "0";

          closeBtn.style.color = "white";

          closeBtn.style.fontSize = "28px";

          closeBtn.style.cursor = "pointer";

          closeBtn.style.padding = "0";

          closeBtn.style.width = "36px";
          closeBtn.style.height = "36px";

          closeBtn.style.lineHeight = "1";


          closeBtn.addEventListener(
            "mouseenter",
            () => {
              closeBtn.style.color = "#d9ae4c";
            }
          );

          closeBtn.addEventListener(
            "mouseleave",
            () => {
              closeBtn.style.color = "white";
            }
          );


          function closeModal() {
            modal.style.opacity = "0";

            card.style.opacity = "0";

            card.style.transform =
              "translateY(40px) scale(0.95)";

            setTimeout(() => {
              modal.style.display = "none";
            }, 300);
          }


          closeBtn.addEventListener(
            "click",
            closeModal
          );


          const iframe =
            document.createElement("iframe");

          iframe.src = iframeSrc;

          iframe.style.width = "100%";

          iframe.style.height = "600px";

          iframe.style.display = "block";

          iframe.style.border = "none";

          iframe.style.borderRadius = "0";

          iframe.setAttribute(
            "scrolling",
            "no"
          );


 

          function handleResize(event) {
            if (
              event.data?.type === "resizeWidget" &&
              event.source === iframe.contentWindow
            ) {
              const newHeight =
                Number(event.data.height);

              if (!Number.isNaN(newHeight)) {
                iframe.style.height =
                  `${newHeight}px`;
              }
            }
          }

          window.addEventListener(
            "message",
            handleResize
          );



          header.appendChild(title);
          header.appendChild(closeBtn);

          card.appendChild(header);
          card.appendChild(iframe);

          modal.appendChild(card);

          document.body.appendChild(modal);




          button.addEventListener(
            "click",
            () => {

              if (pulseInterval) {
                clearInterval(pulseInterval);
                pulseInterval = null;

                button.style.transform =
                  "scale(1)";
              }

              modal.style.display = "flex";

              setTimeout(() => {

                modal.style.opacity = "1";

                card.style.opacity = "1";

                card.style.transform =
                  "translateY(0) scale(1.05)";

                setTimeout(() => {

                  card.style.transform =
                    "translateY(0) scale(1)";

                }, 200);

              }, 20);
            }
          );



          modal.addEventListener(
            "click",
            (e) => {

              if (e.target === modal) {
                closeModal();
              }

            }
          );

        })
        .catch((err) => {
          console.error(
            "Failed to load gigs:",
            err
          );
        });
    });
  }


  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();