import { useQuery } from "@tanstack/react-query";
import { SectionCard } from "../components/SectionCard";
import { fetchStates, fetchSnapshot } from "../api";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function OverviewPage() {
  const snapshotQuery = useQuery({
    queryKey: ["snapshot"],
    queryFn: fetchSnapshot,
  });
  const statesQuery = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
  });

  const snapshot = snapshotQuery.data;
  const states = statesQuery.data ?? [];

  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">Overview page</p>
        <h2>Product framing and current coverage</h2>
      </section>
      <section className="wide-panel split-panel">
        <div className="stack">
          <p className="panel-kicker">Rollout framing</p>
          <h2>Built to ship in layers, not wait for perfection.</h2>
          <p className="body-copy">
            This starter already separates the product into a reliable backend contract, a
            scalable data model, and a frontend that can sell the vision to early B2B clients
            before the nationwide import finishes.
          </p>
        </div>
        <div className="stack">
          <div className="plan-list">
            {(snapshot?.plans ?? []).map((plan) => (
              <div key={plan.name} className="plan-row">
                <div>
                  <strong>{plan.name}</strong>
                  <span>{plan.regions}</span>
                </div>
                <span>{formatNumber(plan.dailyLimit)}/day</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="panel-kicker">State register</p>
            <h2>Initial coverage map</h2>
          </div>
        </div>
        <div className="state-list">
          {states.map((state) => (
            <div key={state.id} className="state-row">
              <div>
                <strong>{state.name}</strong>
                <span>{state.region}</span>
              </div>
              <span>{state.districtCount} districts</span>
            </div>
          ))}
        </div>
      </section>
      <section className="wide-panel stack-grid">
        <SectionCard
          kicker="Implementation review"
          title="See requirement coverage"
          body="Open the requirement status page to check what is already implemented, what is partial, and what still needs backend work."
          to="/requirements"
          cta="Open requirements status"
        />
        <SectionCard
          kicker="Admin workspace"
          title="Drill into operational tooling"
          body="Navigate into approvals, village browsing, and API logs from the admin area."
          to="/admin"
          cta="Open admin workspace"
        />
        <SectionCard
          kicker="Client workspace"
          title="Preview client-facing controls"
          body="Inspect usage analytics, API key flows, and integration docs from the client area."
          to="/client"
          cta="Open client workspace"
        />
      </section>
    </>
  );
}
