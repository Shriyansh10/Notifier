"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { deleteNoteUsingNoteId } from "@/actions/notes-actions";

import NoteContext, { type NoteContextType } from "@/context/note-context";

const DeleteModal = ({ id }: { id: string }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDeleted, setIsDeleted] = React.useState(false);

  const noteContext = React.useContext(NoteContext) as NoteContextType;
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    // check if the id from the params matches the id of the note in the note context, if not show an alert and redirect to the notes page
    if (id !== noteContext.note?.id) {
      alert("Note ID mismatch. Unable to delete the note.");
      router.replace("/notes");
      setIsDeleting(false);
      return;
    }

    // call the action to delete the note using the id from the note context, then redirect to the notes page
    const { success, error } = await deleteNoteUsingNoteId(
      noteContext.note!.id,
    );

    setTimeout(() => {
      if (success) {
        alert("Note deleted successfully");
        setIsDeleted(true);
      } else {
        alert(`Error deleting note: ${error}`);
      }
      router.replace("/notes");
      setIsDeleting(false);
    }, 1000);
  };

  return (
    <>
      <h1>
        Are you sure you want to delete the note titled{" "}
        {noteContext.note!.title}?
      </h1>
      <div>{isDeleted ? "Note deleted successfully" : ""}</div>
      <button onClick={() => router.replace("/notes")}>Cancel</button>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </>
  );
};

export default DeleteModal;
