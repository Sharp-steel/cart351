document.addEventListener("DOMContentLoaded", () => {
    let score = 0;
    let timeLeft = 10;
    let timer;
    let gameActive = false;

    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");
    const startButton = document.getElementById("start-button");
    const message = document.getElementById("message");
    const square = document.getElementById("square");
    const playerName = document.getElementById("player-name");

    function startGame() {
        if (!playerName.value.trim()) {
            alert("I know the button is tempting to press but there is clearly a place that says enter your name :)");
            return;
        }

        score = 0;
        timeLeft = 10;
        gameActive = true;
        scoreDisplay.textContent = "Score: 0";
        message.textContent = "";
        timerDisplay.textContent = `Time left: ${timeLeft}s`;

        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time left: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endOfTheGame();
            }
        }, 1000);
    }

    function endOfTheGame() {
        gameActive = false;
        timerDisplay.textContent = "TIME'S UP!";
        sendScore();
    }

    square.addEventListener("click", () => {
        if (!gameActive) return;
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        square.style.backgroundColor = "#e63946";
        setTimeout(() => {
            square.style.backgroundColor = "rgb(167, 69, 112)";
        }, 150);
    });

    function sendScore() {
        const formData = new FormData();
        formData.append("name", playerName.value);
        formData.append("score", score);

        fetch("/postDataFetch", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            message.textContent = data.message;
            message.style.color = "rgb(167, 69, 112);";
            message.style.transform = "scale(1.1)";
        });
    }

    startButton.addEventListener("click", startGame);
});