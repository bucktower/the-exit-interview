import { Suspense, useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Player, Controls } from "./Player";
import { Maze, generateMazeLayout, generateBorderWalls, generateBorderBlockers } from "./Maze";
import { Floor } from "./Floor";
import { ExitDoor } from "./ExitDoor";
import { OfficeDecorations } from "./OfficeDecorations";
import { Ceiling } from "./Ceiling";
import { GameUI } from "./GameUI";
import { useGame } from "@/lib/stores/useGame";
import { MouseLookControls } from "./MouseLookControls";
import { Coworkers } from "./Coworkers";

const keyMap = [
  { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
  { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
  { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
  { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
];

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} color="#e8f1ff" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.35}
        color="#f4f7ff"
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
  const { phase, end, level, advanceLevel } = useGame();
  const difficulty = useGame((state) => state.difficulty);
  const TILE_SIZE = 30;
  const TILE_COUNT = 2;
  const floorSize = TILE_SIZE * TILE_COUNT;
  const coworkerBounds = floorSize / 2 - 4;
  const coworkerCount = Math.min(32, 20 * Math.pow(2, difficulty));
  const coworkerSeed = 100 + level;
  const halfTile = TILE_SIZE / 2;
  const offsets = useMemo(() => [-halfTile, halfTile], [halfTile]);
  const walls = useMemo(() => {
    const baseWalls = generateMazeLayout(level);
    const tiledWalls = offsets.flatMap((offsetX) =>
      offsets.flatMap((offsetZ) =>
        baseWalls.map((wall) => ({
          ...wall,
          x: wall.x + offsetX,
          z: wall.z + offsetZ,
        }))
      )
    );
    return [
      ...tiledWalls,
      ...generateBorderWalls(floorSize, 4),
      ...generateBorderBlockers(floorSize, 10, 5),
    ];
  }, [floorSize, offsets, level]);
  
  const cornerOffset = floorSize / 2 - 4;
  const playerStart: [number, number, number] = [-cornerOffset, 0.6, -cornerOffset];
  const exitPosition: [number, number, number] = useMemo(() => {
    const corners: [number, number, number][] = [
      [cornerOffset, 0, -cornerOffset],
      [cornerOffset, 0, cornerOffset],
      [-cornerOffset, 0, cornerOffset],
    ];
    return corners[Math.floor(Math.random() * corners.length)];
  }, [phase, level]);

  const handleReachExit = useCallback(() => {
    if (phase === "playing") {
      if (level >= 8) {
        console.log("Player reached exit!");
        end("win");
      } else {
        advanceLevel();
      }
    }
  }, [phase, end, level, advanceLevel]);

  const handleHitCoworker = useCallback(() => {
    if (phase === "playing") {
      end("lose");
    }
  }, [phase, end]);

  if (phase !== "playing") {
    return (
      <>
        <Lights />
        <Floor size={floorSize} />
        <Maze walls={walls} />
        <ExitDoor position={exitPosition} />
        <OfficeDecorations />
        <Coworkers bounds={coworkerBounds} count={coworkerCount} seed={coworkerSeed} />
        <Ceiling size={floorSize} />
      </>
    );
  }

  return (
    <>
      <Lights />
      <Floor size={floorSize} />
      <Maze walls={walls} />
      <Player
        key={`player-${level}`}
        position={playerStart}
        walls={walls}
        onReachExit={handleReachExit}
        onHitCoworker={handleHitCoworker}
        exitPosition={exitPosition}
        coworkerBounds={coworkerBounds}
        coworkerCount={coworkerCount}
        coworkerSeed={coworkerSeed}
        level={level}
      />
      <ExitDoor position={exitPosition} />
      <OfficeDecorations />
      <Coworkers bounds={coworkerBounds} count={coworkerCount} seed={coworkerSeed} />
      <Ceiling size={floorSize} />
    </>
  );
}

export function GameScene() {
  const { phase, result, difficulty, start, restart } = useGame();
  const blurPx = Math.min(difficulty, 8) * 0.8;

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          style={{ filter: blurPx > 0 ? `blur(${blurPx}px)` : "none" }}
          camera={{
            position: [-12, 1.6, -12],
            fov: 60,
            near: 0.1,
            far: 1000,
          }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#e9edf2"]} />
          <fog attach="fog" args={["#e9edf2", 25, 85]} />
          <MouseLookControls enabled={phase === "playing"} />
          <Suspense fallback={null}>
            <GameContent />
          </Suspense>
        </Canvas>
      </KeyboardControls>
      <GameUI phase={phase} result={result} onStart={start} onRestart={restart} />
    </div>
  );
}
