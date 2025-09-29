"use client";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./EmailVerification.module.css";
import Image from "next/image";
import MailIcon from "@/public/mail.png";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";

interface FormInputType {
  email: string;
  verificationCode: string;
}

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormInputType>();

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

  const handleFormSubmission: SubmitHandler<FormInputType> = async (data) => {
    Object.assign(data, { email: email }); // Include the email address in the data object we are going to send to the server
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        localStorage.setItem("jwtToken", responseData.jwtToken);
        localStorage.setItem("user", JSON.stringify(responseData.user));
        router.push("/");
      } else {
        setError("root", {
          type: "server",
          message: responseData.error,
        });
      }
    } catch (error) {
      setError("root", {
        type: "server",
        message: "Please try again later ",
      });
    }
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
      <form
        action=""
        className={styles.formContainer}
        onSubmit={handleSubmit(handleFormSubmission)}
      >
        <input
          type="text"
          className={styles.verificationCode}
          maxLength={6}
          {...register("verificationCode", {
            required: "Verification code is required",
            minLength: {
              value: 6,
              message: "Verification code must be 6 characters long",
            },
          })}
        />
        {errors.verificationCode?.message && (
          <p className={styles.errorMessage}>
            {errors.verificationCode.message}
          </p>
        )}
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
      </form>
    </div>
  );
}
