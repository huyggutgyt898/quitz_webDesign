// Quiz data
const quizzes = [
  {
    id: 1, rank: 1, title: "Đại số tuyến tính - Ma trận & Định thức", category: "math",
    author: "PGS. Nguyễn Văn A", icon: "Ruler", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    plays: 15420, questions: 50, rating: 4.9, difficulty: "Khó"
  },
  {
    id: 2, rank: 2, title: "Hóa học hữu cơ - Phản ứng thế và cộng", category: "science",
    author: "TS. Trần Thị B", icon: "Beaker", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    plays: 12830, questions: 45, rating: 4.8, difficulty: "Trung bình"
  },
  {
    id: 3, rank: 3, title: "Lịch sử Việt Nam - Cách mạng tháng Tám", category: "history",
    author: "ThS. Lê Văn C", icon: "Landmark", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    plays: 11250, questions: 40, rating: 4.7, difficulty: "Dễ"
  },
  {
    id: 4, rank: 4, title: "IELTS Reading - Academic Module", category: "language",
    author: "Nguyễn Minh D", icon: "Book", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    plays: 10890, questions: 35, rating: 4.9, difficulty: "Khó"
  },
  {
    id: 5, rank: 5, title: "Vật lý đại cương - Cơ học Newton", category: "science",
    author: "PGS. Phạm Văn E", icon: "Atom", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    plays: 9650, questions: 42, rating: 4.6, difficulty: "Trung bình"
  },
  {
    id: 6, rank: 6, title: "Văn học Việt Nam - Truyện Kiều", category: "literature",
    author: "ThS. Hoàng Thị F", icon: "Open Book", gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    plays: 8920, questions: 38, rating: 4.8, difficulty: "Trung bình"
  },
  {
    id: 7, rank: 7, title: "Giải tích 2 - Tích phân & Chuỗi", category: "math",
    author: "TS. Vũ Văn G", icon: "∫", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    plays: 8340, questions: 48, rating: 4.5, difficulty: "Khó"
  },
  {
    id: 8, rank: 8, title: "Sinh học phân tử - DNA & RNA", category: "science",
    author: "PGS. Đỗ Thị H", icon: "DNA", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    plays: 7880, questions: 36, rating: 4.7, difficulty: "Khó"
  },
  {
    id: 9, rank: 9, title: "Lịch sử thế giới - Chiến tranh thế giới II", category: "history",
    author: "ThS. Bùi Văn I", icon: "Globe", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    plays: 7420, questions: 44, rating: 4.6, difficulty: "Trung bình"
  },
  {
    id: 10, rank: 10, title: "Tiếng Anh học thuật - Advanced Grammar", category: "language",
    author: "Phạm Minh K", icon: "Letters", gradient: "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
    plays: 7100, questions: 40, rating: 4.8, difficulty: "Khó"
  },
  {
    id: 11, rank: 11, title: "Xác suất thống kê - Phân phối chuẩn", category: "math",
    author: "TS. Trương Văn L", icon: "Chart", gradient: "linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)",
    plays: 6750, questions: 33, rating: 4.5, difficulty: "Trung bình"
  },
  {
    id: 12, rank: 12, title: "Văn học thế giới - Shakespeare", category: "literature",
    author: "ThS. Ngô Thị M", icon: "Mask", gradient: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    plays: 6320, questions: 30, rating: 4.7, difficulty: "Dễ"
  }
];

let currentFilter = 'all';

// Render quizzes
function renderQuizzes(filter = 'all') {
  const grid = document.getElementById('quizGrid');
  const filtered = filter === 'all' 
    ? quizzes 
    : quizzes.filter(q => q.category === filter);

  grid.innerHTML = filtered.map(quiz => `
    <div class="quiz-card" data-category="${quiz.category}">
      <div class="quiz-rank ${quiz.rank <= 3 ? 'top' + quiz.rank : ''}">
        ${quiz.rank}
      </div>
      <div class="quiz-thumbnail" style="background: ${quiz.gradient}">
        <span style="font-size: 80px">${quiz.icon}</span>
      </div>
      <div class="quiz-content">
        <span class="quiz-category">${getCategoryName(quiz.category)}</span>
        <h3 class="quiz-title">${quiz.title}</h3>
        <div class="quiz-author">
          <div class="author-avatar">${quiz.author.charAt(0)}</div>
          <span>${quiz.author}</span>
        </div>
        <div class="quiz-stats">
          <div class="stat-item">
            <i class="fas fa-play-circle"></i>
            <span>${quiz.plays.toLocaleString()} lượt chơi</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-question-circle"></i>
            <span>${quiz.questions} câu</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-star"></i>
            <span>${quiz.rating}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function getCategoryName(category) {
  const names = {
    math: 'Toán học',
    science: 'Khoa học',
    history: 'Lịch sử',
    language: 'Ngôn ngữ',
    literature: 'Văn học'
  };
  return names[category] || category;
}

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.dataset.category;
    renderQuizzes(category);
  });
});

// Quiz card click
document.addEventListener('click', (e) => {
  const card = e.target.closest('.quiz-card');
  if (card) {
    alert('Đang tải quiz...');
  }
});

// Initial render
renderQuizzes();