// GLOABAL VARIABLES
// =========================================================================
var Word = require("./Word.js");
var inquirer = require("inquirer");
var isLetter = require('is-letter');
var userGuessedCorrectly = false;
var wordList = ["dad", "did", "eve", "civic", "eye", "level", "gag", "kayak", "madam", "mom", "peep","noon", "radar", "refer", "rotator", "sagas", "solos", "stats", "tenet"];
var randomWord;
var someWord;
var wins = 0;
var losses = 0;
var guessesRemaining = 10;
var userGuess = "";
var lettersAlreadyGuessedList = "";
var lettersAlreadyGuessedListArray = [];
var slotsFilledIn = 0;


// FUNCTIONS
// =========================================================================
function confirmStart() {
	var readyToStartGame = [
	 {
	    type: 'confirm',
	    name: 'readyToPlay',
	    message: 'Guess the palindrome?',
	    default: true
	  }
	];

	inquirer.prompt(readyToStartGame).then(function (answers) {
		if (answers.readyToPlay){
			console.log("Let's start");
			startGame();
		}

		else {
			console.log("Good bye");
			return;
		}
	});
}

function startGame(){
	guessesRemaining = 10;
	chooseRandomWord();
	lettersAlreadyGuessedList = "";
	lettersAlreadyGuessedListArray = [];
}

function chooseRandomWord() {
randomWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
someWord = new Word (randomWord);
console.log("Your word contains " + randomWord.length + " letters.");
console.log("WORD TO GUESS:");
someWord.splitWord();
someWord.generateLetters();
guessLetter();
}

function guessLetter(){
	if (slotsFilledIn < someWord.letters.length || guessesRemaining > 0) {
	inquirer.prompt([
  {
    name: "letter",
    message: "Guess a letter:",
    validate: function(value) {
        if(isLetter(value)){
          return true;
        } 
        else {
          return false;
        }
      }
  }
]).then(function(guess) {
	guess.letter.toUpperCase();
	console.log("You guessed: " + guess.letter.toUpperCase());
	userGuessedCorrectly = false;
	if (lettersAlreadyGuessedListArray.indexOf(guess.letter.toUpperCase()) > -1) {
		console.log("Letter already guessed.");
		guessLetter();
	}

	else if (lettersAlreadyGuessedListArray.indexOf(guess.letter.toUpperCase()) === -1) {
		lettersAlreadyGuessedList = lettersAlreadyGuessedList.concat(" " + guess.letter.toUpperCase());
		lettersAlreadyGuessedListArray.push(guess.letter.toUpperCase());
		console.log('Letters already guessed: ' + lettersAlreadyGuessedList, {padding: 1});

		for (i=0; i < someWord.letters.length; i++) {
			if (guess.letter.toUpperCase() === someWord.letters[i].character && someWord.letters[i].letterGuessedCorrectly === false) {
				someWord.letters[i].letterGuessedCorrectly === true;
				userGuessedCorrectly = true;
				someWord.underscores[i] = guess.letter.toUpperCase();
				slotsFilledIn++
			}
		}
		console.log("WORD TO GUESS:");
		someWord.splitWord();
		someWord.generateLetters();

		if (userGuessedCorrectly) {
			console.log('CORRECT!');
			checkIfUserWon();
		}

		else {
			console.log('INCORRECT!');
			guessesRemaining--;
			console.log("You have " + guessesRemaining + " guesses left.");
			checkIfUserWon();
		}
	}
});
}
}

function checkIfUserWon() {
	if (guessesRemaining === 0) {
		console.log('YOU LOST :(');
		console.log("The correct word was: " + randomWord);
		losses++;
		console.log("Wins: " + wins);
		console.log("Losses: " + losses);
		playAgain();
	}

	else if (slotsFilledIn === someWord.letters.length) {
		console.log("YOU WON!");
		wins++;
		console.log("Wins: " + wins);
		console.log("Losses: " + losses);
		playAgain();
	}

	else {
		guessLetter("");
	}

}

function playAgain() {
	var playGameAgain = [
	 {
	    type: 'confirm',
	    name: 'playAgain',
	    message: 'Do you want to play again?',
	    default: true
	  }
	];

	inquirer.prompt(playGameAgain).then(function(userWantsTo) {
		if (userWantsTo.playAgain){
			lettersAlreadyGuessedList = "";
			lettersAlreadyGuessedListArray = [];
			slotsFilledIn = 0;
			console.log("OK!");
			startGame();
		}

		else {
			console.log("Good bye!");
			return;
		}
	});
}


// PROCESS
// =========================================================================

confirmStart();
