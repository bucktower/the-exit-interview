import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";

interface PlayerProps {
  position: [number, number, number];
  walls: { x: number; z: number; width: number; depth: number }[];
  onReachExit: () => void;
  exitPosition: [number, number, number];
}

export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

export function Player({ position, walls, onReachExit, exitPosition }: PlayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef(new THREE.Vector3());
  const [, getState] = useKeyboardControls<Controls>();
  
  const SPEED = 5;
  const PLAYER_RADIUS = 0.4;

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
    }
  }, [position]);

  const checkCollision = (newX: number, newZ: number): boolean => {
    for (const wall of walls) {
      const halfWidth = wall.width / 2 + PLAYER_RADIUS;
      const halfDepth = wall.depth / 2 + PLAYER_RADIUS;
      
      if (
        newX > wall.x - halfWidth &&
        newX < wall.x + halfWidth &&
        newZ > wall.z - halfDepth &&
        newZ < wall.z + halfDepth
      ) {
        return true;
      }
    }
    return false;
  };

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const controls = getState();
    const direction = new THREE.Vector3();

    if (controls.forward) direction.z -= 1;
    if (controls.back) direction.z += 1;
    if (controls.left) direction.x -= 1;
    if (controls.right) direction.x += 1;

    if (direction.length() > 0) {
      direction.normalize();
      velocityRef.current.copy(direction).multiplyScalar(SPEED * delta);

      const currentPos = meshRef.current.position;
      const newX = currentPos.x + velocityRef.current.x;
      const newZ = currentPos.z + velocityRef.current.z;

      if (!checkCollision(newX, currentPos.z)) {
        currentPos.x = newX;
      }
      if (!checkCollision(currentPos.x, newZ)) {
        currentPos.z = newZ;
      }
    }

    const playerPos = meshRef.current.position;
    const distanceToExit = Math.sqrt(
      Math.pow(playerPos.x - exitPosition[0], 2) +
      Math.pow(playerPos.z - exitPosition[2], 2)
    );

    if (distanceToExit < 1.5) {
      onReachExit();
    }

    state.camera.position.set(
      playerPos.x,
      playerPos.y + 8,
      playerPos.z + 6
    );
    state.camera.lookAt(playerPos.x, playerPos.y, playerPos.z);
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
      <meshStandardMaterial color="#4287f5" />
    </mesh>
  );
}
