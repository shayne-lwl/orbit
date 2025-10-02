"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { ReactNode } from "react";

interface PropsType {
  children: ReactNode;
}

interface User {
  id: string;
  username: string;
  email: string;
  isEnabled: boolean;
  lastSeen: Date;
  onlineStatus: boolean;
}

interface AuthenticationContextType {
  userData: User | null;
  setUserData: (user: User | null) => void;
  jwtToken: string | null;
  setJwtToken: (token: string | null) => void;
}

// Container that holds our authentications state and functions
const AuthenticationContext = createContext<AuthenticationContextType | null>(
  null
);

// This is a "consumer" that allows other components to access the context
export const checkAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error(
      "checkAuthentication must be used within a AuthenticationProvider"
    );
  }

  return context;
};

// Supplies data to the context
export const AuthenticationProvider = ({ children }: PropsType) => {
  const [userData, setUserData] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  useEffect(() => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  }, [userData]);

  const [jwtToken, setJwtToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const storedJwtToken = localStorage.getItem("jwtToken");
      return storedJwtToken ? storedJwtToken : null;
    }
    return null;
  });

  useEffect(() => {
    if (jwtToken) {
      localStorage.setItem("jwtToken", jwtToken);
    } else {
      localStorage.removeItem("jwtToken");
    }
  }, [jwtToken]);

  return (
    <AuthenticationContext.Provider
      value={{ userData, setUserData, jwtToken, setJwtToken }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
