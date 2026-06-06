"use client";

import React from "react";
import UserContext, { type UserType } from "@/context/user-context";
import NoteContext from "@/context/note-context";
import type { AllNotesType } from "@/validators/notes-schema";

const GlobalProviders = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserType | null>(null);
  const [note, setNote] = React.useState<AllNotesType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NoteContext.Provider value={{ note, setNote }}>
      {children}
      </NoteContext.Provider>
    </UserContext.Provider>
  );
};

export default GlobalProviders;
