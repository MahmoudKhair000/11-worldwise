import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.css";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useAuth } from "../contexts/FakeAuthContext";

export default function Homepage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          You travel the world.
          <br />
          WorldWise keeps track of your adventures.
        </h1>
        {/* hard refreshing the page */}
        {/* <a href="/pricing">Get Started with pricing</a> */}
        <Button
          className="cta"
          onClickFunc={(e) => {
            e.preventDefault();
            if (isAuthenticated) {
              navigate('/app/cities');
            } else {
              navigate('/login');
            }
          }}
        >
          Go to App
        </Button>
        <h2>
          A world map that tracks your footsteps into every city you can think
          of. Never forget your wonderful experiences, and show your friends how
          you have wandered the world.
        </h2>
      </section>
    </main>
  );
}
