import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

function Logo() {
  return (
    <Link to="/" className={styles.logoLink}>
      <img
        className={styles.logo}
        src="/logo.png"
        alt="WorldWise logo"
      />
    </Link>
  )

}

export default Logo;
