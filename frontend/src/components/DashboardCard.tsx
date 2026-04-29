export function DashboardCard({
  title,
  kicker,
  lines,
}: {
  title: string;
  kicker: string;
  lines: string[];
}) {
  return (
    <div className="dashboard-card">
      <p className="panel-kicker">{kicker}</p>
      <h2>{title}</h2>
      <div className="card-lines">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}
