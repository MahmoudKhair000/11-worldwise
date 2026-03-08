import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import { useCitiesContext } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeoLocation";
import Button from "./Button";
import User from "./User";
import useUrlPosition from "../hooks/useUrlPosition";

function validateLng(parametar) {
  if (180 > parametar && parametar > -180) {
    return parametar;
  } else {
    if (parametar > 180) {
      return ((parametar + 180) % 360) - 180;
    }
    if (parametar < -180) {
      return ((parametar - 180) % 360) + 180;
    }
  }
}

function Map() {
  const navigate = useNavigate();
  const { cities, currentCity } = useCitiesContext();
  const [searchParams, setSearchParams] = useSearchParams();
  /* Get map position from URL */
  const [mapLat, mapLng] = useUrlPosition();
  /* Get geolocation position, the user's current location */
  const {
    isLoading: geoLoading,
    position: geoPosition,
    getPosition: getGeoPosition,
    // error: geoError
  } = useGeolocation();

  const [mapPosition, setMapPosition] = useState(
    [
      currentCity?.position?.lat ?? mapLat ?? null,
      currentCity?.position?.lng ?? mapLng ?? null
    ]
  );

  // Update search params when geolocation position changes
  useEffect(
    function () {
      if (geoPosition)
        setSearchParams({
          lat: geoPosition[0] || 0,
          lng: geoPosition[1] || 0,
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [geoPosition]);
  // Update map position when search params change,
  //  and automatically the map will center on the new position
  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([`${mapLat}`, `${mapLng}`]);
  }, [mapLat, mapLng]);

  const isPositionMatched = (
    geoPosition !== null &&
    geoPosition[0] === mapPosition[0] &&
    geoPosition[1] === mapPosition[1]
  );

  /*
  console.log("1 > Map Position :", mapPosition);
  console.log("2 > geo Position :", geoPosition);
  console.log("3 > Search Params:",
    [searchParams.get("lat"), searchParams.get("lng")]
  );
  console.log("4 >>> Position Matched:", isPositionMatched);
  */

  return (
    <div className={styles.mapContainer}>
      {(!isPositionMatched) && (
        <Button
          type="position"
          onClickFunc={() => {
            getGeoPosition();
            navigate(`form`)
            // console.log([searchParams.get("lat"), searchParams.get("lng")]);
          }}
        >
          {geoLoading ? "Loading..." : "Use Your Position"}
        </Button>)}
      <User />

      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={10}
        scrollWheelZoom={true}>
        <TileLayer
          attribution='
          &copy; <a href="https://www.openstreetmap.org/copyright">
          OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            key={city.id}
            position={
              [
                `${city.position.lat}`,
                `${city.position.lng}`
              ]
            }>
            <Popup>
              {city.cityName}, {city.country}
            </Popup>
          </Marker>
        ))}

        <Marker
          position={mapPosition}
          draggable={true}
          eventHandlers={{
            mouseup: (e) => {
              /* Using react router navigate */
              navigate(`form?lat=${e.latlng.lat
                }&lng=${validateLng(e.latlng.lng)}`);

              // /* Using set search params */
              // setSearchParams({ lat: e.latlng.lat, lng: e.latlng.lng });
              // /* ValidateLng(lng): is a function to make sure that the 
              // longitude is in range (-180:180) */
              // console.log(validateLng(e.latlng.lng));
            }
          }} >
          {isPositionMatched && <Popup>
            Your current location
          </Popup>}
        </Marker>

        <ChangeCenter position={mapPosition} />
        <DetectClick />

      </MapContainer>
    </div >
  )
}

function ChangeCenter({ position }) {
  const map = useMap();
  // console.log("5 >>> Map Center:", map.getCenter());
  map.setView(position);
  // console.log("6 >>> Map Position set to:", position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${validateLng(e.latlng.lng)}`);
    }
  })
}

export default Map;
