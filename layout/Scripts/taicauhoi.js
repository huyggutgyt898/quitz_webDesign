let extractedQuestions = [];

// Upload zone interactions
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');

uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

async function handleFile(file) {
  const fileName = file.name.toLowerCase();
  
  document.getElementById('processing').classList.add('active');
  uploadZone.style.display = 'none';

  try {
    if (fileName.endsWith('.docx')) {
      await processWordFile(file);
    } else if (fileName.endsWith('.xlsx')) {
      await processExcelFile(file);
    } else if (fileName.endsWith('.json')) {
      await processJSONFile(file);
    } else if (fileName.match(/\.(jpg|jpeg|png)$/)) {
      await processImageFile(file);
    }

    displayQuestions();
  } catch (error) {
    alert('Lỗi xử lý file: ' + error.message);
    resetUpload();
  }
}

async function processWordFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;
  
  parseQuestionsFromText(text);
}

async function processExcelFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  
  parseQuestionsFromExcel(data);
}

async function processImageFile(file) {
  const { data: { text } } = await Tesseract.recognize(file, 'vie');
  parseQuestionsFromText(text);
}

async function processJSONFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);

  let rawQuestions = [];

  if (Array.isArray(data)) {
    rawQuestions = data;
  } else if (data.questions && Array.isArray(data.questions)) {
    rawQuestions = data.questions;
  } else {
    throw new Error('Format JSON không được hỗ trợ. Vui lòng dùng dạng array hoặc object có key "questions"');
  }

  extractedQuestions = rawQuestions.map((q, index) => {
    // Trích câu hỏi
    const questionText = q.question || q.text || q.title || '';

    // Chuẩn hoá đáp án: có thể là object hoặc array
    let answers = [];
    if (Array.isArray(q.answers)) {
      // Định dạng mới: answers là array
      answers = q.answers;
    } else if (typeof q.answers === 'object' && q.answers !== null) {
      // Định dạng cũ: answers là object {A: "...", B: "...", C: "...", D: "..."}
      // Sắp xếp theo thứ tự A, B, C, D
      answers = ['A', 'B', 'C', 'D']
        .map(key => q.answers[key])
        .filter(val => val !== undefined && val !== null && val !== '');
    }

    // Chuẩn hoá đáp án đúng
    let correctAnswerIndex = 0;
    if (typeof q.correctAnswer === 'string') {
      // Nếu là ký tự A/B/C/D → chuyển thành chỉ số
      const letterIndex = ['A', 'B', 'C', 'D'].indexOf(q.correctAnswer.toUpperCase());
      correctAnswerIndex = letterIndex >= 0 ? letterIndex : 0;
    } else if (typeof q.correctAnswer === 'number') {
      correctAnswerIndex = q.correctAnswer;
    } else if (typeof q.correct === 'number') {
      correctAnswerIndex = q.correct;
    } else if (typeof q.answer === 'number') {
      correctAnswerIndex = q.answer;
    }

    return {
      id: Date.now() + index,
      question: questionText,
      answers: answers,
      correctAnswer: correctAnswerIndex,
      difficulty: q.difficulty || 'medium',
      subject: q.subject || 'general',
      image: q.image || null
    };
  });

  if (extractedQuestions.length === 0) {
    throw new Error('Không tìm thấy câu hỏi trong file JSON');
  }
}

function parseQuestionsFromText(text) {
  // Simple parser - phát hiện câu hỏi dựa trên pattern
  const lines = text.split('\n').filter(line => line.trim());
  let currentQuestion = null;
  
  lines.forEach((line, index) => {
    // Phát hiện câu hỏi (bắt đầu bằng số hoặc "Câu")
    if (/^(Câu\s+)?\d+[\.:)\s]/.test(line)) {
      if (currentQuestion) {
        extractedQuestions.push(currentQuestion);
      }
      currentQuestion = {
        id: Date.now() + index,
        question: line.replace(/^(Câu\s+)?\d+[\.:)\s]+/, '').trim(),
        answers: [],
        correctAnswer: 0
      };
    }
    // Phát hiện đáp án
    else if (currentQuestion && /^[A-D][\.:)\s]/.test(line)) {
      const answerText = line.replace(/^[A-D][\.:)\s]+/, '').trim();
      currentQuestion.answers.push(answerText);
      
      // Phát hiện đáp án đúng (nếu có dấu hiệu như *, √, ✓)
      if (/[\*√✓]/.test(line)) {
        currentQuestion.correctAnswer = currentQuestion.answers.length - 1;
      }
    }
  });
  
  if (currentQuestion) {
    extractedQuestions.push(currentQuestion);
  }

  // Nếu không tìm thấy câu hỏi, tạo mẫu demo
  if (extractedQuestions.length === 0) {
    createDemoQuestions();
  }
}

function parseQuestionsFromExcel(data) {
  // Giả định: Cột A = câu hỏi, B-E = đáp án, F = đáp án đúng
  data.slice(1).forEach((row, index) => {
    if (row[0]) {
      extractedQuestions.push({
        id: Date.now() + index,
        question: row[0],
        answers: [row[1], row[2], row[3], row[4]].filter(a => a),
        correctAnswer: row[5] ? parseInt(row[5]) - 1 : 0
      });
    }
  });

  if (extractedQuestions.length === 0) {
    createDemoQuestions();
  }
}

function createDemoQuestions() {
  extractedQuestions = [
    {
      id: Date.now(),
      question: "Thủ đô của Việt Nam là gì?",
      answers: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Huế"],
      correctAnswer: 0
    },
    {
      id: Date.now() + 1,
      question: "2 + 2 bằng bao nhiêu?",
      answers: ["3", "4", "5", "6"],
      correctAnswer: 1
    },
    {
      id: Date.now() + 2,
      question: "Hành tinh nào gần Mặt Trời nhất?",
      answers: ["Trái Đất", "Sao Hỏa", "Sao Thủy", "Sao Kim"],
      correctAnswer: 2
    }
  ];
}

function displayQuestions() {
  document.getElementById('processing').classList.remove('active');
  document.getElementById('questionsContainer').classList.add('active');
  document.getElementById('bottomActions').classList.add('active');

  const questionsList = document.getElementById('questionsList');
  questionsList.innerHTML = '';

  extractedQuestions.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `
      <div class="question-header">
        <span class="question-number">Câu ${index + 1}</span>
        <div class="question-actions">
          <button class="btn-edit" onclick="editQuestion(${q.id})">✏️ Sửa</button>
          <button class="btn-delete" onclick="deleteQuestion(${q.id})">🗑️ Xóa</button>
        </div>
      </div>
      <div class="question-text">${q.question}</div>
      ${q.answers.map((answer, i) => `
        <div class="answer-option ${i === q.correctAnswer ? 'correct' : ''}">
          <span class="answer-label">${String.fromCharCode(65 + i)}.</span>
          <span>${answer}</span>
          ${i === q.correctAnswer ? '<span style="margin-left: auto; color: #4CAF50; font-weight: bold;">✓ Đúng</span>' : ''}
        </div>
      `).join('')}
    `;
    questionsList.appendChild(questionDiv);
  });
}

function editQuestion(id) {
  const question = extractedQuestions.find(q => q.id === id);
  const newQuestion = prompt('Sửa câu hỏi:', question.question);
  if (newQuestion) {
    question.question = newQuestion;
    displayQuestions();
  }
}

function deleteQuestion(id) {
  if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
    extractedQuestions = extractedQuestions.filter(q => q.id !== id);
    displayQuestions();
  }
}

async function saveQuestions() {
  try {
    // Lấy dữ liệu cũ trong localStorage
    const existingData = localStorage.getItem('all-quizzes');
    const quizzes = existingData ? JSON.parse(existingData) : [];

    // Tạo đề thi mới
    const newQuiz = {
      id: Date.now(),
      title: `Đề thi ${new Date().toLocaleDateString('vi-VN')}`,
      description: `${extractedQuestions.length} câu hỏi được nhập từ file`,
      questions: extractedQuestions,
      createdAt: new Date().toISOString()
    };

    // Thêm vào danh sách đề hiện có
    quizzes.push(newQuiz);

    // Lưu danh sách mới vào localStorage
    localStorage.setItem('all-quizzes', JSON.stringify(quizzes));

    // Hiển thị modal thông báo thành công
    document.getElementById('successModal').classList.add('active');

    // Sau 0.9s thì ẩn modal và chuyển sang kho đề
    setTimeout(() => {
      document.getElementById('successModal').classList.remove('active');
      window.location.href = 'khode.html';
    }, 900);

  } catch (error) {
    alert('Lỗi khi lưu: ' + error.message);
  }
}

function resetUpload() {
  extractedQuestions = [];
  document.getElementById('processing').classList.remove('active');
  document.getElementById('questionsContainer').classList.remove('active');
  document.getElementById('bottomActions').classList.remove('active');
  uploadZone.style.display = 'block';
  fileInput.value = '';
}

function closeModal() {
  document.getElementById('successModal').classList.remove('active');
  window.location.href = 'quizzes.html';
}

function exportToJSON() {
  // Tạo object JSON với format chuẩn
  const exportData = {
    title: `Đề thi ${new Date().toLocaleDateString('vi-VN')}`,
    description: `${extractedQuestions.length} câu hỏi`,
    createdAt: new Date().toISOString(),
    questions: extractedQuestions.map((q, index) => ({
      id: index + 1,
      question: q.question,
      answers: q.answers,
      correctAnswer: q.correctAnswer
    }))
  };

  // Chuyển thành JSON string với format đẹp
  const jsonString = JSON.stringify(exportData, null, 2);
  
  // Tạo Blob và download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quiz-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert('✅ Đã xuất file JSON thành công!');
}

