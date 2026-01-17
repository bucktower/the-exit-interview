import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Coworker {
  position: [number, number, number];
  speed: number;
  radius: number;
  phase: number;
}

const coworkerColors = ["#9fa4a8", "#b7b0a6", "#a8b6bf", "#c1b4a1"];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

interface CoworkersProps {
  scale?: number;
}

export function Coworkers({ scale = 1 }: CoworkersProps) {
  const groupRef = useRef<THREE.Group>(null);

  const coworkers = useMemo(() => {
    const rand = seededRandom(42);
    const list: Coworker[] = [];
    const count = 8;
    const bounds = 12 * scale;
    for (let i = 0; i < count; i += 1) {
      const x = -bounds + rand() * bounds * 2;
      const z = -bounds + rand() * bounds * 2;
      list.push({
        position: [x, 0, z],
        speed: 0.6 + rand() * 0.8,
        radius: 0.8 + rand() * 0.8,
        phase: rand() * Math.PI * 2,
      });
    }
    return list;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      const coworker = coworkers[index];
      const t = state.clock.elapsedTime * coworker.speed + coworker.phase;
      const offsetX = Math.cos(t) * coworker.radius;
      const offsetZ = Math.sin(t * 0.9) * coworker.radius;
      child.position.set(
        coworker.position[0] + offsetX,
        0,
        coworker.position[2] + offsetZ
      );
      child.rotation.y = Math.atan2(offsetX, offsetZ);
    });
  });

  return (
    <group ref={groupRef}>
      {coworkers.map((coworker, index) => (
        <group key={`coworker-${index}`} position={coworker.position}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <capsuleGeometry args={[0.25, 0.9, 6, 12]} />
            <meshStandardMaterial color={coworkerColors[index % coworkerColors.length]} />
          </mesh>
          <mesh position={[0, 1.6, 0]} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#d8c3b5" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
