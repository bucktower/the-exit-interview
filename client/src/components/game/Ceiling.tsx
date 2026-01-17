export function Ceiling() {
  return (
    <group>
      <mesh position={[0, 4, 0]} receiveShadow>
        <boxGeometry args={[30, 0.2, 30]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {[-10, 0, 10].map((x) =>
        [-10, 0, 10].map((z) => (
          <group key={`light-${x}-${z}`} position={[x, 3.8, z]}>
            <mesh>
              <boxGeometry args={[1.5, 0.1, 0.5]} />
              <meshStandardMaterial 
                color="#ffffff" 
                emissive="#ffffff" 
                emissiveIntensity={0.5} 
              />
            </mesh>
            <pointLight 
              position={[0, -0.5, 0]} 
              intensity={0.5} 
              distance={8} 
              color="#fffaf0" 
            />
          </group>
        ))
      )}
    </group>
  );
}
