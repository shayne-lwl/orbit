"use client";
import styles from "./RegistrationForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormProps {
  toggleSelection: (input: "Sign in" | "Sign up") => void;
  currentSelection: string;
}
// API response data type
interface User {
  id: string;
  username: string;
  email: string;
  registrationDate: string;
  lastSeen: string;
  isOnline: boolean;
}

export default function RegistrationForm({
  toggleSelection,
  currentSelection,
}: RegistrationFormProps) {
  // register() is a method that returns an object containing several properrties that a typical HTML input
  // needs to function properly in a controlled form environment.
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset, // To reset the input validation errors and input values when user clicks Sign in
    setError,
  } = useForm<FormInput>();
  const passwordValue = watch("password"); // This is variable is to check if its value matches with the passwordConfirmation input value.

  const registerUser = async (userData: FormInput): Promise<void> => {
    const response = await fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      setError("root", {
        type: "server",
        message: responseData.error,
      });
    }
  };
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    registerUser(data);
  };
  return (
    <div
      className={`${styles.container} ${
        currentSelection === "login" ? styles.inactive : ""
      }`}
      data-testid="registration-form-container"
    >
      <h1 className={styles.formHeader}>CREATE ACCOUNT</h1>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className={styles.formContainer}
      >
        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 5,
                message: "Username must be at least 5 characters long",
              },

              maxLength: {
                value: 15,
                message: "Username cannot be longer than 15 characters",
              },
              pattern: {
                value: /^[A-Za-z0-9_]*$/,
                message:
                  "Username must start with a letter or number and can only contain letters, numbers, and underscores.",
              },
            })}
          />
          {errors.username && (
            <p className={styles.errorMessage}>{errors.username.message}</p>
          )}
          {errors.root && (
            <p className={styles.errorMessage}>
              {errors.root.message === "Username already exists" &&
                errors.root.message}
            </p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Email"
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email?.message}</p>
          )}
          {errors.root && (
            <p className={styles.errorMessage}>
              {errors.root.message === "Email address already exists" &&
                errors.root.message}
            </p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: 8,
              maxLength: 32,
              pattern: {
                value:
                  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,32}$/,
                message:
                  "Password must be 8 to 32 characters and include uppercase, lowercase, numbers, and symbols",
              },
            })}
          />
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password.message}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: true,
              minLength: 8,
              maxLength: 32,
              validate: (value) => {
                if (value === passwordValue) {
                  return true;
                } else return "Password do not match";
              },
            })}
          />
          {errors.confirmPassword && (
            <p className={styles.errorMessage}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button type="submit" className={styles.signUpButton}>
          Sign up
        </button>
      </form>
      <span className={styles.existingAccountQuestion}>
        Already have an account with us?
        <br />
        <button
          className={styles.signInButton}
          onClick={() => {
            reset();
            toggleSelection("Sign in");
          }}
          data-testid="Registration Form Sign in Button"
        >
          Sign in
        </button>
      </span>
    </div>
  );
}
