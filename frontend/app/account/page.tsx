"use client";
import RegistrationForm from "../components/RegistrationForm/RegistrationForm";
import LoginForm from "../components/LoginForm/LoginForm";
import styles from "./account.module.css";
import { useState, useRef, useEffect } from "react";

enum Selection {
  Registration = "registration",
  Login = "login",
}

export default function Account() {
  const [selection, setSelection] = useState<Selection>(Selection.Registration);
  const loginSelectionRef = useRef<HTMLDivElement>(null);

  const toggleSelection = (input: "Sign in" | "Sign up") => {
    if (input === "Sign in") {
      setSelection(Selection.Login);
      if (
        window.innerWidth < 744 ||
        (window.innerWidth <= 932 &&
          window.screen.orientation.type.includes("landscape"))
      ) {
        loginSelectionRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }
    } else {
      setSelection(Selection.Registration);
      if (
        window.innerWidth < 744 ||
        (window.innerWidth <= 932 &&
          window.screen.orientation.type.includes("landscape"))
      ) {
        window.scroll({ top: 0, behavior: "smooth" });
      }
    }
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const [isScrolling, setIsScrolling] = useState(false);
  const [viewportHeight, setViewPortHeight] = useState<number>(
    window.innerHeight
  );

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout; // Used to determine when the scrolling has paused or stopped.

    // Creates handleScroll function on the first render and hands it over to the browser by calling addEventListener
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollPosition(currentScrollY);

      setScrollDirection(currentScrollY > lastScrollY ? "down" : "up");
      lastScrollY = currentScrollY;

      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      if (currentScrollY >= viewportHeight / 2) {
        setSelection(Selection.Login);
      } else {
        setSelection(Selection.Registration);
      }
    };

    // To ensure scrolling behavior only works on mobile devices and mobile devices in landscape view
    if (
      window.innerWidth < 744 ||
      (window.innerWidth <= 932 &&
        window.screen.orientation.type.includes("landscape"))
    ) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    /* Remove the Event Listener when user navigates to a different page. Without this cleanup, the browser would still try to call on
    scroll events that and update state on a component that no longer exists, leading to memory leaks and potential errors. */
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className={styles.formsContainer}>
      <div
        style={
          window.innerWidth < 744 // Ensure the scroll animation only works on mobile devices. The conditions are implement to prevent the inline style to override the css module style when not in mobile devices viewport
            ? {
                top: `${scrollPosition}px`,
                backgroundColor:
                  scrollPosition >= viewportHeight / 2 ? "#7cb5af" : "#618fb8",
              }
            : {} // Empty object when condition is false
        }
        className={`${styles.selection} ${
          selection === Selection.Login ? styles.switch : ""
        }`}
      ></div>
      <RegistrationForm
        toggleSelection={toggleSelection}
        currentSelection={selection}
      />
      <LoginForm
        toggleSelection={toggleSelection}
        ref={loginSelectionRef}
        currentSelection={selection}
      />
    </div>
  );
}
