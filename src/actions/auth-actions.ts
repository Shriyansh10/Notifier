"use server";
import { cookies } from "next/headers";
import * as authServices from "@/services/auth-service";
import { SignUpInputType, SignInInputType } from "@/validators/auth-schema";

export async function createUserWithEmailAndPassword(signUpInputData: SignUpInputType) {
  const { email, fullname, password } = signUpInputData;
  const userObj = await authServices.createUserWithEmailAndPassword({ email, fullname, password });

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
    return {success: true, user:{ id: user.id, email: user.email, fullname: user.fullname }};
  }
  return { success: false, error: userObj.error || "An error occurred" };
}

export async function signInUserWithEmailAndPassword(signInInputData: SignInInputType){
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

  console.log(userObj.error)
  return { success: false, error: "An error occurred" };
}