"use server";
import { cookies } from "next/headers";
import * as authServices from "@/services/auth-service";
import { SignUpInputType } from "@/validators/auth-schema";

export async function createUser(signUpInputData: SignUpInputType) {
  const { email, fullname, password } = signUpInputData;
  const userObj = await authServices.createUser({ email, fullname, password });

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
