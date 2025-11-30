let questions = [];
let currentQuestion = 0;
let score = 0;
let username = prompt("Enter your name:") || "Player";

async function loadQuestions() {
  try {
    const res = await fetch("questions.json");
    questions = await res.json();

    currentQuestion = 0;
    score = 0;

    showQuestion();
  } catch (err) {
    document.getElementById("question").innerText = "❌ Failed to load questions.";
  }
}

function showQuestion() {
   if (currentQuestion >= questions.length) {
    showResult();
    return;
  }


  const q = questions[currentQuestion];
  document.getElementById("question-number").innerText = `Question ${currentQuestion + 1}/${questions.length}`;
  document.getElementById("question").innerText = q.question;
  
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  
  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.innerText = ans;
    btn.onclick = () => checkAnswer(btn, i === q.correct);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(button, isCorrect) {
  const allBtns = document.querySelectorAll(".answers button");
  allBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
  }

  document.getElementById("score").innerText = `Score: ${score}`;
}

document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestion++;
  showQuestion();
});

function showResult() {
  document.querySelector(".quiz-box").style.display = "none";
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.querySelector("#final-score").innerText = `${username} answered correctly ${score}/${questions.length} questions!`;
}

function restartQuiz() {
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("result").style.display = "none";
  document.querySelector(".quiz-box").style.display = "block";
  loadQuestions();
}

function navigate(page) {
  const quizBox = document.querySelector(".quiz-box");
  const createBox = document.querySelector(".create-box");

  quizBox.style.display = page === "home" ? "block" : "none";
  createBox.style.display = page === "create" ? "block" : "none";
}

function saveQuestion() {
  const q = document.getElementById("new-question").value.trim();
  const opts = [
    document.getElementById("opt1").value,
    document.getElementById("opt2").value,
    document.getElementById("opt3").value,
    document.getElementById("opt4").value
  ];
  const correct = parseInt(document.getElementById("correct").value) - 1;

  if (!q || opts.some(o => !o) || isNaN(correct) || correct < 0 || correct > 3) {
    document.getElementById("save-msg").innerText = "⚠️ Please fill all fields correctly!";
    return;
  }

  const newQuestion = { question: q, answers: opts, correct };
  questions.push(newQuestion);
  document.getElementById("save-msg").innerText = "✅ Question added successfully!";
}
loadQuestions();
