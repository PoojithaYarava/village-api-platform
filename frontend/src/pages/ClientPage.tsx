import { KeyRound } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { PageActions } from "../components/PageActions";
import { SectionCard } from "../components/SectionCard";

const clientRoutes = [
  { to: "/client", label: "Dashboard" },
  { to: "/client/usage", label: "Usage" },
  { to: "/client/keys", label: "API Keys" },
  { to: "/client/docs", label: "Docs" },
];

export function ClientPage() {
  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">Client page</p>
        <h2>Usage visibility and API credential workflows</h2>
      </section>
      <PageActions items={clientRoutes} />
      <section className="wide-panel split-panel">
        <DashboardCard
          title="Usage command deck"
          kicker="Client workspace"
          lines={[
            "Today vs monthly volume, request success ratio, and endpoint mix.",
            "API key issuance with one-time secret reveal and instant revocation.",
            "Self-serve documentation area with live examples and plan guidance.",
          ]}
        />
        <DashboardCard
          title="Commercial profile"
          kicker="Subscription lane"
          lines={[
            "Plan-aware daily limits with alerts at 80%, 95%, and 100%.",
            "State access summary for procurement and operational teams.",
            "Upgrade path for seasonal spikes and enterprise support windows.",
          ]}
        />
      </section>
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="panel-kicker">Key operations</p>
            <h2>Credential lifecycle</h2>
          </div>
        </div>
        <div className="credential-list">
          {[
            ["Production", "ak_****93fd", "Active", "Today 08:42"],
            ["Staging", "ak_****10ab", "Active", "Yesterday"],
            ["Demo", "ak_****77ce", "Restricted", "3 days ago"],
          ].map(([name, key, status, used]) => (
            <div key={name} className="credential-row">
              <div className="credential-name">
                <KeyRound size={16} />
                <div>
                  <strong>{name}</strong>
                  <span>{key}</span>
                </div>
              </div>
              <span>{status}</span>
              <span>{used}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="wide-panel stack-grid">
        <SectionCard
          kicker="Usage"
          title="Track daily request patterns"
          body="See consumption trends, alert thresholds, and response performance for the active plan."
          to="/client/usage"
          cta="Open usage analytics"
        />
        <SectionCard
          kicker="Credentials"
          title="Manage API keys"
          body="Review named keys, status, last-used times, and lifecycle actions for production and staging."
          to="/client/keys"
          cta="Open key manager"
        />
        <SectionCard
          kicker="Documentation"
          title="Jump into integration docs"
          body="Use the quick-start endpoint examples and response structures from the embedded docs surface."
          to="/client/docs"
          cta="Open docs"
        />
      </section>
    </>
  );
}
