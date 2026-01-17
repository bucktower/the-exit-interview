
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

function CubicleWall({ x, z, width, depth, height }: WallData) {
  const wallHeight = height ?? 2;
  
  return (
    <mesh position={[x, wallHeight / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[width, wallHeight, depth]} />
      <meshStandardMaterial color="#f1f1f1" />
    </mesh>
  );
}

export function generateMazeWalls({ includeBorder = true } = {}): WallData[] {
  const walls: WallData[] = [];
  const addWall = (wall: WallData) => {
    walls.push(wall);
  };
  
  const borderHeight = 4;
  if (includeBorder) {
    addWall({ x: 0, z: -15, width: 30, depth: WALL_THICKNESS, height: borderHeight });
    addWall({ x: 0, z: 15, width: 30, depth: WALL_THICKNESS, height: borderHeight });
    addWall({ x: -15, z: 0, width: WALL_THICKNESS, depth: 30, height: borderHeight });
    addWall({ x: 15, z: 0, width: WALL_THICKNESS, depth: 30, height: borderHeight });
  }

  addWall({ x: -10, z: -10, width: 8, depth: WALL_THICKNESS });
  addWall({ x: -10, z: -10, width: WALL_THICKNESS, depth: 6 });
  
  addWall({ x: -4, z: -12, width: WALL_THICKNESS, depth: 6 });
  addWall({ x: -4, z: -6, width: 6, depth: WALL_THICKNESS });
  
  addWall({ x: 4, z: -10, width: 8, depth: WALL_THICKNESS });
  addWall({ x: 8, z: -7, width: WALL_THICKNESS, depth: 6 });
  
  addWall({ x: 10, z: -2, width: 10, depth: WALL_THICKNESS });
  
  addWall({ x: -8, z: -2, width: 10, depth: WALL_THICKNESS });
  addWall({ x: -12, z: 2, width: WALL_THICKNESS, depth: 8 });
  
  addWall({ x: -4, z: 2, width: WALL_THICKNESS, depth: 10 });
  addWall({ x: 0, z: 6, width: 8, depth: WALL_THICKNESS });
  
  addWall({ x: 6, z: 4, width: 8, depth: WALL_THICKNESS });
  addWall({ x: 10, z: 7, width: WALL_THICKNESS, depth: 6 });
  
  addWall({ x: -8, z: 10, width: 8, depth: WALL_THICKNESS });
  
  addWall({ x: 4, z: 10, width: 6, depth: WALL_THICKNESS });
  addWall({ x: 7, z: 12, width: WALL_THICKNESS, depth: 4 });

  return walls;
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

export function Maze({ walls }: MazeProps) {
  return (
    <group>
      {walls.map((wall, index) => (
        <CubicleWall key={index} {...wall} />
      ))}
    </group>
  );
}
