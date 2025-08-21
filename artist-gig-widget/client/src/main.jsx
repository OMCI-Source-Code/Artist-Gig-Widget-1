import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import ArtistWidget from './components/ArtistWidget.jsx';
import GlobalWidget from './components/GlobalWidget.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<HashRouter>
<Routes>
<Route path="/*" element={<App />} />
<Route path="/widget/artist" element={<ArtistWidget embedMode />} />
<Route path="/widget/global" element={<GlobalWidget embedMode />} />
</Routes>
</HashRouter>
</React.StrictMode>
);