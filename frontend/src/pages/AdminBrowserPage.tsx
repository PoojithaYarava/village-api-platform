import { DataTable } from "../components/DataTable";
import { PageActions } from "../components/PageActions";

const adminRoutes = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/browser", label: "Village Browser" },
  { to: "/admin/logs", label: "API Logs" },
];

export function AdminBrowserPage() {
  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">Village browser</p>
        <h2>Master data review and hierarchy validation</h2>
      </section>
      <PageActions items={adminRoutes} />
      <section className="wide-panel">
        <div className="filter-ribbon">
          <span className="soft-chip">State: Maharashtra</span>
          <span className="soft-chip">District: Nandurbar</span>
          <span className="soft-chip">Sub-District: Akkalkuwa</span>
          <span className="soft-chip">Page size: 500</span>
        </div>
        <DataTable
          columns={["State", "District", "Sub-District", "Village Code", "Village Name"]}
          rows={[
            ["Maharashtra", "Nandurbar", "Akkalkuwa", "525002", "Manibeli"],
            ["Maharashtra", "Nandurbar", "Akkalkuwa", "525003", "Dhankhedi"],
            ["Maharashtra", "Nandurbar", "Akkalkuwa", "525004", "Chimalkhadi"],
            ["Maharashtra", "Nandurbar", "Akkalkuwa", "525005", "Sinduri"],
          ]}
        />
      </section>
    </>
  );
}
