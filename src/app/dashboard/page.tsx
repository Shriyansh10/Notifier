"use client";

import React from "react";
import UserContext, { type UserContextType } from "@/context/user-context";
import { useRouter } from "next/navigation";

import {
  getUserWithToken,
  resetTokens,
  signOutUser,
} from "@/actions/auth-actions";

const Dashboard = () => {
  const userContext = React.useContext(UserContext) as UserContextType;
  const router = useRouter();

  // todo - handle sign out by clearing the user context and redirecting to the sign in page
  const handleSignOut = async () => {
    userContext?.setUser(null);
    const response = await signOutUser();
    if (response.success) {
      router.push("/sign-in");
    }
  };

  const handdleFetchUserData = async () => {
    // check if the access token is valid
    const originalResponse = await getUserWithToken();
    if (originalResponse.error && originalResponse.statusCode === 401) {
      console.log("Access token expired, attempting to reset tokens...");
      const response = await resetTokens();
      if (!response.success) {
        // navigate to sign in page
        // router.push("/sign-in");
        console.log("Failed to reset tokens:");
      } else {
        console.log("Tokens reset successfully.");
        const responseAfterResettingTokens = await getUserWithToken();
        if (responseAfterResettingTokens.success && responseAfterResettingTokens.user) {
          userContext?.setUser({
            id: `${responseAfterResettingTokens.user.id}`,
            fullname: responseAfterResettingTokens.user.fullname,
            email: responseAfterResettingTokens.user.email,
          });
          console.log("User data from token:", responseAfterResettingTokens.user);
        }
      }
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {userContext?.user?.fullname}!</p>
      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <div>
        <button
          onClick={
            // for testing - get the user data from the token and log it
            handdleFetchUserData
          }
        >
          Get User Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
