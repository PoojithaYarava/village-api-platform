import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardCard } from "../components/DashboardCard";
import { PageActions } from "../components/PageActions";
import { SectionCard } from "../components/SectionCard";

const requestTrend = [
  { day: "Mon", latency: 82 },
  { day: "Tue", latency: 79 },
  { day: "Wed", latency: 80 },
  { day: "Thu", latency: 84 },
  { day: "Fri", latency: 88 },
  { day: "Sat", latency: 75 },
  { day: "Sun", latency: 71 },
];

const adminRoutes = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/browser", label: "Village Browser" },
  { to: "/admin/logs", label: "API Logs" },
];

export function AdminPage() {
  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">Admin page</p>
        <h2>Operations, approval flows, and performance telemetry</h2>
      </section>
      <PageActions items={adminRoutes} />
      <section className="wide-panel split-panel">
        <DashboardCard
          title="User approval desk"
          kicker="Admin operations"
          lines={[
            "Pending enterprise registrations with GST and state-access review.",
            "Bulk approval, suspension, note-taking, and key lifecycle actions.",
            "Audit-friendly state grants for regional commercial agreements.",
          ]}
        />
        <DashboardCard
          title="Village master browser"
          kicker="Data verification"
          lines={[
            "Dependent filters across state, district, sub-district, and village.",
            "500 to 10,000 row pagination presets for deep operations work.",
            "Exports for QA, reconciliation, and client exception handling.",
          ]}
        />
      </section>
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="panel-kicker">Admin telemetry</p>
            <h2>Response time trend</h2>
          </div>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={requestTrend}>
              <CartesianGrid stroke="#d9c7af" vertical={false} />
              <XAxis dataKey="day" stroke="#5e5a52" />
              <YAxis stroke="#5e5a52" />
              <Tooltip />
              <Bar dataKey="latency" fill="#194c47" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="wide-panel stack-grid">
        <SectionCard
          kicker="User management"
          title="Review account approvals"
          body="Search users, filter by status and plan, and review state-access assignments."
          to="/admin/users"
          cta="Open user controls"
        />
        <SectionCard
          kicker="Data browser"
          title="Inspect cleaned village hierarchy"
          body="Browse state, district, sub-district, and village rows with table-style verification."
          to="/admin/browser"
          cta="Open village browser"
        />
        <SectionCard
          kicker="Observability"
          title="Audit API traffic"
          body="Review response times, status classes, and export-friendly log surfaces."
          to="/admin/logs"
          cta="Open API logs"
        />
      </section>
    </>
  );
}
