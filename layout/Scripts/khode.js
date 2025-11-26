const KEY = 'all-quizzes';

// Dùng biến thay vì localStorage (hỗ trợ Claude artifacts)
let quizzesData = [];

// Load dữ liệu từ localStorage nếu có (khi chạy trên web thật)
function loadQuizzes() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(KEY);
      quizzesData = raw ? JSON.parse(raw) : [];
    }
  } catch (e) {
    console.log('localStorage không khả dụng');
  }
  return quizzesData;
}

// Save dữ liệu vào localStorage nếu có
function saveQuizzes(quizzes) {
  quizzesData = quizzes;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(KEY, JSON.stringify(quizzes));
    }
  } catch (e) {
    console.log('localStorage không khả dụng');
  }
}

function renderList() {
  const list = document.getElementById('list');
  const empty = document.getElementById('empty');
  const quizzes = loadQuizzes();
  list.innerHTML = '';
  
  if (!quizzes || quizzes.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  quizzes.slice().reverse().forEach(q => {
    const el = document.createElement('div');
    el.className = 'quiz-item';
    const createdDate = q.createdAt ? " • " + new Date(q.createdAt).toLocaleString() : "";
    
    el.innerHTML = `
      <div class="quiz-meta">
        <div class="quiz-title">${escapeHtml(q.title)}</div>
        <div class="quiz-desc">
          ${escapeHtml(q.description)}${createdDate}
        </div>
      </div>
      <div class="quiz-actions">
        <button class="btn btn-secondary" onclick="viewQuiz('${q.id}')">🔍 Xem</button>
        <button class="btn btn-secondary" onclick="exportQuiz('${q.id}')">📥 Xuất</button>
        <button class="btn btn-primary" onclick="deleteQuiz('${q.id}')">🗑️ Xóa</button>
      </div>
    `;
    list.appendChild(el);
  });
}

function viewQuiz(id) {
  const quizzes = loadQuizzes();
  const q = quizzes.find(x => String(x.id) === String(id));
  if (!q) return alert('Không tìm thấy đề');

  document.getElementById('detail').style.display = 'block';
  document.getElementById('list').style.display = 'none';
  document.getElementById('empty').style.display = 'none';
  document.getElementById('detailMeta').textContent = `${q.title} — ${q.description}`;

  const detailBox = document.getElementById('detailJson');
  let html = '';

  // Xử lý nếu có mảng questions
  if (Array.isArray(q.questions) && q.questions.length > 0) {
    q.questions.forEach((ques, index) => {
      const questionText = ques.question || '';
      const correctIdx = ques.correctAnswer !== undefined ? ques.correctAnswer : -1;
      
      html += `
        <div style="margin-bottom: 20px; padding: 15px; background: #f7f7f7; border-radius: 8px; border-left: 4px solid #667eea;">
          <div style="font-weight: 600; color: #333; font-size: 1.05em; margin-bottom: 12px;">
            ${index + 1}. ${escapeHtml(questionText)}
          </div>
          <ul style="margin: 0; padding-left: 20px;">
      `;
      
      if (Array.isArray(ques.answers)) {
        ques.answers.forEach((ans, i) => {
          const isCorrect = i === correctIdx;
          const icon = isCorrect ? '✅' : '❌';
          const bgColor = isCorrect ? 'background-color: #c6f6d5;' : '';
          
          html += `
            <li style="margin-bottom: 8px; padding: 8px; ${bgColor}">
              ${icon} ${escapeHtml(ans)}
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

function backToList() {
  document.getElementById('detail').style.display = 'none';
  document.getElementById('list').style.display = 'flex';
  renderList();
}

function exportQuiz(id) {
  const quizzes = loadQuizzes();
  const q = quizzes.find(x => String(x.id) === String(id));
  if (!q) return alert('Không tìm thấy đề');
  
  const blob = new Blob([JSON.stringify(q, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${q.title.replace(/\s+/g, '_') || 'quiz'}_${q.id}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function deleteQuiz(id) {
  if (!confirm('Xác nhận xóa đề này khỏi kho?')) return;
  let quizzes = loadQuizzes();
  quizzes = quizzes.filter(x => String(x.id) !== String(id));
  saveQuizzes(quizzes);
  renderList();
}

function clearAll() {
  if (!confirm('Xóa toàn bộ kho đề?')) return;
  saveQuizzes([]);
  renderList();
}

function exportAll() {
  const quizzes = loadQuizzes();
  if (!quizzes || quizzes.length === 0) return alert('Không có đề để xuất');
  
  const blob = new Blob([JSON.stringify(quizzes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kho_de_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importFile() {
  const fileInput = document.getElementById('importFile');
  if (fileInput) {
    fileInput.value = ''; // Reset file input
    fileInput.click();
  }
}

function handleFileImport(e) {
  const f = e.target.files[0];
  if (!f) {
    console.log('Không có file được chọn');
    return;
  }
  
  console.log('File được chọn:', f.name);
  
  const reader = new FileReader();
  
  reader.onload = (ev) => {
    try {
      console.log('Đọc file thành công');
      const data = JSON.parse(ev.target.result);
      console.log('JSON parsed:', data);
      
      let dataToImport = [];

      // Xử lý các định dạng JSON khác nhau
      if (Array.isArray(data)) {
        console.log('Là array, length:', data.length);
        // Nếu là array
        if (data.length > 0) {
          if (data[0].questions) {
            console.log('Format 1: Array of quiz objects');
            // Format: [{ title, description, questions: [...] }]
            dataToImport = data;
          } else if (data[0].question) {
            console.log('Format 2: Array of questions');
            // Format: [{ question, answers, correct/correctAnswer }]
            dataToImport = [{
              id: Date.now(),
              title: 'Nhập từ file',
              description: 'Đề thi nhập từ file',
              createdAt: new Date().toISOString(),
              questions: data.map(q => ({
                question: q.question || '',
                answers: q.answers || [],
                correctAnswer: q.correct !== undefined ? q.correct : (q.correctAnswer !== undefined ? q.correctAnswer : 0)
              }))
            }];
          } else {
            console.log('Format 3: Direct array import');
            dataToImport = data.map(d => {
              if (d.questions) {
                return d;
              }
              return {
                id: d.id || Date.now() + Math.random(),
                title: d.title || 'Đề không tên',
                description: d.description || '',
                createdAt: d.createdAt || new Date().toISOString(),
                questions: d.questions || []
              };
            });
          }
        }
      } else if (data.questions) {
        console.log('Format 4: Single quiz object with questions');
        // Format: { title, description, questions: [...] }
        dataToImport = [data];
      } else if (data.question) {
        console.log('Format 5: Single question object');
        // Format: { question, answers, correct/correctAnswer }
        dataToImport = [{
          id: Date.now(),
          title: 'Nhập từ file',
          description: 'Đề thi nhập từ file',
          createdAt: new Date().toISOString(),
          questions: [{
            question: data.question || '',
            answers: data.answers || [],
            correctAnswer: data.correct !== undefined ? data.correct : (data.correctAnswer !== undefined ? data.correctAnswer : 0)
          }]
        }];
      }

      console.log('Data to import:', dataToImport);

      if (dataToImport.length === 0) {
        alert('❌ Không thể nhận dạng định dạng file JSON.\n\nHãy kiểm tra file của bạn.');
        return;
      }

      // Thêm ID nếu chưa có
      dataToImport = dataToImport.map(d => ({
        ...d,
        id: d.id || Date.now() + Math.random(),
        createdAt: d.createdAt || new Date().toISOString()
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, s =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]
  );
}

// Event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  const backListBtn = document.getElementById('backList');
  const clearAllBtn = document.getElementById('clearAll');
  const exportAllBtn = document.getElementById('exportAll');
  const importBtn = document.getElementById('importBtn');
  const importFileInput = document.getElementById('importFile');

  console.log('backListBtn:', backListBtn);
  console.log('clearAllBtn:', clearAllBtn);
  console.log('exportAllBtn:', exportAllBtn);
  console.log('importBtn:', importBtn);
  console.log('importFileInput:', importFileInput);

  if (backListBtn) {
    backListBtn.addEventListener('click', backToList);
    console.log('✓ backListBtn listener added');
  }
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAll);
    console.log('✓ clearAllBtn listener added');
  }
  if (exportAllBtn) {
    exportAllBtn.addEventListener('click', exportAll);
    console.log('✓ exportAllBtn listener added');
  }
  if (importBtn) {
    importBtn.addEventListener('click', importFile);
    console.log('✓ importBtn listener added');
  }
  if (importFileInput) {
    importFileInput.addEventListener('change', handleFileImport);
    console.log('✓ importFileInput listener added');
  }

  renderList();
  console.log('Event listeners setup complete');
}

document.addEventListener('DOMContentLoaded', setupEventListeners);

// Nếu document đã load rồi, chạy ngay
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupEventListeners);
} else {
  setupEventListeners();
}