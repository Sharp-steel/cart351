// Waits until the HTML document is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {

  // List of Questions/Answers
  const questions = [
    { question: "Which Do You Prefer: Cats or Dogs?", options: ["Cats", "Dogs"] },
    { question: "Which Do You Prefer: Coffee or Tea?", options: ["Coffee", "Tea"] },
    { question: "Which Do You Prefer: The Morning or The Afternoon?", options: ["Morning", "Afternoon"] },
    { question: "Which Do You Prefer: Pepperoni or Cheese Pizza?", options: ["Pepperoni", "Cheese"] },
    { question: "Which Do You Prefer: The Old or The New?", options: ["Old", "New"] }
  ];

  let current = 0;
  let userAnswers = [];

  // Loads the current question
  function loadQuestion() {
    const q = questions[current];
    document.getElementById("question").textContent = q.question;
    document.getElementById("button1").textContent = q.options[0];
    document.getElementById("button2").textContent = q.options[1];
    document.getElementById("next").classList.add("hidden");
  }

  // Sends the users vote to Flask and stores it using POST
  function sendVote(choice) {
    const q = questions[current];
    userAnswers.push({ question: q.question, choice: choice });
  /* Fixed using ChatGPT */
    fetch("/submit_vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q.question, choice: choice })
    })
    .then(response => response.json())
    .then(() => {
      document.getElementById("next").classList.remove("hidden");
    })
    .catch(err => console.error("Error submitting vote:", err));
  /* */
  }

  // Triggers sendVote function when clicked
  document.getElementById("button1").addEventListener("click", () => sendVote(questions[current].options[0]));
  document.getElementById("button2").addEventListener("click", () => sendVote(questions[current].options[1]));

  // Go to Next Question or Display User Results
  document.getElementById("next").addEventListener("click", () => {
    current++;
    if (current < questions.length) {
      loadQuestion();
    } else {
      showUserResults();
    }
  });

  // Displays user Results
  function showUserResults() {
    const container = document.querySelector(".container");
    container.innerHTML = `
      <h2>Here Are Your Final Results</h2>
      <div class="user-results"></div>
      <button id="viewResults">View The Final Consensus</button>
    `;

    const resultDiv = container.querySelector(".user-results");
    userAnswers.forEach((answer, index) => {
      resultDiv.innerHTML += `
        <div class="user-result-item">
          <h3>Q${index + 1}: ${answer.question}</h3>
          <p><strong>You chose:</strong> ${answer.choice}</p>
        </div>
      `;
    });

    document.getElementById("viewResults").addEventListener("click", fetchResults);
  }

  // Fetches results from Flask and creates a data visualizer showing total vote percentage.
  function fetchResults() {
    fetch("/get_results")
      .then(res => res.json())
      .then(data => {
        const container = document.querySelector(".container");
        container.innerHTML = "<h2>The Overall Consensus</h2>";

        for (const [question, results] of Object.entries(data)) {
          const total = Object.values(results).reduce((a, b) => a + b, 0);
          const barHTML = Object.entries(results).map(([option, count]) => {
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            return `
              <div class="result-bar">
                <span>${option}</span>
                <div class="bar">
                  <div class="fill" style="width:${percent}%"></div>
                  <p>${percent}%</p>
                </div>
              </div>
            `;
          }).join("");

          container.innerHTML += `
            <div class="result-block">
              <h3>${question}</h3>
              ${barHTML}
            </div>
          `;
        }
      });
  }

  // Run Load Question when page is loaded
  loadQuestion();
});