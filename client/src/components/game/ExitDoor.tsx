import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ExitDoorProps {
  position: [number, number, number];
}

export function ExitDoor({ position }: ExitDoorProps) {
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[1.5, 2.5, 0.2]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      
      <mesh position={[0.5, 1.2, 0.15]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh ref={glowRef} position={[0, 1.25, -0.3]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
      </mesh>
      
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[2, 0.5, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      <pointLight position={[0, 1.5, 1]} color="#00ff00" intensity={2} distance={5} />
    </group>
  );
}
