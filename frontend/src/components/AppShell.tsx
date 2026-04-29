import type { ReactNode } from "react";
import {
  Activity,
  BadgeIndianRupee,
  Database,
  MapPinned,
  MoveRight,
  Radar,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSnapshot } from "../api";
import { useAuth } from "../auth";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

const modes = [
  { to: "/", label: "Overview" },
  { to: "/admin", label: "Admin" },
  { to: "/client", label: "Client" },
  { to: "/explorer", label: "Explorer" },
  { to: "/requirements", label: "Status" },
];

const pageMeta = [
  {
    match: (pathname: string) => pathname === "/",
    title: "Overview",
    description: "Coverage, product framing, and commercial posture",
  },
  {
    match: (pathname: string) => pathname.startsWith("/admin"),
    title: "Admin",
    description: "Operations control, approvals, and data verification",
  },
  {
    match: (pathname: string) => pathname.startsWith("/client"),
    title: "Client",
    description: "Usage visibility, plan controls, and API key lifecycle",
  },
  {
    match: (pathname: string) => pathname.startsWith("/explorer"),
    title: "Explorer",
    description: "Live API lookup and integration playground",
  },
  {
    match: (pathname: string) => pathname.startsWith("/api-center"),
    title: "API Center",
    description: "Human-readable entry point for local endpoints, health checks, and explorer links",
  },
  {
    match: (pathname: string) => pathname.startsWith("/requirements"),
    title: "Status",
    description: "Requirement coverage, what is done, and what still needs backend work",
  },
] as const;

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const snapshotQuery = useQuery({
    queryKey: ["snapshot"],
    queryFn: fetchSnapshot,
  });
  const snapshot = snapshotQuery.data;
  const isOverview = location.pathname === "/";
  const currentPage = pageMeta.find((item) => item.match(location.pathname)) ?? pageMeta[0];

  return (
    <div className="app-shell">
      <div className="background-grid" />
      <header className="topbar">
        <div className="brand-block">
          <button className="brand-mark" onClick={() => navigate("/")}>
            <Radar size={18} />
          </button>
          <div className="brand-copy">
            <strong>Village API Platform</strong>
            <span>India village intelligence infrastructure</span>
          </div>
        </div>

        <div className="page-context">
          <p>{currentPage.title}</p>
          <span>{currentPage.description}</span>
        </div>

        <div className="topbar-actions">
          <button className="status-pill status-button" onClick={() => navigate("/api-center")}>
            <span className="status-dot" />
            API online
          </button>
          {user ? (
            <div className="session-actions">
              <div className="session-pill">
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>
              <button
                className="nav-cta secondary-nav"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button className="nav-cta" onClick={() => navigate("/login")}>
              Sign in
              <MoveRight size={16} />
            </button>
          )}
        </div>
      </header>

      <nav className="mode-rail">
        {modes.map((mode) => (
          <NavLink
            key={mode.to}
            to={mode.to}
            end={mode.to === "/" || mode.to === "/requirements"}
            className={({ isActive }) => (isActive ? "rail-button active" : "rail-button")}
          >
            {mode.label}
          </NavLink>
        ))}
      </nav>

      <header className="hero-band">
        <div className="hero-copy">
          <p className="eyebrow">Village-grade geography infrastructure for India</p>
          <h1>Operational clarity for the last mile.</h1>
          <p className="hero-text">
            A SaaS control room for address intelligence: village search APIs, rate-limited
            tenant access, admin governance, and live integration tooling in one place.
          </p>
          <div className="hero-visual-card">
            <div className="hero-visual-map" />
            <div className="hero-visual-copy">
              <strong>Field atlas preview</strong>
              <span>Warm-toned route marker graphic that fits the operations-map mood of the product shell.</span>
            </div>
          </div>
          <div className="hero-actions">
            <button className="primary-chip" onClick={() => navigate("/explorer")}>
              Try live explorer
            </button>
            <button className="secondary-chip" onClick={() => navigate("/admin")}>
              Open admin view
            </button>
          </div>
        </div>
        <div className="hero-panel">
          <div className="signal-card">
            <div>
              <span className="signal-label">Coverage radius</span>
              <strong>{snapshot ? formatNumber(snapshot.coverage.villages) : "--"} villages</strong>
            </div>
            <MapPinned size={24} />
          </div>
          <div className="signal-card">
            <div>
              <span className="signal-label">P95 response</span>
              <strong>{snapshot ? snapshot.performance.p95ResponseMs : "--"} ms</strong>
            </div>
            <Activity size={24} />
          </div>
          <div className="terrain-preview">
            <div className="terrain-line terrain-line-a" />
            <div className="terrain-line terrain-line-b" />
            <div className="terrain-line terrain-line-c" />
            <div className="terrain-caption">
              <span>Designed like an operations atlas, not a template pack.</span>
            </div>
          </div>
        </div>
      </header>

      <main className="content-grid">
        <section className="metrics-ribbon">
          <MetricTile
            icon={<Database size={18} />}
            label="States onboarded"
            value={snapshot ? formatNumber(snapshot.coverage.states) : "--"}
            note="Ready for normalization"
          />
          <MetricTile
            icon={<MapPinned size={18} />}
            label="Districts"
            value={snapshot ? formatNumber(snapshot.coverage.districts) : "--"}
            note="Hierarchical API routing"
          />
          <MetricTile
            icon={<Activity size={18} />}
            label="Cache hit rate"
            value={snapshot ? `${snapshot.performance.cacheHitRate}%` : "--"}
            note="Edge friendly payloads"
          />
          <MetricTile
            icon={<BadgeIndianRupee size={18} />}
            label="ARR lane"
            value="Tiered"
            note={isOverview ? "Free to Unlimited" : "Plan-aware controls"}
          />
        </section>

        <Outlet />
      </main>
    </div>
  );
}

function MetricTile({
  icon,
  label,
  value,
  note,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="metric-tile">
      <div className="metric-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{note}</span>
      </div>
    </article>
  );
}
