import { Text, Edges } from "@react-three/drei";
import { COLORS, DEFAULT_COLOR, FLOOR_HEIGHT } from "../constants";

function Room({ room, isSelected, onSelect }) {
  const { id, name, type, x, y, width, length, height, floor } = room;
  const color = COLORS[type] || DEFAULT_COLOR;

  const wallThickness = 0.2;
  const floorThickness = 0.15;
  const doorWidth = room.hasDoor === false ? 0 : 1.5;

  // On divise le nombre total de fenêtres sur les 4 murs
  const totalWindows = room.windows || 0;
  const winPerWall = Math.floor(totalWindows / 4);
  const remainder = totalWindows % 4;

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(id);
  };

  // Fonction bech trssem fenetres 3al 7it
  const renderWindows = (
    wallLength,
    winCount,
    rotation = [0, 0, 0],
    positionOffset = [0, 0, 0],
  ) => {
    if (winCount === 0) return null;
    const gap = wallLength / (winCount + 1);
    return Array.from({ length: winCount }).map((_, i) => {
      const winX = -wallLength / 2 + gap * (i + 1);
      return (
        <group key={`win-${i}`} position={positionOffset} rotation={rotation}>
          <mesh position={[winX, height / 4, 0]} castShadow>
            <boxGeometry
              args={[Math.min(1.5, gap - 0.5), 1.2, wallThickness + 0.05]}
            />
            <meshStandardMaterial
              color="#87ceeb"
              transparent
              opacity={0.5}
              metalness={0.8}
              roughness={0.1}
            />
            <Edges scale={1} color="#222" />
          </mesh>
        </group>
      );
    });
  };

  return (
    <group
      position={[
        x + width / 2,
        floor * FLOOR_HEIGHT + height / 2,
        y + length / 2,
      ]}
    >
      <group onClick={handleClick}>
        {/* Plancher */}
        <mesh position={[0, -height / 2 + floorThickness / 2, 0]} receiveShadow>
          <boxGeometry args={[width, floorThickness, length]} />
          <meshStandardMaterial color="#d1d5db" />
          <Edges scale={1} threshold={15} color="#555" />
        </mesh>

        {/* 1. El 7it l'kholfa (Back Wall) */}
        <mesh
          position={[0, 0, -length / 2 + wallThickness / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[width, height, wallThickness]} />
          <meshStandardMaterial color={color} transparent opacity={0.7} />
          <Edges
            scale={1}
            threshold={15}
            color={isSelected ? "#ffd700" : "#222"}
          />
        </mesh>
        {renderWindows(
          width,
          winPerWall,
          [0, 0, 0],
          [0, 0, -length / 2 + wallThickness / 2],
        )}

        {/* 2. El 7it limin yesser (Left Wall) */}
        <mesh
          position={[-width / 2 + wallThickness / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, height, length]} />
          <meshStandardMaterial color={color} transparent opacity={0.7} />
          <Edges
            scale={1}
            threshold={15}
            color={isSelected ? "#ffd700" : "#222"}
          />
        </mesh>
        {renderWindows(
          length,
          winPerWall,
          [0, Math.PI / 2, 0],
          [-width / 2 + wallThickness / 2, 0, 0],
        )}

        {/* 3. El 7it limin yamin (Right Wall) */}
        <mesh
          position={[width / 2 - wallThickness / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, height, length]} />
          <meshStandardMaterial color={color} transparent opacity={0.7} />
          <Edges
            scale={1}
            threshold={15}
            color={isSelected ? "#ffd700" : "#222"}
          />
        </mesh>
        {renderWindows(
          length,
          winPerWall,
          [0, -Math.PI / 2, 0],
          [width / 2 - wallThickness / 2, 0, 0],
        )}

        {/* 4. El 7it l9odem (Front Wall) m3a Porte w Fenetres */}
        <group position={[0, 0, length / 2 - wallThickness / 2]}>
          {/* Morceau mta3 7it elli fih porte w fenetres */}
          {!doorWidth ? (
            <mesh castShadow receiveShadow>
              <boxGeometry args={[width, height, wallThickness]} />
              <meshStandardMaterial color={color} transparent opacity={0.7} />
              <Edges
                scale={1}
                threshold={15}
                color={isSelected ? "#ffd700" : "#222"}
              />
            </mesh>
          ) : (
            <>
              {/* Morceau 3la jnab el porte (yesser) */}
              <mesh
                position={[-(width - doorWidth) / 4 - doorWidth / 4, 0, 0]}
                castShadow
                receiveShadow
              >
                <boxGeometry
                  args={[(width - doorWidth) / 2, height, wallThickness]}
                />
                <meshStandardMaterial color={color} transparent opacity={0.7} />
                <Edges
                  scale={1}
                  threshold={15}
                  color={isSelected ? "#ffd700" : "#222"}
                />
              </mesh>
              {/* Morceau 3la jnab el porte (yamin) */}
              <mesh
                position={[(width - doorWidth) / 4 + doorWidth / 4, 0, 0]}
                castShadow
                receiveShadow
              >
                <boxGeometry
                  args={[(width - doorWidth) / 2, height, wallThickness]}
                />
                <meshStandardMaterial color={color} transparent opacity={0.7} />
                <Edges
                  scale={1}
                  threshold={15}
                  color={isSelected ? "#ffd700" : "#222"}
                />
              </mesh>
              {/* 7it lfo9 el porte */}
              <mesh
                position={[0, height / 2 - 0.5, 0]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[doorWidth, 1, wallThickness]} />
                <meshStandardMaterial color={color} transparent opacity={0.7} />
                <Edges
                  scale={1}
                  threshold={15}
                  color={isSelected ? "#ffd700" : "#222"}
                />
              </mesh>
              {/* El Porte */}
              <mesh position={[0, -height / 2 + 1.05, 0]} castShadow>
                <boxGeometry
                  args={[doorWidth - 0.1, 2.1, wallThickness + 0.05]}
                />
                <meshStandardMaterial color="#5c4033" />
                <Edges scale={1} color="#222" />
              </mesh>
            </>
          )}
          {/* Fenetres 3al 7it l9odem (ken ba9i 3andna remainder) */}
          {renderWindows(width, winPerWall + remainder)}
        </group>
      </group>

      <Text
        position={[0, height / 2 + 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.8}
        color={isSelected ? "#ffd700" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
}

export default Room;
