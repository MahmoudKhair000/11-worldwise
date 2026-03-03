import styles from "./City.module.css";
import { useNavigate, useParams } from "react-router-dom";
// import ButtonBack from "./ButtonBack";
import { useEffect } from "react";
import { useCitiesContext } from "../contexts/CitiesContext";
// import jsonCities from "../../data/cities.json";
import Spinner from "./Spinner";
import Button from "./Button";

const formatDate = (date) => {
  const options = { day: "numeric", month: "long", year: "numeric", weekday: "long" };
  return new Intl.DateTimeFormat("en", options).format(new Date(date || Date.now()));
};

function City() {
  const { getCity, currentCity, isLoading } = useCitiesContext();
  const { id } = useParams();
  const { cityName, emoji, date, notes } = currentCity;
  const navigate = useNavigate();

  useEffect(() => {
    getCity(id);
    /*
    *Callback loop effect*
    Your effect calls getCity which: updates context state →
    → re-render → new getCity → effect runs again → loop.
  
    Adding getCity as a dependency causes a loop. So, it's omitted.
    And ignored by the linter. Remove before production and deployment.
   */

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && (
        <div className={styles.city}>
          <div className={styles.row}>
            <h6>City name</h6>
            <h3>
              <span>{emoji}</span> {cityName}
            </h3>
          </div>

          <div className={styles.row}>
            <h6>You went to {cityName} on</h6>
            <p>{formatDate(date)}</p>
          </div>

          {notes && (
            <div className={styles.row}>
              <h6>Your notes</h6>
              <p>{notes}</p>
            </div>
          )}

          <div className={styles.row}>
            <h6>Learn more</h6>
            <a
              href={`https://en.wikipedia.org/wiki/${cityName}`}
              target="_blank"
              rel="noreferrer"
            >
              Check out {cityName} on Wikipedia &rarr;
            </a>
          </div>

          <div>
            <Button type="back" onClick={() => navigate('../cities')}>
              &larr; Back
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default City;
