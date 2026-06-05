type NoteCardProps = {
  title: string;
  content: string;
  isCompleted: boolean;
  deadline: string;
}

export const NoteCard = ({
  title,
  content,
  isCompleted,
  deadline,
}: NoteCardProps) => {
  return (
    <div>
      <div>
        <input type="checkbox" checked={isCompleted} />
        <h3>{title}</h3>
      </div>
      <p>{content}</p>
      <div>
        <span>Deadline: {deadline}</span>
      </div>
    </div>
  );
};
