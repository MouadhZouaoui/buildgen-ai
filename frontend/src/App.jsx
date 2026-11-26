import { useState } from "react";
import Scene from "./components/Scene";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import { useBuildingFromServer } from "./hooks/useBuildingFromServer";
import { mockBuilding } from "./data/mockBuilding";

function App() {
  const {
    building,
    updateRoom,
    addRoom,
    removeRoom,
    loading,
    error,
    source,
    reload,
  } = useBuildingFromServer(mockBuilding);

  const [selectedId, setSelectedId] = useState(null);
  const [addCounter, setAddCounter] = useState(0);
  const [currentFloor, setCurrentFloor] = useState("ALL");
  const [resetSignal, setResetSignal] = useState(0); // ⬅️ Jdid lel camera

  const selectedRoom = building.rooms.find((r) => r.id === selectedId) || null;

  const handleSelect = (id) => setSelectedId(id);
  const handleDeselect = () => setSelectedId(null);

  const handleDelete = (id) => {
    removeRoom(id);
    setSelectedId(null);
  };

  const handleAdd = () => {
    const roomW = 8;
    const roomL = 8;
    const gap = 2;
    const cols = 4;
    const col = addCounter % cols;
    const row = Math.floor(addCounter / cols);

    addRoom({
      id: `r${Date.now()}-${addCounter}`,
      name: `Salle ${building.rooms.length + 1}`,
      type: "classroom",
      floor: 0,
      x: col * (roomW + gap),
      y: 40 + row * (roomL + gap),
      width: roomW,
      length: roomL,
      height: 3.5,
    });

    setAddCounter((c) => c + 1);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Scene
        building={building}
        selectedId={selectedId}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        currentFloor={currentFloor}
        resetSignal={resetSignal} // ⬅️ Jdid
      />

      {/* ── Loading overlay ── */}
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingBox}>
            <div style={styles.spinner}></div>
            <div style={{ marginTop: 16, fontSize: 15 }}>
              Chargement du bâtiment…
            </div>
          </div>
        </div>
      )}

      {/* ── Banner fallback ── */}
      {!loading && source === "fallback" && error && (
        <div style={styles.fallbackBanner}>
          <span style={{ marginRight: 12 }}>
            ⚠️ Backend indisponible — <b>Mode démo</b>
          </span>
          <button onClick={reload} style={styles.retryBtn}>
            Réessayer
          </button>
        </div>
      )}

      {/* ── Banner server OK ── */}
      {!loading && source === "server" && (
        <div style={styles.serverBanner}>✅ Connecté au serveur</div>
      )}

      {/* ── Panneau gauche ── */}
      <div style={styles.leftPanel}>
        <div style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>
          🏢 {building.name}
        </div>
        <div style={{ marginBottom: 10, opacity: 0.8 }}>
          {building.floors} étages · {building.rooms.length} pièces
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <button
            onClick={handleAdd}
            style={{ flex: 1, cursor: "pointer", padding: 4 }}
          >
            + Salle
          </button>
          {/* ⬅️ Bouton Reset Camera jdid */}
          <button
            onClick={() => setResetSignal((s) => s + 1)}
            style={{
              flex: 1,
              cursor: "pointer",
              padding: 4,
              background: "#333",
              color: "#fff",
              border: "1px solid #555",
              borderRadius: 4,
            }}
          >
            🔄 Caméra
          </button>
        </div>

        {/* ── Boutons de filtre d'étage ── */}
        <div
          style={{ marginTop: 12, borderTop: "1px solid #444", paddingTop: 12 }}
        >
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>
            ÉTAGE
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["ALL", 0, 1].map((f) => (
              <button
                key={f}
                onClick={() => setCurrentFloor(f)}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: 4,
                  cursor: "pointer",
                  border: "1px solid #555",
                  background: currentFloor === f ? "#4a90e2" : "#111",
                  color: "#fff",
                  fontSize: 12,
                }}
              >
                {f === "ALL" ? "Tous" : f === 0 ? "RDC" : "Étage 1"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sidebar droite ── */}
      <Sidebar
        room={selectedRoom}
        onUpdate={updateRoom}
        onDelete={handleDelete}
        onClose={handleDeselect}
      />

      {/* ── Chat Panel ── */}
      <ChatPanel onSendMock={(text) => console.log("Mock chat :", text)} />
    </div>
  );
}

const styles = {
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    fontFamily: "Arial, sans-serif",
    color: "#fff",
  },
  loadingBox: {
    background: "rgba(30,30,40,0.95)",
    padding: "32px 48px",
    borderRadius: 12,
    textAlign: "center",
    border: "1px solid #444",
  },
  spinner: {
    width: 40,
    height: 40,
    margin: "0 auto",
    border: "4px solid #333",
    borderTop: "4px solid #4a90e2",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  fallbackBanner: {
    position: "absolute",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#c0392b",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 8,
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    zIndex: 50,
  },
  retryBtn: {
    background: "#fff",
    color: "#c0392b",
    border: "none",
    borderRadius: 4,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: "bold",
    cursor: "pointer",
  },
  serverBanner: {
    position: "absolute",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(46,204,113,0.9)",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    zIndex: 50,
  },
  leftPanel: {
    position: "absolute",
    top: 16,
    left: 16,
    background: "rgba(0,0,0,0.75)",
    color: "#fff",
    padding: "14px 16px",
    borderRadius: 8,
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
    minWidth: 240,
  },
};

export default App;
