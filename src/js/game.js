import { async } from "yandex-translator/extendedValidator";
import { KEYBOARD_LETTERS } from "../constants/keyboard-letters";
import { WORDS } from "../constants/words";
import { getRandomWord } from "./getRandomWord";

const gameDiv = document.getElementById("game");
const logoH1 = document.getElementById("logo");
let triesLeft;
let winCount;

export const createPlaceholdersHtml = () => {
	const word = sessionStorage.getItem("word");

	const wordArray = Array.from(word);
	const placeholdersHTML = wordArray.reduce(
		(acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter">_</h1>`,
		""
	);
	return `<div id="placeholders" class="placeholders-wrapper">${placeholdersHTML}</div>`;
};

export const createKeyboard = () => {
	const keyboard = document.createElement("div");
	keyboard.classList.add("keyboard");
	keyboard.id = "keyboard";

	const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
		return (
			acc +
			`<button class="button-primary keyboard-button" id="${curr}">${curr}</button>`
		);
	}, "");

	keyboard.innerHTML = keyboardHTML;
	return keyboard;
};

export const createHangmanImg = () => {
	const img = document.createElement("img");
	img.src = "images/hg-0.png";
	img.alt = "hangman image";
	img.classList.add("hangman-img");
	img.id = "hangman-img";

	return img;
};

export const checkLetter = (letter) => {
	const word = sessionStorage.getItem("word");
	const inputLetter = letter.toLowerCase();

	if (!word.includes(inputLetter)) {
		const triesCounter = document.getElementById("tries-left");
		triesLeft -= 1;
		triesCounter.innerText = triesLeft;

		const hangmanImg = document.getElementById("hangman-img");
		hangmanImg.src = `images/hg-${10 - triesLeft}.png`;

		if (triesLeft === 0) {
			stopGame("lose");
		}
	} else {
		const wordArray = Array.from(word);
		wordArray.forEach((currentLetter, i) => {
			if (currentLetter === inputLetter) {
				winCount += 1;
				if (winCount === word.length) {
					stopGame("win");
					return;
				}
				document.getElementById(`letter_${i}`).innerText =
					inputLetter.toUpperCase();
			}
		});
	}
};

export const stopGame = (status) => {
	document.getElementById("placeholders").remove();
	document.getElementById("tries").remove();
	document.getElementById("keyboard").remove();
	document.getElementById("quit").remove();

	const word = sessionStorage.getItem("word");

	if (status === "win") {
		document.getElementById("hangman-img").src = "images/hg-win.png";
		document.getElementById("game").innerHTML +=
			'<h2 class="result-header win">You won! :)</h2>';
	} else if (status === "lose") {
		document.getElementById("game").innerHTML +=
			'<h2 class="result-header lose">You lost :(</h2>';
	} else if (status === "quit") {
		logoH1.classList.remove("logo-sm");
		document.getElementById("hangman-img").remove();
	}

	document.getElementById("game").innerHTML += `
	<p>
		The word was:
		<span class="result-word">${word}</span>
	</p>
	<button id="play-again" class="button-primary px-5 py-2 mt-5">Play again</button>`;

	document.getElementById("play-again").onclick = startGame;
};

export const startGame = async () => {
	triesLeft = 10;
	winCount = 0;

	logoH1.classList.add("logo-sm");

	const wordToGuess = await getRandomWord();

	sessionStorage.setItem("word", wordToGuess);

	gameDiv.innerHTML = createPlaceholdersHtml();

	gameDiv.innerHTML +=
		'<p id="tries" class="mt-2">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>';

	const keyboardDiv = createKeyboard();
	keyboardDiv.addEventListener("click", (event) => {
		if (event.target.tagName.toLowerCase() === "button") {
			event.target.disabled = true;
			checkLetter(event.target.id);
		}
	});

	const hangmanImg = createHangmanImg();
	gameDiv.prepend(hangmanImg);

	gameDiv.appendChild(keyboardDiv);

	gameDiv.insertAdjacentHTML(
		"beforeend",
		'<button id="quit" class="button-secondary px-2 py-1 mt-5">Quit</button>'
	);
	document.getElementById("quit").onclick = () => {
		const isSure = confirm('Are you sure you want to quit and lose your progress?');
		if (isSure) {
			stopGame("quit");
		}
	};
};
