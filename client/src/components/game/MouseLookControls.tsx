import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface MouseLookControlsProps {
  enabled: boolean;
}

export function MouseLookControls({ enabled }: MouseLookControlsProps) {
  const { camera, gl } = useThree();
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
    eulerRef.current.set(pitchRef.current, yawRef.current, 0);
    camera.quaternion.setFromEuler(eulerRef.current);
  });

  return null;
}
