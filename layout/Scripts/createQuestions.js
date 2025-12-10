// ========== QUẢN LÝ TẠO CÂU HỎI - QUIZZKIT V2 ==========
document.addEventListener("DOMContentLoaded", () => {
  
  // Biến toàn cục
  let quizInfo = {
    title: '',
    subject: '',
    questionCount: 0,
    description: '',
    image: '' // Base64 string của ảnh
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

  // ========== XỬ LÝ UPLOAD ẢNH ==========
  const imageInput = document.getElementById("quizImage");
  const imagePreview = document.getElementById("imagePreview");
  const imagePlaceholder = document.getElementById("imagePlaceholder");
  const previewImg = document.getElementById("previewImg");
  const removeImageBtn = document.getElementById("removeImageBtn");

  // Click vào preview để mở file picker
  imagePreview.addEventListener("click", () => {
    if (!previewImg.style.display || previewImg.style.display === "none") {
      imageInput.click();
    }
  });

  // Xử lý khi chọn file
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("⚠️ Vui lòng chọn file ảnh!");
        return;
      }
      
      // Kiểm tra kích thước (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("⚠️ Kích thước ảnh không được vượt quá 5MB!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        quizInfo.image = event.target.result;
        previewImg.src = event.target.result;
        previewImg.style.display = "block";
        imagePlaceholder.style.display = "none";
        removeImageBtn.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // Xóa ảnh
  removeImageBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    quizInfo.image = '';
    previewImg.src = '';
    previewImg.style.display = "none";
    imagePlaceholder.style.display = "flex";
    removeImageBtn.style.display = "none";
    imageInput.value = '';
  });

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
    quizInfo.title = title;
    quizInfo.subject = subject;
    quizInfo.questionCount = questionCount;
    quizInfo.description = description;

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
    const answer0 = document.getElementById("answer0").value.trim();
    const answer1 = document.getElementById("answer1").value.trim();
    const answer2 = document.getElementById("answer2").value.trim();
    const answer3 = document.getElementById("answer3").value.trim();
    const correctAnswerElement = document.querySelector('input[name="correctAnswer"]:checked');

    // Validate
    if (!text) {
      alert("⚠️ Vui lòng nhập nội dung câu hỏi!");
      return;
    }
    if (!answer0 || !answer1 || !answer2 || !answer3) {
      alert("⚠️ Vui lòng nhập đầy đủ 4 đáp án!");
      return;
    }
    if (!correctAnswerElement) {
      alert("⚠️ Vui lòng chọn đáp án đúng!");
      return;
    }

    // Tạo object câu hỏi theo format mới
    const question = {
      question: text,
      answers: [answer0, answer1, answer2, answer3],
      correct: parseInt(correctAnswerElement.value)
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
    document.getElementById("answer0").value = "";
    document.getElementById("answer1").value = "";
    document.getElementById("answer2").value = "";
    document.getElementById("answer3").value = "";
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
      const letters = ['A', 'B', 'C', 'D'];
      
      return `
        <div class="question-item">
          <div class="question-header">
            <div class="question-title-row">
              <div class="question-title">Câu ${i + 1}: ${q.question}</div>
            </div>
            <div class="question-actions">
              <button class="btn-small btn-edit" onclick="editQuestion(${i})">✏️ Sửa</button>
              <button class="btn-small btn-delete" onclick="deleteQuestion(${i})">🗑️ Xóa</button>
            </div>
          </div>
          <div class="answers-display">
            ${q.answers.map((ans, idx) => `
              <div class="answer-display ${q.correct === idx ? "correct" : ""}">
                <span class="answer-prefix">${letters[idx]}.</span> ${ans}
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
    
    document.getElementById("questionInput").value = q.question;
    document.getElementById("answer0").value = q.answers[0];
    document.getElementById("answer1").value = q.answers[1];
    document.getElementById("answer2").value = q.answers[2];
    document.getElementById("answer3").value = q.answers[3];
    document.querySelector(`input[name="correctAnswer"][value="${q.correct}"]`).checked = true;
    
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
      // Tạo object bộ đề
      const newQuiz = {
        id: Date.now(),
        title: quizInfo.title,
        description: quizInfo.description || `${questions.length} câu hỏi - ${subjectLabels[quizInfo.subject]}`,
        subject: quizInfo.subject,
        image: quizInfo.image || '', // Lưu base64 của ảnh
        questions: questions,
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
        window.location.href = "questionLibrary.html";
      } else {
        // Reset và quay về step 1
        questions = [];
        quizInfo = { title: '', subject: '', questionCount: 0, description: '', image: '' };
        document.getElementById("quizTitle").value = "";
        document.getElementById("quizSubject").value = "math";
        document.getElementById("quizQuestionCount").value = "10";
        document.getElementById("quizDescription").value = "";
        previewImg.src = '';
        previewImg.style.display = "none";
        imagePlaceholder.style.display = "flex";
        removeImageBtn.style.display = "none";
        imageInput.value = '';
        document.getElementById("step2").style.display = "none";
        document.getElementById("step1").style.display = "block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

    } catch (err) {
      alert("❌ Lỗi khi lưu: " + err.message);
    }
  });

});