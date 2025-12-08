let questions = [];
let currentQuestion = 0;
let score = 0;
let username = prompt("Enter your name:") || "Player";

// Cấu hình đường dẫn và file âm thanh
const soundConfig = {
    soundsBasePath: 'Sounds/',
    soundFiles: {
        '02': '02 Charact Select.mp3',
        '08': '08 Stage 4 Fairy Lake.mp3',
        '11': '11 Stage 6 Dungeon.mp3',
        '35': '35 Ending.mp3'
    }
};

// TẤT CẢ CODE TRONG MỘT DOMContentLoaded DUY NHẤT
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM đã sẵn sàng');
    
    // 1. Xử lý background theme
    const savedTheme = localStorage.getItem('quizTheme') || 'default';
    const backgroundSelect = document.getElementById('choice_Background');
    
    if (backgroundSelect) {
        backgroundSelect.value = savedTheme;
        document.body.classList.add(`theme-${savedTheme}`);
        
        backgroundSelect.addEventListener('change', function(e) {
            const theme = e.target.value;
            document.body.className = '';
            document.body.classList.add(`theme-${theme}`);
            localStorage.setItem('quizTheme', theme);
            console.log("Đã chọn theme:", theme);
        });
    }
    
    // 2. Khởi tạo âm thanh
    initSoundPlayer();
    
    // 3. Load quiz
    loadQuestions();
    
    // 4. Gắn sự kiện cho next button
    const nextBtn = document.getElementById("next-btn");
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentQuestion++;
            showQuestion();
        });
    }
});

// ========== CÁC HÀM QUIZ ==========
async function loadQuestions() {
    try {
        const res = await fetch("./Data/questions.json");
        questions = await res.json();

        currentQuestion = 0;
        score = 0;
        const scoreElement = document.getElementById("score");
        if (scoreElement) {
            scoreElement.innerText = "Score: 0";
        }

        showQuestion();
    } catch (err) {
        const questionElement = document.getElementById("question");
        if (questionElement) {
            questionElement.innerText = "❌ Failed to load questions.";
        }
        console.error("Lỗi tải câu hỏi:", err);
    }
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        showResult();
        return;
    }

    const q = questions[currentQuestion];
    
    const questionNumberElement = document.getElementById("question-number");
    if (questionNumberElement) {
        questionNumberElement.innerText = `Question ${currentQuestion + 1}/${questions.length}`;
    }
    
    const questionElement = document.getElementById("question");
    if (questionElement) {
        questionElement.innerText = q.question;
    }
    
    const answersDiv = document.getElementById("answers");
    if (answersDiv) {
        answersDiv.innerHTML = "";
        
        q.answers.forEach((ans, i) => {
            const btn = document.createElement("button");
            btn.innerText = ans;
            btn.onclick = () => checkAnswer(btn, i === q.correct);
            answersDiv.appendChild(btn);
        });
    }
}

function checkAnswer(button, isCorrect) {
    const allBtns = document.querySelectorAll(".answers button");
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
    }

    const scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreElement.innerText = `Score: ${score}`;
    }
}

// Sửa hàm showResult để lưu dữ liệu
function showResult() {
    console.log("Showing result. Score:", score, "/", questions.length);
    
    // Ẩn các phần tử của quiz
    document.getElementById("question").style.display = "none";
    document.getElementById("answers").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    
    // Tính toán kết quả
    const percentage = Math.round((score / questions.length) * 100);
    let grade = "";
    
    // Xác định grade
    if (percentage >= 90) grade = "A+ 🎯";
    else if (percentage >= 80) grade = "A 👍";
    else if (percentage >= 70) grade = "B 😊";
    else if (percentage >= 60) grade = "C 🙂";
    else grade = "F 😢";
    
    // Lưu dữ liệu chi tiết vào localStorage
    const resultData = {
        username: username,
        score: score,
        totalQuestions: questions.length,
        percentage: percentage,
        grade: grade,
        questions: detailedResults.map((result, index) => ({
            questionNumber: index + 1,
            question: result.question,
            userAnswer: result.userAnswer,
            correctAnswer: result.correctAnswer,
            isCorrect: result.isCorrect,
            allOptions: result.allOptions
        }))
    };
    
    localStorage.setItem('quizResultData', JSON.stringify(resultData));
    
    // HIỂN THỊ KẾT QUẢ CƠ BẢN
    document.getElementById("player-name").textContent = username;
    document.getElementById("final-score-text").textContent = `${score}/${questions.length}`;
    document.getElementById("percentage-text").textContent = `${percentage}%`;
    document.getElementById("grade-text").textContent = grade;
    
    // Thêm nút xem chi tiết
    const detailButton = document.createElement('button');
    detailButton.className = 'next-btn';
    detailButton.style.margin = '10px';
    detailButton.textContent = '📊 View Detailed Results';
    detailButton.onclick = () => {
        window.open('result-details.html', '_blank');
    };
    
    const resultDiv = document.getElementById("result");
    const buttonsDiv = resultDiv.querySelector('.restart-buttons') || resultDiv;
    buttonsDiv.appendChild(detailButton);
    
    // Hiển thị result box
    document.getElementById("result").style.display = "block";
}

function viewDetailedResults() {
    window.open('result-details.html', '_blank');
}

function restartQuiz() {
    console.log("Restarting quiz...");
    
    // Reset biến
    currentQuestion = 0;
    score = 0;
    
    // Hiển thị lại các phần tử quiz
    const elementsToShow = ["question", "answers", "next-btn"];
    elementsToShow.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = "block";
    });
    
    // Reset hiển thị
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreElement.innerText = "Score: 0";
    }
    
    const resultElement = document.getElementById("result");
    if (resultElement) {
        resultElement.style.display = "none";
    }
    
    // Load lại câu hỏi
    loadQuestions();
}

function navigate(page) {
    const quizBox = document.querySelector(".quiz-box");
    const createBox = document.querySelector(".create-box");

    if (quizBox) quizBox.style.display = page === "home" ? "block" : "none";
    if (createBox) createBox.style.display = page === "create" ? "block" : "none";
}

function saveQuestion() {
    const q = document.getElementById("new-question")?.value.trim();
    const opts = [
        document.getElementById("opt1")?.value,
        document.getElementById("opt2")?.value,
        document.getElementById("opt3")?.value,
        document.getElementById("opt4")?.value
    ];
    const correct = parseInt(document.getElementById("correct")?.value) - 1;

    if (!q || opts.some(o => !o) || isNaN(correct) || correct < 0 || correct > 3) {
        const saveMsg = document.getElementById("save-msg");
        if (saveMsg) saveMsg.innerText = "⚠️ Please fill all fields correctly!";
        return;
    }

    const newQuestion = { question: q, answers: opts, correct };
    questions.push(newQuestion);
    
    const saveMsg = document.getElementById("save-msg");
    if (saveMsg) saveMsg.innerText = "✅ Question added successfully!";
}

// ========== HÀM ÂM THANH ==========
function initSoundPlayer() {
    const soundSelect = document.getElementById('choice-Sound');
    const backgroundMusic = document.getElementById('background-music');
    
    if (!soundSelect) {
        console.error('Không tìm thấy phần tử #choice-Sound');
        return;
    }
    
    if (!backgroundMusic) {
        console.error('Không tìm thấy phần tử #background-music');
        return;
    }
    
    console.log('Đã tìm thấy phần tử âm thanh');
    
    // Xử lý khi thay đổi lựa chọn âm thanh
    soundSelect.addEventListener('change', function(e) {
        const selectedValue = e.target.value;
        console.log('Đã chọn âm thanh:', selectedValue);
        handleSoundChange(selectedValue, backgroundMusic);
    });
    
    // Tải âm thanh đã lưu từ localStorage
    loadSavedSound(soundSelect, backgroundMusic);
}

function handleSoundChange(selectedValue, backgroundMusic) {
    if (selectedValue === 'none') {
        // Tắt âm thanh
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        console.log('Đã tắt âm thanh');
    } else {
        // Phát âm thanh được chọn
        playSound(selectedValue, backgroundMusic);
    }
    
    // Lưu lựa chọn vào localStorage
    try {
        localStorage.setItem('selectedSound', selectedValue);
    } catch (error) {
        console.warn('Không thể lưu vào localStorage:', error);
    }
}

function playSound(soundKey, backgroundMusic) {
    const fileName = soundConfig.soundFiles[soundKey];
    
    if (!fileName) {
        console.error('Không tìm thấy file âm thanh cho key:', soundKey);
        return;
    }
    
    // Tạo đường dẫn đầy đủ
    const soundPath = soundConfig.soundsBasePath + fileName;
    
    console.log('Đang tải âm thanh:', soundPath);
    
    // Dừng nhạc hiện tại nếu đang phát
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    
    // Đặt nguồn và phát
    backgroundMusic.src = soundPath;
    
    // Thử phát nhạc
    backgroundMusic.play()
        .then(() => {
            console.log('✅ Đang phát nhạc:', soundKey);
        })
        .catch(error => {
            console.error('❌ Lỗi khi phát nhạc:', error);
            
            // Có thể trình duyệt chặn autoplay, cần tương tác người dùng
            if (error.name === 'NotAllowedError') {
                console.log('Trình duyệt chặn autoplay. Cần tương tác người dùng.');
            }
        });
}

function loadSavedSound(soundSelect, backgroundMusic) {
    try {
        const savedSound = localStorage.getItem('selectedSound');
        if (savedSound && soundSelect) {
            // Đặt giá trị cho dropdown
            soundSelect.value = savedSound;
            console.log('Khôi phục âm thanh đã lưu:', savedSound);
            
            // Tự động phát nếu đã chọn nhạc trước đó
            if (savedSound !== 'none') {
                // Đợi 1 giây để trang load xong
                setTimeout(() => {
                    handleSoundChange(savedSound, backgroundMusic);
                }, 1000);
            }
        }
    } catch (error) {
        console.warn('Không thể đọc từ localStorage:', error);
    }
}