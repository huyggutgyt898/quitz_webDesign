// ========== PHẦN LÀM BÀI QUIZ ==========
function loadQuizFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      let data = JSON.parse(e.target.result);

      // ✅ Chuẩn hóa dữ liệu để hỗ trợ cả 2 dạng
      quizQuestions = data.map(q => {
        let answersArray = [];
        if (Array.isArray(q.answers)) {
          answersArray = q.answers;
        } else if (typeof q.answers === "object" && q.answers !== null) {
          answersArray = Object.values(q.answers);
        } else if (Array.isArray(q.options)) {
          answersArray = q.options;
        }

        let correctIndex = 0;
        if (typeof q.correctAnswer === "string") {
          correctIndex = ["A", "B", "C", "D"].indexOf(q.correctAnswer.toUpperCase());
        } else if (typeof q.correctAnswer === "number") {
          correctIndex = q.correctAnswer;
        } else if (typeof q.correct === "number") {
          correctIndex = q.correct;
        }

        return {
          question: q.question || q.text || "",
          answers: answersArray,
          correct: correctIndex
        };
      });

      userAnswers = new Array(quizQuestions.length).fill(null);
      currentQuestionIndex = 0;
      score = 0;

      document.getElementById("uploadArea").classList.add("hidden");
      document.getElementById("quizArea").classList.remove("hidden");
      document.getElementById("resultArea").classList.add("hidden");

      displayQuestion();
      alert("Đã tải " + quizQuestions.length + " câu hỏi thành công!");
    } catch (error) {
      console.error(error);
      alert("Lỗi đọc file! Vui lòng kiểm tra định dạng JSON.");
    }
  };
  reader.readAsText(file);
}

function displayQuestion() {
  if (currentQuestionIndex >= quizQuestions.length) return;
  const q = quizQuestions[currentQuestionIndex];

  document.getElementById("questionNumber").textContent =
    `Câu ${currentQuestionIndex + 1}/${quizQuestions.length}`;
  document.getElementById("questionText").textContent = q.question;

  const container = document.getElementById("answersContainer");
  container.innerHTML = "";

  q.answers.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;
    btn.onclick = () => selectAnswer(i);
    if (userAnswers[currentQuestionIndex] === i) {
      btn.classList.add("selected");
    }
    container.appendChild(btn);
  });

  if (currentQuestionIndex === quizQuestions.length - 1) {
    document.getElementById("nextBtn").classList.add("hidden");
    document.getElementById("finishBtn").classList.remove("hidden");
  } else {
    document.getElementById("nextBtn").classList.remove("hidden");
    document.getElementById("finishBtn").classList.add("hidden");
  }
}

function selectAnswer(index) {
  userAnswers[currentQuestionIndex] = index;
  displayQuestion();
}

function nextQuestion() {
  if (userAnswers[currentQuestionIndex] === null) {
    alert("Vui lòng chọn một đáp án!");
    return;
  }
  currentQuestionIndex++;
  displayQuestion();
}

function finishQuiz() {
  if (userAnswers[currentQuestionIndex] === null) {
    alert("Vui lòng chọn một đáp án!");
    return;
  }

  score = 0;
  quizQuestions.forEach((q, i) => {
    if (userAnswers[i] === q.correct) score++;
  });

  const percentage = ((score / quizQuestions.length) * 100).toFixed(1);

  document.getElementById("quizArea").classList.add("hidden");
  const resultArea = document.getElementById("resultArea");
  resultArea.classList.remove("hidden");

  resultArea.innerHTML = `
    <h2>🎉 Hoàn Thành Quiz!</h2>
    <div class="result-score">${score}/${quizQuestions.length}</div>
    <p style="font-size: 1.5em; color: #666;">Tỷ lệ đúng: ${percentage}%</p>
    <button class="btn btn-primary" onclick="restartQuiz()">🔄 Làm Lại</button>
    <button class="btn btn-success" onclick="backToUpload()">📁 Tải File Khác</button>
  `;
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = new Array(quizQuestions.length).fill(null);

  document.getElementById("resultArea").classList.add("hidden");
  document.getElementById("quizArea").classList.remove("hidden");

  displayQuestion();
}

function backToUpload() {
  document.getElementById("resultArea").classList.add("hidden");
  document.getElementById("quizArea").classList.add("hidden");
  document.getElementById("uploadArea").classList.remove("hidden");
  document.getElementById("fileInput").value = "";
}

// ========== PHẦN TẠO CÂU HỎI ==========
let questions = [];
let editingIndex = -1;

// Xử lý preview ảnh
document.getElementById("imageUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById("imagePreview");
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Thêm câu hỏi
document.getElementById("questionForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const correctAnswerElement = document.querySelector('input[name="correctAnswer"]:checked');
  if (!correctAnswerElement) {
    alert("⚠️ Vui lòng chọn đáp án đúng!");
    return;
  }

  const imagePreview = document.getElementById("imagePreview");
  const hasImage = imagePreview.style.display === "block" && imagePreview.src;

  const question = {
    id: editingIndex >= 0 ? questions[editingIndex].id : Date.now(),
    text: document.getElementById("questionInput").value.trim(),
    difficulty: document.getElementById("difficulty").value,
    subject: document.getElementById("subject").value,
    image: hasImage ? imagePreview.src : null,
    answers: {
      A: document.getElementById("answerA").value.trim(),
      B: document.getElementById("answerB").value.trim(),
      C: document.getElementById("answerC").value.trim(),
      D: document.getElementById("answerD").value.trim(),
    },
    correctAnswer: correctAnswerElement.value,
  };

  if (editingIndex >= 0) {
    questions[editingIndex] = question;
    editingIndex = -1;
    alert("✅ Đã cập nhật câu hỏi!");
  } else {
    questions.push(question);
    alert("✅ Đã thêm câu hỏi thành công!");
  }

  renderQuestions();
  this.reset();
  imagePreview.style.display = "none";
  imagePreview.src = "";

  setTimeout(() => {
    document.getElementById("questionsList").scrollIntoView({ behavior: "smooth" });
  }, 100);
});

// Render danh sách câu hỏi
function renderQuestions() {
  const container = document.getElementById("questionsList");
  const countElement = document.getElementById("questionCount");
  countElement.textContent = questions.length;

  if (questions.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <div class="empty-state-icon">📝</div>
      <p>Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!</p>
    </div>`;
    return;
  }

  container.innerHTML = questions.map((q, i) => `
    <div class="question-item">
      <div class="question-header">
        <div class="question-title">Câu ${i + 1}: ${q.text}</div>
        <div class="question-actions">
          <button class="btn-small btn-edit" onclick="editQuestion(${i})">✏️ Sửa</button>
          <button class="btn-small btn-delete" onclick="deleteQuestion(${i})">🗑️ Xóa</button>
        </div>
      </div>
      <div class="answers-display">
        ${["A","B","C","D"].map(k => `
          <div class="answer-display ${q.correctAnswer === k ? "correct" : ""}">
            <span class="answer-prefix">${k}.</span> ${q.answers[k]}
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

// Sửa câu hỏi
function editQuestion(index) {
  const q = questions[index];
  editingIndex = index;
  document.getElementById("questionInput").value = q.text;
  document.getElementById("difficulty").value = q.difficulty;
  document.getElementById("subject").value = q.subject;
  document.getElementById("answerA").value = q.answers.A;
  document.getElementById("answerB").value = q.answers.B;
  document.getElementById("answerC").value = q.answers.C;
  document.getElementById("answerD").value = q.answers.D;
  document.querySelector(`input[value="${q.correctAnswer}"]`).checked = true;
  if (q.image) {
    document.getElementById("imagePreview").src = q.image;
    document.getElementById("imagePreview").style.display = "block";
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Xóa câu hỏi
function deleteQuestion(index) {
  if (confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
    questions.splice(index, 1);
    renderQuestions();
  }
}

// Lưu file JSON và vào kho đề
document.getElementById("saveBtn").addEventListener("click", function() {
  if (questions.length === 0) {
    alert("Chưa có câu hỏi nào để lưu!");
    return;
  }

  const dataStr = JSON.stringify(questions, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quiz_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  try {
    const KEY = "all-quizzes";
    const raw = localStorage.getItem(KEY);
    const quizzes = raw ? JSON.parse(raw) : [];

    const convertedQuestions = questions.map(q => ({
      id: q.id,
      question: q.text,
      answers: [q.answers.A, q.answers.B, q.answers.C, q.answers.D],
      correctAnswer: ["A","B","C","D"].indexOf(q.correctAnswer),
      difficulty: q.difficulty,
      subject: q.subject,
      image: q.image
    }));

    const newQuiz = {
      id: Date.now(),
      title: `Đề thi ${new Date().toLocaleDateString("vi-VN")}`,
      description: `${questions.length} câu hỏi tạo thủ công`,
      questions: convertedQuestions,
      createdAt: new Date().toISOString()
    };

    quizzes.push(newQuiz);
    localStorage.setItem(KEY, JSON.stringify(quizzes));
    alert("✅ Đã lưu file và lưu vào kho đề thành công!");
    setTimeout(() => window.location.href = "khode.html", 500);
  } catch (err) {
    alert("Lỗi khi lưu vào kho đề: " + err.message);
  }
});
