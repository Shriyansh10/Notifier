"use server";
import { cookies } from "next/headers";

import { decodeToken } from "@/utils/tokens";
import { NoteInput, type NoteInputType } from "@/validators/notes-schema";
import * as notesService from "@/services/notes-service";

export {
  createNote,
  fetchNotesForUserUsingUserId,
  deleteNoteUsingNoteId,
  updateNoteUsingNoteId,
};

const fetchTokenFromCookies = async (
  tokenType: "accessToken" | "refreshToken",
) => {
  const cookieStore = await cookies();
  const tokenInCookie = cookieStore.get(tokenType)?.value as string;
  const { decoded } = decodeToken(tokenInCookie);
  return decoded;
};

const createNote = async (noteData: NoteInputType) => {
  // validate the note data using zod
  const { title, content, isCompleted, deadline } =
    await NoteInput.parseAsync(noteData);

  // decode token and get user id from it
  const decoded = await fetchTokenFromCookies("accessToken");

  if (!decoded || !("id" in decoded)) {
    return {
      success: false,
      error: "Invalid token",
    };
  }
  const userId = decoded.id;

  // call the createNote service to save the note in the db
  const { success } = await notesService.createNote(
    { title, content, isCompleted, deadline },
    +(userId as string),
  );

  // return the response
  if (!success) {
    return {
      success: false,
      error: "An error occurred while creating the note",
    };
  }

  return {
    success: true,
    message: "Note created successfully",
  };
};

const fetchNotesForUserUsingUserId = async () => {
  const decoded = await fetchTokenFromCookies("accessToken");

  if (!decoded || !("id" in decoded)) {
    return {
      success: false,
      error: "Invalid token",
    };
  }
  const userId = decoded.id;

  // call the fetchNotesForUserUsingUserId service to get the notes for the user from the db
  const { success, notes } =
    await notesService.fetchNotesForUserUsingUserId(userId);

  if (!success) {
    return {
      success: false,
      error:  "An error occurred while fetching the notes for the user",
    };
  }

  // return the response
  return {
    success: true,
    notes,
  };
};

const deleteNoteUsingNoteId = async (noteId: string) => {
  try {
    const { success } = await notesService.deleteNoteUsingNoteId(noteId);
    if (!success) {
      return {
        success: false,
        error: "An error occurred while deleting the note",
      };
    }
    return {
      success: true,
      message: "Note deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred while deleting the note",
    };
  }
};

const updateNoteUsingNoteId = async (noteId: string, noteData: NoteInputType) => {
  try {
    const { success } = await notesService.updateNoteUsingNoteId(noteId, noteData);
    if (!success) {
      return {
        success: false,
        error: "An error occurred while updating the note",
      };
    }
    return {
      success: true,
      message: "Note updated successfully",
    };
  }
    catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the note",
    };
  }
}