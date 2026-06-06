import NoteForm from '@/components/note-form';
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <NoteForm formType={"edit"} />
  )
}

export default page