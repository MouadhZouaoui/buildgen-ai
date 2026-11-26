import { Canvas, useThree } from "@react-three/fiber";
import { Grid, OrbitControls, ContactShadows, Text } from "@react-three/drei";
import { useRef, useEffect } from "react";
import Building from "./Building";

function Scene({
  building,
  selectedId,
  onSelect,
  onDeselect,
  currentFloor,
  resetSignal,
}) {
  const controlsRef = useRef();

  // Ki tetbaddel resetSignal, el camera terja3 l blast'ha
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [resetSignal]);

  return (
    <Canvas
      camera={{ position: [25, 22, 25], fov: 50 }}
      onPointerMissed={onDeselect}
      shadows
      style={{ background: "#1a1a24" }}
    >
      <directionalLight
        position={[20, 30, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <ambientLight intensity={0.6} />

      {/* Boussole (Nord / Est) 3al sol */}
      <Text
        position={[0, 0, -40]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={2.5}
        color="#ff4444"
      >
        NORD ↑
      </Text>
      <Text
        position={[40, 0, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={2.5}
        color="#888"
      >
        EST →
      </Text>

      <Grid
        args={[100, 100]}
        cellSize={1}
        cellColor="#444"
        sectionSize={5}
        sectionColor="#666"
        fadeDistance={80}
        infiniteGrid
        position={[0, -0.01, 0]}
      />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.6}
        scale={80}
        blur={2}
        far={10}
      />

      <Building
        building={building}
        selectedId={selectedId}
        onSelect={onSelect}
        currentFloor={currentFloor}
      />

      <OrbitControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={10}
        maxDistance={80}
      />
    </Canvas>
  );
}

export default Scene;
