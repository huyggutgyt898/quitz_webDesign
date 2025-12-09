document.addEventListener('DOMContentLoaded', function() {
    console.log('Quiz selector page loaded');
    
    // Load user information
    loadUserInfo();
    
    // Load user statistics
    loadUserStats();
    
    // Add event listeners for cards
    setupCardInteractions();
});

function loadUserInfo() {
    const username = localStorage.getItem('currentUser') || 'Guest';
    const avatar = document.getElementById('user-avatar');
    const usernameDisplay = document.getElementById('username-display');
    
    // Display username
    usernameDisplay.textContent = username;
    
    // Set avatar
    if (avatar) {
        const firstLetter = username.charAt(0).toUpperCase();
        avatar.textContent = firstLetter;
        
        // Set avatar color based on username
        const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F'];
        const colorIndex = username.charCodeAt(0) % colors.length;
        avatar.style.background = `linear-gradient(135deg, ${colors[colorIndex]}, ${colors[(colorIndex + 1) % colors.length]})`;
    }
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!isLoggedIn) {
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            alert('Please login to access quiz selection.');
            window.location.href = 'login.html';
        }, 2000);
    }
}

function loadUserStats() {
    // Load quiz history from localStorage
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    const username = localStorage.getItem('currentUser') || 'Guest';
    
    // Filter quizzes for current user
    const userQuizzes = quizHistory.filter(quiz => quiz.username === username);
    
    // Update statistics
    document.getElementById('quizzes-taken').textContent = userQuizzes.length;
    
    if (userQuizzes.length > 0) {
        // Calculate highest score
        const highestPercentage = Math.max(...userQuizzes.map(quiz => quiz.percentage));
        document.getElementById('high-score').textContent = `${highestPercentage}%`;
        
        // Calculate average score
        const averagePercentage = Math.round(
            userQuizzes.reduce((sum, quiz) => sum + quiz.percentage, 0) / userQuizzes.length
        );
        document.getElementById('average-score').textContent = `${averagePercentage}%`;
    } else {
        document.getElementById('high-score').textContent = '0%';
        document.getElementById('average-score').textContent = '0%';
    }
}

function setupCardInteractions() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.quiz-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function startQuiz(topic) {
    console.log(`Starting ${topic} quiz...`);
    
    // Get selected difficulty
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    
    // Save quiz settings to localStorage
    const quizSettings = {
        topic: topic,
        difficulty: difficulty,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('currentQuizSettings', JSON.stringify(quizSettings));
    
    // Determine which JSON file to load based on topic
    let jsonFile;
    switch(topic) {
        case 'geography':
            jsonFile = './Data/geography_questions.json';
            break;
        case 'webdesign':
            jsonFile = './Data/web_design_questions.json';
            break;
        case 'biology':
            jsonFile = './Data/biology_questions.json';
            break;
        default:
            jsonFile = './Data/questions.json';
    }
    
    // Save the selected JSON file path
    localStorage.setItem('selectedQuizFile', jsonFile);
    
    // Show loading animation
    showLoadingAnimation();
    
    // Redirect to quiz page after short delay
    setTimeout(() => {
        window.location.href = 'showQuestion.html';
    }, 1500);
}

function showLoadingAnimation() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <h3>Loading Quiz...</h3>
            <p>Preparing your ${getTopicName()} questions</p>
            <div class="loading-progress">
                <div class="progress-bar"></div>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }
        
        .loading-content {
            text-align: center;
            color: white;
            max-width: 400px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #667eea;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        .loading-content h3 {
            font-size: 1.8em;
            margin-bottom: 10px;
            color: white;
        }
        
        .loading-content p {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 20px;
        }
        
        .loading-progress {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            overflow: hidden;
            margin-top: 20px;
        }
        
        .progress-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            animation: progress 1.5s ease-in-out forwards;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes progress {
            to { width: 100%; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingOverlay);
}

function getTopicName() {
    const selected = localStorage.getItem('currentQuizSettings');
    if (selected) {
        const settings = JSON.parse(selected);
        switch(settings.topic) {
            case 'geography': return 'Geography';
            case 'webdesign': return 'Web Design';
            case 'biology': return 'Biology';
            default: return 'General';
        }
    }
    return 'General';
}

// Add logout functionality
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Add event listener for logout if needed
document.addEventListener('DOMContentLoaded', function() {
    const logoutLinks = document.querySelectorAll('a[href="login.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
});