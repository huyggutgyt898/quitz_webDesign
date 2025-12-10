const KEY = 'all-quizzes';

// Load & Save
function loadQuizzes() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.log('Lỗi khi load:', e);
    return [];
  }
}

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

// ==================== THÊM HÀM LÀM BÀI ====================
function startQuiz(id) {
  const quizzes = loadQuizzes();
  const quiz = quizzes.find(x => String(x.id) === String(id));
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return alert('Đề thi trống hoặc không tồn tại!');
  }

  // Lưu tạm đề đang làm
  localStorage.setItem('currentQuiz', JSON.stringify({
    ...quiz,
    startTime: new Date().toISOString()
  }));

  // Chuyển sang trang làm bài (cùng thư mục)
  window.location.href = 'showQuestion.html';
}

// ==================== RENDER DANH SÁCH (CÓ NÚT LÀM BÀI) ====================
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

    const hasImage = q.image && q.image.length > 0;
    const imageHtml = hasImage ?
      `<div class="quiz-card-image" style="background-image: url('${q.image}')"></div>` :
      `<div class="quiz-card-image quiz-card-placeholder"><span>Quiz</span></div>`;

    el.innerHTML = `
      ${imageHtml}
      <div class="quiz-card-content">
        <div class="quiz-card-header">
          <h3 class="quiz-card-title">${escapeHtml(q.title)}</h3>
          <span class="quiz-card-badge">${subjectName}</span>
        </div>
        <p class="quiz-card-desc">${escapeHtml(q.description || 'Không có mô tả')}</p>
        <div class="quiz-card-meta">
          <span>${questionCount} câu hỏi</span>
          ${createdDate ? `<span>${createdDate}</span>` : ''}
        </div>
        <div class="quiz-card-actions">
          <button class="btn-card btn-start" onclick="startQuiz('${q.id}')">Làm bài</button>
          <button class="btn-card btn-view" onclick="viewQuiz('${q.id}')">Xem</button>
          <button class="btn-card btn-export-json" onclick="exportQuizJSON('${q.id}')">JSON</button>
          <button class="btn-card btn-export-html" onclick="exportQuizHTML('${q.id}')">HTML</button>
          <button class="btn-card btn-delete" onclick="deleteQuiz('${q.id}')">Xóa</button>
        </div>
      </div>
    `;
    list.appendChild(el);
  });
}

// ==================== XEM CHI TIẾT (CÓ NÚT LÀM BÀI Ở TRÊN ĐẦU) ====================
function viewQuiz(id) {
  const quizzes = loadQuizzes();
  const q = quizzes.find(x => String(x.id) === String(id));
  if (!q) return alert('Không tìm thấy đề');

  document.getElementById('detail').style.display = 'block';
  document.getElementById('list').style.display = 'none';
  document.getElementById('empty').style.display = 'none';
  document.querySelector('.topbar').style.display = 'none';

  const subjectName = subjectLabels[q.subject] || q.subject || 'Chưa phân loại';

  // Header chi tiết + nút Làm bài nổi bật
  document.getElementById('detailMeta').innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; margin-bottom:20px;">
      <div>
        <strong style="font-size:1.4em;">${escapeHtml(q.title)}</strong><br>
        <span style="color:#666;">${subjectName} • ${q.questions ? q.questions.length : 0} câu hỏi</span>
      </div>
      <button onclick="startQuiz('${q.id}')" class="btn-primary">
        Làm bài ngay
      </button>
    </div>
  `;

  const detailBox = document.getElementById('detailJson');
  let html = '';

  if (q.image && q.image.length > 0) {
    html += `
      <div style="text-align:center; margin:20px 0;">
        <img src="${q.image}" alt="${escapeHtml(q.title)}" style="max-width:100%; max-height:350px; border-radius:12px; box-shadow:0 6px 20px rgba(0,0,0,0.15);">
      </div>
    `;
  }

  if (Array.isArray(q.questions) && q.questions.length > 0) {
    const letters = ['A', 'B', 'C', 'D'];
    q.questions.forEach((ques, index) => {
      const correctIdx = ques.correct !== undefined ? ques.correct : (ques.correctAnswer !== undefined ? ques.correctAnswer : -1);

      html += `
        <div style="margin-bottom:25px; padding:20px; background:#f9f9f9; border-radius:12px; border-left:5px solid #667eea;">
          <div style="font-weight:600; font-size:1.1em; margin-bottom:15px; color:#333;">
            Câu ${index + 1}: ${escapeHtml(ques.question || '')}
          </div>
          <ul style="list-style:none; padding:0; margin:0;">`;

      if (Array.isArray(ques.answers)) {
        ques.answers.forEach((ans, i) => {
          const isCorrect = i === correctIdx;
          const icon = isCorrect ? 'Correct' : 'Incorrect';
          const style = isCorrect ? 'background:#d4edda; border:1px solid #c3e6cb;' : '';
          html += `
            <li style="padding:10px; margin:8px 0; border-radius:8px; ${style}">
              <strong>${letters[i]}.</strong> ${escapeHtml(ans)} ${icon}
            </li>`;
        });
      }

      html += `</ul></div>`;
    });
  } else {
    html = '<pre>' + JSON.stringify(q, null, 2) + '</pre>';
  }

  detailBox.innerHTML = html;
}

// Các hàm cũ giữ nguyên (chỉ thêm nút làm bài ở trên)
function backToList() {
  document.getElementById('detail').style.display = 'none';
  document.getElementById('list').style.display = 'grid';
  document.querySelector('.topbar').style.display = 'flex';
  renderList();
}

function exportQuizJSON(id) { /* giữ nguyên như cũ */ }
function exportQuizHTML(id) { /* giữ nguyên như cũ */ }
function deleteQuiz(id) {
  if (!confirm('Xác nhận xóa đề này?')) return;
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
  if (!quizzes.length) return alert('Không có đề nào');

  if (!confirm(`Xuất tất cả ${quizzes.length} bộ đề (JSON)?`)) return;

  let delay = 0;
  quizzes.forEach((q, i) => {
    setTimeout(() => {
      const data = q.questions || [];
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(q.title || 'quiz_' + (i+1)).replace(/[^a-zA-Z0-9]/g, '_')}_questions.json`;
      a.click();
      URL.revokeObjectURL(url);
    }, delay);
    delay += 500;
  });
}

function importFile() {
  document.getElementById('importFile').click();
}

function handleFileImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);
      let toImport = [];

      if (Array.isArray(data)) {
        if (data[0]?.questions) toImport = data;
        else if (data[0]?.question) {
          toImport = [{
            id: Date.now(),
            title: 'Import từ file',
            description: '',
            subject: 'other',
            createdAt: new Date().toISOString(),
            questions: data.map(x => ({
              question: x.question || '',
              answers: x.answers || [],
              correct: x.correct ?? x.correctAnswer ?? 0
            }))
          }];
        }
      } else if (data.questions) {
        toImport = [data];
      }

      if (toImport.length === 0) throw new Error('Định dạng không hỗ trợ');

      toImport = toImport.map(x => ({
        ...x,
        id: x.id || Date.now() + Math.random(),
        createdAt: x.createdAt || new Date().toISOString(),
        subject: x.subject || 'other'
      }));

      const existing = loadQuizzes();
      saveQuizzes(existing.concat(toImport));
      renderList();
      alert(`Đã nhập thành công ${toImport.length} đề!`);
    } catch (err) {
      alert('Lỗi file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// Setup
function setupEventListeners() {
  document.getElementById('backList')?.addEventListener('click', backToList);
  document.getElementById('clearAll')?.addEventListener('click', clearAll);
  document.getElementById('exportAll')?.addEventListener('click', exportAll);
  document.getElementById('importBtn')?.addEventListener('click', importFile);
  document.getElementById('importFile')?.addEventListener('change', handleFileImport);

  renderList();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupEventListeners);
} else {
  setupEventListeners();
}