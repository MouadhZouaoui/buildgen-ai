const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const { headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...headers },
    ...rest,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText || ""}`.trim());
  }
  return res.json();
}

// GET building par id
export async function fetchBuilding(id) {
  return request(`/api/building/${id}`);
}

// PATCH une room
export async function patchRoom(buildingId, roomId, patch) {
  return request(`/api/building/${buildingId}/room/${roomId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}
