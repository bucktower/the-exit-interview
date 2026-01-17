import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createCoworkers, getCoworkerOffset, coworkerColors } from "./coworkerUtils";

interface CoworkersProps {
  bounds: number;
  count?: number;
  seed?: number;
}

export function Coworkers({ bounds, count = 8, seed = 42 }: CoworkersProps) {
  const groupRef = useRef<THREE.Group>(null);
  const heightScale = 1.2;

  const coworkers = useMemo(() => {
    return createCoworkers(count, bounds, seed);
  }, [bounds, count, seed]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      const coworker = coworkers[index];
      const offset = getCoworkerOffset(coworker, state.clock.elapsedTime);
      child.position.set(
        coworker.position[0] + offset.x,
        0,
        coworker.position[2] + offset.z
      );
      child.rotation.y = Math.atan2(offset.x, offset.z);
    });
  });

  return (
    <group ref={groupRef}>
      {coworkers.map((coworker, index) => (
        <group key={`coworker-${index}`} position={coworker.position}>
          <mesh position={[0, 0.9 * heightScale, 0]} castShadow>
            <capsuleGeometry args={[0.25, 0.9 * heightScale, 6, 12]} />
            <meshStandardMaterial color={coworkerColors[index % coworkerColors.length]} />
          </mesh>
          <mesh position={[0, 1.6 * heightScale, 0]} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#d8c3b5" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
