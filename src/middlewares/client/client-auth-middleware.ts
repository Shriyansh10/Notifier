import { resetTokens } from "@/actions/auth-actions";
import {authenticated} from '@/middlewares/server/server-auth-middleware'

export const verifyTokenAuthentication = async () => {
  // check if the access token is valid, if not 401 statuscode will be returned, otherwise the user will be asked to sign in again to start a new session
  const originalResponse = await authenticated(); // this will be middleware fn not a controller fn

  // if the access token is valid, return success
  if(originalResponse.success){
    return { status: true, message: "User is authenticated" };
  }

  // if the access token is expired, try to reset the tokens using the refresh token or return an error message 
  if (originalResponse.statusCode === 401) {

    // call the resetTokens function to get new tokens using the refresh token
    const response = await resetTokens();

    // the tokens didn't reset successfully
    if (!response.success) {
      return { status: false, error: "Failed to reset tokens" };
    }

    // the tokens reset successfully, now we can fetch the user data using the new access token
    else {
      return { status: true, message: "Tokens reset successfully." };
    }
  } 

  // if the user is not redirected to sign in page but when fetching user data the tokens were removed, frontend will atleast recieve an error message to sign in again to start a new session
  else  {
    return { status: false, error: "Sign in again to start a new session" };
  }
};
