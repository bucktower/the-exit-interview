import * as THREE from "three";

export interface CoworkerData {
  position: [number, number, number];
  speed: number;
  radius: number;
  phase: number;
}

export const coworkerColors = ["#9fa4a8", "#b7b0a6", "#a8b6bf", "#c1b4a1"];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function createCoworkers(count: number, bounds: number, seed = 42): CoworkerData[] {
  const rand = seededRandom(seed);
  const list: CoworkerData[] = [];
  const borderChance = 0.35;
  const borderInset = 0.8;
  for (let i = 0; i < count; i += 1) {
    let x = -bounds + rand() * bounds * 2;
    let z = -bounds + rand() * bounds * 2;
    if (rand() < borderChance) {
      const side = Math.floor(rand() * 4);
      const edge = bounds - borderInset;
      if (side === 0) {
        x = -edge;
        z = -bounds + rand() * bounds * 2;
      } else if (side === 1) {
        x = edge;
        z = -bounds + rand() * bounds * 2;
      } else if (side === 2) {
        z = -edge;
        x = -bounds + rand() * bounds * 2;
      } else {
        z = edge;
        x = -bounds + rand() * bounds * 2;
      }
    }
    list.push({
      position: [x, 0, z],
      speed: 0.6 + rand() * 0.8,
      radius: 0.8 + rand() * 0.8,
      phase: rand() * Math.PI * 2,
    });
  }
  return list;
}

export function getCoworkerOffset(coworker: CoworkerData, time: number): THREE.Vector3 {
  const t = time * coworker.speed + coworker.phase;
  return new THREE.Vector3(
    Math.cos(t) * coworker.radius,
    0,
    Math.sin(t * 0.9) * coworker.radius
  );
}
