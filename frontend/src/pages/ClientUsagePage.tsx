import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageActions } from "../components/PageActions";

const clientRoutes = [
  { to: "/client", label: "Dashboard" },
  { to: "/client/usage", label: "Usage" },
  { to: "/client/keys", label: "API Keys" },
  { to: "/client/docs", label: "Docs" },
];

const usage = [
  { day: "Apr 23", requests: 8200 },
  { day: "Apr 24", requests: 9100 },
  { day: "Apr 25", requests: 12040 },
  { day: "Apr 26", requests: 10320 },
  { day: "Apr 27", requests: 14900 },
  { day: "Apr 28", requests: 17220 },
  { day: "Apr 29", requests: 18860 },
];

export function ClientUsagePage() {
  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">Client usage</p>
        <h2>Daily volume, trend, and plan burn rate</h2>
      </section>
      <PageActions items={clientRoutes} />
      <section className="wide-panel split-panel">
        <div className="dashboard-card">
          <p className="panel-kicker">Today</p>
          <h2>18,860 requests</h2>
          <div className="chip-row">
            <span className="soft-chip">Limit: 50,000</span>
            <span className="soft-chip">Success: 99.2%</span>
            <span className="soft-chip">Avg: 62 ms</span>
          </div>
        </div>
        <div className="dashboard-card">
          <p className="panel-kicker">Alerts</p>
          <h2>Quota watch</h2>
          <div className="card-lines">
            <p>80% threshold email: Not triggered</p>
            <p>95% threshold email: Not triggered</p>
            <p>Closest day this month: 41,320 requests</p>
          </div>
        </div>
      </section>
      <section className="wide-panel">
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={usage}>
              <defs>
                <linearGradient id="clientUsageFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#194c47" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#194c47" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#d9c7af" vertical={false} />
              <XAxis dataKey="day" stroke="#5e5a52" />
              <YAxis stroke="#5e5a52" />
              <Tooltip />
              <Area type="monotone" dataKey="requests" stroke="#194c47" fill="url(#clientUsageFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
