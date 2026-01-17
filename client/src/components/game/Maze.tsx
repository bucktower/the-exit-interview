
interface WallData {
  x: number;
  z: number;
  width: number;
  depth: number;
}

interface MazeProps {
  walls: WallData[];
}

function CubicleWall({ x, z, width, depth }: WallData) {
  const wallHeight = 2;
  
  return (
    <mesh position={[x, wallHeight / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[width, wallHeight, depth]} />
      <meshStandardMaterial color="#8B8B8B" />
    </mesh>
  );
}

export function generateMazeWalls(): WallData[] {
  const walls: WallData[] = [];
  const wallThickness = 0.3;
  
  walls.push({ x: 0, z: -15, width: 30, depth: wallThickness });
  walls.push({ x: 0, z: 15, width: 30, depth: wallThickness });
  walls.push({ x: -15, z: 0, width: wallThickness, depth: 30 });
  walls.push({ x: 15, z: 0, width: wallThickness, depth: 30 });

  walls.push({ x: -10, z: -10, width: 8, depth: wallThickness });
  walls.push({ x: -10, z: -10, width: wallThickness, depth: 6 });
  
  walls.push({ x: -4, z: -12, width: wallThickness, depth: 6 });
  walls.push({ x: -4, z: -6, width: 6, depth: wallThickness });
  
  walls.push({ x: 4, z: -10, width: 8, depth: wallThickness });
  walls.push({ x: 8, z: -7, width: wallThickness, depth: 6 });
  
  walls.push({ x: 10, z: -2, width: 10, depth: wallThickness });
  
  walls.push({ x: -8, z: -2, width: 10, depth: wallThickness });
  walls.push({ x: -12, z: 2, width: wallThickness, depth: 8 });
  
  walls.push({ x: -4, z: 2, width: wallThickness, depth: 10 });
  walls.push({ x: 0, z: 6, width: 8, depth: wallThickness });
  
  walls.push({ x: 6, z: 4, width: 8, depth: wallThickness });
  walls.push({ x: 10, z: 7, width: wallThickness, depth: 6 });
  
  walls.push({ x: -8, z: 10, width: 8, depth: wallThickness });
  
  walls.push({ x: 4, z: 10, width: 6, depth: wallThickness });
  walls.push({ x: 7, z: 12, width: wallThickness, depth: 4 });

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
