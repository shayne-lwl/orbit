"use client";
import styles from "./LoginForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { Ref } from "react";

interface FormInput {
  email: string;
  password: string;
}

interface LoginFormProps {
  toggleSelection: (input: "Sign in" | "Sign up") => void;
  ref: Ref<HTMLDivElement | null>;
  currentSelection: string;
}

export default function LoginForm({
  toggleSelection,
  ref,
  currentSelection,
}: LoginFormProps) {
  const { register, handleSubmit } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => console.log(data);

  return (
    <div
      className={`${styles.container} ${
        currentSelection === "registration" ? styles.inactive : ""
      }`}
      ref={ref}
      data-testid="login-form-container"
    >
      <h1 className={styles.formHeader}>WELCOME BACK</h1>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className={styles.formContainer}
      >
        <input type="text" placeholder="Email" {...register("email")} />
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        <button type="submit" className={styles.signUpButton}>
          Sign in
        </button>
      </form>
      <span className={styles.existingAccountQuestion}>
        Don't have an account with us yet?
        <br />
        <button
          className={styles.registerNow}
          onClick={() => toggleSelection("Sign up")}
        >
          Register now
        </button>
      </span>
    </div>
  );
}
