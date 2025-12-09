const KEY = 'all-quizzes';

// Load dữ liệu từ localStorage
function loadQuizzes() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.log('Lỗi khi load:', e);
    return [];
  }
}

// Save dữ liệu vào localStorage
function saveQuizzes(quizzes) {
  try {
    localStorage.setItem(KEY, JSON.stringify(quizzes));
  } catch (e) {
    console.log('Lỗi khi save:', e);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, s =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]
  );
}

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

// Render danh sách đề
function renderList() {
  const list = document.getElementById('list');
  const empty = document.getElementById('empty');
  const quizzes = loadQuizzes();
  
  list.innerHTML = '';
  
  if (!quizzes || quizzes.length === 0) {
    list.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  
  list.style.display = 'grid';
  empty.style.display = 'none';

  quizzes.slice().reverse().forEach(q => {
    const el = document.createElement('div');
    el.className = 'quiz-card';
    
    const questionCount = q.questions ? q.questions.length : 0;
    const subjectName = subjectLabels[q.subject] || q.subject || 'Chưa phân loại';
    const createdDate = q.createdAt ? new Date(q.createdAt).toLocaleDateString('vi-VN') : '';
    
    // Kiểm tra có ảnh không
    const hasImage = q.image && q.image.length > 0;
    const imageHtml = hasImage ? 
      `<div class="quiz-card-image" style="background-image: url('${q.image}')"></div>` :
      `<div class="quiz-card-image quiz-card-placeholder">
        <span>📝</span>
      </div>`;
    
    el.innerHTML = `
      ${imageHtml}
      <div class="quiz-card-content">
        <div class="quiz-card-header">
          <h3 class="quiz-card-title">${escapeHtml(q.title)}</h3>
          <span class="quiz-card-badge">${subjectName}</span>
        </div>
        <p class="quiz-card-desc">${escapeHtml(q.description || 'Không có mô tả')}</p>
        <div class="quiz-card-meta">
          <span>📊 ${questionCount} câu hỏi</span>
          ${createdDate ? `<span>📅 ${createdDate}</span>` : ''}
        </div>
        <div class="quiz-card-actions">
          <button class="btn-card btn-view" onclick="viewQuiz('${q.id}')">👁️ Xem</button>
          <button class="btn-card btn-export-json" onclick="exportQuizJSON('${q.id}')">📄 JSON</button>
          <button class="btn-card btn-export-html" onclick="exportQuizHTML('${q.id}')">🌐 HTML</button>
          <button class="btn-card btn-delete" onclick="deleteQuiz('${q.id}')">🗑️ Xóa</button>
        </div>
      </div>
    `;
    list.appendChild(el);
  });
}

// Xem chi tiết đề
function viewQuiz(id) {
  const quizzes = loadQuizzes();
  const q = quizzes.find(x => String(x.id) === String(id));
  if (!q) return alert('Không tìm thấy đề');

  document.getElementById('detail').style.display = 'block';
  document.getElementById('list').style.display = 'none';
  document.getElementById('empty').style.display = 'none';
  document.querySelector('.topbar').style.display = 'none';
  
  const subjectName = subjectLabels[q.subject] || q.subject || 'Chưa phân loại';
  document.getElementById('detailMeta').textContent = `${q.title} — ${subjectName} — ${q.questions ? q.questions.length : 0} câu hỏi`;

  const detailBox = document.getElementById('detailJson');
  let html = '';

  // Hiển thị ảnh nếu có
  if (q.image && q.image.length > 0) {
    html += `
      <div style="margin-bottom: 20px; text-align: center;">
        <img src="${q.image}" alt="${escapeHtml(q.title)}" style="max-width: 100%; max-height: 300px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      </div>
    `;
  }

  // Xử lý nếu có mảng questions
  if (Array.isArray(q.questions) && q.questions.length > 0) {
    q.questions.forEach((ques, index) => {
      const questionText = ques.question || '';
      const correctIdx = ques.correct !== undefined ? ques.correct : (ques.correctAnswer !== undefined ? ques.correctAnswer : -1);
      const letters = ['A', 'B', 'C', 'D'];
      
      html += `
        <div style="margin-bottom: 20px; padding: 15px; background: #f7f7f7; border-radius: 8px; border-left: 4px solid #667eea;">
          <div style="font-weight: 600; color: #333; font-size: 1.05em; margin-bottom: 12px;">
            Câu ${index + 1}: ${escapeHtml(questionText)}
          </div>
          <ul style="margin: 0; padding-left: 20px; list-style: none;">
      `;
      
      if (Array.isArray(ques.answers)) {
        ques.answers.forEach((ans, i) => {
          const isCorrect = i === correctIdx;
          const icon = isCorrect ? '✅' : '❌';
          const bgColor = isCorrect ? 'background-color: #c6f6d5;' : '';
          
          html += `
            <li style="margin-bottom: 8px; padding: 8px; ${bgColor} border-radius: 5px;">
              <strong>${letters[i]}.</strong> ${escapeHtml(ans)} ${icon}
            </li>
          `;
        });
      }
      
      html += `
          </ul>
        </div>
      `;
    });
    detailBox.innerHTML = html;
  } else {
    // Hiển thị JSON gốc nếu không có questions
    detailBox.textContent = JSON.stringify(q, null, 2);
  }
}

// Quay lại danh sách
function backToList() {
  document.getElementById('detail').style.display = 'none';
  document.getElementById('list').style.display = 'grid';
  document.querySelector('.topbar').style.display = 'flex';
  renderList();
}

// Xuất 1 bộ đề dạng JSON
function exportQuizJSON(id) {
  const quizzes = loadQuizzes();
  const q = quizzes.find(x => String(x.id) === String(id));
  if (!q) return alert('Không tìm thấy đề');

  const fileName = (q.title || 'quiz').replace(/[^a-zA-Z0-9]/g, '_');
  
  // Xuất file JSON (chỉ phần questions)
  const questionsData = q.questions || [];
  const blob = new Blob([JSON.stringify(questionsData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}_questions.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  
  alert('✅ Đã xuất file JSON!');
}

// Xuất 1 bộ đề dạng HTML (giống Quizgecko)
function exportQuizHTML(id) {
  const quizzes = loadQuizzes();
  const q = quizzes.find(x => String(x.id) === String(id));
  if (!q) return alert('Không tìm thấy đề');

  const fileName = (q.title || 'quiz').replace(/[^a-zA-Z0-9]/g, '_');
  const subjectName = subjectLabels[q.subject] || q.subject || 'Chưa phân loại';
  const questionCount = q.questions ? q.questions.length : 0;
  const letters = ['A', 'B', 'C', 'D'];
  
  let questionsHTML = '';
  if (Array.isArray(q.questions) && q.questions.length > 0) {
    q.questions.forEach((ques, index) => {
      const correctIdx = ques.correct !== undefined ? ques.correct : (ques.correctAnswer !== undefined ? ques.correctAnswer : -1);
      
      questionsHTML += `
        <div class="question-block">
          <h3>Câu ${index + 1}: ${escapeHtml(ques.question || '')}</h3>
          <div class="answers">
      `;
      
      if (Array.isArray(ques.answers)) {
        ques.answers.forEach((ans, i) => {
          const isCorrect = i === correctIdx;
          const className = isCorrect ? 'answer correct' : 'answer';
          questionsHTML += `
            <div class="${className}">
              <strong>${letters[i]}.</strong> ${escapeHtml(ans)}
              ${isCorrect ? '<span class="correct-mark">✓ Đáp án đúng</span>' : ''}
            </div>
          `;
        });
      }
      
      questionsHTML += `
          </div>
        </div>
      `;
    });
  }

  const imageHTML = q.image && q.image.length > 0 ? 
    `<img src="${q.image}" alt="${escapeHtml(q.title)}" class="quiz-image">` : '';

  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(q.title)} - QUIZZKIT</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .header .meta {
      opacity: 0.9;
      font-size: 16px;
    }
    .quiz-image {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
    }
    .content {
      padding: 40px;
    }
    .description {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
      border-left: 4px solid #667eea;
    }
    .question-block {
      margin-bottom: 35px;
      padding: 25px;
      background: #f8f9fa;
      border-radius: 12px;
      border-left: 4px solid #667eea;
    }
    .question-block h3 {
      color: #333;
      margin-bottom: 20px;
      font-size: 18px;
      line-height: 1.6;
    }
    .answers {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .answer {
      padding: 15px;
      background: white;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
      transition: all 0.3s;
    }
    .answer.correct {
      background: #c6f6d5;
      border-color: #48bb78;
      font-weight: 600;
    }
    .correct-mark {
      float: right;
      color: #48bb78;
      font-weight: bold;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      border-top: 1px solid #e0e0e0;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${escapeHtml(q.title)}</h1>
      <div class="meta">${subjectName} • ${questionCount} câu hỏi</div>
    </div>
    ${imageHTML}
    <div class="content">
      ${q.description ? `<div class="description"><strong>Mô tả:</strong> ${escapeHtml(q.description)}</div>` : ''}
      ${questionsHTML}
    </div>
    <div class="footer">
      <p>Được tạo bởi QUIZZKIT • ${new Date().toLocaleDateString('vi-VN')}</p>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}_quiz.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  
  alert('✅ Đã xuất file HTML!\n\nBạn có thể mở file để xem hoặc in ra giấy.');
}

// Xóa 1 đề
function deleteQuiz(id) {
  if (!confirm('Xác nhận xóa đề này khỏi kho?')) return;
  let quizzes = loadQuizzes();
  quizzes = quizzes.filter(x => String(x.id) !== String(id));
  saveQuizzes(quizzes);
  renderList();
}

// Xóa tất cả
function clearAll() {
  if (!confirm('Xóa toàn bộ kho đề?')) return;
  saveQuizzes([]);
  renderList();
}

// Xuất tất cả
function exportAll() {
  const quizzes = loadQuizzes();
  if (!quizzes || quizzes.length === 0) return alert('Không có đề để xuất');
  
  if (!confirm(`Bạn muốn xuất ${quizzes.length} bộ đề?\nMỗi bộ sẽ có file JSON và HTML`)) {
    return;
  }

  let delay = 0;
  
  quizzes.forEach((q, index) => {
    const fileName = (q.title || `quiz_${index + 1}`).replace(/[^a-zA-Z0-9]/g, '_');

    // Download file JSON
    setTimeout(() => {
      const questionsData = q.questions || [];
      const blob = new Blob([JSON.stringify(questionsData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}_questions.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, delay);
    delay += 400;
  });

  alert(`Đang xuất ${quizzes.length} file...\nVui lòng cho phép trình duyệt tải nhiều file`);
}

// Import file
function importFile() {
  const fileInput = document.getElementById('importFile');
  if (fileInput) {
    fileInput.value = '';
    fileInput.click();
  }
}

function handleFileImport(e) {
  const f = e.target.files[0];
  if (!f) return;
  
  const reader = new FileReader();
  
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      let dataToImport = [];

      // Xử lý các định dạng JSON khác nhau
      if (Array.isArray(data)) {
        if (data.length > 0) {
          if (data[0].questions) {
            dataToImport = data;
          } else if (data[0].question) {
            dataToImport = [{
              id: Date.now(),
              title: 'Nhập từ file',
              description: 'Đề thi nhập từ file',
              subject: 'other',
              createdAt: new Date().toISOString(),
              questions: data.map(q => ({
                question: q.question || '',
                answers: q.answers || [],
                correct: q.correct !== undefined ? q.correct : (q.correctAnswer !== undefined ? q.correctAnswer : 0)
              }))
            }];
          }
        }
      } else if (data.questions) {
        dataToImport = [data];
      } else if (data.question) {
        dataToImport = [{
          id: Date.now(),
          title: 'Nhập từ file',
          description: 'Đề thi nhập từ file',
          subject: 'other',
          createdAt: new Date().toISOString(),
          questions: [{
            question: data.question || '',
            answers: data.answers || [],
            correct: data.correct !== undefined ? data.correct : (data.correctAnswer !== undefined ? data.correctAnswer : 0)
          }]
        }];
      }

      if (dataToImport.length === 0) {
        alert('❌ Không thể nhận dạng định dạng file JSON.\n\nHãy kiểm tra file của bạn.');
        return;
      }

      // Thêm ID nếu chưa có
      dataToImport = dataToImport.map(d => ({
        ...d,
        id: d.id || Date.now() + Math.random(),
        createdAt: d.createdAt || new Date().toISOString(),
        subject: d.subject || 'other'
      }));

      const existing = loadQuizzes();
      const merged = existing.concat(dataToImport);
      saveQuizzes(merged);
      renderList();
      alert('✅ Nhập thành công ' + dataToImport.length + ' đề!');
    } catch (err) {
      console.error('Lỗi:', err);
      alert('❌ Lỗi file JSON:\n' + err.message);
    }
  };
  
  reader.onerror = () => {
    alert('❌ Lỗi khi đọc file');
  };
  
  reader.readAsText(f);
}

// Event listeners
function setupEventListeners() {
  const backListBtn = document.getElementById('backList');
  const clearAllBtn = document.getElementById('clearAll');
  const exportAllBtn = document.getElementById('exportAll');
  const importBtn = document.getElementById('importBtn');
  const importFileInput = document.getElementById('importFile');

  if (backListBtn) {
    backListBtn.addEventListener('click', backToList);
  }
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAll);
  }
  if (exportAllBtn) {
    exportAllBtn.addEventListener('click', exportAll);
  }
  if (importBtn) {
    importBtn.addEventListener('click', importFile);
  }
  if (importFileInput) {
    importFileInput.addEventListener('change', handleFileImport);
  }

  renderList();
}

// Chạy khi DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupEventListeners);
} else {
  setupEventListeners();
}