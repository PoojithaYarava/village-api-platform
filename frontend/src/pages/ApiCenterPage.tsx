import { NavLink } from "react-router-dom";

const endpointCards = [
  {
    title: "Snapshot",
    path: "/api/v1/snapshot",
    body: "Coverage counts, plan summaries, and baseline performance signals for the dashboard shell.",
  },
  {
    title: "States",
    path: "/api/v1/states",
    body: "Returns the current state list used by overview and drill-down UI surfaces.",
  },
  {
    title: "Autocomplete",
    path: "/api/v1/autocomplete?q=ma&hierarchyLevel=village",
    body: "Typeahead-friendly village suggestions with full hierarchy labels for forms and dropdowns.",
  },
  {
    title: "Search",
    path: "/api/v1/search?q=man&limit=10",
    body: "Structured village search with room for future state, district, and sub-district filtering.",
  },
];

export function ApiCenterPage() {
  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">API center</p>
        <h2>Readable entry point for the local API instead of a raw JSON tab</h2>
      </section>

      <section className="wide-panel split-panel">
        <div className="dashboard-card">
          <p className="panel-kicker">Base URL</p>
          <h2>http://localhost:3000/api/v1</h2>
          <div className="card-lines">
            <p>Use the public explorer and demo docs from here while the platform is still running on local mock-backed services.</p>
            <p>Admin and client pages in the UI rely on this same local API base for snapshot and search data.</p>
          </div>
        </div>
        <div className="dashboard-card">
          <p className="panel-kicker">Quick links</p>
          <h2>Useful local routes</h2>
          <div className="chip-row">
            <a className="soft-chip link-chip" href="http://localhost:3000/health" target="_blank" rel="noreferrer">
              Health check
            </a>
            <NavLink className="soft-chip link-chip" to="/explorer">
              Open explorer
            </NavLink>
            <NavLink className="soft-chip link-chip" to="/client/docs">
              Integration docs
            </NavLink>
          </div>
        </div>
      </section>

      <section className="wide-panel stack-grid">
        {endpointCards.map((card) => (
          <div key={card.title} className="section-card">
            <p className="panel-kicker">Endpoint</p>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <a
              className="inline-link-button"
              href={`http://localhost:3000${card.path}`}
              target="_blank"
              rel="noreferrer"
            >
              Open {card.path}
            </a>
          </div>
        ))}
      </section>
    </>
  );
}
