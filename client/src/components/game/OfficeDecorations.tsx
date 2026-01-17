import { useMemo } from "react";

interface DeskProps {
  position: [number, number, number];
  rotation?: number;
}

function Desk({ position, rotation = 0 }: DeskProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.6]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      <mesh position={[-0.5, 0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.5]} />
        <meshStandardMaterial color="#5c3d2e" />
      </mesh>
      <mesh position={[0.5, 0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.5]} />
        <meshStandardMaterial color="#5c3d2e" />
      </mesh>
      
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.4, 0.25, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#0066cc" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Chair({ position, rotation = 0 }: DeskProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.4]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0, 0.5, -0.15]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

function WaterCooler({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.5]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  );
}

interface OfficeDecorationsProps {
  scale?: number;
}

export function OfficeDecorations({ scale = 1 }: OfficeDecorationsProps) {
  const decorations = useMemo(() => {
    return {
      desks: [
        { position: [-12, 0, -12] as [number, number, number], rotation: 0 },
        { position: [-8, 0, -8] as [number, number, number], rotation: Math.PI / 2 },
        { position: [2, 0, -8] as [number, number, number], rotation: 0 },
        { position: [12, 0, -6] as [number, number, number], rotation: Math.PI },
        { position: [-10, 0, 4] as [number, number, number], rotation: 0 },
        { position: [2, 0, 0] as [number, number, number], rotation: Math.PI / 2 },
        { position: [12, 0, 10] as [number, number, number], rotation: Math.PI },
        { position: [-6, 0, 12] as [number, number, number], rotation: 0 },
      ],
      chairs: [
        { position: [-12, 0, -11] as [number, number, number], rotation: Math.PI },
        { position: [-7, 0, -8] as [number, number, number], rotation: -Math.PI / 2 },
        { position: [2, 0, -7] as [number, number, number], rotation: Math.PI },
        { position: [12, 0, -5] as [number, number, number], rotation: 0 },
        { position: [-10, 0, 5] as [number, number, number], rotation: Math.PI },
        { position: [3, 0, 0] as [number, number, number], rotation: -Math.PI / 2 },
        { position: [12, 0, 11] as [number, number, number], rotation: 0 },
        { position: [-6, 0, 13] as [number, number, number], rotation: Math.PI },
      ],
      waterCoolers: [
        [5, 0, -4] as [number, number, number],
        [-6, 0, 8] as [number, number, number],
      ],
      plants: [
        [-14, 0, -14] as [number, number, number],
        [14, 0, -14] as [number, number, number],
        [-14, 0, 14] as [number, number, number],
        [8, 0, 8] as [number, number, number],
        [-2, 0, -4] as [number, number, number],
      ],
    };
  }, []);

  const scalePosition = (pos: [number, number, number]) =>
    [pos[0] * scale, pos[1] * scale, pos[2] * scale] as [number, number, number];

  return (
    <group>
      {decorations.desks.map((desk, i) => (
        <Desk key={`desk-${i}`} position={scalePosition(desk.position)} rotation={desk.rotation} />
      ))}
      {decorations.chairs.map((chair, i) => (
        <Chair key={`chair-${i}`} position={scalePosition(chair.position)} rotation={chair.rotation} />
      ))}
      {decorations.waterCoolers.map((pos, i) => (
        <WaterCooler key={`cooler-${i}`} position={scalePosition(pos)} />
      ))}
      {decorations.plants.map((pos, i) => (
        <Plant key={`plant-${i}`} position={scalePosition(pos)} />
      ))}
    </group>
  );
}
