import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import ArtistWidget from './components/ArtistWidget.jsx';
import GlobalWidget from './components/GlobalWidget.jsx';
import CalendarWidget from './components/CalendarWidget.jsx';
import { AuthProvider } from './context/AuthContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
            <HashRouter>
                  <AuthProvider>
                        <Routes>
                              <Route path="/widget/artist" element={<ArtistWidget embedMode />} />
                              <Route path="/widget/global" element={<GlobalWidget embedMode />} />
                              <Route path="/widget/calendar" element={<CalendarWidget embedMode />} />
                              <Route path="/*" element={<App />} />
                        </Routes>
                  </AuthProvider>
            </HashRouter>
      </React.StrictMode>
);