"use client";
import styles from "./MobileMenu.module.css";
import Image from "next/image";
import ExploreIcon from "../../../public/explore-icon.png";
import DonateIcon from "../../../public/donate-icon.png";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
}

export const MobileMenu = ({ isMobileMenuOpen }: MobileMenuProps) => {
  return (
    <div
      className={`${styles.mobileMenuContainer} ${
        isMobileMenuOpen ? styles.display : ""
      }`}
    >
      <div>
        <Image
          className={styles.icon}
          src={ExploreIcon}
          alt="Explore Icon"
        ></Image>
        <p>Explore</p>
      </div>
      <div>
        <Image
          className={styles.icon}
          src={DonateIcon}
          alt="Donate Icon"
        ></Image>
        <p>Donate</p>
      </div>
      <h1>orbit</h1>
    </div>
  );
};
