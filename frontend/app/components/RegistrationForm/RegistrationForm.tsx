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

export default function RegistrationForm({
  toggleSelection,
  currentSelection,
}: RegistrationFormProps) {
  // register() is a method that returns an object containing several properrties that a typical HTML input
  // needs to function properly in a controlled form environment.
  const { register, handleSubmit } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => console.log(data);
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
        <input type="text" placeholder="Username" {...register("username")} />
        <input type="text" placeholder="Email" {...register("email")} />
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
        />
        <button type="submit" className={styles.signUpButton}>
          Sign up
        </button>
      </form>
      <span className={styles.existingAccountQuestion}>
        Already have an account with us?
        <br />
        <button
          className={styles.signInButton}
          onClick={() => toggleSelection("Sign in")}
          data-testid="Registration Form Sign in Button"
        >
          Sign in
        </button>
      </span>
    </div>
  );
}
