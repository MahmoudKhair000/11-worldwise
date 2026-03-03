import styles from "./Sidebar.module.css";

import Logo from "./Logo";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";
// import { convertToEmoji } from "./Form";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <footer className={styles.footer}>
        <p>
          <br />
          🌐-wise-🍑
          &copy; Copyright {new Date().getFullYear()} City Explorer.
          All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Sidebar;
