import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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
  const { camera } = useThree();
  
  const SPEED = 5;
  const ACCELERATION = 14;
  const PLAYER_RADIUS = 0.4;
  const EYE_HEIGHT = 1.6;

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
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() > 0) {
      forward.normalize();
    } else {
      forward.set(0, 0, -1);
    }
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
    const direction = new THREE.Vector3();

    if (controls.forward) direction.add(forward);
    if (controls.back) direction.sub(forward);
    if (controls.left) direction.sub(right);
    if (controls.right) direction.add(right);

    if (direction.length() > 0) {
      direction.normalize();
    }

    const desiredVelocity = direction.multiplyScalar(SPEED);
    const damping = 1 - Math.exp(-ACCELERATION * delta);
    velocityRef.current.lerp(desiredVelocity, damping);

    const currentPos = meshRef.current.position;
    const newX = currentPos.x + velocityRef.current.x * delta;
    const newZ = currentPos.z + velocityRef.current.z * delta;

    if (!checkCollision(newX, currentPos.z)) {
      currentPos.x = newX;
    }
    if (!checkCollision(currentPos.x, newZ)) {
      currentPos.z = newZ;
    }

    const playerPos = meshRef.current.position;
    const distanceToExit = Math.sqrt(
      Math.pow(playerPos.x - exitPosition[0], 2) +
      Math.pow(playerPos.z - exitPosition[2], 2)
    );

    if (distanceToExit < 1.5) {
      onReachExit();
    }

    camera.position.set(
      playerPos.x,
      playerPos.y + EYE_HEIGHT,
      playerPos.z
    );
  });

  return (
    <mesh ref={meshRef} position={position} castShadow visible={false}>
      <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
      <meshStandardMaterial color="#4287f5" />
    </mesh>
  );
}
