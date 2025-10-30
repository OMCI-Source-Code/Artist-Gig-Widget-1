import React from "react";
import { createRoot } from "react-dom/client";
import WidgetArtist from "./components/ArtistWidget.jsx";

document.querySelectorAll('[data-gig-widget]').forEach((el) => {
  const artistId = el.dataset.artistId;
  const view = el.dataset.view;

  const root = createRoot(el);
  root.render(<WidgetArtist embedArtistId={artistId} embedView={view} />);
});
