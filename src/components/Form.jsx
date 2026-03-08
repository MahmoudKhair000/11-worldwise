// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUrlPosition from "../hooks/useUrlPosition";
import Button from "./Button";
import styles from "./Form.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCitiesContext } from "../contexts/CitiesContext";
// import { useGeolocation } from "../hooks/useGeoLocation";

/*
const exampleData = {
  "lookupSource": "coordinates",
  "latitude": 26.107655,
  "longitude": 34.266327,

  "continent": "Africa",
  "continentCode": "AF",

  "countryName": "Egypt",
  "countryCode": "EG",

  "principalSubdivision": "Red Sea Governorate",
  "principalSubdivisionCode": "EG-BA",

  "city": "Al Qusayr",
  "locality": "Al Qusayr",
}
*/

function Form() {
  const navigate = useNavigate();
  const [mapLat, mapLng] = useUrlPosition();

  /* Get geolocation position, the user's current location */
  // const {
  // isLoading: geoLoading,
  // position: geoPosition,
  // getPosition: getGeoPosition,
  // error: geoError
  // } = useGeolocation();

  const formRef = useRef(null);

  const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  // New City Data
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const { createCity, isLoading } = useCitiesContext();

  const principalSubdivision = useRef("");

  useEffect(
    function () {
      if (!mapLat || !mapLng) return;

      function fetchLocationDate(lat, lng) {
        setIsFormLoading(true);
        // fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${0}&longitude=${0}`)
        fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
          .then((res) => res.json())
          .then((data) => {
            setCityName(data.city || data.locality || '');
            setCountry(
              data.countryName === 'Israel'
                ? "Palestine, State of"
                : (data.countryName || '')
            );
            setCountryCode(
              data.countryCode === "IL"
                ? "PS"
                : (data.countryCode || '')
            );
            setDate(new Date());
            principalSubdivision.current = data.principalSubdivision;
            setFormError("");
            // console.log(data)
            if (!data.countryCode)
              throw new Error("That doesn't seem to be a city, Click somewhere else 😉")
          }).catch(
            (err) => {
              // console.error(err);
              setFormError(err.message);
            }
          ).finally(
            () => setIsFormLoading(false)
          );
      }
      fetchLocationDate(mapLat, mapLng);
    },
    [BASE_URL, mapLat, mapLng])

  async function handleSubmit(e) {
    e.preventDefault();
    // e.stopPropagation();
    // e.stopImmediatePropagation();

    if (!cityName || !countryCode || !date) return;

    const newCity = {
      cityName,
      countryCode,
      country,
      date,
      notes,
      position: { lat: mapLat, lng: mapLng },
    }

    // console.log(newCity);
    await createCity(newCity);
    navigate(`../cities`);
  }

  if (isFormLoading) return <Spinner />;
  if (formError) return <Message message={formError} />;
  return (
    <form
      ref={formRef}
      className={`
        ${styles.form}${' '}
        ${(isLoading || isFormLoading) ? styles.loading : ''}
        `}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City Name</label>
        <input
          id="cityName" disabled={!!cityName}
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          <img
            src={`https://flagsapi.com/${countryCode || 'unknown'}/flat/48.png`}
            title={
              (cityName && country)
                ? (country + ', ' + principalSubdivision.current)
                : (country ? country : null)
            } alt={country} />
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">
          When did you go to {cityName}?
        </label>
        <input
          id="date" type="date"
          onChange={(e) => setDate(new Date(e.target.value))}
          value={date.toISOString().split('T')[0]}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName || `...Enter City`}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button
          type="primary"
        // onClickFunc={
        //   () => console.log("Add button clicked")
        // }
        >Add</Button>
        <Button type="back" onClickFunc={() => navigate('../cities')}>
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
