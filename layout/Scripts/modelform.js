// QUESTIONS PAGE JAVASCRIPT - FIXED

// DOM Elements
const filterDropdownBtn = document.getElementById('filterDropdownBtn');
const filterDropdown = document.getElementById('filterDropdown');
const filterOptions = document.querySelectorAll('.filter-option');
const categoryDropdownItems = document.querySelectorAll('#categoryDropdown .dropdown-item');
const quizSearchInput = document.getElementById('quizSearchInput');
const searchBtn = document.getElementById('searchBtn');
const allSections = document.getElementById('allSections');
const singleSection = document.getElementById('singleSection');
const filteredQuizGrid = document.getElementById('filteredQuizGrid');
const quizSections = document.querySelectorAll('.quiz-section');

let currentFilter = 'all';
let currentCategory = 'all';
let searchTerm = '';
let allQuizData = [];

// Toggle Filter Dropdown
filterDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    filterDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!filterDropdown.contains(e.target) && !filterDropdownBtn.contains(e.target)) {
        filterDropdown.classList.remove('active');
    }
});

// Filter Option Click Handler
filterOptions.forEach(option => {
    option.addEventListener('click', function() {
        filterOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        currentFilter = this.getAttribute('data-filter');
        const filterText = this.querySelector('span:last-child').textContent;
        filterDropdownBtn.querySelector('.filter-text').textContent = filterText;
        
        filterDropdown.classList.remove('active');
        applyFilter();
    });
});

// Category Dropdown Click Handler
categoryDropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        categoryDropdownItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        currentCategory = this.getAttribute('data-category');
        applyFilter();
    });
});

// Apply Filter Function - FIXED
function applyFilter() {
    // Clear search term when changing filter
    searchTerm = '';
    if (quizSearchInput) quizSearchInput.value = '';
    
    if (currentFilter === 'all') {
        showAllSections();
    } else {
        showFilteredSection();
    }
    
    applyCategoryFilter();
    addEntranceAnimation();
}

// Show All Sections
function showAllSections() {
    allSections.style.display = 'block';
    singleSection.style.display = 'none';
    
    quizSections.forEach(section => {
        section.style.display = 'block';
    });
}

// Show Filtered Section - FIXED
function showFilteredSection() {
    allSections.style.display = 'none';
    singleSection.style.display = 'block';
    
    filteredQuizGrid.innerHTML = '';
    
    const matchingQuizzes = allQuizData.filter(quiz => quiz.section === currentFilter);
    
    if (matchingQuizzes.length === 0) {
        showEmptyState(filteredQuizGrid);
        return;
    }
    
    matchingQuizzes.forEach(quiz => {
        const quizElement = createQuizElement(quiz);
        filteredQuizGrid.appendChild(quizElement);
    });
}

// Apply Category Filter
function applyCategoryFilter() {
    if (currentCategory === 'all') {
        if (currentFilter === 'all') {
            quizSections.forEach(section => {
                const quizItems = section.querySelectorAll('.quiz-item');
                quizItems.forEach(item => item.style.display = 'flex');
                section.style.display = 'block';
            });
        } else {
            const quizzes = filteredQuizGrid.querySelectorAll('.quiz-item');
            quizzes.forEach(quiz => quiz.style.display = 'flex');
        }
    } else {
        if (currentFilter === 'all') {
            quizSections.forEach(section => {
                const quizItems = section.querySelectorAll('.quiz-item');
                let hasMatchingQuiz = false;
                
                quizItems.forEach(item => {
                    const quizCategory = item.getAttribute('data-category');
                    if (quizCategory === currentCategory) {
                        item.style.display = 'flex';
                        hasMatchingQuiz = true;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                section.style.display = hasMatchingQuiz ? 'block' : 'none';
            });
        } else {
            const quizzes = filteredQuizGrid.querySelectorAll('.quiz-item');
            let hasResults = false;
            
            quizzes.forEach(quiz => {
                const quizCategory = quiz.getAttribute('data-category');
                if (quizCategory === currentCategory) {
                    quiz.style.display = 'flex';
                    hasResults = true;
                } else {
                    quiz.style.display = 'none';
                }
            });
            
            if (!hasResults) {
                showEmptyState(filteredQuizGrid);
            }
        }
    }
}

// Search Functionality
function handleSearch() {
    searchTerm = quizSearchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        applyFilter();
        return;
    }
    
    if (currentFilter === 'all') {
        quizSections.forEach(section => {
            const quizzes = section.querySelectorAll('.quiz-item');
            let hasResults = false;
            
            quizzes.forEach(quiz => {
                if (matchesSearch(quiz)) {
                    quiz.style.display = 'flex';
                    hasResults = true;
                } else {
                    quiz.style.display = 'none';
                }
            });
            
            section.style.display = hasResults ? 'block' : 'none';
        });
    } else {
        const quizzes = filteredQuizGrid.querySelectorAll('.quiz-item');
        let hasResults = false;
        
        quizzes.forEach(quiz => {
            if (matchesSearch(quiz)) {
                quiz.style.display = 'flex';
                hasResults = true;
            } else {
                quiz.style.display = 'none';
            }
        });
        
        if (!hasResults) {
            showEmptyState(filteredQuizGrid);
        }
    }
}

function matchesSearch(quizElement) {
    const quizName = quizElement.querySelector('.quiz-name').textContent.toLowerCase();
    const quizDesc = quizElement.querySelector('.quiz-description').textContent.toLowerCase();
    const authorName = quizElement.querySelector('.author-name').textContent.toLowerCase();
    
    return quizName.includes(searchTerm) || 
           quizDesc.includes(searchTerm) || 
           authorName.includes(searchTerm);
}

// Search event listeners
if (quizSearchInput) {
    quizSearchInput.addEventListener('input', () => {
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(handleSearch, 300);
    });
}

if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
}

if (quizSearchInput) {
    quizSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// Show Empty State
function showEmptyState(container) {
    const existingEmpty = container.querySelector('.empty-state');
    if (existingEmpty) existingEmpty.remove();
    
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">Không tìm thấy quiz nào</div>
        <div class="empty-state-subtext">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
    `;
    container.appendChild(emptyState);
}

// Create Quiz Element
function createQuizElement(quiz) {
    const quizDiv = document.createElement('div');
    quizDiv.className = 'quiz-item';
    quizDiv.setAttribute('data-category', quiz.category);
    quizDiv.setAttribute('data-filter', quiz.section);
    
    quizDiv.innerHTML = `
        <div class="quiz-thumbnail">
            <img src="${quiz.thumbnail}" alt="${quiz.alt}">
            <div class="quiz-overlay">
                <button class="play-btn">▶ Chơi ngay</button>
            </div>
        </div>
        <div class="quiz-details">
            <h3 class="quiz-name">${quiz.name}</h3>
            <p class="quiz-description">${quiz.description}</p>
            <div class="quiz-author">
                <img src="${quiz.authorImg}" alt="${quiz.authorName}" class="author-avatar">
                <span class="author-name">${quiz.authorName}</span>
                ${quiz.authorBadge ? `<span class="author-badge">${quiz.authorBadge}</span>` : ''}
            </div>
            <div class="quiz-stats">
                <div class="stat-item">
                    <span class="stat-icon">▶️</span>
                    <span class="stat-value">${quiz.plays}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">👁️</span>
                    <span class="stat-value">${quiz.views}</span>
                </div>
                <div class="quiz-reactions">
                    <button class="reaction-btn like-btn">
                        <span class="reaction-icon">👍</span>
                        <span class="reaction-count">${quiz.likes}</span>
                    </button>
                    <button class="reaction-btn dislike-btn">
                        <span class="reaction-icon">👎</span>
                        <span class="reaction-count">${quiz.dislikes}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    attachQuizEventListeners(quizDiv);
    return quizDiv;
}

// Attach Event Listeners to Quiz
function attachQuizEventListeners(quizElement) {
    const playBtn = quizElement.querySelector('.play-btn');
    const likeBtn = quizElement.querySelector('.like-btn');
    const dislikeBtn = quizElement.querySelector('.dislike-btn');
    const quizName = quizElement.querySelector('.quiz-name').textContent;

    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = `lecture.html?quiz=${encodeURIComponent(quizName)}`;
        });
    }

    if (likeBtn) {
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleReaction(likeBtn, dislikeBtn);
        });
    }

    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleReaction(dislikeBtn, likeBtn);
        });
    }
}

// Handle Like/Dislike
function handleReaction(clickedBtn, oppositeBtn) {
    const countSpan = clickedBtn.querySelector('.reaction-count');
    let count = parseInt(countSpan.textContent);
    
    if (clickedBtn.classList.contains('active')) {
        clickedBtn.classList.remove('active');
        count--;
    } else {
        clickedBtn.classList.add('active');
        count++;
        
        if (oppositeBtn.classList.contains('active')) {
            oppositeBtn.classList.remove('active');
            const oppositeCount = oppositeBtn.querySelector('.reaction-count');
            oppositeCount.textContent = parseInt(oppositeCount.textContent) - 1;
        }
    }
    
    countSpan.textContent = count;
    
    clickedBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        clickedBtn.style.transform = '';
    }, 200);
}

// Load Quizzes from JSON
window.addEventListener('load', () => {
    loadPreferences();
    
    fetch('data/allQuizzes.json')
        .then(response => {
            if (!response.ok) throw new Error('Không load được JSON');
            return response.json();
        })
        .then(quizzes => {
            allQuizData = quizzes;
            
            const sectionGrids = {
                recommended: document.querySelector('.quiz-section[data-section="recommended"] .quiz-grid'),
                trending: document.querySelector('.quiz-section[data-section="trending"] .quiz-grid'),
                new: document.querySelector('.quiz-section[data-section="new"] .quiz-grid'),
                popular: document.querySelector('.quiz-section[data-section="popular"] .quiz-grid'),
                'most-played': document.querySelector('.quiz-section[data-section="most-played"] .quiz-grid'),
                'hot-players': document.querySelector('.quiz-section[data-section="hot-players"] .quiz-grid')
            };

            quizzes.forEach(quiz => {
                const targetGrid = sectionGrids[quiz.section];
                if (targetGrid) {
                    const quizElement = createQuizElement(quiz);
                    targetGrid.appendChild(quizElement);
                }
            });

            applyFilter();
            addEntranceAnimation();
        })
        .catch(error => {
            console.error('Lỗi load quiz JSON:', error);
        });
});

// Section links
document.querySelectorAll('.section-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.closest('.quiz-section');
        const sectionName = section.getAttribute('data-section');
        
        filterOptions.forEach(option => {
            if (option.getAttribute('data-filter') === sectionName) {
                option.click();
            }
        });
    });
});

// Save/Load Preferences
function savePreferences() {
    localStorage.setItem('lastFilter', currentFilter);
    localStorage.setItem('lastCategory', currentCategory);
}

function loadPreferences() {
    const savedFilter = localStorage.getItem('lastFilter');
    const savedCategory = localStorage.getItem('lastCategory');
    
    if (savedFilter && savedFilter !== 'all') {
        currentFilter = savedFilter;
        filterOptions.forEach(option => {
            if (option.getAttribute('data-filter') === savedFilter) {
                option.classList.add('active');
                const filterText = option.querySelector('span:last-child').textContent;
                filterDropdownBtn.querySelector('.filter-text').textContent = filterText;
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    if (savedCategory && savedCategory !== 'all') {
        currentCategory = savedCategory;
        categoryDropdownItems.forEach(item => {
            if (item.getAttribute('data-category') === savedCategory) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

filterOptions.forEach(option => {
    option.addEventListener('click', savePreferences);
});

categoryDropdownItems.forEach(item => {
    item.addEventListener('click', savePreferences);
});

// Entrance Animation
function addEntranceAnimation() {
    const visibleQuizzes = document.querySelectorAll('.quiz-item:not([style*="display: none"])');
    
    visibleQuizzes.forEach((quiz, index) => {
        quiz.style.opacity = '0';
        quiz.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            quiz.style.transition = 'all 0.5s ease';
            quiz.style.opacity = '1';
            quiz.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

console.log('%c🎮 Questions Page Loaded!', 'background: #e07b39; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');