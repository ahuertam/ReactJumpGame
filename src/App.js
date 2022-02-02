import { useState } from "react";
import "./styles.css";
import Egg from "./Egg";

export default function App() {
  const [start, setStart] = useState(false);

  const startGame = () => {
    setStart(!start);
  };
  return (
    <div className="App">
      <h1>Egg Game</h1>
      <button type="button" onClick={startGame}>
        {start ? "Stop Game" : "Start Game"}
      </button>
      <Egg start={start} />
    </div>
  );
}
