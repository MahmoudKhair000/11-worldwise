import { NavLink } from "react-router-dom";
import styles from "./Button.module.css";
function ButtonBack() {
  return (
    <NavLink to="/app/cities/">
      <button className={`${styles.btn} ${styles.back}`}>&larr; Back</button>
    </NavLink>
  );
}

export default ButtonBack;
