// QUIZ PAGE JAVASCRIPT

// Get quiz name from URL
const urlParams = new URLSearchParams(window.location.search);
const quizName = decodeURIComponent(urlParams.get('quiz') || '');

let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let userAnswers = []; // Store user answers for review

const elements = {
    quizTitle: document.getElementById('quizTitle'),
    quizInfo: document.getElementById('quizInfo'),
    questionNumber: document.getElementById('questionNumber'),
    questionText: document.getElementById('questionText'),
    optionList: document.getElementById('optionList'),
    nextBtn: document.getElementById('nextBtn'),
    progressBar: document.getElementById('progressBar'),
    questionCard: document.getElementById('questionCard'),
    resultContainer: document.getElementById('resultContainer'),
    resultScore: document.getElementById('resultScore'),
    resultMessage: document.getElementById('resultMessage'),
    reviewBtn: document.getElementById('reviewBtn'),
    restartBtn: document.getElementById('restartBtn'),
    backToLectureBtn: document.getElementById('backToLectureBtn'),
    answerReview: document.getElementById('answerReview'),
    reviewList: document.getElementById('reviewList'),
    backToResultBtn: document.getElementById('backToResultBtn'),
    scoreInline: document.getElementById('scoreInline'),
    totalQuestions: document.getElementById('totalQuestions')
};

// Navbar dropdown functionality
const navbarDropdownWrapper = document.querySelector('.navbar-dropdown-wrapper');
const categoryDropdown = document.getElementById('categoryDropdown');

if (navbarDropdownWrapper && categoryDropdown) {
    navbarDropdownWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        categoryDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
        if (!navbarDropdownWrapper.contains(e.target)) {
            categoryDropdown.classList.remove('show');
        }
    });
}

// Category dropdown items
const categoryDropdownItems = document.querySelectorAll('#categoryDropdown .dropdown-item');
categoryDropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        categoryDropdownItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        
        if (categoryDropdown) {
            categoryDropdown.classList.remove('show');
        }
        
        window.location.href = `modelform.html?category=${category}`;
    });
});

// Load quiz data
if (!quizName) {
    elements.questionText.textContent = 'Không tìm thấy quiz!';
} else {
    fetch('data/quizData.json')
        .then(response => response.json())
        .then(quizData => {
            currentQuiz = quizData[quizName] || [];
            if (currentQuiz.length === 0) {
                elements.questionText.textContent = 'Quiz chưa có dữ liệu!';
                return;
            }
            elements.quizTitle.textContent = quizName;
            elements.totalQuestions.textContent = currentQuiz.length;
            renderQuestion();
        })
        .catch(error => {
            console.error('Lỗi:', error);
            elements.questionText.textContent = 'Lỗi load quiz.';
        });
}

function renderQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    const letters = ['A', 'B', 'C', 'D'];
    
    elements.questionNumber.textContent = `Question ${currentQuestionIndex + 1}/${currentQuiz.length}`;
    elements.quizInfo.textContent = `Câu ${currentQuestionIndex + 1} / ${currentQuiz.length}`;
    elements.questionText.textContent = question.question;
    
    elements.optionList.innerHTML = question.options.map((opt, idx) => `
        <div class="option-item" data-index="${idx}" onclick="selectOption(${idx})">
            <div class="option-letter">${letters[idx]}</div>
            <span class="flex-1">${opt}</span>
        </div>
    `).join('');
    
    selectedOption = null;
    elements.nextBtn.disabled = true;

    const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    
    // Add fade-in animation
    elements.questionCard.classList.remove('fade-in');
    setTimeout(() => elements.questionCard.classList.add('fade-in'), 10);
}

window.selectOption = function(index) {
    const options = elements.optionList.querySelectorAll('.option-item');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');
    
    const question = currentQuiz[currentQuestionIndex];
    selectedOption = question.options[index];
    elements.nextBtn.disabled = false;
};

elements.nextBtn.addEventListener('click', () => {
    const question = currentQuiz[currentQuestionIndex];
    const isCorrect = selectedOption === question.answer;
    
    // Store user answer
    userAnswers.push({
        question: question.question,
        options: question.options,
        userAnswer: selectedOption,
        correctAnswer: question.answer,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        score++;
        // Update score display
        elements.scoreInline.innerHTML = `
            <span class="score-icon">📊</span>
            <span class="score-text">Score: ${score}</span>
        `;
    }
    
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.length) {
        renderQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    elements.questionCard.style.display = 'none';
    elements.resultContainer.style.display = 'block';
    elements.resultContainer.classList.add('fade-in');
    
    elements.resultScore.textContent = `${score}/${currentQuiz.length}`;
    
    const percentage = (score / currentQuiz.length) * 100;
    let message = '';
    
    if (percentage === 100) {
        message = '🏆 Hoàn hảo! Bạn đã trả lời đúng tất cả!';
    } else if (percentage >= 80) {
        message = '🌟 Xuất sắc! Bạn đã làm rất tốt!';
    } else if (percentage >= 60) {
        message = '👍 Tốt lắm! Tiếp tục cố gắng nhé!';
    } else if (percentage >= 40) {
        message = '💪 Khá đấy! Hãy ôn tập thêm nhé!';
    } else {
        message = '📚 Cần cố gắng hơn! Hãy xem lại bài giảng nhé!';
    }
    
    elements.resultMessage.textContent = message;
}

elements.reviewBtn.addEventListener('click', () => {
    elements.resultContainer.style.display = 'none';
    elements.answerReview.style.display = 'block';
    elements.answerReview.classList.add('fade-in');
    
    elements.reviewList.innerHTML = userAnswers.map((item, index) => `
        <div class="review-item ${item.isCorrect ? 'correct' : 'incorrect'}">
            <div class="review-question">
                <span class="font-bold">Câu ${index + 1}:</span> ${item.question}
            </div>
            <div class="review-answer">
                <span class="icon">${item.isCorrect ? '✅' : '❌'}</span>
                <span><strong>Câu trả lời của bạn:</strong> ${item.userAnswer}</span>
            </div>
            ${!item.isCorrect ? `
                <div class="review-answer" style="margin-top: 0.5rem;">
                    <span class="icon">✓</span>
                    <span><strong>Đáp án đúng:</strong> ${item.correctAnswer}</span>
                </div>
            ` : ''}
        </div>
    `).join('');
});

elements.backToResultBtn.addEventListener('click', () => {
    elements.answerReview.style.display = 'none';
    elements.resultContainer.style.display = 'block';
});

elements.restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    elements.scoreInline.innerHTML = `
        <span class="score-icon">📊</span>
        <span class="score-text">Score: 0</span>
    `;
    elements.questionCard.style.display = 'block';
    elements.resultContainer.style.display = 'none';
    elements.answerReview.style.display = 'none';
    renderQuestion();
});

elements.backToLectureBtn.addEventListener('click', () => {
    window.location.href = `lecture.html?quiz=${encodeURIComponent(quizName)}`;
});