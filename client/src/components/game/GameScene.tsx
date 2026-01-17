import { Suspense, useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Player, Controls } from "./Player";
import { Maze, generateMazeWalls } from "./Maze";
import { Floor } from "./Floor";
import { ExitDoor } from "./ExitDoor";
import { OfficeDecorations } from "./OfficeDecorations";
import { Ceiling } from "./Ceiling";
import { GameUI } from "./GameUI";
import { useGame } from "@/lib/stores/useGame";

const keyMap = [
  { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
  { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
  { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
  { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
];

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  );
}

function GameContent() {
  const { phase, end } = useGame();
  const walls = useMemo(() => generateMazeWalls(), []);
  
  const playerStart: [number, number, number] = [-12, 0.6, -12];
  const exitPosition: [number, number, number] = [12, 0, 13];

  const handleReachExit = useCallback(() => {
    if (phase === "playing") {
      console.log("Player reached exit!");
      end();
    }
  }, [phase, end]);

  if (phase !== "playing") {
    return (
      <>
        <Lights />
        <Floor />
        <Maze walls={walls} />
        <ExitDoor position={exitPosition} />
        <OfficeDecorations />
        <Ceiling />
      </>
    );
  }

  return (
    <>
      <Lights />
      <Floor />
      <Maze walls={walls} />
      <Player
        position={playerStart}
        walls={walls}
        onReachExit={handleReachExit}
        exitPosition={exitPosition}
      />
      <ExitDoor position={exitPosition} />
      <OfficeDecorations />
      <Ceiling />
    </>
  );
}

export function GameScene() {
  const { phase, start, restart } = useGame();

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{
            position: [-12, 10, -6],
            fov: 60,
            near: 0.1,
            far: 1000,
          }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#1a1a2e"]} />
          <fog attach="fog" args={["#1a1a2e", 15, 40]} />
          <Suspense fallback={null}>
            <GameContent />
          </Suspense>
        </Canvas>
      </KeyboardControls>
      <GameUI phase={phase} onStart={start} onRestart={restart} />
    </div>
  );
}
