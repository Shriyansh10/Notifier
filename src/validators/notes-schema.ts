import {z} from "zod";

export const NoteInput = z.object({
  title: z.string().min(3).max(50).describe("Title of the note"),
  content: z.string().min(5).max(500).describe("Content of the note").optional(),
  isCompleted: z.boolean().default(false).describe("Completion status of the note"),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Deadline for the note"),
});

export type NoteInputType = z.infer<typeof NoteInput>;