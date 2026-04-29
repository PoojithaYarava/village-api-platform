import { NavLink } from "react-router-dom";

export function SectionCard({
  kicker,
  title,
  body,
  to,
  cta,
}: {
  kicker: string;
  title: string;
  body: string;
  to: string;
  cta: string;
}) {
  return (
    <div className="section-card">
      <p className="panel-kicker">{kicker}</p>
      <h3>{title}</h3>
      <p>{body}</p>
      <NavLink className="inline-link-button" to={to}>
        {cta}
      </NavLink>
    </div>
  );
}
