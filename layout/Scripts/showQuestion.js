let detailedResults = [];
let questions = [];
let currentQuestion = 0;
let score = 0;
let username = localStorage.getItem("currentUser") || "Guest";

// Kiểm tra và làm sạch username
if (!username || username === "null" || username === "undefined") {
    username = "Player";
    console.log("No user logged in, using default name: Player");
}

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

// Thêm vào trong DOMContentLoaded hoặc tạo hàm riêng
function updateUserDisplay() {
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        // Lấy chữ cái đầu tiên của username
        const firstLetter = username.charAt(0).toUpperCase();
        avatar.textContent = firstLetter;
        
        // Tạo màu nền dựa trên username
        const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F'];
        const colorIndex = username.charCodeAt(0) % colors.length;
        avatar.style.backgroundColor = colors[colorIndex];
        
        // Cập nhật tooltip
        avatar.title = `Logged in as: ${username}`;
        
        // Thêm hover effect
        avatar.style.cursor = 'pointer';
        avatar.onclick = function() {
            window.location.href = 'profile.html';
        };
    }
}

// TẤT CẢ CODE TRONG MỘT DOMContentLoaded DUY NHẤT
document.addEventListener('DOMContentLoaded', function() {
    // Xóa text-decoration của câu hỏi
    const questionElement = document.getElementById('question');
    if (questionElement) {
        questionElement.style.textDecoration = 'none';
        questionElement.style.borderBottom = 'none';
        questionElement.style.border = 'none';
        questionElement.style.backgroundImage = 'none';
    }
    
    // Áp dụng cho tất cả các phần tử câu hỏi
    document.querySelectorAll('.question').forEach(element => {
        element.style.textDecoration = 'none';
        element.style.borderBottom = 'none';
    });

    console.log('DOM đã sẵn sàng');
    console.log('Username:', username);
    
    // Cập nhật hiển thị người dùng
    updateUserDisplay();
    
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
    let quizData = null;

    // Ưu tiên 1: Kiểm tra có đề đang làm từ kho đề không (currentQuiz)
    const currentQuizStr = localStorage.getItem('currentQuiz');
    if (currentQuizStr) {
        try {
            quizData = JSON.parse(currentQuizStr);
            console.log('Đang làm bài từ kho đề:', quizData.title);
        } catch (e) {
            console.error('Lỗi parse currentQuiz:', e);
        }
    }

    // Ưu tiên 2: Nếu không có → load từ file JSON cũ (giữ tương thích)
    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        try {
            const res = await fetch("./Data/web_design_questions.json");
            if (!res.ok) throw new Error('File not found');
            const jsonData = await res.json();

            // Hỗ trợ cả 2 kiểu: mảng trực tiếp hoặc object có .questions
            quizData = Array.isArray(jsonData) ? { title: "Web Design Quiz", questions: jsonData } : jsonData;
            console.log('Load từ file JSON thành công');
        } catch (err) {
            console.error("Không tải được file JSON:", err);
            document.getElementById("question").innerText = "Không tải được bộ câu hỏi.";
            return;
        }
    }

    // Gán dữ liệu toàn cục
    questions = quizData.questions || [];
    
    // Cập nhật tiêu đề đề thi (nếu có)
    const titleEl = document.getElementById("quiz-title") || document.querySelector("h1");
    if (titleEl && quizData.title) {
        titleEl.innerText = quizData.title;
    }

    // Reset trạng thái
    currentQuestion = 0;
    score = 0;
    detailedResults = [];

    const scoreElement = document.getElementById("score");
    if (scoreElement) scoreElement.innerText = "Score: 0";

    showQuestion();
}

function showQuestion() {
    // Kết thúc → hiện kết quả
    if (currentQuestion >= questions.length) {
        showResult();
        return;
    }

    const q = questions[currentQuestion];

    // Cập nhật số câu
    const questionNumberElement = document.getElementById("question-number");
    if (questionNumberElement) {
        questionNumberElement.innerText = `Câu ${currentQuestion + 1}/${questions.length}`;
    }

    // Hiển thị câu hỏi
    const questionElement = document.getElementById("question");
    if (questionElement) {
        questionElement.innerHTML = q.question || q.text || "Câu hỏi không có nội dung";
    }

    // Xóa đáp án cũ
    const answersDiv = document.getElementById("answers");
    if (answersDiv) {
        answersDiv.innerHTML = "";

        const answers = q.answers || q.options || [];
        const correctIndex = q.correct !== undefined ? q.correct : q.correctAnswer;

        answers.forEach((ans, i) => {
            const btn = document.createElement("button");
            btn.className = "answer-btn";
            btn.innerHTML = ans;

            btn.onclick = function() {
                checkAnswer(btn, i === correctIndex);
            };

            answersDiv.appendChild(btn);
        });
    }

    // Cuộn lên đầu câu hỏi mới (tùy chọn)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function checkAnswer(button, isCorrect) {
    const allBtns = document.querySelectorAll(".answers button");
    allBtns.forEach(b => b.disabled = true);
    
    const q = questions[currentQuestion];
    
    // Lưu kết quả chi tiết
    detailedResults.push({
        question: q.question,
        userAnswer: button.innerText,
        correctAnswer: q.answers[q.correct],
        isCorrect: isCorrect,
        allOptions: q.answers
    });

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
    
    // Tính toán kết quả
    const percentage = Math.round((score / questions.length) * 100);
    let grade = "";
    
    // Xác định grade
    if (percentage >= 90) grade = "A+ 🎯";
    else if (percentage >= 80) grade = "A 👍";
    else if (percentage >= 70) grade = "B 😊";
    else if (percentage >= 60) grade = "C 🙂";
    else if (percentage >= 50) grade = "D 😅";
    else grade = "F 😢";
    
    // QUAN TRỌNG: Lưu detailedResults vào localStorage
    localStorage.setItem('detailedResults', JSON.stringify(detailedResults));
    
    // Lưu dữ liệu tổng hợp
    const resultData = {
        username: username,
        score: score,
        totalQuestions: questions.length,
        percentage: percentage,
        grade: grade,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('quizResultData', JSON.stringify(resultData));
    console.log('Đã lưu dữ liệu vào localStorage:', resultData);
    console.log('Đã lưu detailedResults:', detailedResults.length, 'câu hỏi');
    
    // Hiển thị kết quả
    document.getElementById("player-name").textContent = username;
    document.getElementById("final-score-text").textContent = `${score}/${questions.length}`;
    document.getElementById("percentage-text").textContent = `${percentage}%`;
    document.getElementById("grade-text").textContent = grade;
    
    // Hiển thị result overlay (che toàn màn hình)
    const resultOverlay = document.getElementById("result-overlay");
    if (resultOverlay) {
        resultOverlay.style.display = "flex";
        // Thêm class để ẩn các phần tử khác
        document.body.classList.add("show-result");
    }
}

function viewDetailedResults() {
    // Đảm bảo đã lưu dữ liệu
    const percentage = Math.round((score / questions.length) * 100);
    let grade = "";
    
    if (percentage >= 90) grade = "A+ 🎯";
    else if (percentage >= 80) grade = "A 👍";
    else if (percentage >= 70) grade = "B 😊";
    else if (percentage >= 60) grade = "C 🙂";
    else if (percentage >= 50) grade = "D 😅";
    else grade = "F 😢";
    
    // Lưu dữ liệu vào localStorage
    const resultData = {
        username: username,
        score: score,
        totalQuestions: questions.length,
        percentage: percentage,
        grade: grade,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('quizResultData', JSON.stringify(resultData));
    localStorage.setItem('detailedResults', JSON.stringify(detailedResults));
    
    console.log('Đang mở trang chi tiết với dữ liệu:');
    console.log('- Result Data:', resultData);
    console.log('- Detailed Results:', detailedResults.length, 'câu hỏi');
    
    // Mở cửa sổ mới hoặc tab mới
    window.open('result-details.html', '_blank');
}

function restartQuiz() {
    console.log("Restarting quiz...");
    
    // Reset biến
    currentQuestion = 0;
    score = 0;
    detailedResults = []; // QUAN TRỌNG: Reset detailedResults
    
    // Xóa dữ liệu cũ trong localStorage
    localStorage.removeItem('detailedResults');
    localStorage.removeItem('quizResultData');
    
    // Ẩn result overlay
    const resultOverlay = document.getElementById("result-overlay");
    if (resultOverlay) {
        resultOverlay.style.display = "none";
        // Xóa class để hiện lại các phần tử
        document.body.classList.remove("show-result");
    }
    
    // Reset hiển thị
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreElement.innerText = "Score: 0";
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