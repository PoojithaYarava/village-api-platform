import { DataTable } from "../components/DataTable";
import { PageActions } from "../components/PageActions";

const adminRoutes = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/browser", label: "Village Browser" },
  { to: "/admin/logs", label: "API Logs" },
];

export function AdminUsersPage() {
  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">Admin users</p>
        <h2>User approvals, plan controls, and state access</h2>
      </section>
      <PageActions items={adminRoutes} />
      <section className="wide-panel split-panel">
        <div className="dashboard-card">
          <p className="panel-kicker">Approval queue</p>
          <h2>High priority applicants</h2>
          <div className="card-lines">
            <p>Pending: 18 accounts waiting for manual business verification.</p>
            <p>Approvals today: 7</p>
            <p>Suspended accounts: 2 flagged for excessive request bursts.</p>
          </div>
        </div>
        <div className="dashboard-card">
          <p className="panel-kicker">Access controls</p>
          <h2>State grant matrix</h2>
          <div className="chip-row">
            <span className="soft-chip">All India: 4</span>
            <span className="soft-chip">Regional access: 11</span>
            <span className="soft-chip">Single-state: 26</span>
          </div>
        </div>
      </section>
      <section className="wide-panel">
        <div className="panel-head">
          <div>
            <p className="panel-kicker">User list</p>
            <h2>Accounts requiring action</h2>
          </div>
        </div>
        <DataTable
          columns={["Business", "Email", "Plan", "Status", "States", "Last Active"]}
          rows={[
            ["Apex Rural Logistics", "ops@apexrural.in", "Pro", "Pending", "Maharashtra, Gujarat", "Today"],
            ["Krishi Commerce Grid", "infra@kcg.in", "Premium", "Active", "Karnataka, Tamil Nadu", "12 min ago"],
            ["Northfield Supply Network", "tech@northfield.in", "Unlimited", "Review", "All India", "1 hour ago"],
            ["Delta Bazaar Systems", "admin@delta.in", "Free", "Suspended", "Uttar Pradesh", "Yesterday"],
          ]}
        />
      </section>
    </>
  );
}
