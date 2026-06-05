import React from "react";

const NotePage = ({ params }: { params: { id: string } }) => {
  return <div>Note {params.id}</div>;
};

export default NotePage; 