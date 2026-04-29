import { DataTable } from "../components/DataTable";
import { PageActions } from "../components/PageActions";

const clientRoutes = [
  { to: "/client", label: "Dashboard" },
  { to: "/client/usage", label: "Usage" },
  { to: "/client/keys", label: "API Keys" },
  { to: "/client/docs", label: "Docs" },
];

export function ClientKeysPage() {
  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">API keys</p>
        <h2>Credential inventory and lifecycle actions</h2>
      </section>
      <PageActions items={clientRoutes} />
      <section className="wide-panel split-panel">
        <div className="dashboard-card">
          <p className="panel-kicker">Actions</p>
          <h2>Key controls</h2>
          <div className="chip-row">
            <span className="soft-chip">Create new key</span>
            <span className="soft-chip">Rotate secret</span>
            <span className="soft-chip">Revoke immediately</span>
          </div>
        </div>
        <div className="dashboard-card">
          <p className="panel-kicker">Policy</p>
          <h2>Current limits</h2>
          <div className="card-lines">
            <p>Maximum active keys: 5</p>
            <p>Secret is shown once per generation.</p>
            <p>Revocations take effect immediately.</p>
          </div>
        </div>
      </section>
      <section className="wide-panel">
        <DataTable
          columns={["Key Name", "API Key", "Created", "Last Used", "Status"]}
          rows={[
            ["Production", "ak_****93fd", "2026-01-01", "Today 08:42", "Active"],
            ["Staging", "ak_****10ab", "2026-02-18", "Yesterday", "Active"],
            ["Demo", "ak_****77ce", "2026-03-11", "3 days ago", "Restricted"],
          ]}
        />
      </section>
    </>
  );
}
