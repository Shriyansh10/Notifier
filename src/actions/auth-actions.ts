"use server";

import { cookies } from "next/headers";
import * as authServices from "@/services/auth-service";
import { SignUpInputType, SignInInputType } from "@/validators/auth-schema";
import { verifyToken } from "@/utils/tokens";

export async function createUserWithEmailAndPassword(
  signUpInputData: SignUpInputType,
) {
  const { email, fullname, password } = signUpInputData;
  const userObj = await authServices.createUserWithEmailAndPassword({
    email,
    fullname,
    password,
  });

  if (userObj.user) {
    const cookiesStore = await cookies();
    const user = userObj.user;

    cookiesStore.set("accessToken", user.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 day
    });
    cookiesStore.set("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 day
    });
    return {
      success: true,
      user: { id: user.id, email: user.email, fullname: user.fullname },
    };
  }
  return { success: false, error: userObj.error || "An error occurred" };
}

export async function signInUserWithEmailAndPassword(
  signInInputData: SignInInputType,
) {
  const { email, password } = signInInputData;
  const userObj = await authServices.signInUserWithEmailAndPassword({
    email,
    password,
  });

  if (userObj.user) {
    const cookiesStore = await cookies();
    const user = userObj.user;

    cookiesStore.set("accessToken", user.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 day
    });
    cookiesStore.set("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 day
    });
    return {
      success: true,
      user: { id: user.id, email: user.email, fullname: user.fullname },
    };
  }

  console.log(userObj.error);
  return { success: false, error: "An error occurred" };
}

// signing out the user by clearing the cookies
export async function signOutUser() {
  const cookiesStore = await cookies();

  // fetch the email from the token
  const {decoded} = verifyToken(cookiesStore.get("accessToken")?.value || "", "AccessToken");

  cookiesStore.delete("accessToken");
  cookiesStore.delete("refreshToken");

  // call the sign out service to clear the refresh token from the db
  if(decoded && "email" in decoded){
    await authServices.signOutUser(decoded.email);
  }

  return { success: true };
}

export async function getUserWithToken() {

  console.log('entered getUserWithToken controller function')
  // todo - verify token using middleware
  const cookiesStore = await cookies();
  const token = cookiesStore.get("accessToken")?.value;
  if (!token) {
    return { success: false, error: "No token found" };
  }

  const verificationResponse = verifyToken(token, "AccessToken");
  if (!verificationResponse.success) {
    return { success: false, error: "Invalid token", statusCode: 401 };
  }

  // check the user in the db using the id from the token
  let email = "";
  if("email" in verificationResponse.decoded!){
  email = verificationResponse.decoded!.email; // get the user id from the token after verification
  }

  const userObj = await authServices.getUserFromToken(email);

  if (userObj.user) {
    const user = userObj.user;
    return {
      success: true,
      user: { id: user.id, email: user.email, fullname: user.fullname },
    };
  }

  console.log(userObj.error);
  return { success: false, error: "An error occurred" };
}


export async function resetTokens() {
  console.log('entered resetTokens controller function')
  
  const cookiesStore = await cookies();
  cookiesStore.delete("accessToken");

  // get the refresh token from the cookie
  const refreshTokenInCookie = cookiesStore.get("refreshToken")?.value;
  if (!refreshTokenInCookie) {
    return { success: false, error: "No refresh token found" };
  }

  const verificationResponse = verifyToken(refreshTokenInCookie, "RefreshToken");
  if (!verificationResponse.success) {
    return { success: false, error: "Invalid refresh token" };
  }

  // call the resetTokens service to get new tokens
  const { success, accessToken, refreshToken } =
    await authServices.resetTokens(refreshTokenInCookie);

  if (success) {
    cookiesStore.set("accessToken", accessToken!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 day
    });
    cookiesStore.set("refreshToken", refreshToken!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 day
    });
    return {
      success: true,
    };
  }else{
    return {
      success: false,
      error: "An error occurred while resetting tokens",
    };
  }
}
