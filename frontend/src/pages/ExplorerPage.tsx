import { useEffect, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { searchVillages } from "../api";
import type { VillageOption } from "../types";

export function ExplorerPage() {
  const [query, setQuery] = useState("ma");
  const [results, setResults] = useState<VillageOption[]>([]);
  const [selected, setSelected] = useState<VillageOption | null>(null);

  useEffect(() => {
    let ignore = false;

    async function runSearch() {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      const data = await searchVillages(query);
      if (!ignore) {
        setResults(data);
        setSelected(data[0] ?? null);
      }
    }

    runSearch().catch(() => {
      if (!ignore) {
        setResults([]);
      }
    });

    return () => {
      ignore = true;
    };
  }, [query]);

  return (
    <>
      <section className="page-intro">
        <p className="panel-kicker">Explorer page</p>
        <h2>Live village autocomplete and demo integration flow</h2>
      </section>
      <section className="wide-panel explorer-panel">
        <div className="panel-head">
          <div>
            <p className="panel-kicker">Live village lookup</p>
            <h2>Autocomplete playground</h2>
          </div>
          <span className="panel-badge">Uses the running local API</span>
        </div>
        <label className="search-shell">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type a village, district, or sub-district"
          />
        </label>
        <div className="result-list">
          {results.map((item) => (
            <button
              key={item.value}
              type="button"
              className={selected?.value === item.value ? "result-row result-button active" : "result-row result-button"}
              onClick={() => setSelected(item)}
            >
              <div>
                <strong>{item.label}</strong>
                <span>{item.fullAddress}</span>
              </div>
              <ArrowUpRight size={16} />
            </button>
          ))}
          {!results.length && (
            <div className="empty-state">Type at least two characters to see address suggestions.</div>
          )}
        </div>
      </section>
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="panel-kicker">Integration note</p>
            <h2>Demo client flow</h2>
          </div>
        </div>
        <div className="code-card">
          <code>GET /api/v1/autocomplete?q=ma&amp;hierarchyLevel=village</code>
          <p>Returns dropdown-ready labels and the full standardized address hierarchy.</p>
        </div>
        {selected ? (
          <div className="detail-card">
            <p className="panel-kicker">Selected village</p>
            <h3>{selected.hierarchy.village}</h3>
            <div className="card-lines">
              <p>Sub-District: {selected.hierarchy.subDistrict}</p>
              <p>District: {selected.hierarchy.district}</p>
              <p>State: {selected.hierarchy.state}</p>
              <p>Country: {selected.hierarchy.country}</p>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
