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

let answer = "";
let correctChars = [];
let incorrectChars = [];
let errors = 0;

function hangmanUpdate() {
	let isGameOver = errors == 6;
	let isCorrect = !isGameOver;

	let showStr = Array.from(answer).reduce((accum, char) => {
		if (char == " ") {
			return accum + "&nbsp;&nbsp;";
		} else if (correctChars.includes(char) || isGameOver)
			return accum + `${char.toUpperCase()} `;
		else {
			isCorrect = false;
			return accum + "_ ";
		}
	}, "");

	if (isCorrect) isGameOver = true;

	hangmanImgElem.setAttribute("src", `images/hangman${errors}.png`);

	hangmanTxtElem.innerHTML = showStr;

	hangmanUsedElem.innerText = incorrectChars.reduce(
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

function init() {
	correctChars = [];
	incorrectChars = [];
	errors = 0;

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
			answer = answerObj.answer;
			hangmanHintElem.innerHTML = `Hint: ${answerObj.hint}`;

			hangmanUpdate();
		});
	});
}

hangmanInputElem.addEventListener("input", (e) => {
	if (!e.data) return;
	let userInput = e.data.replace(/[^a-z]/, "");
	if ((correctChars + incorrectChars).includes(userInput)) userInput = "";

	e.target.value = userInput.toUpperCase();
});

const submitHandler = () => {
	let userInput = hangmanInputElem.value.toLowerCase();
	hangmanInputElem.value = "";
	if (userInput.length == 0) return;
	userInput = userInput[0];

	if ((correctChars + incorrectChars).includes(userInput)) return;

	if (answer.includes(userInput)) {
		correctChars.push(userInput);
	} else {
		incorrectChars.push(userInput);
		errors++;
	}

	hangmanUpdate();
};

hangmanInputElem.addEventListener("keyup", (e) => {
	if (e.key == "Enter") submitHandler();
});
hangmanSubmitElem.addEventListener("click", submitHandler);

hangmanAgainElem.addEventListener("click", init);

init();
