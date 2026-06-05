'use server'
import { cookies } from "next/headers";

import { decodeToken } from "@/utils/tokens";
import { NoteInput, type NoteInputType } from "@/validators/notes-schema";
import * as notesService from "@/services/notes-service";

export { createNote };

const fetchTokenFromCookies = async (tokenType: "accessToken" | "refreshToken") => {
    const cookieStore = await cookies();
    const tokenInCookie = cookieStore.get(tokenType)?.value as string;
    return tokenInCookie;
}

const createNote = async (noteData: NoteInputType) => {
    // validate the note data using zod
    const { title, content, isCompleted, deadline } = await NoteInput.parseAsync(noteData);
    
    // decode token and get user id from it
    const accessTokenInCookie = await fetchTokenFromCookies("accessToken");
    const { decoded } = decodeToken(accessTokenInCookie);

    if(!decoded || !("id" in decoded)) {
        return {
            success: false,
            error: "Invalid token"
        }
    }
    const userId = decoded.id;

    // call the createNote service to save the note in the db
    const {success} = await notesService.createNote({ title, content, isCompleted, deadline }, +(userId as string));

    // return the response
    if(!success) {
        return {
            success: false,
            error: "An error occurred while creating the note"
        }
    }

    return {
        success: true,
        message: "Note created successfully"
    }
}
