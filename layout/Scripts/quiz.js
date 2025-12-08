const urlParams = new URLSearchParams(window.location.search);
const quizName = decodeURIComponent(urlParams.get('quiz') || '');

let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

const elements = {
    quizTitle: document.getElementById('quizTitle'),
    quizBody: document.getElementById('quizBody'),
    nextBtn: document.getElementById('nextBtn'),
    progressBar: document.getElementById('progressBar'),
    quizResult: document.getElementById('quizResult'),
    scoreText: document.getElementById('scoreText'),
    restartBtn: document.getElementById('restartBtn'),
    backToLectureBtn: document.getElementById('backToLectureBtn')
};

if (!quizName) {
    elements.quizBody.innerHTML = '<p>Không tìm thấy quiz!</p>';
} else {
    fetch('data/quizData.json')
        .then(response => response.json())
        .then(quizData => {
            currentQuiz = quizData[quizName] || [];
            if (currentQuiz.length === 0) {
                elements.quizBody.innerHTML = '<p>Quiz chưa có dữ liệu!</p>';
                return;
            }
            elements.quizTitle.textContent = quizName;
            renderQuestion();
        })
        .catch(error => {
            console.error('Lỗi:', error);
            elements.quizBody.innerHTML = '<p>Lỗi load quiz.</p>';
        });
}

function renderQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    elements.quizBody.innerHTML = `
        <div class="question-text">${question.question}</div>
        <div class="option-list">
            ${question.options.map((opt, idx) => `
                <div class="option-item" data-index="${idx}" onclick="selectOption(this)">
                    <span class="option-label">${opt}</span>
                </div>
            `).join('')}
        </div>
    `;
    selectedOption = null;
    elements.nextBtn.disabled = true;

    const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
}

window.selectOption = function(element) { // Global để onclick HTML dùng
    const options = elements.quizBody.querySelectorAll('.option-item');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    selectedOption = element.querySelector('.option-label').textContent;
    elements.nextBtn.disabled = false;
};

elements.nextBtn.addEventListener('click', () => {
    if (selectedOption === currentQuiz[currentQuestionIndex].answer) score++;
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.length) {
        renderQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    elements.quizBody.style.display = 'none';
    elements.nextBtn.style.display = 'none';
    elements.quizResult.style.display = 'block';
    elements.scoreText.textContent = `Bạn đúng ${score}/${currentQuiz.length} câu!`;
}

elements.restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    elements.quizBody.style.display = 'block';
    elements.nextBtn.style.display = 'block';
    elements.quizResult.style.display = 'none';
    renderQuestion();
});

elements.backToLectureBtn.addEventListener('click', () => {
    window.location.href = `lecture.html?quiz=${encodeURIComponent(quizName)}`;
});