// Game state object
let gameState = {
    playing: false,
    score: 0,
    action: null,
    timeRemaining: null,
    correctAnswer: null,
    happyEmojis: ['😊', '😁', '🎉', '👍', '😄'],
    sadEmojis: ['😞', '😢', '🙁', '😭', '👎']
};

// Define a global array to track used question IDs
let usedQuestions = [];

// Start/Reset button click event handler
document.querySelector("#startreset").onclick = () => {
    if (gameState.playing) {
        // Reload the page if already playing
        location.reload();
    } else {
        // Start the game
        gameState.playing = true;
        gameState.score = 0;
        document.querySelector("#scorevalue").innerHTML = gameState.score;
        showElement("timeremaining");
        gameState.timeRemaining = 120;
        document.querySelector("#timeremainingvalue").innerHTML = gameState.timeRemaining;
        hideElement("gameOver");
        document.querySelector("#startreset").innerHTML = "Reset Game";
        startCountdownFrom(5); // Start countdown from 5
    }
};

// Answer box click event handlers
for (let i = 1; i < 5; i++) {
    document.querySelector("#box" + i).onclick = () => {
        if (gameState.playing) {
            const selectedAnswer = document.querySelector("#box" + i).dataset.answer;
            const correctAnswer = gameState.correctAnswer;
            if (selectedAnswer === correctAnswer) {
                gameState.score += 2;
                document.querySelector("#scorevalue").innerHTML = gameState.score;
                hideElement("wrong");
                showElement("correct");
                showEmoji("correct");
                document.getElementById('correctAnswerSound').play();
                setTimeout(() => {
                    hideElement("correct");
                }, 1000);
                generateQA();
            } else {
                gameState.score -= 1;
                document.querySelector("#scorevalue").innerHTML = gameState.score;
                hideElement("correct");
                showElement("wrong");
                showEmoji("wrong");
                document.getElementById('IncorrectAnswerSound').play();
                setTimeout(() => {
                    hideElement("wrong");
                }, 1000);
            }
        }
    };
}

// Countdown function starting from a specific number
function startCountdownFrom(countdownStart) {
    let countdown = countdownStart;
    document.querySelector("#timeremainingvalue").innerHTML = countdown;

    gameState.action = setInterval(() => {
        countdown--;
        document.querySelector("#timeremainingvalue").innerHTML = countdown;
        if (countdown === 0) {
            stopCountdown();
            generateQA();
            startCountdown();
        }
    }, 1000);
}

// Countdown function
function startCountdown() {
    gameState.action = setInterval(() => {
        gameState.timeRemaining -= 1;
        document.querySelector("#timeremainingvalue").innerHTML = gameState.timeRemaining;
        if (gameState.timeRemaining === 0) {
            stopCountdown();
            showElement("gameOver");
            document.querySelector("#gameOver").innerHTML = "<p>Game Over!</p><p> score is : " + gameState.score + ".</p>";
            hideElement("timeremaining");
            hideElement("correct");
            hideElement("wrong");
            gameState.playing = false;
            document.querySelector("#startreset").innerHTML = "Start Game";
        }
    }, 1000);
}

// Stop countdown function
function stopCountdown() {
    clearInterval(gameState.action);
}

// Utility function to hide elements
function hideElement(id) {
    document.querySelector("#" + id).style.display = "none";
}

// Utility function to show elements
function showElement(id) {
    document.querySelector("#" + id).style.display = "block";
}

// Function to show emoji based on result
function showEmoji(result) {
    const emojiElement = document.querySelector("#" + result);
    let emoji;
    if (result === "correct") {
        const shuffledHappyEmojis = shuffle(gameState.happyEmojis);
        emoji = shuffledHappyEmojis[0];
    } else if (result === "wrong") {
        const shuffledSadEmojis = shuffle(gameState.sadEmojis);
        emoji = shuffledSadEmojis[0];
    }
    emojiElement.innerHTML = `<span class="emoji">${emoji}</span>`;
}

// Function to generate questions and answers
function generateQA() {
    // Filter out questions that have already been used
    let availableQuestions = questions.filter(question => !usedQuestions.includes(question.id));

    if (availableQuestions.length === 0) {
        // If all questions have been used, end the game
        stopCountdown();
        showElement("gameOver");
        document.querySelector("#gameOver").innerHTML = "<p>Your final score is : " + gameState.score + ".</p>";
        hideElement("timeremaining");
        hideElement("correct");
        hideElement("wrong");
        gameState.playing = false;
        document.querySelector("#startreset").innerHTML = "Start Game";
        return;
    }

    // Randomly select a question from availableQuestions
    let randomIndex = Math.floor(Math.random() * availableQuestions.length);
    let questionObj = availableQuestions[randomIndex];
    const correspondingAnswer = answers.find(answer => answer.id === questionObj.id);

    // Display the question
    document.querySelector("#question").innerHTML = questionObj.text;
    MathJax.typeset();

    // Shuffle and display answer choices
    const shuffledChoices = shuffle(correspondingAnswer.choices);
    for (let i = 1; i < 5; i++) {
        const choiceBox=document.querySelector("#box"+i);
        choiceBox.innerHTML = shuffledChoices[i - 1];
        choiceBox.dataset.answer=shuffledChoices[i-1];
        MathJax.typeset();
    }

    // Track this question as used
    usedQuestions.push(questionObj.id);

    // Store the correct answer for validation
    gameState.correctAnswer = correspondingAnswer.correct;
}

// Function to shuffle array elements
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}










