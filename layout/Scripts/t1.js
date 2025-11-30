// HOME PAGE JAVASCRIPT

// Hero Buttons
const startQuizBtn = document.getElementById('startQuizBtn');
const createQuizBtn = document.getElementById('createQuizBtn');

startQuizBtn.addEventListener('click', () => {
    window.location.href = 'questions.html';
});

createQuizBtn.addEventListener('click', () => {
    window.location.href = 'create.html';
});

// Category Cards
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        window.location.href = `questions.html?category=${category}`;
    });
});

// Quiz Cards
const quizCards = document.querySelectorAll('.quiz-card');
quizCards.forEach((card, index) => {
    card.addEventListener('click', function() {
        // Animation effect
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
            window.location.href = `quiz-detail.html?id=${index + 1}`;
        }, 150);
    });
});

// Leaderboard Items
const leaderboardItems = document.querySelectorAll('.leaderboard-item');
leaderboardItems.forEach((item, index) => {
    item.addEventListener('click', function() {
        window.location.href = `profile.html?user=${index + 1}`;
    });
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
let searchTimeout;

searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    const searchTerm = this.value.toLowerCase();
    
    if (searchTerm.length > 2) {
        searchTimeout = setTimeout(() => {
            // Simulate search (in real app, this would call an API)
            console.log('Searching for:', searchTerm);
            // You can add search results display here
        }, 500);
    }
});

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const searchTerm = this.value;
        if (searchTerm.length > 0) {
            window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
        }
    }
});

// Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections
const animatedElements = document.querySelectorAll('.categories-grid, .quiz-grid, .leaderboard-preview, .activities-list');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Stat Counter Animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target >= 1000) {
            element.textContent = (current / 1000).toFixed(1) + 'K+';
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
}

// Start counter animation when hero section is visible
const heroSection = document.querySelector('.hero-section');
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            animateCounter(statNumbers[0], 10000);
            animateCounter(statNumbers[1], 5000);
            animateCounter(statNumbers[2], 50);
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

heroObserver.observe(heroSection);

// Activity Auto-Update Simulation (for demo purposes)
let activityCount = 3;
function addNewActivity() {
    const activitiesList = document.querySelector('.activities-list');
    const activities = [
        {
            icon: '🎯',
            user: 'Phạm Văn D',
            action: 'đã hoàn thành quiz',
            quiz: 'Địa lý thế giới',
            time: 'Vừa xong',
            score: '+180 điểm'
        },
        {
            icon: '🏆',
            user: 'Hoàng Thị E',
            action: 'đạt thành tích mới trong',
            quiz: 'Toán học nâng cao',
            time: 'Vừa xong',
            score: '+300 điểm'
        },
        {
            icon: '✨',
            user: 'Ngô Văn F',
            action: 'đã tạo quiz mới',
            quiz: 'Khoa học tự nhiên',
            time: 'Vừa xong',
            score: '+150 điểm'
        }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.style.opacity = '0';
    activityItem.innerHTML = `
        <div class="activity-icon">${randomActivity.icon}</div>
        <div class="activity-content">
            <p><strong>${randomActivity.user}</strong> ${randomActivity.action} <strong>${randomActivity.quiz}</strong></p>
            <span class="activity-time">${randomActivity.time}</span>
        </div>
        <div class="activity-score">${randomActivity.score}</div>
    `;
    
    activitiesList.insertBefore(activityItem, activitiesList.firstChild);
    
    // Fade in animation
    setTimeout(() => {
        activityItem.style.transition = 'opacity 0.5s ease';
        activityItem.style.opacity = '1';
    }, 100);
    
    // Remove last item if more than 5
    const items = activitiesList.querySelectorAll('.activity-item');
    if (items.length > 5) {
        items[items.length - 1].remove();
    }
}

// Add new activity every 10 seconds (for demo)
setInterval(addNewActivity, 10000);

// Quiz Card Hover Effect Enhancement
quizCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const playIcon = this.querySelector('.quiz-play-icon');
        playIcon.style.transform = 'scale(1.2) rotate(90deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        const playIcon = this.querySelector('.quiz-play-icon');
        playIcon.style.transform = '';
    });
});

// Category Card Pulse Animation on Hover
categoryCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.category-icon');
        icon.style.animation = 'pulse 0.5s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.category-icon');
        icon.style.animation = '';
    });
});

// Add pulse animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

// Tooltip for Quiz Badges
const quizBadges = document.querySelectorAll('.quiz-badge');
quizBadges.forEach(badge => {
    badge.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    badge.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Local Storage for Recent Views
function saveRecentView(quizId) {
    let recentViews = JSON.parse(localStorage.getItem('recentViews') || '[]');
    recentViews.unshift(quizId);
    recentViews = [...new Set(recentViews)].slice(0, 5);
    localStorage.setItem('recentViews', JSON.stringify(recentViews));
}

// Load user preferences
function loadUserPreferences() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

loadUserPreferences();

// Console welcome message
console.log('%c🎯 Welcome to QUIZZKIT! ', 'background: #e07b39; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%cReady to test your knowledge?', 'color: #e07b39; font-size: 14px;');

// Performance tracking
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});