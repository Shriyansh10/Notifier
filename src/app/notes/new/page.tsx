"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { createNote } from "@/actions/notes-actions";
import { NoteInput } from "@/validators/notes-schema";
import {verifyTokenAuthentication} from '@/middlewares/client/client-auth-middleware'

type FormData = {
  title: string;
  content: string;
  isCompleted: boolean;
  deadline?: string;
};

const NewForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | undefined>(undefined);
  const [submitSuccess, setSubmitSuccess] = React.useState<string | undefined>(undefined);
  const router = useRouter();

  const { register, handleSubmit, setError, formState: {errors} } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      isCompleted: false,
      deadline: undefined,
    },
  });

  const todayDate = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: FormData) => {

    await verifyTokenAuthentication();
    
    let hasError = false;
    if(data.title.trim().length < 3 || data.title.trim().length > 50) {
      setError("title", {
        type: "manual",
        message: "Title must be between 3 and 50 characters",
      });
      hasError = true;
    }
    if(data.content.trim().length < 5 || data.content.trim().length > 200) {
      setError("content", {
        type: "manual",
        message: "Content must be between 5 and 200 characters",
      });
      hasError = true;
    }
    if(!data.deadline?.match(/^\d{4}-\d{2}-\d{2}$/)) {
      
        setError("deadline", {
          type: "manual",
          message: "Invalid deadline format, expected YYYY-MM-DD",
        });
        hasError = true;
      
    }

    if(data.deadline && data.deadline < today) {
      setError("deadline", {
        type: "manual",
        message: "Deadline cannot be in the past",
      }); 
      hasError = true;
    }

    if(!hasError) {
      setIsSubmitting(true);
      setSubmitError(undefined);
      setSubmitSuccess(undefined);
      // TODO: implement submit logic
      // data contains: title, content, isCompleted, deadline
      const { title, content, isCompleted, deadline } = NoteInput.parse(data);
      const { success, message, error } = await createNote({ title, content, isCompleted, deadline });
      if(success) {
        setIsSubmitting(false);
        setSubmitSuccess(message);
        router.replace("/notes");
      }
      else {
        setIsSubmitting(false);
        setSubmitError(error);

        if(error === "Invalid token") {
          // if the error is due to invalid token, redirect to login page after 2 seconds
          setTimeout(() => {
            router.replace("/sign-in");
          }, 2000);
        }
      }
    }
  };

  return (
    <div>
      <h1>New Note</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Title</label>
          <input {...register("title", { required: true })} placeholder="Enter Title"/>
        </div>
        {errors.title && <p style={{color: "red"}}>{errors.title.message}</p>}
        <div>
          <label>Content</label>
          <textarea {...register("content")} placeholder="Enter Description"/>
        </div>
        {errors.content && <p style={{color: "red"}}>{errors.content.message}</p>}
        <div>
          <label>
            <input type="checkbox" {...register("isCompleted")}  /> Completed
          </label>
        </div>

        <div>
          <label>Deadline</label>
          <input type="date" {...register("deadline")} min={todayDate} defaultValue={todayDate} />
        </div>
        {errors.deadline && <p style={{color: "red"}}>{errors.deadline.message}</p>}

        {submitError && <p style={{color: "red"}}>{submitError}</p>}
        {submitSuccess && <p style={{color: "green"}}>{submitSuccess}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </button>

        <button type="button" onClick={() => router.replace("/notes")} disabled={isSubmitting}>Go Back</button>
      </form>
    </div>
  );
};

export default NewForm;
