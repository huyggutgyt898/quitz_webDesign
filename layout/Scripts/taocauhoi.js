// ========== QUẢN LÝ TẠO CÂU HỎI - QUIZZKIT ==========
document.addEventListener("DOMContentLoaded", () => {
  
  // Biến toàn cục
  let quizInfo = {
    title: '',
    subject: '',
    questionCount: 0,
    description: ''
  };
  
  let questions = [];
  let editingIndex = -1;

  // Danh sách môn học
  const subjectLabels = {
    math: 'Toán học',
    physics: 'Vật lý',
    chemistry: 'Hóa học',
    biology: 'Sinh học',
    english: 'Tiếng Anh',
    literature: 'Văn học',
    history: 'Lịch sử',
    geography: 'Địa lý',
    it: 'Tin học',
    iq: 'IQ/Trí tuệ',
    other: 'Khác'
  };

  // ========== BƯỚC 1: THIẾT LẬP BỘ ĐỀ ==========
  document.getElementById("startCreatingBtn").addEventListener("click", function() {
    const title = document.getElementById("quizTitle").value.trim();
    const subject = document.getElementById("quizSubject").value;
    const questionCount = parseInt(document.getElementById("quizQuestionCount").value);
    const description = document.getElementById("quizDescription").value.trim();

    // Validate
    if (!title) {
      alert("⚠️ Vui lòng nhập tên bộ đề!");
      return;
    }
    if (questionCount < 1 || questionCount > 100) {
      alert("⚠️ Số lượng câu hỏi phải từ 1 đến 100!");
      return;
    }

    // Lưu thông tin
    quizInfo = { title, subject, questionCount, description };

    // Hiển thị thông tin lên step 2
    document.getElementById("displayQuizTitle").textContent = title;
    document.getElementById("displayQuizSubject").textContent = subjectLabels[subject];
    document.getElementById("progressText").textContent = `0/${questionCount}`;

    // Chuyển sang bước 2
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Nút quay lại step 1
  document.getElementById("backToStep1Btn").addEventListener("click", function() {
    if (questions.length > 0) {
      if (!confirm("Bạn có các câu hỏi chưa lưu. Quay lại sẽ mất dữ liệu. Tiếp tục?")) {
        return;
      }
    }
    document.getElementById("step2").style.display = "none";
    document.getElementById("step1").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ========== BƯỚC 2: TẠO CÂU HỎI ==========

  // Thêm câu hỏi
  document.getElementById("addQuestionBtn").addEventListener("click", function() {
    const text = document.getElementById("questionInput").value.trim();
    const difficulty = document.getElementById("difficulty").value;
    const answerA = document.getElementById("answerA").value.trim();
    const answerB = document.getElementById("answerB").value.trim();
    const answerC = document.getElementById("answerC").value.trim();
    const answerD = document.getElementById("answerD").value.trim();
    const correctAnswerElement = document.querySelector('input[name="correctAnswer"]:checked');

    // Validate
    if (!text) {
      alert("⚠️ Vui lòng nhập nội dung câu hỏi!");
      return;
    }
    if (!answerA || !answerB || !answerC || !answerD) {
      alert("⚠️ Vui lòng nhập đầy đủ 4 đáp án!");
      return;
    }
    if (!correctAnswerElement) {
      alert("⚠️ Vui lòng chọn đáp án đúng!");
      return;
    }

    const question = {
      id: editingIndex >= 0 ? questions[editingIndex].id : Date.now(),
      text: text,
      difficulty: difficulty,
      answers: {
        A: answerA,
        B: answerB,
        C: answerC,
        D: answerD
      },
      correctAnswer: correctAnswerElement.value
    };

    if (editingIndex >= 0) {
      // Cập nhật câu hỏi
      questions[editingIndex] = question;
      editingIndex = -1;
      document.getElementById("formTitle").textContent = "➕ Thêm Câu Hỏi Mới";
      document.getElementById("addQuestionBtn").textContent = "➕ Thêm câu hỏi";
      document.getElementById("cancelEditBtn").style.display = "none";
      alert("✅ Đã cập nhật câu hỏi!");
    } else {
      // Thêm mới
      questions.push(question);
      alert("✅ Đã thêm câu hỏi thành công!");
    }

    renderQuestions();
    resetForm();
    updateProgress();

    // Scroll xuống danh sách
    setTimeout(() => {
      document.getElementById("questionsList").scrollIntoView({ behavior: "smooth" });
    }, 100);
  });

  // Hủy chỉnh sửa
  document.getElementById("cancelEditBtn").addEventListener("click", function() {
    editingIndex = -1;
    resetForm();
    document.getElementById("formTitle").textContent = "➕ Thêm Câu Hỏi Mới";
    document.getElementById("addQuestionBtn").textContent = "➕ Thêm câu hỏi";
    document.getElementById("cancelEditBtn").style.display = "none";
  });

  // Reset form
  function resetForm() {
    document.getElementById("questionInput").value = "";
    document.getElementById("difficulty").value = "medium";
    document.getElementById("answerA").value = "";
    document.getElementById("answerB").value = "";
    document.getElementById("answerC").value = "";
    document.getElementById("answerD").value = "";
    const radios = document.querySelectorAll('input[name="correctAnswer"]');
    radios.forEach(r => r.checked = false);
  }

  // Cập nhật tiến độ
  function updateProgress() {
    const current = questions.length;
    const total = quizInfo.questionCount;
    const percent = Math.round((current / total) * 100);
    
    document.getElementById("progressText").textContent = `${current}/${total}`;
    document.getElementById("progressFill").style.width = Math.min(percent, 100) + "%";
  }

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

    container.innerHTML = questions.map((q, i) => {
      const difficultyClass = q.difficulty === 'easy' ? 'difficulty-easy' : 
                              q.difficulty === 'medium' ? 'difficulty-medium' : 'difficulty-hard';
      const difficultyText = q.difficulty === 'easy' ? 'Dễ' : 
                             q.difficulty === 'medium' ? 'Trung bình' : 'Khó';
      
      return `
        <div class="question-item">
          <div class="question-header">
            <div class="question-title-row">
              <div class="question-title">Câu ${i + 1}: ${q.text}</div>
              <span class="meta-badge ${difficultyClass}">${difficultyText}</span>
            </div>
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
      `;
    }).join("");
  }

  // Sửa câu hỏi
  window.editQuestion = function(index) {
    const q = questions[index];
    editingIndex = index;
    
    document.getElementById("questionInput").value = q.text;
    document.getElementById("difficulty").value = q.difficulty;
    document.getElementById("answerA").value = q.answers.A;
    document.getElementById("answerB").value = q.answers.B;
    document.getElementById("answerC").value = q.answers.C;
    document.getElementById("answerD").value = q.answers.D;
    document.querySelector(`input[value="${q.correctAnswer}"]`).checked = true;
    
    document.getElementById("formTitle").textContent = "✏️ Sửa Câu Hỏi";
    document.getElementById("addQuestionBtn").textContent = "💾 Cập nhật câu hỏi";
    document.getElementById("cancelEditBtn").style.display = "inline-block";
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xóa câu hỏi
  window.deleteQuestion = function(index) {
    if (confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      questions.splice(index, 1);
      renderQuestions();
      updateProgress();
    }
  };

  // Xóa tất cả câu hỏi
  document.getElementById("clearBtn").addEventListener("click", function() {
    if (questions.length === 0) {
      alert("⚠️ Chưa có câu hỏi nào để xóa!");
      return;
    }
    if (confirm("Bạn có chắc muốn xóa toàn bộ câu hỏi không?")) {
      questions = [];
      renderQuestions();
      updateProgress();
      alert("🗑️ Đã xóa toàn bộ câu hỏi!");
    }
  });

  // Lưu bộ đề
  document.getElementById("saveBtn").addEventListener("click", function() {
    if (questions.length === 0) {
      alert("⚠️ Chưa có câu hỏi nào để lưu!");
      return;
    }

    try {
      // Chuyển đổi format câu hỏi
      const convertedQuestions = questions.map(q => ({
        id: q.id,
        question: q.text,
        answers: [q.answers.A, q.answers.B, q.answers.C, q.answers.D],
        correctAnswer: ["A","B","C","D"].indexOf(q.correctAnswer),
        difficulty: q.difficulty,
        subject: quizInfo.subject
      }));

      // Tạo object bộ đề
      const newQuiz = {
        id: Date.now(),
        title: quizInfo.title,
        description: quizInfo.description || `${questions.length} câu hỏi - ${subjectLabels[quizInfo.subject]}`,
        subject: quizInfo.subject,
        questions: convertedQuestions,
        createdAt: new Date().toISOString()
      };

      // Lưu vào localStorage
      const KEY = "all-quizzes";
      const raw = localStorage.getItem(KEY);
      const quizzes = raw ? JSON.parse(raw) : [];
      quizzes.push(newQuiz);
      localStorage.setItem(KEY, JSON.stringify(quizzes));

      alert("✅ Đã lưu bộ đề vào kho thành công!");

      // Hỏi có muốn chuyển sang kho đề không
      if (confirm("Bạn có muốn chuyển đến trang Kho Đề không?")) {
        window.location.href = "khode.html";
      } else {
        // Reset và quay về step 1
        questions = [];
        quizInfo = { title: '', subject: '', questionCount: 0, description: '' };
        document.getElementById("quizTitle").value = "";
        document.getElementById("quizSubject").value = "math";
        document.getElementById("quizQuestionCount").value = "10";
        document.getElementById("quizDescription").value = "";
        document.getElementById("step2").style.display = "none";
        document.getElementById("step1").style.display = "block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

    } catch (err) {
      alert("❌ Lỗi khi lưu: " + err.message);
    }
  });

});