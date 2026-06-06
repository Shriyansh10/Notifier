type NoteCardProps = {
  title: string;
  content: string;
  isCompleted: boolean;
  deadline: string;
  createdAt: string;
}

export const NoteCard = ({
  title,
  content,
  isCompleted,
  deadline,
  createdAt,
}: NoteCardProps) => {
  return (
    <div>
      <div>
        <input type="checkbox" checked={isCompleted} readOnly />
        <h3>{title}</h3>
      </div>
      <p>{content}</p>
      <div>
        <span>Deadline: {deadline}</span>
        <span>Created At: {createdAt.split("T")[0]}</span>
      </div>
    </div>
  );
};
