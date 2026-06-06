import DeleteModal from "@/components/delete-modal";
import React from "react";

const NotePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <DeleteModal id = { id } />;
};

export default NotePage;
