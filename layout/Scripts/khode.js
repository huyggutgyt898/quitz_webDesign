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
  
  list.style.display = 'flex';
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

// Xem chi tiết đề
function viewQuiz(id) {
  const quizzes = loadQuizzes();
  const q = quizzes.find(x => String(x.id) === String(id));
  if (!q) return alert('Không tìm thấy đề');

  document.getElementById('detail').style.display = 'block';
  document.getElementById('list').style.display = 'none';
  document.getElementById('empty').style.display = 'none';
  document.querySelector('.topbar').style.display = 'none';
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

// Quay lại danh sách
function backToList() {
  document.getElementById('detail').style.display = 'none';
  document.getElementById('list').style.display = 'flex';
  document.querySelector('.topbar').style.display = 'flex';
  renderList();
}

// Xuất 1 bộ đề (tách thành 2 file: info.json và questions.json)
function exportQuiz(id) {
  const quizzes = loadQuizzes();
  const q = quizzes.find(x => String(x.id) === String(id));
  if (!q) return alert('Không tìm thấy đề');

  const fileName = (q.title || 'quiz').replace(/[^a-zA-Z0-9]/g, '_');

  // File 1: Thông tin đề thi (info)
  const infoData = {
    id: q.id,
    title: q.title,
    description: q.description || '',
    createdAt: q.createdAt,
    totalQuestions: q.questions ? q.questions.length : 0
  };

  // File 2: Danh sách câu hỏi (questions)
  const questionsData = q.questions || [];

  // Xuất file info.json
  const blob1 = new Blob([JSON.stringify(infoData, null, 2)], { type: 'application/json' });
  const url1 = URL.createObjectURL(blob1);
  const a1 = document.createElement('a');
  a1.href = url1;
  a1.download = `${fileName}_info.json`;
  document.body.appendChild(a1);
  a1.click();
  a1.remove();
  URL.revokeObjectURL(url1);

  // Delay nhỏ rồi xuất file questions.json
  setTimeout(() => {
    const blob2 = new Blob([JSON.stringify(questionsData, null, 2)], { type: 'application/json' });
    const url2 = URL.createObjectURL(blob2);
    const a2 = document.createElement('a');
    a2.href = url2;
    a2.download = `questions.json`; // Tên cố định để dễ thay thế
    document.body.appendChild(a2);
    a2.click();
    a2.remove();
    URL.revokeObjectURL(url2);
    
    alert('✅ Đã xuất file!\n\n📝 Hướng dẫn:\n1. File "questions.json" đã tải
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

// Xuất tất cả (mỗi bộ đề 2 file riêng)
function exportAll() {
  const quizzes = loadQuizzes();
  if (!quizzes || quizzes.length === 0) return alert('Không có đề để xuất');
  
  if (!confirm(`Bạn muốn xuất ${quizzes.length} bộ đề?\nMỗi bộ sẽ có 2 file (info + questions)`)) {
    return;
  }

  let delay = 0;
  
  quizzes.forEach((q, index) => {
    const fileName = (q.title || `quiz_${index + 1}`).replace(/[^a-zA-Z0-9]/g, '_');

    // File 1: Thông tin đề thi
    const infoData = {
      id: q.id,
      title: q.title,
      description: q.description || '',
      createdAt: q.createdAt,
      totalQuestions: q.questions ? q.questions.length : 0
    };

    // File 2: Danh sách câu hỏi
    const questionsData = q.questions || [];

    // Download file info
    setTimeout(() => {
      const blob = new Blob([JSON.stringify(infoData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}_info.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, delay);
    delay += 400;

    // Download file questions
    setTimeout(() => {
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

  alert(`Đang xuất ${quizzes.length * 2} file...\nVui lòng cho phép trình duyệt tải nhiều file`);
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
        if (data.length > 0) {
          if (data[0].questions) {
            console.log('Format 1: Array of quiz objects');
            dataToImport = data;
          } else if (data[0].question) {
            console.log('Format 2: Array of questions');
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
        dataToImport = [data];
      } else if (data.question) {
        console.log('Format 5: Single question object');
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

// Event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
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
  console.log('Setup complete, quizzes loaded:', loadQuizzes().length);
}

// Chạy khi DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupEventListeners);
} else {
  setupEventListeners();
}