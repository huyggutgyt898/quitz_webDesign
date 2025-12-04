// QUESTIONS PAGE JAVASCRIPT

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
const allQuizItems = document.querySelectorAll('.quiz-item');

let currentFilter = 'all';
let currentCategory = 'all';
let searchTerm = '';

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
        // Remove active class from all options
        filterOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        this.classList.add('active');
        
        // Get filter value
        currentFilter = this.getAttribute('data-filter');
        
        // Update button text
        const filterText = this.querySelector('span:last-child').textContent;
        filterDropdownBtn.querySelector('.filter-text').textContent = filterText;
        
        // Close dropdown
        filterDropdown.classList.remove('active');
        
        // Apply filter
        applyFilter();
    });
});

// Category Dropdown Click Handler
categoryDropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all items
        categoryDropdownItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Get category value
        currentCategory = this.getAttribute('data-category');
        
        // Apply filter
        applyFilter();
    });
});

// Apply Filter Function
function applyFilter() {
    if (currentFilter === 'all') {
        // Show all sections
        showAllSections();
    } else {
        // Show single filtered section
        showFilteredSection();
    }
    
    // Apply category filter
    applyCategoryFilter();
}

// Show All Sections (Tab "Tất cả")
function showAllSections() {
    allSections.style.display = 'block';
    singleSection.style.display = 'none';
    
    // Show all sections
    quizSections.forEach(section => {
        section.style.display = 'block';
    });
}

// Show Filtered Section (Specific tab selected)
function showFilteredSection() {
    allSections.style.display = 'none';
    singleSection.style.display = 'block';
    
    // Clear filtered grid
    filteredQuizGrid.innerHTML = '';
    
    // Get all quiz items that match the filter
    const matchingQuizzes = Array.from(allQuizItems).filter(item => {
        const itemFilter = item.getAttribute('data-filter');
        return itemFilter === currentFilter;
    });
    
    // Clone and add matching quizzes to filtered grid
    matchingQuizzes.forEach(quiz => {
        const clonedQuiz = quiz.cloneNode(true);
        attachQuizEventListeners(clonedQuiz);
        filteredQuizGrid.appendChild(clonedQuiz);
    });
    
    // Show empty state if no results
    if (matchingQuizzes.length === 0) {
        showEmptyState(filteredQuizGrid);
    }
}

// Apply Category Filter
function applyCategoryFilter() {
    if (currentCategory === 'all') {
        // Show all quizzes
        if (currentFilter === 'all') {
            quizSections.forEach(section => {
                section.style.display = 'block';
            });
        } else {
            const quizzes = filteredQuizGrid.querySelectorAll('.quiz-item');
            quizzes.forEach(quiz => {
                quiz.style.display = 'flex';
            });
        }
    } else {
        // Filter by category
        if (currentFilter === 'all') {
            // Hide/show sections based on whether they have items in this category
            quizSections.forEach(section => {
                const quizzesInSection = section.querySelectorAll('.quiz-item');
                let hasMatchingQuiz = false;
                
                quizzesInSection.forEach(quiz => {
                    const quizCategory = quiz.getAttribute('data-category');
                    if (quizCategory === currentCategory) {
                        quiz.style.display = 'flex';
                        hasMatchingQuiz = true;
                    } else {
                        quiz.style.display = 'none';
                    }
                });
                
                // Hide section if no matching quizzes
                section.style.display = hasMatchingQuiz ? 'block' : 'none';
            });
        } else {
            // Filter in single section view
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
    
    // Search in current view
    if (currentFilter === 'all') {
        // Search in all sections
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
        // Search in filtered view
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

// Check if quiz matches search term
function matchesSearch(quizElement) {
    const quizName = quizElement.querySelector('.quiz-name').textContent.toLowerCase();
    const quizDesc = quizElement.querySelector('.quiz-description').textContent.toLowerCase();
    const authorName = quizElement.querySelector('.author-name').textContent.toLowerCase();
    
    return quizName.includes(searchTerm) || 
           quizDesc.includes(searchTerm) || 
           authorName.includes(searchTerm);
}

// Search event listeners
quizSearchInput.addEventListener('input', () => {
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(handleSearch, 300);
});

searchBtn.addEventListener('click', handleSearch);

quizSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Show Empty State
function showEmptyState(container) {
    const existingEmpty = container.querySelector('.empty-state');
    if (existingEmpty) return;
    
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">Không tìm thấy quiz nào</div>
        <div class="empty-state-subtext">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
    `;
    container.appendChild(emptyState);
}

// Cập nhật attachQuizEventListeners để redirect khi chơi
function attachQuizEventListeners(quizElement) {
    const playBtn = quizElement.querySelector('.play-btn');
    const likeBtn = quizElement.querySelector('.like-btn');
    const dislikeBtn = quizElement.querySelector('.dislike-btn');
    const quizName = quizElement.querySelector('.quiz-name').textContent;

    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Redirect đến lecture.html với param
            window.location.href = `lecture.html?quiz=${encodeURIComponent(quizName)}`;
        });
    }

    // Giữ nguyên quiz item click 
    quizElement.addEventListener('click', () => {
        alert('Chi tiết quiz sẽ được hiển thị!');
    });

    // Giữ nguyên like/dislike
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

// Thêm phần load và render quiz từ JSON
window.addEventListener('load', () => {
    loadPreferences();
    
    fetch('data/allQuizzes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Không load được JSON');
            }
            return response.json();
        })
        .then(quizzes => {
            // Map section đến grid DOM
            const sectionGrids = {
                recommended: document.querySelector('.quiz-section[data-section="recommended"] .quiz-grid'),
                trending: document.querySelector('.quiz-section[data-section="trending"] .quiz-grid'),
                new: document.querySelector('.quiz-section[data-section="new"] .quiz-grid'),
                popular: document.querySelector('.quiz-section[data-section="popular"] .quiz-grid'),
                'most-played': document.querySelector('.quiz-section[data-section="most-played"] .quiz-grid'),
                'hot-players': document.querySelector('.quiz-section[data-section="hot-players"] .quiz-grid')
            };

            quizzes.forEach(quiz => {
                const quizHTML = `
                    <div class="quiz-item" data-category="${quiz.category}" data-filter="${quiz.section}">
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
                    </div>
                `;

                const targetGrid = sectionGrids[quiz.section];
                if (targetGrid) {
                    targetGrid.innerHTML += quizHTML;
                    const newItem = targetGrid.lastElementChild;
                    attachQuizEventListeners(newItem);
                }
            });

            // Apply filter và animation sau render
            applyFilter();
            addEntranceAnimation();
        })
        .catch(error => {
            console.error('Lỗi load quiz JSON:', error);
            // Optional: Hiển thị thông báo lỗi trên page
        });
});
//  Like/Dislike
function handleReaction(clickedBtn, oppositeBtn) {
    const countSpan = clickedBtn.querySelector('.reaction-count');
    let count = parseInt(countSpan.textContent);
    
    if (clickedBtn.classList.contains('active')) {
        // Remove reaction
        clickedBtn.classList.remove('active');
        count--;
    } else {
        // Add reaction
        clickedBtn.classList.add('active');
        count++;
        
        // Remove opposite reaction if active
        if (oppositeBtn.classList.contains('active')) {
            oppositeBtn.classList.remove('active');
            const oppositeCount = oppositeBtn.querySelector('.reaction-count');
            oppositeCount.textContent = parseInt(oppositeCount.textContent) - 1;
        }
    }
    
    countSpan.textContent = count;
    
    // Animation
    clickedBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        clickedBtn.style.transform = '';
    }, 200);
}

// Initialize event listeners for existing quiz items
allQuizItems.forEach(quiz => {
    attachQuizEventListeners(quiz);
});

// Section "xem thêm" links
document.querySelectorAll('.section-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.closest('.quiz-section');
        const sectionName = section.getAttribute('data-section');
        
        // Find and activate the corresponding filter
        filterOptions.forEach(option => {
            if (option.getAttribute('data-filter') === sectionName) {
                option.click();
            }
        });
    });
});

// Save user preferences
function savePreferences() {
    localStorage.setItem('lastFilter', currentFilter);
    localStorage.setItem('lastCategory', currentCategory);
}

// Load user preferences
function loadPreferences() {
    const savedFilter = localStorage.getItem('lastFilter');
    const savedCategory = localStorage.getItem('lastCategory');
    
    if (savedFilter) {
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
    
    if (savedCategory) {
        currentCategory = savedCategory;
        categoryDropdownItems.forEach(item => {
            if (item.getAttribute('data-category') === savedCategory) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    applyFilter();
}

// Auto-save on changes
filterOptions.forEach(option => {
    option.addEventListener('click', savePreferences);
});

categoryDropdownItems.forEach(item => {
    item.addEventListener('click', savePreferences);
});

// Entrance animation
function addEntranceAnimation() {
    const visibleQuizzes = document.querySelectorAll('.quiz-item[style*="display: flex"], .quiz-item:not([style*="display: none"])');
    
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

// Initialize on page load
window.addEventListener('load', () => {
    loadPreferences();
    addEntranceAnimation();
});

// Re-animate on filter change
filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        setTimeout(addEntranceAnimation, 100);
    });
});

categoryDropdownItems.forEach(item => {
    item.addEventListener('click', () => {
        setTimeout(addEntranceAnimation, 100);
    });
});

// Console log
console.log('%c🎮 Questions Page Loaded! ', 'background: #e07b39; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');
console.log(`Filter: ${currentFilter} | Category: ${currentCategory}`);