import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
// import City from "./City";

function CountryList({ cities, isLoading }) {
  const countries = cities.reduce((accArr, currCity) => {
    // if (!accArr.some((i) => i.country === currCity.country)) {
    if (!accArr.map((i) => i.country).includes(currCity.country)) {
      accArr.push({ country: currCity.country, emoji: currCity.emoji });
    }
    return accArr;
  }, []);

  if (isLoading) return <Spinner />;
  if (!countries || countries.length === 0)
    return (
      <Message message="Add your first city by clicking on a city on the map." />
    );

  return (
    <ul className={styles.countryList}>
      {countries.map((countryItem) => {
        return <CountryItem key={countryItem.country} country={countryItem} />;
      })}
    </ul>
  );
}

export default CountryList;
