import { useState } from "react";
import Scene from "./components/Scene";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import { useBuildingFromServer } from "./hooks/useBuildingFromServer";
import { useBuildingUpload } from "./hooks/useBuildingUpload";
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
    replaceBuilding,
  } = useBuildingFromServer(mockBuilding);

  const [selectedId, setSelectedId] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [projectSummary, setProjectSummary] = useState(null);
  const [projectCurrency, setProjectCurrency] = useState("");
  const [addCounter, setAddCounter] = useState(0);
  const [currentFloor, setCurrentFloor] = useState("ALL");
  const [resetSignal, setResetSignal] = useState(0); // ⬅️ Jdid lel camera
  const { status, error: uploadError, projectId, isConfigured, uploadPdf } =
    useBuildingUpload();

  const selectedRoom = building.rooms.find((r) => r.id === selectedId) || null;

  const handleSelect = (id) => setSelectedId(id);
  const handleDeselect = () => setSelectedId(null);
  const handleUpload = () => {
    uploadPdf(selectedPdf, (newBuilding, summary, currency) => {
      replaceBuilding(newBuilding);
      setProjectSummary(summary);
      setProjectCurrency(currency);
      setSelectedId(null);
      setCurrentFloor("ALL");
      setResetSignal((signal) => signal + 1);
    });
  };

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
        <div style={styles.uploadSection}>
          <div style={styles.uploadTitle}>Nouveau bâtiment</div>
          <label style={styles.filePicker}>
            <span>{selectedPdf ? selectedPdf.name : "Choisir un cahier des charges (PDF)"}</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setSelectedPdf(file);
              }}
              style={styles.fileInput}
            />
          </label>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedPdf || !isConfigured || ["uploading", "uploaded", "processing"].includes(status)}
            style={{
              ...styles.uploadBtn,
              opacity: !selectedPdf || !isConfigured || ["uploading", "uploaded", "processing"].includes(status) ? 0.55 : 1,
              cursor: !selectedPdf || !isConfigured || ["uploading", "uploaded", "processing"].includes(status) ? "not-allowed" : "pointer",
            }}
          >
            {status === "uploading" ? "Envoi du PDF…" : "Envoyer et générer"}
          </button>
          {!isConfigured && (
            <div style={styles.uploadHint}>
              Configurez les variables Supabase dans <code>.env.local</code> pour activer l’envoi.
            </div>
          )}
          {["uploading", "uploaded", "processing"].includes(status) && (
            <div style={styles.processingStatus}>
              <span style={styles.smallSpinner} />
              {status === "uploading"
                ? "Envoi du document…"
                : status === "uploaded"
                  ? "Document envoyé — en attente de l’IA…"
                  : "L’IA analyse le document…"}
            </div>
          )}
          {status === "completed" && (
            <div style={styles.successStatus}>
              <div>{building.name} est prêt.</div>
              {projectSummary?.total_cost != null && (
                <div style={styles.summaryText}>
                  Coût estimé : {Number(projectSummary.total_cost).toLocaleString("fr-FR")}
                  {projectCurrency ? ` ${projectCurrency}` : ""}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setCurrentFloor("ALL");
                  setResetSignal((signal) => signal + 1);
                }}
                style={styles.viewBuildingBtn}
              >
                Voir le bâtiment 3D
              </button>
            </div>
          )}
          {status === "error" && uploadError && (
            <div role="alert" style={styles.uploadError}>{uploadError}</div>
          )}
          {projectId && status !== "completed" && (
            <div style={styles.uploadHint}>Référence du projet : {projectId}</div>
          )}
        </div>

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
    maxWidth: 320,
    maxHeight: "calc(100vh - 32px)",
    overflowY: "auto",
  },
  uploadSection: {
    paddingBottom: 12,
    marginBottom: 12,
    borderBottom: "1px solid #444",
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filePicker: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    background: "#111",
    border: "1px solid #555",
    borderRadius: 4,
    padding: "8px 10px",
    cursor: "pointer",
    marginBottom: 8,
  },
  fileInput: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
  },
  uploadBtn: {
    width: "100%",
    background: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "9px 10px",
    fontWeight: "bold",
  },
  uploadHint: {
    marginTop: 8,
    fontSize: 11,
    color: "#bbb",
    lineHeight: 1.4,
    overflowWrap: "anywhere",
  },
  processingStatus: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    color: "#f1c40f",
    fontSize: 12,
  },
  smallSpinner: {
    width: 14,
    height: 14,
    flex: "0 0 14px",
    border: "2px solid #555",
    borderTop: "2px solid #f1c40f",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  successStatus: {
    marginTop: 10,
    color: "#7bed9f",
    fontSize: 12,
    lineHeight: 1.5,
  },
  summaryText: {
    color: "#ddd",
    marginTop: 4,
  },
  viewBuildingBtn: {
    width: "100%",
    marginTop: 8,
    background: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "8px 10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  uploadError: {
    marginTop: 10,
    color: "#ffb3b3",
    background: "rgba(192, 57, 43, 0.2)",
    border: "1px solid #c0392b",
    borderRadius: 4,
    padding: 8,
    fontSize: 12,
    overflowWrap: "anywhere",
  },
};

export default App;
