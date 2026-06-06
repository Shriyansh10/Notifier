"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { deleteNoteUsingNoteId } from "@/actions/notes-actions";

import NoteContext, { type NoteContextType } from "@/context/note-context";

const DeleteModal = () => {
  const noteContext = React.useContext(NoteContext) as NoteContextType;
  const router = useRouter();

  const handleDelete = async () => {
    // call the action to delete the note using the id from the note context, then redirect to the notes page
    const { success, error } = await deleteNoteUsingNoteId( noteContext.note!.id );

    setTimeout(() => {
      if (success) {
        alert("Note deleted successfully (mock)");
      } else {
        alert(`Error deleting note: ${error}`);
      }
      router.replace("/notes");
    }, 1000);
    
  };

  React.useEffect(() => {
    console.log("Note in context:", noteContext.note);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Are you sure you want to delete the note titled{" "}
        {noteContext.note!.title}?
      </h1>

      <button onClick={() => router.replace("/notes")}>Cancel</button>
      <button onClick={handleDelete}>Delete</button>
    </>
  );
};

export default DeleteModal;
