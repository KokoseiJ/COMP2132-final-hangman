const hangmanMainElem = document.getElementById("hangmanMain");
const hangmanResultElem = document.getElementById("hangmanResult");
const hangmanImgElem = document.getElementById("hangmanImg");
const hangmanHintElem = document.getElementById("hangmanHint");
const hangmanTxtElem = document.getElementById("hangmanTxt");
const hangmanUsedElem = document.getElementById("hangmanUsed");
const hangmanInputDivElem = document.getElementById("hangmanInputDiv");
const hangmanInputElem = document.getElementById("hangmanInput");
const hangmanSubmitElem = document.getElementById("hangmanSubmit");
const hangmanAgainElem = document.getElementById("hangmanAgain");

class hangmanClass {
	answer = "";
	correctChars = [];
	incorrectChars = [];
	errors = 0;

	constructor() {
		this.init();
	}

	hangmanUpdate = () => {
		let isGameOver = this.errors == 6;
		let isCorrect = !isGameOver;

		let showStr = Array.from(this.answer).reduce((accum, char) => {
			if (char == " ") {
				return accum + "&nbsp;&nbsp;";
			} else if (this.correctChars.includes(char) || isGameOver)
				return accum + `${char.toUpperCase()} `;
			else {
				isCorrect = false;
				return accum + "_ ";
			}
		}, "");

		if (isCorrect) isGameOver = true;

		hangmanImgElem.setAttribute("src", `images/hangman${this.errors}.png`);

		hangmanTxtElem.innerHTML = showStr;

		hangmanUsedElem.innerText = this.incorrectChars.reduce(
			(accum, char) => `${accum}${char.toUpperCase()} `,
			"",
		);

		if (isGameOver) {
			hangmanResultElem.innerHTML = isCorrect ? "You Win!" : "You Lose!";
			hangmanResultElem.classList.remove("hidden");
			hangmanInputDivElem.classList.add("hidden");
			hangmanAgainElem.classList.remove("hidden");
		}
	}

	inputCheck = (e) => {
		if (!e.data) return;
		let userInput = e.data.slice(0, 1).replace(/[^a-z]/, "");
		if ((this.correctChars + this.incorrectChars).includes(userInput))
			userInput = "";

		e.target.value = userInput.toUpperCase();
	};

	submitHandler = (e) => {
		let userInput = hangmanInputElem.value.toLowerCase();
		hangmanInputElem.value = "";
		if (userInput.length == 0) return;
		userInput = userInput.slice(0, 1);

		if ((this.correctChars + this.incorrectChars).includes(userInput))
			return;

		if (this.answer.includes(userInput)) {
			this.correctChars.push(userInput);
		} else {
			this.incorrectChars.push(userInput);
			this.errors++;
		}

		this.hangmanUpdate();
	};

	init = () => {
		this.correctChars = [];
		this.incorrectChars = [];
		this.errors = 0;

		hangmanResultElem.classList.add("hidden");
		hangmanInputDivElem.classList.remove("hidden");
		hangmanAgainElem.classList.add("hidden");

		fetch("data/answers.json").then((resp) => {
			if (!resp.ok) {
				alert("Failed to receive answer data!");
				return;
			}

			resp.json().then((data) => {
				const answerObj = data[Math.floor(Math.random() * data.length)];
				this.answer = answerObj.answer;
				hangmanHintElem.innerHTML = `Hint: ${answerObj.hint}`;

				this.hangmanUpdate();
			});
		});
	}
}

const hangman = new hangmanClass();

hangmanInputElem.addEventListener("input", hangman.inputCheck);

hangmanInputElem.addEventListener("keyup", (e) => {
	if (e.key == "Enter") hangman.submitHandler();
});
hangmanSubmitElem.addEventListener("click", hangman.submitHandler);

hangmanAgainElem.addEventListener("click", hangman.init);

hangman.init();
