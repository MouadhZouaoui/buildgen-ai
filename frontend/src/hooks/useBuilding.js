import { useState } from "react";

export function useBuilding(initialBuilding) {
  const [building, setBuilding] = useState(initialBuilding);

  // ✅ Modifier UNE room (par id)
  const updateRoom = (id, patch) => {
    setBuilding((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  };

  // ✅ Ajouter une room
  const addRoom = (room) => {
    setBuilding((prev) => ({
      ...prev,
      rooms: [...prev.rooms, room],
    }));
  };

  // ✅ Supprimer une room par id
  const removeRoom = (id) => {
    setBuilding((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((r) => r.id !== id),
    }));
  };

  // ✅ Remplacer tout le building
  const replaceBuilding = (newBuilding) => {
    setBuilding(newBuilding);
  };

  return {
    building,
    updateRoom,
    addRoom,
    removeRoom,
    replaceBuilding,
  };
}
