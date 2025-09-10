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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // To reset the input validation errors and input values when user clicks Register now
  } = useForm<FormInput>();
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
        <div>
          <input
            type="text"
            placeholder="Email"
            {...register("email", { required: "Email address is required" })}
          />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className={styles.signUpButton}>
          Sign in
        </button>
      </form>
      <span className={styles.existingAccountQuestion}>
        Don't have an account with us yet?
        <br />
        <button
          className={styles.registerNow}
          onClick={() => {
            reset();
            toggleSelection("Sign up");
          }}
        >
          Register now
        </button>
      </span>
    </div>
  );
}
