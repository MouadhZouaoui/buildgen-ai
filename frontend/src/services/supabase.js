import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseConfigError = supabase
  ? null
  : "Configurez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans le fichier .env.local.";

export const BUILDING_BUCKET = "building-documents";

export function toViewerBuilding(buildingJson, fallbackName) {
  const twin = buildingJson?.building;
  if (!Array.isArray(twin?.levels)) {
    throw new Error("Le résultat reçu ne contient pas de niveaux exploitables.");
  }

  const rooms = twin.levels.flatMap((level, levelIndex) =>
    (level.rooms || []).map((room, roomIndex) => ({
      id: room.id || `L${level.index ?? levelIndex}-R${roomIndex + 1}`,
      name: room.name || `Pièce ${roomIndex + 1}`,
      type: room.type || "other",
      floor: level.index ?? levelIndex,
      x: Number(room.x) || 0,
      y: Number(room.y) || 0,
      width: Number(room.w) || 1,
      length: Number(room.d) || 1,
      height: Number(level.height || twin.parameters?.floor_height) || 3,
      windows: 0,
      hasDoor: true,
    })),
  );

  if (!rooms.length) {
    throw new Error("Le résultat reçu ne contient aucune pièce.");
  }

  return {
    id: buildingJson.id || "generated-building",
    name: twin.meta?.name || buildingJson.summary?.project_name || fallbackName,
    floors: Number(twin.parameters?.floors) || twin.levels.length,
    rooms,
  };
}
