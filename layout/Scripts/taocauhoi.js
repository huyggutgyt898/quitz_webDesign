// ========== PHẦN TẠO CÂU HỎI ==========
document.addEventListener("DOMContentLoaded", () => {
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
      container.innerHTML = `
        <div class="empty-state">
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
  window.editQuestion = function(index) {
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
  };

  // Xóa câu hỏi
  window.deleteQuestion = function(index) {
    if (confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      questions.splice(index, 1);
      renderQuestions();
    }
  };

  // Xóa toàn bộ câu hỏi
  document.getElementById("clearBtn").addEventListener("click", function() {
    if (confirm("Bạn có chắc muốn xóa toàn bộ câu hỏi không?")) {
      questions = [];
      renderQuestions();
      alert("🗑️ Đã xóa toàn bộ câu hỏi!");
    }
  });

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
});
