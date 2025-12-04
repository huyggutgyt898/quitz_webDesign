// =====================================================
// HOME PAGE JAVASCRIPT - QUIZZKIT
// =====================================================

// Animate stats numbers on scroll
const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numValue = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/[0-9]/g, '');
                
                let currentValue = 0;
                const increment = numValue / 50;
                const duration = 1500; // 1.5 seconds
                const stepTime = duration / 50;
                
                target.classList.add('animated');
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numValue) {
                        target.textContent = finalValue;
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(currentValue).toLocaleString() + suffix;
                    }
                }, stepTime);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
};

// Handle quiz card clicks
const handleQuizClicks = () => {
    const quizItems = document.querySelectorAll('.quiz-item');
    
    quizItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Nếu click vào nút play
            if (e.target.classList.contains('play-btn')) {
                const quizName = this.querySelector('.quiz-name').textContent;
                alert(`Bắt đầu chơi: ${quizName}`);
                // TODO: Redirect to quiz page
                // window.location.href = 'quiz-play.html?id=xxx';
            }
        });
    });
};

// Handle reaction buttons (like/dislike)
const handleReactions = () => {
    const reactionBtns = document.querySelectorAll('.reaction-btn');
    
    reactionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent quiz card click event
            
            const countElement = this.querySelector('.reaction-count');
            let count = parseInt(countElement.textContent);
            
            if (this.classList.contains('active')) {
                // Unlike/Undislike
                count--;
                this.classList.remove('active');
            } else {
                // Like/Dislike
                count++;
                this.classList.add('active');
                
                // Remove active from opposite button
                const parent = this.closest('.quiz-reactions');
                const otherBtn = this.classList.contains('like-btn') 
                    ? parent.querySelector('.dislike-btn')
                    : parent.querySelector('.like-btn');
                
                if (otherBtn.classList.contains('active')) {
                    const otherCount = otherBtn.querySelector('.reaction-count');
                    otherCount.textContent = parseInt(otherCount.textContent) - 1;
                    otherBtn.classList.remove('active');
                }
            }
            
            countElement.textContent = count;
        });
    });
};

// Smooth scroll to sections
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
};

// Add entrance animations
const addEntranceAnimations = () => {
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

    // Apply to feature cards, quiz items, etc.
    const animatedElements = document.querySelectorAll('.feature-card, .quiz-item, .stat-card');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
};

// Handle search functionality
const handleSearch = () => {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    // TODO: Redirect to questions page with search query
                    window.location.href = `questions.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
};

// Log page view (analytics placeholder)
const logPageView = () => {
    console.log('📊 Home page viewed');
    // TODO: Integrate with analytics service
    // Example: gtag('event', 'page_view', { page_path: '/home' });
};

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 QUIZZKIT Home Page Loaded');
    
    // Initialize features
    animateStats();
    handleQuizClicks();
    handleReactions();
    smoothScroll();
    addEntranceAnimations();
    handleSearch();
    logPageView();
    
    // Add loading complete class to body
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        console.log('Window resized');
        // Add any resize-specific logic here
    }, 250);
});