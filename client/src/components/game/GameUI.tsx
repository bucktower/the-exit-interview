import { GamePhase, GameResult } from "@/lib/stores/useGame";

interface GameUIProps {
  phase: GamePhase;
  result: GameResult;
  level: number;
  onStart: () => void;
  onRestart: () => void;
}

export function GameUI({
  phase,
  result,
  level,
  onStart,
  onRestart,
}: GameUIProps) {
  if (phase === "ready") {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          padding: "2rem 1rem",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          fontFamily: "Inter, sans-serif",
          zIndex: 100,
        }}
      >
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", marginBottom: "1rem" }}>
          The Exit Interview
        </h1>
        <p
          style={{
            fontSize: "clamp(0.72rem, 2vw, 0.9rem)",
            marginBottom: "0.5rem",
            maxWidth: 500,
            textAlign: "center",
          }}
        >
          Dave from Accounting just handed you a 'celebratory' cold one.
          Unfortunately, you have a very specific, very un-insured allergy to
          Mexican lagers: Ocular Lasers. Your pupils are glowing, your corneas
          are smoking, and the exit is on the other side of the cubicle farm,
          eight floors down. Navigate out of the office without zapping
          someone{" "}
        </p>
        <p
          style={{
            fontSize: "clamp(0.8rem, 2.4vw, 1rem)",
            marginBottom: "1.5rem",
            color: "#aaa",
          }}
        >
          Use WASD or Arrow Keys to move
        </p>
        <button
          onClick={onStart}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: "#4287f5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#2d6ad4")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#4287f5")
          }
        >
          Start Game
        </button>
      </div>
    );
  }

  if (phase === "ended") {
    const isWin = result === "win";
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isWin
            ? "rgba(0, 100, 0, 0.8)"
            : "rgba(120, 10, 10, 0.85)",
          color: "white",
          fontFamily: "Inter, sans-serif",
          zIndex: 100,
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          {isWin ? "You Escaped!" : "You Zapped a Coworker!"}
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
          {isWin
            ? "Congratulations! You found the exit!"
            : "Lasers are a no-go in the office. Try again."}
        </p>
        <button
          onClick={onRestart}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: isWin ? "#2d5a27" : "#8a1f1f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = isWin
              ? "#1a3d17"
              : "#6b1717")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = isWin
              ? "#2d5a27"
              : "#8a1f1f")
          }
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        padding: "1rem",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        borderRadius: "8px",
        fontFamily: "Inter, sans-serif",
        zIndex: 100,
      }}
    >
      <p style={{ margin: 0, fontSize: "0.85rem", color: "#8fb0ff" }}>
        Floor {Math.max(0, 8 - level)} / 8
      </p>
      <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#ffb3a7" }}>
        Blood Alcohol Content: {(level * 0.02).toFixed(2)}%
      </p>
      <p style={{ margin: 0, fontSize: "0.9rem" }}>
        Find the glowing green exit door!
      </p>
      <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem", color: "#aaa" }}>
        WASD / Arrow Keys to move
      </p>
    </div>
  );
}
