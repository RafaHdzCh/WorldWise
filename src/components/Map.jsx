// Importa las imágenes para los íconos de los marcadores
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import L from "leaflet";
import Button from "./Button";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCities } from "../context/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlLocation } from "../hooks/useUrlPosition";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";


// Configura el ícono del marcador
const defaultIcon = L.icon(
{
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Map() 
{
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  
  const 
  {
    isLoading: isLoadingPosition,
    position: geolocationPosition, 
    getPosition
  } = useGeolocation();
  const [mapLat, mapLng] = useUrlLocation()
  

  useEffect(() => 
  {
    if (mapLat && mapLng) 
    {
      setMapPosition([parseFloat(mapLat), parseFloat(mapLng)]);
    }
  }, [mapLat, mapLng]);

  useEffect(function() 
  {
    if(geolocationPosition)
    {
      setMapPosition([geolocationPosition.lng, geolocationPosition.lat]);
    }
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && <Button type="position" onClick={getPosition}>{isLoadingPosition ? "Loading..." : "Use your position"}</Button>}
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.mapContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map(city => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
            icon={defaultIcon}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) 
{
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() 
{
  const navigate = useNavigate();

  useMapEvents(
  {
    click: (event) => 
    {
      navigate(`form?lat=${event.latlng.lat}&lng=${event.latlng.lng}`);
    },
  });

  return null;
}