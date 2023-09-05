import "../css/style.css";

import { startGame } from "./game";
import { darkModeHandler } from "./utils";

darkModeHandler();

const startGameButton = document.getElementById("startGame");
startGameButton.addEventListener("click", () => startGame());
