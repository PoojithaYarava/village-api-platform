import type { ApiResponse, Snapshot, VillageOption } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}

export function fetchSnapshot() {
  return request<Snapshot>("/snapshot");
}

export function fetchStates() {
  return request<
    Array<{ id: string; name: string; code: string; region: string; districtCount: number }>
  >("/states");
}

export function searchVillages(query: string) {
  const encoded = encodeURIComponent(query);
  return request<VillageOption[]>(`/autocomplete?q=${encoded}&hierarchyLevel=village`);
}
