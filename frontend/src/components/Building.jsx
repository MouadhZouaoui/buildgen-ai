import Room from "./Room";

function Building({ building, selectedId, onSelect, currentFloor }) {
  // Filtrage : Si "ALL", on affiche tout. Sinon, on affiche que l'étage sélectionné.
  const visibleRooms = building.rooms.filter(
    (r) => currentFloor === "ALL" || r.floor === currentFloor,
  );

  return (
    <>
      {visibleRooms.map((room) => (
        <Room
          key={room.id}
          room={room}
          isSelected={selectedId === room.id}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export default Building;
