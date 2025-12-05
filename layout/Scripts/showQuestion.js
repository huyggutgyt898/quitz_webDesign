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
    document.getElementById("score").innerText = "Score: 0"; // Reset hiển thị điểm

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
  console.log("Showing result. Score:", score, "/", questions.length);
  
  // Ẩn các phần tử của quiz
  document.getElementById("question").style.display = "none";
  document.getElementById("answers").style.display = "none";
  document.getElementById("next-btn").style.display = "none";
  
  // Tính toán kết quả
  const percentage = Math.round((score / questions.length) * 100);
  let grade = "";
  
  // Xác định grade
  if (percentage >= 90) grade = "A+ 🎯";
  else if (percentage >= 80) grade = "A 👍";
  else if (percentage >= 70) grade = "B 😊";
  else if (percentage >= 60) grade = "C 🙂";
  else grade = "F 😢";
  
  // HIỂN THỊ KẾT QUẢ vào các phần tử HTML mới
  document.getElementById("player-name").textContent = username;
  document.getElementById("final-score-text").textContent = `${score}/${questions.length}`;
  document.getElementById("percentage-text").textContent = `${percentage}%`;
  document.getElementById("grade-text").textContent = grade;
  
  // Giữ lại cho tương thích (có thể ẩn)
  document.getElementById("final-score").innerHTML = `
    ${username} answered correctly ${score}/${questions.length} questions!<br>
    Percentage: ${percentage}% | Grade: ${grade}
  `;
  
  // Hiển thị result box
  document.getElementById("result").style.display = "block";
}

function restartQuiz() {
  console.log("Restarting quiz...");
  
  // Reset biến
  currentQuestion = 0;
  score = 0;
  
  // Hiển thị lại các phần tử quiz
  document.getElementById("question").style.display = "block";
  document.getElementById("answers").style.display = "block";
  document.getElementById("next-btn").style.display = "block";
  
  // Reset hiển thị
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("result").style.display = "none";
  
  // Load lại câu hỏi
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

// Xử lý thay đổi background
document.getElementById('choice_Background').addEventListener('change', function(e) {
  const theme = e.target.value; // "default", "breach", "love", "noel"

  // Xóa tất cả class theme cũ
  document.body.className = '';

  // Thêm class theme mới
  document.body.classList.add(`theme-${theme}`);

  // Lưu vào localStorage
  localStorage.setItem('quizTheme', theme);

  console.log("Đã chọn theme:", theme);
});

// Khôi phục background khi tải trang
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('quizTheme') || 'default';

  // Đặt giá trị cho select
  document.getElementById('choice_Background').value = savedTheme;

  // Thêm class theme cho body
  document.body.classList.add(`theme-${savedTheme}`);
});

// Load quiz khi khởi động
loadQuestions();