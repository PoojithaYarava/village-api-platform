import { SectionCard } from "../components/SectionCard";

const areas = [
  {
    kicker: "Implemented now",
    title: "Frontend routing and responsive shell",
    body: "Public overview and explorer routes, protected admin and client routes, demo login, and responsive product shell are live.",
    to: "/explorer",
    cta: "Open live product",
  },
  {
    kicker: "Implemented now",
    title: "Dataset cleaning pipeline",
    body: "The uploaded village dataset is extracted, cleaned, normalized, and written into processed CSV outputs with quality reports.",
    to: "/",
    cta: "Review platform overview",
  },
  {
    kicker: "Partially implemented",
    title: "Admin and client workflows",
    body: "Admin and client areas now have deeper detail pages for users, logs, usage, keys, and docs, but they still use mock UI data.",
    to: "/admin",
    cta: "Inspect admin workspace",
  },
  {
    kicker: "Still pending",
    title: "Production backend features",
    body: "JWT auth, Prisma-backed import, Neon/Postgres persistence, Redis rate limiting, email flows, and live analytics still need API implementation.",
    to: "/client/docs",
    cta: "See integration docs",
  },
];

export function RequirementsPage() {
  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">Requirements status</p>
        <h2>What is implemented, partial, and still pending</h2>
      </section>
      <section className="wide-panel stack-grid">
        {areas.map((area) => (
          <SectionCard key={area.title} {...area} />
        ))}
      </section>
    </>
  );
}
