"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { signInUserWithEmailAndPassword } from "@/actions/auth-actions";
import { signInInput } from "@/validators/auth-schema";

type SignInInputType = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInInputType>();

  const onSubmit = async (data: SignInInputType) => {
    let hasError = false;
    if (!data.email) {
      hasError = true;
      setError("email", {
        type: "manual",
        message: "Email is required",
      });
    }
    if (!data.password) {
      hasError = true;
      setError("password", {
        type: "manual",
        message: "Password is required",
      });
    }
    if (!hasError) {
      // validate the data before sending it to the server
      if (!signInInput.safeParse(data).success) {
        setError("root", {
          type: "manual",
          message: "Invalid email or password",
        });
      } else {
        const result = await signInUserWithEmailAndPassword(data);
        if (!result.success) {
          setSuccessMessage(null);
          setError("root", {
            type: "manual",
            message: result.error || "An error occurred",
          });
        } else {
          // Handle successful sign-in, e.g., redirect to dashboard or show success message
          setSuccessMessage("User signed in successfully!");
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input {...register("email")} placeholder="Email" />
      </div>
      {errors.email && <p>{errors.email.message}</p>}
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
        />
      </div>
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Sign In</button>
      {errors.root && <p>{errors.root.message}</p>}
      {successMessage && <p>{successMessage}</p>}
    </form>
  );
};

export default SignIn;
