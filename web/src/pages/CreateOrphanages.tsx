import { ChangeEvent, FormEvent, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MapContainer, Marker, TileLayer, MapConsumer } from "react-leaflet";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

import "../styles/pages/create-orphanage.css";
import mapIcon from "../utils/mapIcon";

interface Position {
  latitude: number;
  longitude: number;
}

const CreateOrphanage = () => {
  const navigate = useNavigate();

  const [actualPosition, setActualPosition] = useState<Position>({
    latitude: 0,
    longitude: 0,
  });

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [instructions, setInstructions] = useState("");
  const [opening_hours, setOpeningHours] = useState("");
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [contact, setContact] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.log("images");

      return;
    }

    const selectedImages = Array.from(e.target.files);

    const newImages = [...images, ...selectedImages];

    setImages(newImages);

    const selectedImagesPreview = newImages.map((image) => {
      return URL.createObjectURL(image);
    });

    setImagePreview(selectedImagesPreview);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { latitude, longitude } = actualPosition;

    const data = new FormData();

    data.append("name", name);
    data.append("about", about);
    data.append("instructions", instructions);
    data.append("opening_hours", opening_hours);
    data.append("open_on_weekends", String(open_on_weekends));
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("contact", contact);

    images.forEach((image) => {
      data.append("images", image);
    });

    await api.post("/orphanages", data);

    alert("Sucess");

    navigate("/app");
  };

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Info</legend>

            <MapContainer
              center={[-27.59165714380539, -48.55075372672796]}
              style={{ width: "100%", height: 280 }}
              zoom={15}
            >
              <MapConsumer>
                {(map) => {
                  map.on("click", function (e: any) {
                    const { lat, lng } = e.latlng;
                    setActualPosition({ latitude: lat, longitude: lng });
                  });
                  return null;
                }}
              </MapConsumer>

              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {actualPosition.latitude !== 0 && (
                <Marker
                  position={[actualPosition.latitude, actualPosition.longitude]}
                  icon={mapIcon}
                  interactive={false}
                />
              )}
            </MapContainer>

            <div className="input-block">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">
                About <span>300 characters max</span>
              </label>
              <textarea
                name="textarea"
                id="textarea"
                maxLength={300}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Images</label>

              <div className="images-container">
                {imagePreview.map((image) => {
                  return <img src={image} alt={name} key={image} />;
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input
                type="file"
                id="image[]"
                onChange={(e) => handleSelectImages(e)}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visit</legend>

            <div className="input-block">
              <label htmlFor="intructions">Instructions</label>
              <textarea
                name="instructions"
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="contact">Contact</label>
              <input
                type="number"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Opening hours</label>
              <input
                type="text"
                id="opening_hours"
                value={opening_hours}
                onChange={(e) => setOpeningHours(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Open on weekends</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? "active-no" : ""}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  No
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateOrphanage;
