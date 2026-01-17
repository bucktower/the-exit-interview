interface FloorProps {
  size?: number;
}

export function Floor({ size = 30 }: FloorProps) {
  return (
    <mesh position={[0, -0.25, 0]} receiveShadow>
      <boxGeometry args={[size, 0.5, size]} />
      <meshStandardMaterial color="#c4a484" />
    </mesh>
  );
}
