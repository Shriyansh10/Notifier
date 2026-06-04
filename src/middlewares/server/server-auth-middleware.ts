'use server'

import { verifyToken } from "@/utils/tokens";
import { cookies } from "next/headers";

export const authenticated = async () => {
    const cookiesStore = await cookies();
      
    // fetch the access token from the cookie
    const token = cookiesStore.get("accessToken")?.value;

    // if no token found in the cookie
    if (!token) return { success: false, error: "No token found" };
    
    // verify the access token
    const verificationResponse = verifyToken(token, "AccessToken");

    // if the access token is invalid, return an error message with 401 status code
    if (!verificationResponse.success) {
    return { success: false, error: "Invalid token", statusCode: 401 };
    }
      
    // if the access token is valid, return success
    return { success: true, message: "User is authenticated" };
}
