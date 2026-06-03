import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

import {
  SignInInputType,
  SignUpInputType,
  signInInput,
  signUpInput,
} from "@/validators/auth-schema";
import { createToken, verifyToken} from "@/utils/tokens";

// service for creating a user
export const createUser = async (signUpInputData: SignUpInputType) => {
  try {
    // validate the data using zod
    const { fullname, email, password } =
      await signUpInput.parseAsync(signUpInputData);
    if (!fullname || !email || !password) {
      throw new Error("Missing required fields");
    }

    // check if user exists
    if (await prisma.user.findFirst({ where: { email: email } })) {
      return {
        success: false,
        error: "User with this email already exists",
      }
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
    const refreshToken = createToken(
      { id: `${user.id}`},
      "RefreshToken",
    );
    // store the refresh token in db
    await prisma.user.update({
      where: {email},
      data: {refresh_token: refreshToken},
      select: {id: true}
    })

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
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
};
