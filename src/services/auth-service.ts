import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

import {
  SignInInputType,
  SignUpInputType,
  signInInput,
  signUpInput,
} from "@/validators/auth-schema";
import { createToken } from "@/utils/tokens";

// service for creating a user
export const createUserWithEmailAndPassword = async (
  signUpInputData: SignUpInputType,
) => {
  try {
    // validate the data using zod
    const { fullname, email, password } =
      await signUpInput.parseAsync(signUpInputData);
    if (!fullname || !email || !password) {
      return {
        success: false,
        error: "Enter all fields",
      };
    }

    // check if user exists
    if (await prisma.user.findFirst({ where: { email: email } })) {
      return {
        success: false,
        error: "User with this email already exists",
      };
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store the data in the db
    const user = await prisma.user.create({
      data: {
        email,
        full_name: fullname,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    // create the refresh token and access token
    const accessToken = createToken(
      { id: `${user.id}`, email: user.email },
      "AccessToken",
    );
    const refreshToken = createToken({ id: `${user.id}` }, "RefreshToken");

    // store the refresh token in db
    await prisma.user.update({
      where: { email },
      data: { refresh_token: refreshToken },
      select: { id: true },
    });

    // return the id and tokens
    return {
      success: true,
      user: {
        id: user.id,
        email,
        fullname,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const signInUserWithEmailAndPassword = async (
  signInInputData: SignInInputType,
) => {
  try {
    // validate the data using zod
    const { email, password } = await signInInput.parseAsync(signInInputData);

    // check if user exists
    const user = await prisma.user.findMany({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        full_name: true,
      },
    });

    if (user.length === 0) {
      return {
        success: false,
        error: "No user found with this email",
      };
    }

    // check if password matches - if not return error message
    if (!(await bcrypt.compare(password, user[0].password))) {
      return { success: false, error: "Entered wrong email or password" };
    }

    // create the refresh token and access token
    const accessToken = createToken(
      { id: `${user[0].id}`, email: user[0].email },
      "AccessToken",
    );
    const refreshToken = createToken({ id: `${user[0].id}` }, "RefreshToken");

    // store the refresh token in db
    await prisma.user.update({
      where: { email },
      data: { refresh_token: refreshToken },
      select: { id: true },
    });

    // return the user data and tokens
    return {
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        fullname: user[0].full_name,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.log("Error while signing in", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const getUserFromToken = async (email: string) => {
  console.log('entered getUserFromToken service function')
  try {
    // get the user from the db using the email from the token
    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        full_name: true,
      },
    });

    // if no user found return null
    if (!user) {
      return {
        success: false,
        error: "No user found with this email",
      };
    }

    // return the user data
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.full_name,
      },
    };
  } catch (error) {
    console.log("Error while getting user from token", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const resetTokens = async (refreshTokenInCookie: string) => {
  console.log('entered resetTokens service function')
  try {

    // validate the token and get the email from it

    const user = await prisma.user.findMany({
      where: { refresh_token: refreshTokenInCookie },
      select: { email: true, id: true, full_name: true },
    }); // get the user id from the token after verification

    if(user.length === 0) {
      return {
        success: false,
        error: "Invalid refresh token",
      };  
    }

    const email = user[0].email;
    const id = user[0].id;

    // create the refresh token and access token
    const accessToken = createToken({ id: `${id}`, email }, "AccessToken");
    const refreshToken = createToken({ id: `${id}` }, "RefreshToken");

    // store the refresh token in db
    await prisma.user.update({
      where: { email },
      data: { refresh_token: refreshToken },
      select: { id: true },
    });

    // return the tokens
    return {
      success: true,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("Error while resetting tokens", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
};


export const signOutUser = async (email: string) => {

  // clear the refresh token from the db
  await prisma.user.update({
    where: { email },
    data: { refresh_token: null },
    select: { id: true },
  });

  return { success: true };
}