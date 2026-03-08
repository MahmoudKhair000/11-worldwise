import { useNavigate } from "react-router-dom";
// import styles from "./Button.module.css";
import Button from "./Button";

function ButtonBack() {
  const navigate = useNavigate();

  return (
    <Button type="back" onClick={(e) => {
      e.preventDefault();
      navigate(-1);
    }}>&larr; Back</Button>
  );
}

export default ButtonBack;
