import { PageActions } from "../components/PageActions";

const clientRoutes = [
  { to: "/client", label: "Dashboard" },
  { to: "/client/usage", label: "Usage" },
  { to: "/client/keys", label: "API Keys" },
  { to: "/client/docs", label: "Docs" },
];

export function ClientDocsPage() {
  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">Docs</p>
        <h2>Quick start and integration references</h2>
      </section>
      <PageActions items={clientRoutes} />
      <section className="wide-panel split-panel">
        <div className="code-card">
          <code>GET /api/v1/autocomplete?q=man&amp;hierarchyLevel=village</code>
          <p>Use this for typeahead search in address fields and return dropdown-ready labels.</p>
        </div>
        <div className="code-card">
          <code>X-API-Key: ak_xxxx</code>
          <p>Add your key to every request. Write-sensitive routes also require the secret.</p>
        </div>
      </section>
      <section className="wide-panel stack-grid">
        <div className="section-card static-card">
          <p className="panel-kicker">Quick start</p>
          <h3>1. Copy your API key</h3>
          <p>Generate a named credential in the key manager and store the secret the moment it appears.</p>
        </div>
        <div className="section-card static-card">
          <p className="panel-kicker">Quick start</p>
          <h3>2. Make your first request</h3>
          <p>Use the autocomplete endpoint to populate village and area dropdowns with full hierarchy context.</p>
        </div>
        <div className="section-card static-card">
          <p className="panel-kicker">Quick start</p>
          <h3>3. Monitor usage</h3>
          <p>Track daily request volume, response time, and key-specific usage from the client workspace.</p>
        </div>
      </section>
    </>
  );
}
