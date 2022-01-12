import React from "react";

import "./styles/global.css";

import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import OrphanagesMap from "./pages/OrphanagesMap";
import Orphanage from "./pages/Orphanage";
import CreateOrphanage from "./pages/CreateOrphanages";
import "leaflet/dist/leaflet.css";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="app" element={<OrphanagesMap />} />
      <Route path="orphanages/create" element={<CreateOrphanage />} />
      <Route path="orphanages/:id" element={<Orphanage />} />
    </Routes>
  );
}

export default App;
