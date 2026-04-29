import { NavLink } from "react-router-dom";

export function PageActions({
  items,
}: {
  items: Array<{ to: string; label: string }>;
}) {
  return (
    <div className="subnav-grid">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) => (isActive ? "subnav-link active" : "subnav-link")}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
