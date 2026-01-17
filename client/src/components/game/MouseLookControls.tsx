import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";

interface MouseLookControlsProps {
  enabled: boolean;
}

export function MouseLookControls({ enabled }: MouseLookControlsProps) {
  const { camera, gl } = useThree();
  const difficulty = useGame((state) => state.difficulty);
  const isLockedRef = useRef(false);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const eulerRef = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const sensitivity = 0.0025;

  useEffect(() => {
    if (!enabled) return;
    const startEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
    yawRef.current = startEuler.y;
    pitchRef.current = startEuler.x;
  }, [enabled, camera]);

  useEffect(() => {
    const element = gl.domElement;

    const onPointerLockChange = () => {
      isLockedRef.current = document.pointerLockElement === element;
    };

    const onPointerLockError = () => {
      isLockedRef.current = false;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!enabled || !isLockedRef.current) return;
      yawRef.current -= event.movementX * sensitivity;
      pitchRef.current -= event.movementY * sensitivity;
      const pitchLimit = Math.PI / 2 - 0.01;
      pitchRef.current = Math.max(-pitchLimit, Math.min(pitchLimit, pitchRef.current));
    };

    const requestLock = () => {
      if (!enabled) return;
      if (document.pointerLockElement !== element) {
        element.requestPointerLock().catch(() => {});
      }
    };

    element.addEventListener("click", requestLock);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("pointerlockerror", onPointerLockError);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      element.removeEventListener("click", requestLock);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("pointerlockerror", onPointerLockError);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [enabled, gl.domElement]);

  useEffect(() => {
    if (!enabled && document.pointerLockElement === gl.domElement) {
      document.exitPointerLock();
    }
  }, [enabled, gl.domElement]);

  useFrame(() => {
    if (!enabled) return;
    const wobbleStrength = difficulty > 0 ? 0.02 * difficulty : 0;
    const wobbleSpeed = 0.8 * difficulty + 0.8;
    const time = performance.now() * 0.001;
    const wobblePitch = Math.sin(time * wobbleSpeed) * wobbleStrength;
    const wobbleYaw = Math.sin(time * wobbleSpeed * 0.7) * wobbleStrength * 0.6;
    const wobbleRoll = Math.cos(time * wobbleSpeed * 1.3) * wobbleStrength * 0.8;
    eulerRef.current.set(
      pitchRef.current + wobblePitch,
      yawRef.current + wobbleYaw,
      wobbleRoll
    );
    camera.quaternion.setFromEuler(eulerRef.current);
  });

  return null;
}
