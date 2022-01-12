import "../styles/pages/orphanage.css";
import { FiClock, FiInfo } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

interface OrphanageInfo {
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  description: string;
  contact: string;
  images: {
    id: number;
    url: string;
  }[];
}

const Orphanage = () => {
  const { id } = useParams();
  const [orphanage, setOrphanage] = useState<OrphanageInfo>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    api.get(`orphanages/${id}`).then((response) => {
      setOrphanage(response.data);
    });
  }, [id]);

  if (!orphanage) {
    return <div>Loading</div>;
  }

  return (
    <div id="page-orphanage">
      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img
            src={orphanage.images[activeImageIndex].url}
            alt={orphanage.name}
          />

          <div className="images">
            {orphanage.images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className={activeImageIndex === index ? "active" : ""}
                onClick={() => setActiveImageIndex(index)}
              >
                <img src={image.url} alt={orphanage.name} />
              </button>
            ))}
          </div>

          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <MapContainer
                center={[orphanage.latitude, orphanage.longitude]}
                zoom={16}
                style={{ width: "100%", height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[orphanage.latitude, orphanage.longitude]}
                  icon={mapIcon}
                  interactive={false}
                />
              </MapContainer>

              <footer>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  See on Google Maps
                </a>
              </footer>
            </div>

            <hr />

            <h2>{orphanage.instructions}</h2>
            <p>{orphanage.description}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15b6d6" />
                Monday to Friday <br />
                {orphanage.opening_hours}
              </div>
              {orphanage.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39cc83" />
                  Open <br />
                  on weekends
                </div>
              ) : (
                <div className="open-on-weekends dont-open">
                  <FiInfo size={32} color="#FF669d" />
                  Closed <br />
                  on weekends
                </div>
              )}
            </div>

            <a
              className="contact-anchor"
              target="_blank"
              rel="noreferrer"
              href={`https://wa.me/${orphanage.contact}`}
            >
              <FaWhatsapp size={20} color="#FFF" />
              Contact
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orphanage;
