
interface WallData {
  x: number;
  z: number;
  width: number;
  depth: number;
  height?: number;
}

interface MazeProps {
  walls: WallData[];
}

const WALL_THICKNESS = 0.3;

const baseLayout: WallData[] = [
  { x: -10, z: -10, width: 8, depth: WALL_THICKNESS },
  { x: -10, z: -10, width: WALL_THICKNESS, depth: 6 },
  { x: -4, z: -12, width: WALL_THICKNESS, depth: 6 },
  { x: -4, z: -6, width: 6, depth: WALL_THICKNESS },
  { x: 4, z: -10, width: 8, depth: WALL_THICKNESS },
  { x: 8, z: -7, width: WALL_THICKNESS, depth: 6 },
  { x: 10, z: -2, width: 10, depth: WALL_THICKNESS },
  { x: -8, z: -2, width: 10, depth: WALL_THICKNESS },
  { x: -12, z: 2, width: WALL_THICKNESS, depth: 8 },
  { x: -4, z: 2, width: WALL_THICKNESS, depth: 10 },
  { x: 0, z: 6, width: 8, depth: WALL_THICKNESS },
  { x: 6, z: 4, width: 8, depth: WALL_THICKNESS },
  { x: 10, z: 7, width: WALL_THICKNESS, depth: 6 },
  { x: -8, z: 10, width: 8, depth: WALL_THICKNESS },
  { x: 4, z: 10, width: 6, depth: WALL_THICKNESS },
  { x: 7, z: 12, width: WALL_THICKNESS, depth: 4 },
];

const levelExtras: WallData[][] = [
  [],
  [
    { x: -2, z: -14, width: 6, depth: WALL_THICKNESS },
    { x: 2, z: -8, width: WALL_THICKNESS, depth: 6 },
    { x: 12, z: 2, width: WALL_THICKNESS, depth: 8 },
  ],
  [
    { x: -14, z: -6, width: WALL_THICKNESS, depth: 8 },
    { x: -2, z: 8, width: 6, depth: WALL_THICKNESS },
    { x: 6, z: 12, width: 6, depth: WALL_THICKNESS },
  ],
  [
    { x: -6, z: -2, width: 6, depth: WALL_THICKNESS },
    { x: 2, z: 2, width: WALL_THICKNESS, depth: 8 },
    { x: 12, z: -12, width: WALL_THICKNESS, depth: 6 },
  ],
  [
    { x: -12, z: 12, width: 6, depth: WALL_THICKNESS },
    { x: 0, z: -4, width: 8, depth: WALL_THICKNESS },
    { x: 12, z: 8, width: 8, depth: WALL_THICKNESS },
  ],
  [
    { x: -6, z: 6, width: WALL_THICKNESS, depth: 8 },
    { x: 6, z: -6, width: WALL_THICKNESS, depth: 8 },
    { x: -2, z: 12, width: 6, depth: WALL_THICKNESS },
  ],
  [
    { x: -12, z: -12, width: 6, depth: WALL_THICKNESS },
    { x: 0, z: 0, width: 8, depth: WALL_THICKNESS },
    { x: 12, z: -4, width: 6, depth: WALL_THICKNESS },
  ],
  [
    { x: -4, z: -4, width: WALL_THICKNESS, depth: 8 },
    { x: 4, z: 8, width: WALL_THICKNESS, depth: 8 },
    { x: -10, z: 4, width: 8, depth: WALL_THICKNESS },
  ],
  [
    { x: -14, z: 0, width: WALL_THICKNESS, depth: 8 },
    { x: 6, z: -12, width: 8, depth: WALL_THICKNESS },
    { x: 8, z: 2, width: WALL_THICKNESS, depth: 8 },
  ],
  [
    { x: -10, z: 14, width: 8, depth: WALL_THICKNESS },
    { x: 0, z: -8, width: WALL_THICKNESS, depth: 8 },
    { x: 10, z: -6, width: 6, depth: WALL_THICKNESS },
  ],
];

function CubicleWall({ x, z, width, depth, height }: WallData) {
  const wallHeight = height ?? 2;
  
  return (
    <mesh position={[x, wallHeight / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[width, wallHeight, depth]} />
      <meshStandardMaterial color="#f1f1f1" />
    </mesh>
  );
}

export function generateMazeLayout(level = 0): WallData[] {
  const extras = levelExtras[level % levelExtras.length] ?? [];
  return [...baseLayout, ...extras];
}

export function generateBorderWalls(size: number, height = 4): WallData[] {
  const half = size / 2;
  return [
    { x: 0, z: -half, width: size, depth: WALL_THICKNESS, height },
    { x: 0, z: half, width: size, depth: WALL_THICKNESS, height },
    { x: -half, z: 0, width: WALL_THICKNESS, depth: size, height },
    { x: half, z: 0, width: WALL_THICKNESS, depth: size, height },
  ];
}

export function generateBorderBlockers(
  size: number,
  spacing = 10,
  blockerLength = 4
): WallData[] {
  const half = size / 2;
  const walls: WallData[] = [];
  const start = -half + spacing;
  const end = half - spacing;
  const inwardOffset = blockerLength / 2 + WALL_THICKNESS;

  for (let x = start; x <= end; x += spacing) {
    walls.push({
      x,
      z: -half + inwardOffset,
      width: WALL_THICKNESS,
      depth: blockerLength,
    });
    walls.push({
      x,
      z: half - inwardOffset,
      width: WALL_THICKNESS,
      depth: blockerLength,
    });
  }

  for (let z = start; z <= end; z += spacing) {
    walls.push({
      x: -half + inwardOffset,
      z,
      width: blockerLength,
      depth: WALL_THICKNESS,
    });
    walls.push({
      x: half - inwardOffset,
      z,
      width: blockerLength,
      depth: WALL_THICKNESS,
    });
  }

  return walls;
}

export function Maze({ walls }: MazeProps) {
  return (
    <group>
      {walls.map((wall, index) => (
        <CubicleWall key={index} {...wall} />
      ))}
    </group>
  );
}
