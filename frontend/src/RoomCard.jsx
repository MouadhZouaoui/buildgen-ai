function RoomCard(props) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        margin: "8px 0",
        background: "#f9f9f9",
      }}
    >
      <h3>{props.name}</h3>
      <p>Type : {props.type}</p>
      <p>Surface : {props.width * props.length} m²</p>
    </div>
  );
}

export default RoomCard;
