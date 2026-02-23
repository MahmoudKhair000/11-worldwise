import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  let lat = searchParams.get('lat');
  let lng = searchParams.get('lng');

  return (
    <div
      className={styles.mapContainer}
      onClick={() => {
        navigate("form");
      }}>
      <h1>Map Component</h1>
      <h1>Position: {lat}, {lng}</h1>
      <button style={{ zIndex: 2 }}
        onClick={() => setSearchParams({ lat: 0, lng: 0 })}>Reset</button>
    </div>
  );
}

export default Map;
