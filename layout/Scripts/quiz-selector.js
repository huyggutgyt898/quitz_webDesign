document.addEventListener('DOMContentLoaded', function() {
    console.log('Library page loaded');
    
    // Load user information
    loadUserInfo();
    
    // Setup filters
    setupFilters();
    
    // Setup search
    setupSearch();
    
    // Setup card interactions
    setupCardInteractions();
});

function loadUserInfo() {
    const username = localStorage.getItem('currentUser') || 'Guest';
    const sidebarUsername = document.getElementById('sidebarUsername');
    
    // Update sidebar username
    if (sidebarUsername) {
        sidebarUsername.textContent = username;
    }
}

function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterTopics);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', sortTopics);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', searchTopics);
        
        // Add debounce for better performance
        let debounceTimer;
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(searchTopics, 300);
        });
    }
}

function setupCardInteractions() {
    const cards = document.querySelectorAll('.topic-card');
    
    cards.forEach(card => {
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
        });
    });
}

function filterTopics() {
    const category = document.getElementById('categoryFilter').value;
    const cards = document.querySelectorAll('.topic-card');
    
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || category === cardCategory) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function sortTopics() {
    const sortBy = document.getElementById('sortFilter').value;
    const grid = document.getElementById('topicsGrid');
    const cards = Array.from(grid.querySelectorAll('.topic-card'));
    
    switch(sortBy) {
        case 'newest':
            // Simple shuffle for demo
            cards.sort(() => Math.random() - 0.5);
            break;
        case 'popular':
            // Sort by "popular" badge first
            cards.sort((a, b) => {
                const aHasPopular = a.querySelector('.badge.popular');
                const bHasPopular = b.querySelector('.badge.popular');
                return (bHasPopular ? 1 : 0) - (aHasPopular ? 1 : 0);
            });
            break;
        case 'questions':
            // Sort by question count (hardcoded for demo)
            const questionCounts = {
                'geography': 40,
                'web': 20,
                'biology': 30
            };
            
            cards.sort((a, b) => {
                const aCategory = a.getAttribute('data-category');
                const bCategory = b.getAttribute('data-category');
                return questionCounts[bCategory] - questionCounts[aCategory];
            });
            break;
    }
    
    // Reappend cards in new order
    cards.forEach(card => grid.appendChild(card));
}

function searchTopics() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.topic-card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const matches = title.includes(searchTerm) || 
                       description.includes(searchTerm) ||
                       tags.some(tag => tag.includes(searchTerm));
        
        card.style.display = matches ? 'flex' : 'none';
    });
}

function startQuiz(topic) {
    console.log(`Starting ${topic} quiz...`);
    
    // Get topic name and json file
    let topicName;
    let jsonFile;
    
    switch(topic) {
        case 'geography':
            topicName = 'Địa Lý Thế Giới';
            jsonFile = './Data/geography_questions.json';
            break;
        case 'webdesign':
            topicName = 'Thiết Kế Web Cơ Bản';
            jsonFile = './Data/web_design_questions.json';
            break;
        case 'biology':
            topicName = 'Sinh Học Cơ Bản';
            jsonFile = './Data/biology_questions.json';
            break;
        default:
            topicName = 'Quiz';
            jsonFile = './Data/questions.json';
    }
    
    // Save quiz settings to localStorage
    const quizSettings = {
        topic: topic,
        topicName: topicName,
        jsonFile: jsonFile,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('currentQuizSettings', JSON.stringify(quizSettings));
    localStorage.setItem('selectedQuizFile', jsonFile);
    
    // Show loading animation
    showLoadingAnimation(topicName);
    
    // Redirect to quiz page after short delay
    setTimeout(() => {
        window.location.href = 'showQuestion.html';
    }, 1500);
}

function showLoadingAnimation(topicName) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingTopic = document.getElementById('loadingTopic');
    
    if (loadingOverlay && loadingTopic) {
        loadingTopic.textContent = `Đang tải: ${topicName}`;
        loadingOverlay.classList.add('active');
    }
}

// Handle logout
function logoutUser(e) {
    e.preventDefault();
    
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}