import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./NavigationBar.module.css";
import MenuIcon from "../../../public/menu.png";

const NavigationBar = () => {
  return (
    <nav className={styles.navigationBarContainer}>
      <div className={styles.mobile}>
        <Image
          src={MenuIcon}
          alt="Menu Icon"
          className={styles.menuIcon}
        ></Image>
      </div>
      <div className={styles.desktop}>
        <Link href="/browse">Explore</Link>
        <Link href="/donate">Donate</Link>
      </div>

      <Link href="/">orbit</Link>
      <Link href="/register" className={styles.getStartedBtn}>
        Get Started
      </Link>
    </nav>
  );
};

export default NavigationBar;
