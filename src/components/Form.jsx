/* eslint-disable react-refresh/only-export-components */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";
import styles from "./Form.module.css";
import Spinner from "./Spinner";
import Message from "./Message";

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

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const [mapLat, mapLng] = useUrlPosition();
  const formRef = useRef(null);
  const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  // const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  const principalSubdivision = useRef("");

  useEffect(
    () => {
      setIsFormLoading(true);
      // fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${0}&longitude=${0}`)
      fetch(`${BASE_URL}?latitude=${mapLat}&longitude=${mapLng}`)
        .then((res) => res.json())
        .then((data) => {
          setCityName(data.city || data.locality || '');
          setCountry(data.countryName || '');
          setCountryCode(data.countryCode || '');
          setDate(new Date());
          principalSubdivision.current = data.principalSubdivision;
          setFormError("");

          if (!data.countryCode)
            throw new Error("That doesn't seem to be a city, Click somewhere else 😉")
          // setEmoji(convertToEmoji(data.countryCode));
          console.log(data);
        }).catch(
          (err) => {
            // console.error(err);
            setFormError(err.message);
          }
        ).finally(
          () => setIsFormLoading(false)
        );
    },
    [mapLat, mapLng]
  )
  if (isFormLoading) return <Spinner />;
  if (formError) return <Message message={formError} />;
  return (
    <form ref={formRef} className={styles.form}>
      <div className={styles.row}>
        {/* htmlFor='inputID' */}
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
        <Button onClick={(e) => e.preventDefault()} type="primary">Add</Button>
        <Button type="back" onClick={() => navigate('../cities')}>
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
