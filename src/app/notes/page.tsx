"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { verifyTokenAuthentication } from "@/middlewares/client/client-auth-middleware";

import { getUserDetailsWithToken, signOutUser } from "@/actions/auth-actions";
import { NoteCard } from "@/components/notes-card";
import { AllNotesType } from "@/validators/notes-schema";
import { fetchNotesForUserUsingUserId } from "@/actions/notes-actions";

import NoteContext, { type NoteContextType } from "@/context/note-context";
import UserContext, { type UserContextType } from "@/context/user-context";

const Notes = () => {
  const userContext = React.useContext(UserContext) as UserContextType;
  const noteContext = React.useContext(NoteContext) as NoteContextType;
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  const [notes, setNotes] = React.useState<AllNotesType[]>([]);

  // todo - fetch the notes for the user and display them in the UI, also handle loading and error states
  const fetchNotes = async () => {
    // call the action to fetch the notes for the user and set the notes state with the response
    const response = await verifyTokenAuthentication();

    if (response.status === true) {
      // fetch the notes for the user
      const notesResponse = await fetchNotesForUserUsingUserId();
      if (!notesResponse.success) {
        alert("An error occurred while fetching notes");
      } else if (notesResponse.success && notesResponse.notes) {
        setNotes(notesResponse.notes);
      }
    }
    setLoading(false);
  };

  // todo - handle sign out by clearing the user context and redirecting to the sign in page
  const handleSignOut = async () => {
    userContext?.setUser(null);
    const response = await signOutUser();
    if (response.success) {
      router.replace("/sign-in");
    }
  };

  const handleFetchUserData = async () => {
    // check if the access token is valid, if not 401 statuscode will be returned, otherwise the user will be asked to sign in again to start a new session
    const response = await verifyTokenAuthentication();

    // if the tokens are valid or reset successfully
    if (response.status === true) {
      // fetch the user data using the new access token
      const { success, user } = await getUserDetailsWithToken();

      if (success && user) {
        userContext?.setUser({
          id: `${user.id}`,
          fullname: user.fullname,
          email: user.email,
        });
      }
      setTimeout(async () => {
        await fetchNotes();
      }, 1000); // to avoid setting state synchronously within the effect body
    }
    // if the tokens are invalid and couldn't be reset successfully, handle as per requirement
    else {
      userContext?.setUser(null);
      alert("Your session has expired. Please sign in again.");
      setTimeout(() => {
        router.replace("/sign-in");
      }, 2000);
    }
  };

  const handleButtonClick = (route: string, note: AllNotesType | null) => {
    if (note) {
      noteContext?.setNote({
        content: note.content || "No description provided",
        deadline: note.deadline,
        id: note.id,
        is_completed: note.is_completed,
        title: note.title,
        created_at: note.created_at,
      });
    }
    router.push(route);
  };

  React.useEffect(() => {
    // avoid calling setState synchronously within the effect body
    (async () => {
      handleFetchUserData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Notes</h1>
      <p>Welcome, {userContext?.user?.fullname}!</p>
      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <div>
        <button onClick={() => handleButtonClick("/notes/new", null)}>
          Create New Note
        </button>
      </div>
      {notes ? (
        <div>
          {notes.map((note) => (
            <div key={note.id}>
              <NoteCard
                title={note.title}
                content={note.content || "No description provided"}
                isCompleted={note.is_completed}
                deadline={note.deadline.split("T")[0]}
                createdAt={note.created_at}
              />

              <button
                onClick={() =>
                  handleButtonClick(`/notes/${note.id}/edit`, note)
                }
              >
                Edit
              </button>
              <button
                onClick={() => handleButtonClick(`/notes/${note.id}`, note)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No notes found. Create your first note!</p>
      )}
    </div>
  );
};

export default Notes;
