// Debug: Hiển thị tất cả dữ liệu localStorage
console.log('=== DEBUG: ALL LOCALSTORAGE DATA ===');
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(`${key}:`, localStorage.getItem(key));
}
console.log('=== END DEBUG ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Trang result-details đã tải');
    
    // Lấy dữ liệu từ localStorage
    const resultData = JSON.parse(localStorage.getItem('quizResultData'));
    const detailedResults = JSON.parse(localStorage.getItem('detailedResults')) || [];
    
    console.log('Dữ liệu đọc từ localStorage:');
    console.log('- Result Data:', resultData);
    console.log('- Detailed Results:', detailedResults);
    console.log('- Số lượng câu hỏi chi tiết:', detailedResults.length);
    
    if (!resultData) {
        showError("No quiz results found. Please complete a quiz first.");
        return;
    }
    
    if (!detailedResults.length) {
        console.warn('Không có detailedResults trong localStorage');
    }
    
    // Hiển thị thông tin cơ bản
    displayBasicInfo(resultData);
    
    // Hiển thị chi tiết từng câu hỏi
    displayEnhancedQuestions(resultData, detailedResults);
    
    // Hiển thị thời gian
    displayTimestamp();
});

function displayBasicInfo(data) {
    // Hiển thị thông tin người chơi
    document.getElementById('player-name').textContent = data.username || 'Player';
    
    // Hiển thị điểm số
    document.getElementById('final-score').textContent = 
        `${data.score || 0}/${data.totalQuestions || 0}`;
    
    // Hiển thị phần trăm
    const percentage = data.percentage || Math.round((data.score / data.totalQuestions) * 100) || 0;
    document.getElementById('percentage').textContent = `${percentage}%`;
    
    // Hiển thị grade
    document.getElementById('grade').textContent = data.grade || calculateGrade(percentage);
    
    // Cập nhật progress bar
    const correctCount = data.score || 0;
    const totalQuestions = data.totalQuestions || 1;
    const progressPercentage = Math.round((correctCount / totalQuestions) * 100);
    
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('progress-percentage').textContent = `${progressPercentage}%`;
    
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = `${progressPercentage}%`;
    
    // Cập nhật màu progress bar dựa trên kết quả
    if (progressPercentage >= 80) {
        progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
    } else if (progressPercentage >= 60) {
        progressFill.style.background = 'linear-gradient(90deg, #FF9800, #FFB74D)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #F44336, #EF5350)';
    }
}

function calculateGrade(percentage) {
    if (percentage >= 90) return "A+ 🎯";
    if (percentage >= 80) return "A 👍";
    if (percentage >= 70) return "B 😊";
    if (percentage >= 60) return "C 🙂";
    if (percentage >= 50) return "D 😅";
    return "F 😢";
}

function displayDetailedQuestions(resultData, detailedResults) {
    const questionsList = document.getElementById('questions-list');
    
    if (!detailedResults.length) {
        questionsList.innerHTML = `
            <div class="no-data">
                <i class="fas fa-info-circle"></i>
                <p>Detailed question data is not available. Please ensure you complete the quiz properly.</p>
            </div>
        `;
        return;
    }
    
    let questionsHTML = '';
    
    detailedResults.forEach((question, index) => {
        const questionNumber = index + 1;
        const isCorrect = question.isCorrect;
        
        questionsHTML += `
            <div class="question-item">
                <div class="question-header">
                    <div class="question-number">Question ${questionNumber}</div>
                    <div class="question-status ${isCorrect ? 'status-correct' : 'status-incorrect'}">
                        ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                </div>
                
                <div class="question-text">
                    ${question.question || 'No question text available'}
                </div>
                
                <div class="options-container">
                    ${generateOptionsHTML(question)}
                </div>
                
                <div class="answer-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
                    <strong>${isCorrect ? '✅ Well done!' : '❌ The correct answer was:'}</strong>
                    ${isCorrect ? ' You selected the correct answer.' : ` <strong>${question.correctAnswer}</strong>`}
                </div>
            </div>
        `;
    });
    
    questionsList.innerHTML = questionsHTML;
}

function generateOptionsHTML(question) {
    let optionsHTML = '';
    const userAnswer = question.userAnswer;
    const correctAnswer = question.correctAnswer;
    const allOptions = question.allOptions || [];
    
    // Tạo label cho từng option (A, B, C, D)
    const labels = ['A', 'B', 'C', 'D'];
    
    allOptions.forEach((option, index) => {
        const label = labels[index];
        let optionClass = 'option';
        
        // Kiểm tra nếu đây là đáp án đúng
        if (option === correctAnswer) {
            optionClass += ' correct';
        }
        
        // Kiểm tra nếu đây là đáp án người chơi chọn
        if (option === userAnswer) {
            optionClass += ' selected';
        }
        
        optionsHTML += `
            <div class="${optionClass}">
                <span class="option-label">${label}.</span>
                <span class="option-text">${option}</span>
            </div>
        `;
    });
    
    return optionsHTML;
}

function displayTimestamp() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('result-date').textContent = formattedDate;
    document.getElementById('completion-time').textContent = formattedTime;
    document.getElementById('completion-time-footer').textContent = `${formattedDate} at ${formattedTime}`;
}

function goBack() {
    // Quay lại trang quiz
    window.close(); // Đóng tab hiện tại
    // Hoặc: window.history.back(); // Nếu bạn muốn quay lại trang trước
}

function shareResults() {
    const resultData = JSON.parse(localStorage.getItem('quizResultData'));
    
    if (!resultData) {
        alert('No results to share!');
        return;
    }
    
    const shareText = `🎮 I scored ${resultData.score}/${resultData.totalQuestions} (${resultData.percentage || 0}%) in the Quiz Game!`;
    
    // Sử dụng Web Share API nếu có sẵn
    if (navigator.share) {
        navigator.share({
            title: 'My Quiz Results',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: Copy vào clipboard
        navigator.clipboard.writeText(shareText)
            .then(() => alert('Results copied to clipboard! 📋'))
            .catch(() => alert('Could not copy to clipboard. Please copy manually.'));
    }
}

function showError(message) {
    document.querySelector('.container').innerHTML = `
        <div class="error-container">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>No Results Found</h2>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="window.location.href='./showQuestion.html'">
                <i class="fas fa-gamepad"></i> Go to Quiz
            </button>
        </div>
    `;
}

// Thêm style cho error state
const errorStyle = document.createElement('style');
errorStyle.textContent = `
    .error-container {
        text-align: center;
        padding: 100px 20px;
        color: #666;
    }
    
    .error-container i {
        font-size: 4em;
        color: #FF9800;
        margin-bottom: 20px;
    }
    
    .error-container h2 {
        margin-bottom: 15px;
        color: #333;
    }
    
    .error-container p {
        margin-bottom: 30px;
        font-size: 1.1em;
    }
`;
document.head.appendChild(errorStyle);

// Thêm hàm hiển thị đáp án chi tiết
function displayAnswerAnalysis(question, questionNumber) {
    const labels = ['A', 'B', 'C', 'D'];
    let analysisHTML = '';
    
    question.allOptions.forEach((option, index) => {
        const label = labels[index];
        let optionClass = 'option';
        let statusText = '';
        let icon = '';
        
        // Kiểm tra đáp án
        const isCorrectAnswer = option === question.correctAnswer;
        const isUserAnswer = option === question.userAnswer;
        
        if (isCorrectAnswer && isUserAnswer) {
            // Người chơi chọn đúng
            optionClass += ' correct selected';
            statusText = '<span class="answer-status correct-status">✓ Your Answer (Correct)</span>';
            icon = '✅';
        } else if (isCorrectAnswer && !isUserAnswer) {
            // Đáp án đúng nhưng người chơi không chọn
            optionClass += ' correct';
            statusText = '<span class="answer-status correct-answer">✓ Correct Answer</span>';
            icon = '⭐';
        } else if (!isCorrectAnswer && isUserAnswer) {
            // Người chơi chọn sai
            optionClass += ' wrong selected';
            statusText = '<span class="answer-status wrong-status">✗ Your Answer (Wrong)</span>';
            icon = '❌';
        } else {
            // Đáp án sai khác
            optionClass += ' wrong';
            statusText = '<span class="answer-status wrong-answer">✗ Wrong Option</span>';
            icon = '○';
        }
        
        analysisHTML += `
            <div class="${optionClass}">
                <div class="option-header">
                    <span class="option-label">${label}.</span>
                    <span class="option-icon">${icon}</span>
                    ${statusText}
                </div>
                <div class="option-text">${option}</div>
            </div>
        `;
    });
    
    return analysisHTML;
}

// Cập nhật hàm generateOptionsHTML để sử dụng phân tích mới
function generateOptionsHTML(question) {
    const labels = ['A', 'B', 'C', 'D'];
    let optionsHTML = '';
    
    question.allOptions.forEach((option, index) => {
        const label = labels[index];
        const isCorrectAnswer = option === question.correctAnswer;
        const isUserAnswer = option === question.userAnswer;
        
        let optionClass = 'option';
        let badge = '';
        
        if (isCorrectAnswer && isUserAnswer) {
            optionClass += ' correct-user';
            badge = '<span class="badge correct-badge">Your Correct Answer</span>';
        } else if (isCorrectAnswer) {
            optionClass += ' correct-only';
            badge = '<span class="badge correct-badge">Correct Answer</span>';
        } else if (isUserAnswer) {
            optionClass += ' wrong-user';
            badge = '<span class="badge wrong-badge">Your Wrong Answer</span>';
        } else {
            optionClass += ' wrong-only';
            badge = '<span class="badge wrong-badge">Wrong Option</span>';
        }
        
        optionsHTML += `
            <div class="${optionClass}">
                <div class="option-content">
                    <div class="option-header">
                        <span class="option-label">${label}.</span>
                        ${badge}
                    </div>
                    <div class="option-text">${option}</div>
                </div>
            </div>
        `;
    });
    
    return optionsHTML;
}

function displayEnhancedQuestions(resultData, detailedResults) {
    const questionsList = document.getElementById('questions-list');
    
    console.log('Hiển thị enhanced questions:', detailedResults);

    if (!detailedResults || !detailedResults.length) {
        console.error('Không có dữ liệu detailedResults');
        questionsList.innerHTML = `
            <div class="no-data">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>⚠️ No Detailed Data Available</h3>
                <p>Could not load detailed question results.</p>
                <p><strong>Possible reasons:</strong></p>
                <ul>
                    <li>Quiz was not completed properly</li>
                    <li>Browser cookies/localStorage are disabled</li>
                    <li>Data was cleared from browser</li>
                </ul>
                <button class="btn btn-primary" onclick="window.location.href='./showQuestion.html'">
                    <i class="fas fa-redo"></i> Take Quiz Again
                </button>
            </div>
        `;
        return;
    }
    
    let questionsHTML = '';
    const labels = ['A', 'B', 'C', 'D'];
    
    detailedResults.forEach((question, index) => {
        const questionNumber = index + 1;
        const isCorrect = question.isCorrect;
        const userAnswer = question.userAnswer;
        const correctAnswer = question.correctAnswer;
        const allOptions = question.allOptions || [];
        
        // Tạo HTML cho tất cả các đáp án
        let optionsHTML = '';
        
        allOptions.forEach((option, optionIndex) => {
            const label = labels[optionIndex];
            const isCorrectAnswer = option === correctAnswer;
            const isUserAnswer = option === userAnswer;
            
            let optionClass = 'option';
            let badge = '';
            let optionStatus = '';
            
            if (isCorrectAnswer && isUserAnswer) {
                optionClass += ' correct-user';
                badge = '<span class="badge correct-badge">✅ Your Correct Answer</span>';
                optionStatus = 'correct-user';
            } else if (isCorrectAnswer) {
                optionClass += ' correct-only';
                badge = '<span class="badge correct-badge">⭐ Correct Answer</span>';
                optionStatus = 'correct-only';
            } else if (isUserAnswer) {
                optionClass += ' wrong-user';
                badge = '<span class="badge wrong-badge">❌ Your Wrong Answer</span>';
                optionStatus = 'wrong-user';
            } else {
                optionClass += ' wrong-only';
                badge = '<span class="badge wrong-badge">○ Wrong Option</span>';
                optionStatus = 'wrong-only';
            }
            
            optionsHTML += `
                <div class="${optionClass}" data-status="${optionStatus}">
                    <div class="option-content">
                        <div class="option-header">
                            <span class="option-label">${label}.</span>
                            ${badge}
                        </div>
                        <div class="option-text">${option}</div>
                    </div>
                </div>
            `;
        });
        
        questionsHTML += `
            <div class="question-item">
                <div class="question-header">
                    <div class="question-info">
                        <div class="question-number">Câu hỏi ${questionNumber}</div>
                        <div class="question-result ${isCorrect ? 'result-correct' : 'result-incorrect'}">
                            ${isCorrect ? '✅ Correct' : '❌ Incorrect'}
                        </div>
                    </div>
                    <div class="question-points">
                        <span class="points-label">Points:</span>
                        <span class="points-value ${isCorrect ? 'points-correct' : 'points-wrong'}">
                            ${isCorrect ? '+1' : '0'}
                        </span>
                    </div>
                </div>
                
                <div class="question-text">
                    ${question.question || 'No question text available'}
                </div>
                
                <div class="answer-analysis">
                    <h4 class="analysis-title">
                        <i class="fas fa-list-check"></i> Phân tích đáp án
                    </h4>
                    <div class="options-analysis-container">
                        ${optionsHTML}
                    </div>
                    
                    <div class="answer-summary">
                        <div class="summary-item ${isCorrect ? 'summary-correct' : 'summary-incorrect'}">
                            <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                            <span>
                                ${isCorrect 
                                    ? 'You answered correctly!' 
                                    : `You selected: <strong>"${userAnswer}"</strong>`
                                }
                            </span>
                        </div>
                        ${!isCorrect ? `
                        <div class="summary-item summary-correct">
                            <i class="fas fa-check-circle"></i>
                            <span>Correct answer: <strong>"${correctAnswer}"</strong></span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    // Thêm legend
    questionsHTML += `
        <div class="answer-legend">
            <h4 class="legend-title"><i class="fas fa-key"></i> Answer Key</h4>
            <div class="legend-items">
                <div class="legend-item">
                    <div class="legend-color legend-correct-user"></div>
                    <span>Your Correct Answer</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-correct-only"></div>
                    <span>Correct Answer (Not Selected)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-wrong-user"></div>
                    <span>Your Wrong Answer</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-wrong-only"></div>
                    <span>Wrong Option</span>
                </div>
            </div>
        </div>
    `;
    
    questionsList.innerHTML = questionsHTML;
}