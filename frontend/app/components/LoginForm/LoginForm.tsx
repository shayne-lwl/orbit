"use client";
import styles from "./LoginForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { Ref } from "react";
import { useRouter } from "next/navigation";

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
    setError,
    reset, // To reset the input validation errors and input values when user clicks Register now
  } = useForm<FormInput>();

  const router = useRouter();

  const loginUser = async (userData: FormInput): Promise<void> => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError("root", {
          type: "server",
          message: responseData.error,
        });
      }

      router.push("/");
    } catch (error) {
      console.log(error);
      setError("root", {
        type: "server",
        message: "Unexpected login error. Please try again later.",
      });
    }
  };
  const onSubmit: SubmitHandler<FormInput> = (data) => loginUser(data);

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
          {errors.root && (
            <p className={styles.errorMessage}>{errors.root.message}</p>
          )}
        </div>

        <button type="submit" className={styles.signInButton}>
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
