// QUESTIONS PAGE JAVASCRIPT

// Filter Tabs Functionality
const filterTabs = document.querySelectorAll('.filter-tab');
const categoryFilters = document.querySelectorAll('.category-filter');
const quizItems = document.querySelectorAll('.quiz-item');
const quizList = document.querySelector('.quiz-list');

let currentFilter = 'recommended';
let currentCategory = 'all';

// Filter Tab Click Handler
filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Get filter value
        currentFilter = this.getAttribute('data-filter');
        
        // Apply filters
        applyFilters();
    });
});

// Category Filter Click Handler
categoryFilters.forEach(filter => {
    filter.addEventListener('click', function() {
        // Remove active class from all filters
        categoryFilters.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked filter
        this.classList.add('active');
        
        // Get category value
        currentCategory = this.getAttribute('data-category');
        
        // Apply filters
        applyFilters();
    });
});

// Apply Filters Function
function applyFilters() {
    let hasVisibleItems = false;
    
    quizItems.forEach(item => {
        const itemFilter = item.getAttribute('data-filter');
        const itemCategory = item.getAttribute('data-category');
        
        // Check if item matches current filters
        const matchesFilter = currentFilter === 'recommended' || itemFilter === currentFilter;
        const matchesCategory = currentCategory === 'all' || itemCategory === currentCategory;
        
        if (matchesFilter && matchesCategory) {
            item.style.display = 'flex';
            // Add fade-in animation
            item.style.animation = 'fadeIn 0.5s ease';
            hasVisibleItems = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    showEmptyState(!hasVisibleItems);
}

// Show Empty State
function showEmptyState(show) {
    let emptyState = document.querySelector('.empty-state');
    
    if (show) {
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-text">Không tìm thấy quiz nào</div>
                <div class="empty-state-subtext">Thử thay đổi bộ lọc hoặc tìm kiếm khác</div>
            `;
            quizList.appendChild(emptyState);
        }
        emptyState.style.display = 'block';
    } else {
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }
}

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Quiz Item Click Handler
quizItems.forEach((item, index) => {
    const playBtn = item.querySelector('.play-btn');
    
    // Click on play button
    if (playBtn) {
        playBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.location.href = `quiz-play.html?id=${index + 1}`;
        });
    }
    
    // Click on entire card
    item.addEventListener('click', function() {
        window.location.href = `quiz-detail.html?id=${index + 1}`;
    });
});

// Like/Dislike Buttons
const likeButtons = document.querySelectorAll('.like-btn');
const dislikeButtons = document.querySelectorAll('.dislike-btn');

likeButtons.forEach((btn, index) => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const countSpan = this.querySelector('.reaction-count');
        let count = parseInt(countSpan.textContent);
        
        if (this.classList.contains('active')) {
            // Unlike
            this.classList.remove('active');
            count--;
        } else {
            // Like
            this.classList.add('active');
            count++;
            
            // Remove dislike if active
            const dislikeBtn = this.parentElement.querySelector('.dislike-btn');
            if (dislikeBtn.classList.contains('active')) {
                dislikeBtn.classList.remove('active');
                const dislikeCount = dislikeBtn.querySelector('.reaction-count');
                dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
            }
        }
        
        countSpan.textContent = count;
        
        // Add animation
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

dislikeButtons.forEach((btn, index) => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const countSpan = this.querySelector('.reaction-count');
        let count = parseInt(countSpan.textContent);
        
        if (this.classList.contains('active')) {
            // Un-dislike
            this.classList.remove('active');
            count--;
        } else {
            // Dislike
            this.classList.add('active');
            count++;
            
            // Remove like if active
            const likeBtn = this.parentElement.querySelector('.like-btn');
            if (likeBtn.classList.contains('active')) {
                likeBtn.classList.remove('active');
                const likeCount = likeBtn.querySelector('.reaction-count');
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
            }
        }
        
        countSpan.textContent = count;
        
        // Add animation
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Load More Button
const loadMoreBtn = document.getElementById('loadMoreBtn');
let isLoading = false;

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
        if (isLoading) return;
        
        isLoading = true;
        const textSpan = this.querySelector('span:first-child');
        const spinner = this.querySelector('.loading-spinner');
        
        // Show loading state
        textSpan.textContent = 'Đang tải...';
        spinner.style.display = 'inline-block';
        this.style.opacity = '0.7';
        this.style.cursor = 'not-allowed';
        
        // Simulate loading (replace with actual API call)
        setTimeout(() => {
            // Add more quiz items (demo)
            addMoreQuizzes();
            
            // Reset button state
            textSpan.textContent = 'Xem thêm';
            spinner.style.display = 'none';
            this.style.opacity = '1';
            this.style.cursor = 'pointer';
            isLoading = false;
        }, 1500);
    });
}

// Add More Quizzes Function (Demo)
function addMoreQuizzes() {
    const categories = ['technology', 'science', 'history', 'geography', 'sports', 'entertainment'];
    const filters = ['recommended', 'trending', 'new', 'popular', 'most-played'];
    const quizTitles = [
        'Quiz về JavaScript',
        'Khoa học vũ trụ',
        'Chiến tranh thế giới',
        'Thủ đô các nước',
        'Bóng rổ NBA',
        'Âm nhạc Việt Nam'
    ];
    
    for (let i = 0; i < 4; i++) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomFilter = filters[Math.floor(Math.random() * filters.length)];
        const randomTitle = quizTitles[Math.floor(Math.random() * quizTitles.length)];
        
        const quizItem = document.createElement('div');
        quizItem.className = 'quiz-item';
        quizItem.setAttribute('data-category', randomCategory);
        quizItem.setAttribute('data-filter', randomFilter);
        quizItem.style.display = 'none';
        
        quizItem.innerHTML = `
            <div class="quiz-thumbnail">
                <img src="https://via.placeholder.com/200x150/667eea/ffffff?text=Quiz" alt="${randomTitle}">
                <div class="quiz-overlay">
                    <button class="play-btn">▶ Chơi ngay</button>
                </div>
            </div>
            <div class="quiz-details">
                <h3 class="quiz-name">${randomTitle}</h3>
                <p class="quiz-description">Mô tả ngắn về quiz này</p>
                <div class="quiz-author">
                    <img src="Images/Avatar.jpg" alt="User" class="author-avatar">
                    <span class="author-name">User ${Math.floor(Math.random() * 100)}</span>
                </div>
                <div class="quiz-stats">
                    <div class="stat-item">
                        <span class="stat-icon">👁️</span>
                        <span class="stat-value">${Math.floor(Math.random() * 5000) + 500}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🎮</span>
                        <span class="stat-value">${Math.floor(Math.random() * 2000) + 100}</span>
                    </div>
                    <div class="quiz-reactions">
                        <button class="reaction-btn like-btn">
                            <span class="reaction-icon">👍</span>
                            <span class="reaction-count">${Math.floor(Math.random() * 50)}</span>
                        </button>
                        <button class="reaction-btn dislike-btn">
                            <span class="reaction-icon">👎</span>
                            <span class="reaction-count">${Math.floor(Math.random() * 10)}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        quizList.appendChild(quizItem);
        
        // Add event listeners to new items
        const playBtn = quizItem.querySelector('.play-btn');
        playBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('Chức năng chơi quiz sẽ được triển khai!');
        });
        
        quizItem.addEventListener('click', function() {
            alert('Chi tiết quiz sẽ được hiển thị!');
        });
        
        // Add like/dislike functionality
        const newLikeBtn = quizItem.querySelector('.like-btn');
        const newDislikeBtn = quizItem.querySelector('.dislike-btn');
        
        newLikeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
        
        newDislikeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    }
    
    // Re-apply filters to show new items
    applyFilters();
}

// Search Functionality
const searchInput = document.getElementById('searchInput');
let searchTimeout;

if (searchInput) {
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm.length > 0) {
            searchTimeout = setTimeout(() => {
                filterBySearch(searchTerm);
            }, 300);
        } else {
            applyFilters();
        }
    });
}

// Filter by Search
function filterBySearch(term) {
    let hasResults = false;
    
    quizItems.forEach(item => {
        const quizName = item.querySelector('.quiz-name').textContent.toLowerCase();
        const quizDesc = item.querySelector('.quiz-description').textContent.toLowerCase();
        const authorName = item.querySelector('.author-name').textContent.toLowerCase();
        
        if (quizName.includes(term) || quizDesc.includes(term) || authorName.includes(term)) {
            item.style.display = 'flex';
            hasResults = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    showEmptyState(!hasResults);
}

// Scroll to Top on Filter Change
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

filterTabs.forEach(tab => {
    tab.addEventListener('click', scrollToTop);
});

// Save User Preferences
function saveFilterPreference() {
    localStorage.setItem('lastFilter', currentFilter);
    localStorage.setItem('lastCategory', currentCategory);
}

filterTabs.forEach(tab => {
    tab.addEventListener('click', saveFilterPreference);
});

categoryFilters.forEach(filter => {
    filter.addEventListener('click', saveFilterPreference);
});

// Load User Preferences
function loadFilterPreference() {
    const lastFilter = localStorage.getItem('lastFilter');
    const lastCategory = localStorage.getItem('lastCategory');
    
    if (lastFilter) {
        currentFilter = lastFilter;
        filterTabs.forEach(tab => {
            if (tab.getAttribute('data-filter') === lastFilter) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    if (lastCategory) {
        currentCategory = lastCategory;
        categoryFilters.forEach(filter => {
            if (filter.getAttribute('data-category') === lastCategory) {
                filter.classList.add('active');
            } else {
                filter.classList.remove('active');
            }
        });
    }
    
    applyFilters();
}

// Initialize on page load
window.addEventListener('load', () => {
    loadFilterPreference();
    
    // Add entrance animation to quiz items
    quizItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 50);
    });
});

// Infinite Scroll (Optional)
let autoLoadEnabled = false;

window.addEventListener('scroll', () => {
    if (!autoLoadEnabled || isLoading) return;
    
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    
    // Load more when user is 200px from bottom
    if (scrollPosition >= pageHeight - 200) {
        if (loadMoreBtn) {
            loadMoreBtn.click();
        }
    }
});

// Toggle auto-load (can be controlled by user setting)
function toggleAutoLoad(enabled) {
    autoLoadEnabled = enabled;
}

// Console welcome message
console.log('%c🎮 Questions Page Loaded! ', 'background: #e07b39; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');
console.log(`Current Filter: ${currentFilter} | Current Category: ${currentCategory}`);