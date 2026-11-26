import { useState, useEffect } from "react";
import { useBuilding } from "./useBuilding";
import { fetchBuilding } from "../services/api";

export function useBuildingFromServer(fallbackBuilding) {
  const state = useBuilding(fallbackBuilding);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState("fallback"); // "server" | "fallback"

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBuilding(fallbackBuilding.id);
      state.replaceBuilding(data);
      setSource("server");
    } catch (err) {
      console.warn("Backend indisponible, fallback sur mock :", err.message);
      setError(err.message);
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, loading, error, source, reload };
}
