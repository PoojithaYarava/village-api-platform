import { DataTable } from "../components/DataTable";
import { PageActions } from "../components/PageActions";

const adminRoutes = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/browser", label: "Village Browser" },
  { to: "/admin/logs", label: "API Logs" },
];

export function AdminLogsPage() {
  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">API logs</p>
        <h2>Monitoring, response times, and failure review</h2>
      </section>
      <PageActions items={adminRoutes} />
      <section className="wide-panel split-panel">
        <div className="dashboard-card">
          <p className="panel-kicker">Filters</p>
          <h2>Current view</h2>
          <div className="chip-row">
            <span className="soft-chip">Last 24 hours</span>
            <span className="soft-chip">2xx + 4xx</span>
            <span className="soft-chip">Threshold: 120ms</span>
          </div>
        </div>
        <div className="dashboard-card">
          <p className="panel-kicker">Exports</p>
          <h2>Weekly reporting</h2>
          <div className="card-lines">
            <p>CSV export ready for ops review.</p>
            <p>JSON download available for incident analysis.</p>
            <p>Email digest schedule: Mondays, 09:00 IST.</p>
          </div>
        </div>
      </section>
      <section className="wide-panel">
        <DataTable
          columns={["Timestamp", "API Key", "Business", "Endpoint", "Response", "Status"]}
          rows={[
            ["2026-04-29 11:15", "ak_****93fd", "Apex Rural Logistics", "/api/v1/autocomplete", "47 ms", "200"],
            ["2026-04-29 11:11", "ak_****10ab", "KCG", "/api/v1/search", "83 ms", "200"],
            ["2026-04-29 10:58", "ak_****77ce", "Demo", "/api/v1/autocomplete", "122 ms", "429"],
            ["2026-04-29 10:54", "ak_****31de", "Northfield", "/api/v1/states", "34 ms", "200"],
          ]}
        />
      </section>
    </>
  );
}
