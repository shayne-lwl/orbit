import styles from "./Home.module.css";
import Image from "next/image";
import Link from "next/link";
import EarthIcon from "../public/earth-icon.png";
export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.firstRow}>
        <h1 className={styles.mainSlogan}>
          Got something to dispose?
          <br />
          Don't throw it
        </h1>
      </div>
      <div className={styles.secondRow}>
        <h2 className={styles.secondarySlogan}>
          <Image src={EarthIcon} alt="Earth Icon" id={styles.earthIcon}></Image>
          rbit it
        </h2>
      </div>
      <div className={styles.thirdRow}>
        <h3 className={styles.lastSlogan}>
          Donate what you no longer need and find what you do
        </h3>
      </div>
      <Link href="/register" className={styles.joinButton}>
        <span>Join us now</span>
      </Link>
    </main>
  );
}
