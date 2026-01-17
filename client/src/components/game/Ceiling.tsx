interface CeilingProps {
  size?: number;
}

export function Ceiling({ size = 30 }: CeilingProps) {
  const grid = [-size / 3, 0, size / 3];
  return (
    <group>
      <mesh position={[0, 4, 0]} receiveShadow>
        <boxGeometry args={[size, 0.2, size]} />
        <meshStandardMaterial color="#eef3f7" />
      </mesh>
      
      {grid.map((x) =>
        grid.map((z) => (
          <group key={`light-${x}-${z}`} position={[x, 3.8, z]}>
            <mesh>
              <boxGeometry args={[1.5, 0.1, 0.5]} />
              <meshStandardMaterial 
                color="#f8fbff" 
                emissive="#e6f3ff" 
                emissiveIntensity={1.2} 
              />
            </mesh>
            <pointLight 
              position={[0, -0.5, 0]} 
              intensity={0.9} 
              distance={9} 
              color="#d6edff" 
            />
          </group>
        ))
      )}
    </group>
  );
}
