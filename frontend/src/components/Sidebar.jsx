function Sidebar({ room, onUpdate, onDelete, onClose }) {
  if (!room) return null;

  const surface = (room.width * room.length).toFixed(1);

  // Calculer el maximum mta3 les fenetres elli el 7it ytnajem y7othom
  // El périmètre kemel = (width * 2) + (length * 2). Kol fenetre te5ou 2.5m espaces.
  const maxWindows = Math.floor((room.width * 2 + room.length * 2) / 2.5);

  const numChange = (field) => (e) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v > 0) onUpdate(room.id, { [field]: v });
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h2 style={styles.title}>{room.name}</h2>
        <button style={styles.closeBtn} onClick={onClose}>
          ×
        </button>
      </div>

      <div style={styles.badge}>{room.type}</div>

      <div style={styles.section}>
        <label style={styles.label}>Nom</label>
        <input
          style={styles.input}
          type="text"
          value={room.name}
          onChange={(e) => onUpdate(room.id, { name: e.target.value })}
        />
      </div>

      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label}>Largeur (m)</label>
          <input
            style={styles.input}
            type="number"
            min="1"
            step="0.5"
            value={room.width}
            onChange={numChange("width")}
          />
        </div>
        <div style={styles.col}>
          <label style={styles.label}>Longueur (m)</label>
          <input
            style={styles.input}
            type="number"
            min="1"
            step="0.5"
            value={room.length}
            onChange={numChange("length")}
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label}>Hauteur (m)</label>
          <input
            style={styles.input}
            type="number"
            min="2"
            step="0.1"
            value={room.height}
            onChange={numChange("height")}
          />
        </div>
        <div style={styles.col}>
          <label style={styles.label}>Étage</label>
          <input
            style={styles.input}
            type="number"
            min="0"
            step="1"
            value={room.floor}
            onChange={numChange("floor")}
          />
        </div>
      </div>

      <div
        style={{ marginTop: 12, borderTop: "1px solid #333", paddingTop: 12 }}
      >
        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Fenêtres (Max: {maxWindows})</label>
            <input
              style={styles.input}
              type="number"
              min="0"
              max={maxWindows} // ⬅️ N7ottou el limite houni
              value={room.windows || 0}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onUpdate(room.id, { windows: Math.min(val, maxWindows) });
              }}
            />
          </div>
          <div
            style={{
              ...styles.col,
              justifyContent: "flex-end",
              paddingBottom: 8,
            }}
          >
            <label
              style={{
                ...styles.label,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={room.hasDoor !== false}
                onChange={(e) =>
                  onUpdate(room.id, { hasDoor: e.target.checked })
                }
                style={{ marginRight: 8, transform: "scale(1.2)" }}
              />
              Porte
            </label>
          </div>
        </div>
      </div>

      <div style={styles.info}>
        Surface : <b>{surface} m²</b>
      </div>

      <button style={styles.deleteBtn} onClick={() => onDelete(room.id)}>
        🗑 Supprimer cette pièce
      </button>
    </div>
  );
}

const styles = {
  panel: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 300,
    maxHeight: "calc(100vh - 32px)",
    overflowY: "auto",
    background: "rgba(20, 20, 25, 0.95)",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: 12,
    padding: 20,
    fontFamily: "Arial, sans-serif",
    fontSize: 14,
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: "bold", margin: 0 },
  closeBtn: {
    background: "transparent",
    color: "#aaa",
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    lineHeight: 1,
    padding: "0 4px",
  },
  badge: {
    display: "inline-block",
    background: "#2a3a55",
    color: "#8fb3d9",
    padding: "2px 10px",
    borderRadius: 12,
    fontSize: 12,
    marginBottom: 16,
  },
  section: { marginBottom: 16 },
  row: { display: "flex", gap: 12, marginBottom: 12 },
  col: { flex: 1, display: "flex", flexDirection: "column" },
  label: {
    fontSize: 11,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  input: {
    background: "#111",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 14,
    outline: "none",
    width: "100%",
  },
  info: {
    marginTop: 8,
    padding: "10px 12px",
    background: "#1a1a25",
    borderRadius: 8,
    fontSize: 13,
  },
  deleteBtn: {
    width: "100%",
    marginTop: 20,
    background: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 12px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Sidebar;
