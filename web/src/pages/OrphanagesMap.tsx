import { Link } from "react-router-dom";
import mapMarkerImg from "../images/map-marker.svg";
import { FiPlus, FiArrowRight } from "react-icons/fi";

import "../styles/pages/orphanages-map.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import mapIcon from "../utils/mapIcon";
import { useEffect, useState } from "react";
import api from "../services/api";

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

const OrphanagesMap = () => {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(() => {
    api.get("orphanages").then((response) => {
      const orphanages = response.data;
      setOrphanages(orphanages);
      console.log(orphanages)
    });
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy" />
          <h2>Choose an orphanage on the map</h2>
          <p>Many children are waiting for your visit</p>
        </header>

        <footer>
          <strong>Florianópolis</strong>
          <span>Santa Catarina</span>
        </footer>
      </aside>

      <MapContainer
        center={[-27.59165714380539, -48.55075372672796]}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
        className={"leaflet-container"}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {orphanages.map(orphanage => (
           <Marker
           position={[orphanage.latitude, orphanage.longitude]}
           icon={mapIcon}
           key={orphanage.id}
         >
           <Popup
             closeButton={false}
             minWidth={240}
             maxWidth={240}
             className="map-popup"
           >
             {orphanage.name}
             <Link to={`/orphanages/${orphanage.id}`}>
               <FiArrowRight size={20} color="#FFF" />
             </Link>
           </Popup>
         </Marker>
        ))}

      </MapContainer>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#FFF" />
      </Link>
    </div>
  );
};

export default OrphanagesMap;
