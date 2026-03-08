import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span className={styles.flag}>
        <img
          src={`https://flagsapi.com/${country.countryCode}/flat/48.png`}
          title={
            (country.country)
              ? (country.country)
              : null
          } alt={country.country} />
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
