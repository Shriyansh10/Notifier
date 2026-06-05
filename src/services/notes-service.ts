import { prisma } from "@/lib/prisma";
import { NoteInput, type NoteInputType } from "@/validators/notes-schema";

export const createNote = async (noteData: NoteInputType, userId: number) => {

  try {
    // validate the note data using zod
    const { title, content, isCompleted, deadline } =
      await NoteInput.parseAsync(noteData);

    // check if the title is already in use by the user
    const existingNote = await prisma.note.findFirst({ where: { title } });

    if (existingNote) {
      return {
        success: false,
        error: "Note with this title already exists",
      };
    }

    // save the note in the db
    const note = await prisma.note.create({
      data: {
        title,
        content: content || "",
        is_completed: isCompleted,
        deadline: new Date(deadline),
        userId,
      },
    });

    if (!note) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal server error while creating the note",
    };
  }
};
