import IssueCard from "./IssueCard";

export default function BoardColumn({ title, issues }) {
  return (
    <div className="board-column">

      <h3>{title}</h3>

      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}

    </div>
  );
}