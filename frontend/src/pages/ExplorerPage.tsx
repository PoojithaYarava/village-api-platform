import { useEffect, useState } from "react";
import { ArrowUpRight, Copy, Landmark, MapPinned, Route, Search } from "lucide-react";
import { searchVillages } from "../api";
import type { VillageOption } from "../types";

export function ExplorerPage() {
  const [query, setQuery] = useState("ma");
  const [results, setResults] = useState<VillageOption[]>([]);
  const [selected, setSelected] = useState<VillageOption | null>(null);

  const selectedEndpoint = selected
    ? `/api/v1/search?q=${encodeURIComponent(selected.hierarchy.village)}&limit=1`
    : "/api/v1/search?q=ma&limit=1";

  const selectedPayload = selected
    ? JSON.stringify(
        {
          id: selected.value,
          villageCode: selected.code || "not provided",
          village: selected.hierarchy.village,
          subDistrict: selected.hierarchy.subDistrict,
          district: selected.hierarchy.district,
          state: selected.hierarchy.state,
          country: selected.hierarchy.country,
          fullAddress: selected.fullAddress,
        },
        null,
        2
      )
    : "";

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
              aria-pressed={selected?.value === item.value}
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
            <div className="detail-heading">
              <div>
                <p className="panel-kicker">Selected village</p>
                <h3>{selected.hierarchy.village}</h3>
              </div>
              <span className="detail-code">{selected.code || "Code pending"}</span>
            </div>

            <div className="detail-address">
              <MapPinned size={18} />
              <p>{selected.fullAddress}</p>
            </div>

            <div className="detail-grid">
              <div>
                <span>Village ID</span>
                <strong>{selected.value}</strong>
              </div>
              <div>
                <span>Village Code</span>
                <strong>{selected.code || "Not provided"}</strong>
              </div>
              <div>
                <span>Sub-District</span>
                <strong>{selected.hierarchy.subDistrict}</strong>
              </div>
              <div>
                <span>District</span>
                <strong>{selected.hierarchy.district}</strong>
              </div>
              <div>
                <span>State</span>
                <strong>{selected.hierarchy.state}</strong>
              </div>
              <div>
                <span>Country</span>
                <strong>{selected.hierarchy.country}</strong>
              </div>
            </div>

            <div className="hierarchy-path" aria-label="Selected village hierarchy">
              <span>{selected.hierarchy.country}</span>
              <Route size={14} />
              <span>{selected.hierarchy.state}</span>
              <Route size={14} />
              <span>{selected.hierarchy.district}</span>
              <Route size={14} />
              <span>{selected.hierarchy.subDistrict}</span>
              <Route size={14} />
              <span>{selected.hierarchy.village}</span>
            </div>

            <div className="detail-actions">
              <a className="inline-link-button" href={selectedEndpoint} target="_blank" rel="noreferrer">
                <Landmark size={16} />
                Open API query
              </a>
              <button
                className="inline-link-button"
                type="button"
                onClick={() => navigator.clipboard?.writeText(selectedPayload)}
              >
                <Copy size={16} />
                Copy payload
              </button>
            </div>

            <div className="code-card detail-json">
              <code>{selectedPayload}</code>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
