
    const KEY = 'all-quizzes';


    function loadQuizzes() {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    }

    function saveQuizzes(quizzes) {
      localStorage.setItem(KEY, JSON.stringify(quizzes));
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
        el.innerHTML = `
          <div class="quiz-meta">
            <div class="quiz-title">${escapeHtml(q.title)}</div>
            <div class="quiz-desc">${escapeHtml(q.description)} • ${new Date(q.createdAt).toLocaleString()}</div>
          </div>
          <div class="quiz-actions">
            <button class="btn btn-secondary" data-id="${q.id}" onclick="viewQuiz(this.dataset.id)">🔎 Xem</button>
            <button class="btn btn-secondary" data-id="${q.id}" onclick="exportQuiz(this.dataset.id)">📥 Xuất</button>
            <button class="btn btn-primary" data-id="${q.id}" onclick="deleteQuiz(this.dataset.id)">🗑️ Xóa</button>
          </div>
        `;
        list.appendChild(el);
      });
    }

    function viewQuiz(id) {
  const quizzes = loadQuizzes();
  const q = quizzes.find(x => String(x.id) === String(id));
  if (!q) return;

  document.getElementById('detail').style.display = 'block';
  document.getElementById('list').style.display = 'none';
  document.getElementById('empty').style.display = 'none';
  document.getElementById('detailMeta').textContent = `${q.title} — ${q.description}`;

  const detailBox = document.getElementById('detailJson');

  // Nếu đề có mảng câu hỏi
  if (Array.isArray(q.questions) && q.questions.length > 0) {
    let html = "";
    q.questions.forEach((ques, index) => {
      html += `
        <div style="margin-bottom:16px;">
          <div style="font-weight:600;color:#333;">${index + 1}. ${escapeHtml(ques.question || '')}</div>
          <ul style="margin-top:6px;margin-left:20px;">
          ${ques.answers
  .map((ans, i) => {
    const isCorrect = i === ques.correctAnswer ? '✅' : '❌';
    return `<li style="margin-bottom:4px;">${isCorrect} ${escapeHtml(ans)}</li>`;
  })
  .join('')}

          </ul>
        </div>
      `;
    });
    detailBox.innerHTML = html;
  } else {
    // Nếu không có câu hỏi, vẫn hiển thị JSON gốc
    detailBox.textContent = JSON.stringify(q, null, 2);
  }
}


    document.getElementById('backList').addEventListener('click', () => {
      document.getElementById('detail').style.display = 'none';
      document.getElementById('list').style.display = 'flex';
      renderList();
    });

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

    document.getElementById('clearAll').addEventListener('click', () => {
      if (!confirm('Xóa toàn bộ kho đề?')) return;
      localStorage.removeItem(KEY);
      renderList();
    });

    document.getElementById('exportAll').addEventListener('click', () => {
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
    });

    document.getElementById('importBtn').addEventListener('click', () =>
      document.getElementById('importFile').click()
    );

    document.getElementById('importFile').addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (!Array.isArray(data)) return alert('File nhập phải là array các đề (JSON)');
          const existing = loadQuizzes();
          const merged = existing.concat(data.map(d => ({ ...d, id: d.id || Date.now() + Math.random() })));
          saveQuizzes(merged);
          renderList();
          alert('✅ Nhập thành công');
        } catch (err) { 

          alert('Lỗi file JSON: ' + err.message);
        
        }
      };
      reader.readAsText(f);

    });

    function escapeHtml(str){
      if(!str) return '';
      return String(str).replace(/[&<>"']/g, s =>
        ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]
      );
}

    // init
    renderList();