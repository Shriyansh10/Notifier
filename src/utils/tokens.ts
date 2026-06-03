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
  if (tokenType === "AccessToken" && 'email' in payload) {
    const { id, email } = payload;

    const generatedToken = jwt.sign(
      { id, email },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
        algorithm: "HS256",
      },
    );
    return generatedToken;
  } else {
    const { id } = payload;

    const generatedToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue,
      algorithm: "HS256",
    });
    return generatedToken;
  }
};

// verify the token
export const verifyToken = (
  token: string,
  tokenType: "AccessToken" | "RefreshToken",
) => {
  const decodedToken = jwt.verify(
    token,
    tokenType === "AccessToken"
      ? process.env.ACCESS_TOKEN_SECRET!
      : process.env.REFRESH_TOKEN_SECRET!,
  );
  return decodedToken;
};
