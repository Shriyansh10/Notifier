'use client'
import React from "react";
import { AllNotesType } from "@/validators/notes-schema";

export type NoteContextType = {
  note: AllNotesType | null;
  setNote: React.Dispatch<React.SetStateAction<AllNotesType | null>>;
};

const NoteContext = React.createContext<NoteContextType | null>(null);

export default NoteContext;