// Event listener for the start of game
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.querySelector('#gamestart button');
    const gameSection = document.querySelector('#gamestart');
    const scoreDisplay = document.querySelector('#gamestart p');
    let score = 0;
    let currentQuestionIndex = 0; // Keep track of the current question index

    // Load leaderboard from localStorage or initialize as an empty array
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Add event listener to the start button
    startButton.addEventListener('click', startGame);

  window.onload = function() {
    var audio = document.querySelector('audio');
    audio.play().catch(function(error) {
      console.log('Audio playback failed:', error);
    });
   }

   const audio = document.getElementById('myAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeControl = document.getElementById('volumeControl');

playPauseBtn.addEventListener('click', function() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = 'Pause';
  } else {
    audio.pause();
    playPauseBtn.textContent = 'Play';
  }
});

volumeControl.addEventListener('input', function() {
  audio.volume = volumeControl.value;
});
 
    // Function to start the game
    async function startGame() {
        score = 0;
        scoreDisplay.textContent = 'Game Score: 0';
        startButton.disabled = true;
        currentQuestionIndex = 0; // Reset to first question

        // Try to fetch trivia questions 
        try {
            const questions = await fetchTriviaQuestions();
            displayQuestion(questions); // Display the first question
        } catch (error) {
            console.error('Error fetching trivia questions:', error);
        }
    }

    // Function to fetch trivia questions from API
    async function fetchTriviaQuestions() {
        const apiUrl = 'https://opentdb.com/api.php?amount=15&category=15&difficulty=easy&type=multiple'; // Example API URL
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.results;
    }

    // Function to display a single trivia question
    function displayQuestion(questions) {
        if (currentQuestionIndex >= questions.length) {
            endGame(); // End the game when all questions are answered
            return;
        }

        const question = questions[currentQuestionIndex];
        gameSection.innerHTML = '<h2>Question:</h2>'; // Clear previous question
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.dataset.correctAnswer = question.correct_answer; // Add correct answer here
        
        // Display question and answers
        questionElement.innerHTML = ` 
            <h3>${question.question}</h3> 
            <ul>
                ${shuffleArray([...question.incorrect_answers, question.correct_answer]).map(answer => `
                    <li><button class="answer-btn">${answer}</button></li>
                `).join('')}
            </ul>
        `;
        gameSection.appendChild(questionElement); // Append question to the game section

        // Add event listeners to answer buttons
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            button.addEventListener('click', (event) => checkAnswer(event, questions));
        });
    }

    // Function to check the selected answer
    function checkAnswer(event, questions) {
        const selectedAnswer = event.target.textContent;
        const questionElement = event.target.closest('.question');
        const correctAnswer = questionElement.dataset.correctAnswer;

        // Check if the selected answer is correct
        if (selectedAnswer === correctAnswer) {
            score++;
            scoreDisplay.textContent = `Game Score: ${score}`; // Update score display
            event.target.style.backgroundColor = 'lightgreen'; // Change button color to green
        } else {
            event.target.style.backgroundColor = 'salmon'; // Change button color to red
        }

        // Move to next question after a short delay
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion(questions); // Display next question
        }, 1000); // Adjust this delay as needed
    }

    // End the game
    function endGame() {
        gameSection.innerHTML = `<h2>Game Over!</h2><p>Your final score is ${score}.</p>`;
        
        // Prompt for player's name after the game ends
        const playerName = prompt("Enter your name for the leaderboard:");
        if (playerName) {
            leaderboard.push({ name: playerName, score: score });
            leaderboard.sort((a, b) => b.score - a.score); // Sort leaderboard by score in descending order
            
            // Save the leaderboard to localStorage
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

            // Call function to display leaderboard
            displayLeaderboard();
        }

        startButton.disabled = false;
    }

    // Function to display the leaderboard
    function displayLeaderboard() {
        const leaderboardBox = document.querySelector('.leaderboard');
        leaderboardBox.innerHTML = '<h3>Leaderboard </h3>';
        
        // Display top 5 players
        leaderboard.slice(0, 5).forEach((entry, index) => {
            leaderboardBox.innerHTML += `<p>${index + 1}. ${entry.name} - ${entry.score} points</p>`;
        });
    }

    // Function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Display the leaderboard on page load
    displayLeaderboard();
});

function scrollToGameStart() {
    // Get the element with id 'gamestart'
    const gameStartSection = document.getElementById("gamestart");

    // Scroll to the gameStart section with smooth scrolling
    gameStartSection.scrollIntoView({ behavior: "smooth" });
}