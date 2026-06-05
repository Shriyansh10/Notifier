"use client";

import React from "react";
import UserContext, { type UserContextType } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { verifyTokenAuthentication } from "@/middlewares/client/client-auth-middleware";

import {
  getUserDetailsWithToken,
  signOutUser,
} from "@/actions/auth-actions";

const Notes = () => {
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

  
  const handleFetchUserData = async () => {

    // check if the access token is valid, if not 401 statuscode will be returned, otherwise the user will be asked to sign in again to start a new session
    const response = await verifyTokenAuthentication();

    // if the tokens are valid or reset successfully
    if (response.status === true) {

      // fetch the user data using the new access token
      const responseAfterResettingTokens = await getUserDetailsWithToken(); // this will be a controller fn not a middleware fn
        if (responseAfterResettingTokens.success && responseAfterResettingTokens.user) {
          userContext?.setUser({
            id: `${responseAfterResettingTokens.user.id}`,
            fullname: responseAfterResettingTokens.user.fullname,
            email: responseAfterResettingTokens.user.email,
          });
        }
    } 
    // if the tokens are invalid and couldn't be reset successfully, handle as per requirement
    else {
      userContext?.setUser(null);
      console.log("Sign in again to start a new session");
    }
  }

  React.useEffect(() => {
  // check if the access token is valid, if not 401 statuscode will be returned, otherwise the user will be asked to sign in again to start a new session
  handleFetchUserData();
  
  }, []);


  return (
    <div>
      <h1>Notes</h1>
      <p>Welcome, {userContext?.user?.fullname}!</p>
      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      
    </div>
  );
};

export default Notes;
