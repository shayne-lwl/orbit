"use client";
import { useSearchParams } from "next/navigation";
import styles from "./EmailVerification.module.css";
import Image from "next/image";
import MailIcon from "@/public/mail.png";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";

interface VerficationCodeInputType {
  codeInput: string;
}

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { register, handleSubmit, setError } =
    useForm<VerficationCodeInputType>();

  const [time, setTime] = useState(60000);
  const [resend, setResend] = useState(false);

  const handleResend = async () => {
    setTime(60000);
    setResend((previousState) => !previousState);
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register/resend-verification-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        setError("root", {
          type: "server",
          message: responseData.error,
        });
      }
    } catch (error) {
      setError("root", {
        type: "server",
        message: "Emal verification failed. Please try again later.",
      });
    }
  };

  useEffect(() => {
    if (time <= 0) return;
    const interval = setInterval(() => {
      setTime((previousTime) => {
        if (previousTime <= 1000) {
          clearInterval(interval);
          return 0;
        }
        return previousTime - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resend]);

  const getFormattedTime = () => {
    return Math.floor(time / 1000);
  };

  return (
    <div className={styles.container}>
      <Image
        src={MailIcon}
        alt="Email Icon"
        className={styles.emailIcon}
      ></Image>
      <h1 className={styles.firstHeader}>Please check your email</h1>
      <h2 className={styles.secondHeader}>
        Enter the 6 alphanumeric characters sent to {email}
      </h2>
      <input
        type="text"
        className={styles.codeInput}
        maxLength={6}
        {...register("codeInput")}
      />
      <p className={styles.resendInstruction}>
        Didn't receive the code?
        <br />
        {getFormattedTime() > 0 ? (
          <span> Resend in {getFormattedTime()} seconds</span>
        ) : (
          <button className={styles.resendButton} onClick={handleResend}>
            Resend
          </button>
        )}
      </p>
      <button className={styles.verifyButton}>Verify</button>
    </div>
  );
}
