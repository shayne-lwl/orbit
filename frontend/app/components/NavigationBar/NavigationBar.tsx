"use client";
import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import styles from "./NavigationBar.module.css";
import MenuIcon from "../../../public/menu.png";
import { MobileMenu } from "./MobileMenu";

const NavigationBar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <>
      <nav className={styles.navigationBarContainer}>
        <div className={styles.mobile}>
          <Image
            src={MenuIcon}
            alt="Menu Icon"
            className={styles.menuIcon}
            onClick={toggleMobileMenu}
          ></Image>
        </div>
        <div className={styles.desktop}>
          <Link href="/browse">Explore</Link>
          <Link href="/donate">Donate</Link>
        </div>

        <Link href="/" aria-label="orbitHomeLink">
          orbit
        </Link>
        <Link href="/account" className={styles.getStartedBtn}>
          Get Started
        </Link>
      </nav>
      <MobileMenu isMobileMenuOpen={isMobileMenuOpen} />
      <div
        className={`${styles.overlay} ${isMobileMenuOpen ? styles.active : ""}`}
        onClick={toggleMobileMenu}
      ></div>
    </>
  );
};

export default NavigationBar;
