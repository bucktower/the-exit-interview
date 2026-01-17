import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MutableRefObject, TouchEvent } from "react";

interface TouchControlsProps {
  enabled: boolean;
  moveRef: MutableRefObject<THREE.Vector2>;
  lookRef: MutableRefObject<THREE.Vector2>;
}

export function TouchControls({ enabled, moveRef, lookRef }: TouchControlsProps) {
  const leftIdRef = useRef<number | null>(null);
  const rightIdRef = useRef<number | null>(null);
  const leftStartRef = useRef({ x: 0, y: 0 });
  const rightLastRef = useRef({ x: 0, y: 0 });
  const radius = 60;
  const lookSensitivity = 0.004;

  useEffect(() => {
    if (!enabled) {
      moveRef.current.set(0, 0);
      lookRef.current.set(0, 0);
    }
  }, [enabled, moveRef, lookRef]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const midX = window.innerWidth / 2;
    Array.from(event.changedTouches).forEach((touch) => {
      if (touch.clientX < midX && leftIdRef.current === null) {
        leftIdRef.current = touch.identifier;
        leftStartRef.current = { x: touch.clientX, y: touch.clientY };
      } else if (touch.clientX >= midX && rightIdRef.current === null) {
        rightIdRef.current = touch.identifier;
        rightLastRef.current = { x: touch.clientX, y: touch.clientY };
      }
    });
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (!enabled) return;
    Array.from(event.changedTouches).forEach((touch) => {
      if (touch.identifier === leftIdRef.current) {
        const dx = touch.clientX - leftStartRef.current.x;
        const dy = touch.clientY - leftStartRef.current.y;
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy), radius);
        const angle = Math.atan2(dy, dx);
        moveRef.current.set(
          (Math.cos(angle) * distance) / radius,
          (Math.sin(angle) * distance) / radius
        );
      } else if (touch.identifier === rightIdRef.current) {
        const dx = touch.clientX - rightLastRef.current.x;
        const dy = touch.clientY - rightLastRef.current.y;
        lookRef.current.x += dx * lookSensitivity;
        lookRef.current.y += dy * lookSensitivity;
        rightLastRef.current = { x: touch.clientX, y: touch.clientY };
      }
    });
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    Array.from(event.changedTouches).forEach((touch) => {
      if (touch.identifier === leftIdRef.current) {
        leftIdRef.current = null;
        moveRef.current.set(0, 0);
      } else if (touch.identifier === rightIdRef.current) {
        rightIdRef.current = null;
      }
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        touchAction: "none",
        pointerEvents: enabled ? "auto" : "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        style={{
          position: "absolute",
          left: "6%",
          bottom: "8%",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.25)",
          backgroundColor: "rgba(255,255,255,0.05)",
          display: enabled ? "block" : "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "6%",
          bottom: "8%",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.25)",
          backgroundColor: "rgba(255,255,255,0.05)",
          display: enabled ? "block" : "none",
        }}
      />
    </div>
  );
}
