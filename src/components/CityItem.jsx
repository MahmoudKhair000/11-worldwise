import { NavLink } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCitiesContext } from "../contexts/CitiesContext";

function CityItem({ cityId }) {
  const { cities, currentCity } = useCitiesContext();

  const city = cities.find((c) => c.id === cityId);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }).format(new Date(date));

  const { cityName, emoji, date, position, id } = city;
  const { lat, lng } = position;
  // console.log('city:', city);
  // console.log('position:', position);

  return (
    <li>
      <NavLink to={`${id}?lat=${lat}&lng=${lng}`}
        className={`${styles.cityItem} ${currentCity?.id === id
          ? styles["cityItem--active"]
          : ""
          }`}>
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn}>&times;</button>
      </NavLink>
    </li >
  );
}

export default CityItem;
