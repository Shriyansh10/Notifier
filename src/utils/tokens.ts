import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export type CreateAccessTokenType = {
  id: string;
  email: string;
};

export type CreateRefreshTokenType = {
  id: string;
};

// create a token
export const createToken = (
  payload: CreateAccessTokenType | CreateRefreshTokenType,
  tokenType: "AccessToken" | "RefreshToken",
) => {
  if (tokenType === "AccessToken" && "email" in payload) {
    const { id, email } = payload;

    const generatedToken = jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
        algorithm: "HS256",
      },
    );
    console.log("Generated access token:", generatedToken);
    return generatedToken;
  } else {
    const { id } = payload;

    const generatedToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue,
      algorithm: "HS256",
    });
    console.log("Generated refresh token:", generatedToken);
    return generatedToken;
  }
};

// verify the token
export const verifyToken = (
  token: string,
  tokenType: "AccessToken" | "RefreshToken",
) => {
  try {
    let decoded: CreateAccessTokenType | CreateRefreshTokenType;

    if (tokenType === "AccessToken") {
      decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as CreateAccessTokenType;
    } else {
      decoded = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as CreateRefreshTokenType;
    }
    return {
      success: true,
      decoded,
    };
  } catch (error) {
    console.log("Error while verifying token", error);
    return {
      success: false,
      error: "Invalid token",
    };
  }
};
