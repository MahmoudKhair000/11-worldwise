/* eslint-disable react/prop-types */
import styles from './Button.module.css'

export default function Button({ children, onClickFunc, type = "primary" }) {
  return (
    <button
      className={`${styles.btn} ${styles[type]}`}
      onClick={onClickFunc}>
      {children}
    </button >
  )
}
