import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { createCoworkers, getCoworkerOffset } from "./coworkerUtils";

interface PlayerProps {
  position: [number, number, number];
  walls: { x: number; z: number; width: number; depth: number; height?: number }[];
  onReachExit: () => void;
  onHitCoworker: () => void;
  exitPosition: [number, number, number];
  coworkerBounds: number;
  coworkerCount: number;
  coworkerSeed: number;
  level: number;
}

export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

export function Player({
  position,
  walls,
  onReachExit,
  onHitCoworker,
  exitPosition,
  coworkerBounds,
  coworkerCount,
  coworkerSeed,
  level,
}: PlayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const leftLaserRef = useRef<THREE.Mesh>(null);
  const rightLaserRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef(new THREE.Vector3());
  const hasCoworkerHitRef = useRef(false);
  const [, getState] = useKeyboardControls<Controls>();
  const { camera } = useThree();
  
  const SPEED = 6;
  const ACCELERATION = 14;
  const PLAYER_RADIUS = 0.4;
  const EYE_HEIGHT = 1.6;
  const LASER_MAX = 80;
  const CEILING_HEIGHT = 5;
  const LASER_SEPARATION = 0.1;
  const COWORKER_HIT_RADIUS = 0.4;
  const COWORKER_CENTER_Y = 0.9;

  const coworkers = useRef(createCoworkers(coworkerCount, coworkerBounds, coworkerSeed));

  useEffect(() => {
    coworkers.current = createCoworkers(coworkerCount, coworkerBounds, coworkerSeed);
    hasCoworkerHitRef.current = false;
  }, [coworkerBounds, coworkerCount, coworkerSeed, level]);

  const rayIntersectAABB = (
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    min: THREE.Vector3,
    max: THREE.Vector3
  ): number | null => {
    let tMin = -Infinity;
    let tMax = Infinity;

    for (const axis of ["x", "y", "z"] as const) {
      const o = origin[axis];
      const d = direction[axis];
      const minVal = min[axis];
      const maxVal = max[axis];

      if (Math.abs(d) < 1e-6) {
        if (o < minVal || o > maxVal) return null;
      } else {
        const t1 = (minVal - o) / d;
        const t2 = (maxVal - o) / d;
        const tNear = Math.min(t1, t2);
        const tFar = Math.max(t1, t2);
        tMin = Math.max(tMin, tNear);
        tMax = Math.min(tMax, tFar);
        if (tMin > tMax) return null;
      }
    }

    if (tMax < 0) return null;
    return tMin >= 0 ? tMin : tMax;
  };

  const intersectPlane = (
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    planeY: number
  ): number | null => {
    if (Math.abs(direction.y) < 1e-6) return null;
    const t = (planeY - origin.y) / direction.y;
    return t > 0 ? t : null;
  };

  const intersectSphere = (
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    center: THREE.Vector3,
    radius: number
  ): number | null => {
    const oc = origin.clone().sub(center);
    const b = oc.dot(direction);
    const c = oc.dot(oc) - radius * radius;
    const discriminant = b * b - c;
    if (discriminant < 0) return null;
    const sqrt = Math.sqrt(discriminant);
    const t1 = -b - sqrt;
    const t2 = -b + sqrt;
    if (t1 > 0) return t1;
    if (t2 > 0) return t2;
    return null;
  };

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

    const beamDirection = new THREE.Vector3();
    camera.getWorldDirection(beamDirection);
    beamDirection.normalize();

    const beamRight = new THREE.Vector3().crossVectors(beamDirection, camera.up).normalize();
    const eyeYOffset = EYE_HEIGHT - 0.1;

    const updateLaser = (laser: THREE.Mesh | null, offset: number) => {
      if (!laser) return;
      const beamOrigin = new THREE.Vector3(
        playerPos.x + beamRight.x * offset,
        playerPos.y + eyeYOffset,
        playerPos.z + beamRight.z * offset
      );

      let hitDistance = LASER_MAX;
      let hitCoworker = false;

      for (const wall of walls) {
        const height = wall.height ?? 2;
        const min = new THREE.Vector3(
          wall.x - wall.width / 2,
          0,
          wall.z - wall.depth / 2
        );
        const max = new THREE.Vector3(
          wall.x + wall.width / 2,
          height,
          wall.z + wall.depth / 2
        );
        const distance = rayIntersectAABB(beamOrigin, beamDirection, min, max);
        if (distance !== null && distance < hitDistance) {
          hitDistance = distance;
        }
      }

      for (const coworker of coworkers.current) {
        const offset = getCoworkerOffset(coworker, state.clock.elapsedTime);
        const center = new THREE.Vector3(
          coworker.position[0] + offset.x,
          COWORKER_CENTER_Y,
          coworker.position[2] + offset.z
        );
        const distance = intersectSphere(beamOrigin, beamDirection, center, COWORKER_HIT_RADIUS);
        if (distance !== null && distance < hitDistance) {
          hitDistance = distance;
          hitCoworker = true;
        }
      }

      const floorHit = intersectPlane(beamOrigin, beamDirection, 0);
      if (floorHit !== null && floorHit < hitDistance) {
        hitDistance = floorHit;
        hitCoworker = false;
      }

      const ceilingHit = intersectPlane(beamOrigin, beamDirection, CEILING_HEIGHT);
      if (ceilingHit !== null && ceilingHit < hitDistance) {
        hitDistance = ceilingHit;
        hitCoworker = false;
      }

      const beamCenter = beamOrigin
        .clone()
        .add(beamDirection.clone().multiplyScalar(hitDistance / 2));
      laser.position.copy(beamCenter);
      laser.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        beamDirection
      );
      laser.scale.set(1, hitDistance, 1);

      if (hitCoworker && !hasCoworkerHitRef.current) {
        hasCoworkerHitRef.current = true;
        onHitCoworker();
      }
    };

    updateLaser(leftLaserRef.current, -LASER_SEPARATION);
    updateLaser(rightLaserRef.current, LASER_SEPARATION);
  });

  return (
    <group>
      <mesh ref={meshRef} position={position} castShadow visible={false}>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color="#4287f5" />
      </mesh>
      <mesh ref={leftLaserRef}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial
          color="#ff2a2a"
          emissive="#ff2a2a"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh ref={rightLaserRef}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial
          color="#ff2a2a"
          emissive="#ff2a2a"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}
