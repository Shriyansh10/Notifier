"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { createUser } from "@/actions/auth-actions";

type SignUpInputType = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {

  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpInputType>();

  const onSubmit = async (data: SignUpInputType) => {
    let hasError = false;
    if (!data.fullname) {
      hasError = true;
      setError("fullname", {
        type: "manual",
        message: "Full name is required",
      });
    }
    if (!data.email) {
      hasError = true;
      setError("email", {
        type: "manual",
        message: "Email is required",
      });
    }
    if(!data.email.match(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/)) {
      hasError = true;
      setError("email", {
        type: "manual",
        message: "Invalid email address",
      });
    }
    if (!data.password) {
      hasError = true;
      setError("password", {
        type: "manual",
        message: "Password is required",
      });
    }
    if(!data.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) {
      hasError = true;
      setError("password", {
        type: "manual",
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      });
    }
    if (data.password !== data.confirmPassword) {
      hasError = true;
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
    }
    if (!hasError) {
      const result = await createUser(data);
      if (!result.success) {
        setSuccessMessage(null);
        setError("root", {
          type: "manual",
          message: result.error || "An error occurred",
        });
      } else {
        // Handle successful sign-up, e.g., redirect to dashboard or show success message
        setSuccessMessage("User created successfully!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="fullname">Full Name</label>
        <input {...register("fullname")} placeholder="Full Name" />
      </div>
      {errors.fullname && <p>{errors.fullname.message}</p>}
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
      <div>
        {errors.password && <p>{errors.password.message}</p>}
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm Password"
        />
      </div>
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      <button type="submit">Sign Up</button>
      {errors.root && <p>{errors.root.message}</p>}
      {successMessage && <p>{successMessage}</p>}
    </form>
  );
};

export default SignUp;
