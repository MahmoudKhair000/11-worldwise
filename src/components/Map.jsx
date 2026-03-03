/* eslint-disable react/prop-types */
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import { useCitiesContext } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeoLocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const { cities, currentCity } = useCitiesContext();
  const [mapPosition, setMapPosition] = useState(
    [
      currentCity?.position?.lat ?? 30,
      currentCity?.position?.lng ?? 30
    ]
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapLat, mapLng] = useUrlPosition();
  const {
    isLoading: geoLoading,
    position: geoPosition,
    getPosition: getGeoPosition,
    // error: geoError
  } = useGeolocation();

  // console.log(mapPosition);

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

  console.log("1 > Map Position :", mapPosition);
  console.log("2 > geo Position :", geoPosition);
  console.log("3 > Search Params:", [searchParams.get("lat"), searchParams.get("lng")]);
  console.log("4 >>> Position Matched:", (
    geoPosition !== null &&
    geoPosition[0] === mapPosition[0] &&
    geoPosition[1] === mapPosition[1]
  ));

  // return (
  // // trying stop propagation
  //   <div
  //     className={styles.mapContainer}
  //     onClick={() => {
  //       navigate("form");
  //     }}>
  //     <h1>Map Component</h1>
  //     <h1>Position: {lat}, {lng}</h1>
  //     <button style={{ zIndex: 2 }}
  //       onClick={(e) => {
  //         e.preventDefault();
  //         e.stopPropagation();
  //         setSearchParams({ lat: 0, lng: 0 });
  //       }}>
  //       Reset
  //     </button>
  //   </div>
  // );

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={10}
        scrollWheelZoom={true}>
        {(geoPosition === null ||
          geoPosition[0] !== mapPosition[0] ||
          geoPosition[1] !== mapPosition[1]
        ) && (
            <Button
              type="position"
              onClick={(e) => {
                e.stopPropagation();
                // e.stopImmediatePropagation();
                // e.preventDefault();
                getGeoPosition();
                // console.log([searchParams.get("lat"), searchParams.get("lng")]);
              }}
            >
              {geoLoading ? "Loading..." : "Use Your Position"}
            </Button>)}
        <TileLayer
          attribution='
          &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker key={city.id} position={
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

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div >
  )
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    }
  })
}

export default Map;
