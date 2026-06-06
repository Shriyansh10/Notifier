import { prisma } from "@/lib/prisma";
import { NoteInput, type NoteInputType } from "@/validators/notes-schema";

export { createNote, fetchNotesForUserUsingUserId, deleteNoteUsingNoteId, updateNoteUsingNoteId };


const createNote = async (noteData: NoteInputType, userId: number) => {
  try {
    // validate the note data using zod
    const { title, content, isCompleted, deadline } =
      await NoteInput.parseAsync(noteData);

    // check if the title is already in use by the user
    const existingNote = await prisma.note.findFirst({ where: { title } });

    if (existingNote) {
      return {
        success: false,
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
    };
  }
};

const fetchNotesForUserUsingUserId = async (userId: string) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: +userId,
      },
      orderBy: {
        deadline: "asc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        is_completed: true,
        deadline: true,
        created_at: true,
      },
    });

    const formattedNotes = notes.map((note) => ({
      ...note,
      id: String(note.id),
      deadline: note.deadline!.toISOString().split("T")[0],
      created_at: note.created_at.toISOString(),
    }));

    return {
      success: true,
      notes: formattedNotes,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
};

const deleteNoteUsingNoteId = async (noteId: string) => {
  try {
    const deletedNote = await prisma.note.delete({ where: { id: +noteId } });

    if (!deletedNote) return { success: false };
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
};

const updateNoteUsingNoteId = async (
  noteId: string,
  noteData: NoteInputType,
) => {
  try {
    const { title, content, isCompleted, deadline } =
      await NoteInput.parseAsync(noteData);

    const updatedNote = await prisma.note.update({
      where: { id: +noteId },

      data: {
        title,
        content: content || "",
        is_completed: isCompleted,
        deadline: new Date(deadline),
      },
    });

    if (!updatedNote) return { success: false };
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
};
