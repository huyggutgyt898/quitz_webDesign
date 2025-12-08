// QUESTIONS PAGE - FINAL VERSION

const filterDropdownBtn = document.getElementById('filterDropdownBtn');
const filterDropdown = document.getElementById('filterDropdown');
const filterOptions = document.querySelectorAll('.filter-option');
const categoryDropdownItems = document.querySelectorAll('#categoryDropdown .dropdown-item');
const quizSearchInput = document.getElementById('quizSearchInput');
const searchBtn = document.getElementById('searchBtn');
const allSections = document.getElementById('allSections');
const singleSection = document.getElementById('singleSection');
const filteredQuizGrid = document.getElementById('filteredQuizGrid');

// Navbar dropdown toggle
const navbarDropdownWrapper = document.querySelector('.navbar-dropdown-wrapper');
const categoryDropdown = document.getElementById('categoryDropdown');

let currentFilter = 'all';
let currentCategory = 'all';
let searchTerm = '';
let allQuizData = [];

// Toggle Navbar Category Dropdown
if (navbarDropdownWrapper && categoryDropdown) {
    navbarDropdownWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        categoryDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbarDropdownWrapper.contains(e.target)) {
            categoryDropdown.classList.remove('show');
        }
    });
}

// Toggle Filter Dropdown
if (filterDropdownBtn) {
    filterDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('opacity-0');
        filterDropdown.classList.toggle('invisible');
    });
}

document.addEventListener('click', (e) => {
    if (filterDropdown && filterDropdownBtn) {
        if (!filterDropdown.contains(e.target) && !filterDropdownBtn.contains(e.target)) {
            filterDropdown.classList.add('opacity-0');
            filterDropdown.classList.add('invisible');
        }
    }
});

// Filter Options
filterOptions.forEach(option => {
    option.addEventListener('click', function() {
        filterOptions.forEach(opt => {
            opt.classList.remove('active', 'bg-orange-50', 'border-orange-500', 'text-orange-600');
        });
        this.classList.add('active', 'bg-orange-50', 'border-orange-500', 'text-orange-600');
        
        currentFilter = this.getAttribute('data-filter');
        const filterText = this.textContent;
        if (filterDropdownBtn) {
            filterDropdownBtn.querySelector('.filter-text').textContent = filterText;
        }
        
        filterDropdown.classList.add('opacity-0', 'invisible');
        applyFilter();
    });
});

// Category Dropdown
categoryDropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        categoryDropdownItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        currentCategory = this.getAttribute('data-category');
        
        // Close dropdown
        if (categoryDropdown) {
            categoryDropdown.classList.remove('show');
        }
        
        applyFilter();
    });
});

// SỬA: Hàm applyFilter() bây giờ sẽ lọc theo currentCategory trước.
// Nếu currentCategory != 'all', ưu tiên lọc theo category và hiển thị ở singleSection.
// Nếu currentCategory == 'all', thì fallback về lọc theo currentFilter như cũ.
// (Giả sử mỗi quiz trong allQuizData có thuộc tính 'category' như 'math', 'physics',...)
function applyFilter() {
    searchTerm = '';
    if (quizSearchInput) quizSearchInput.value = '';
    
    let filteredQuizzes = allQuizData;

    // Ưu tiên lọc theo category nếu != 'all'
    if (currentCategory !== 'all') {
        filteredQuizzes = filteredQuizzes.filter(q => q.category === currentCategory);
        
        // Nếu có filter != 'all', lọc thêm theo section (tùy chọn, để kết hợp cả hai)
        if (currentFilter !== 'all') {
            filteredQuizzes = filteredQuizzes.filter(q => q.section === currentFilter);
        }
        
        showFilteredQuizzes(filteredQuizzes);
        return;
    }

    // Nếu category == 'all', lọc theo filter như cũ
    if (currentFilter === 'all') {
        if (allSections) allSections.classList.remove('hidden');
        if (singleSection) singleSection.classList.add('hidden');
    } else {
        filteredQuizzes = filteredQuizzes.filter(q => q.section === currentFilter);
        showFilteredQuizzes(filteredQuizzes);
    }
}

// Hàm mới: Hiển thị quiz đã lọc ở singleSection
function showFilteredQuizzes(quizzes) {
    if (allSections) allSections.classList.add('hidden');
    if (singleSection) singleSection.classList.remove('hidden');
    
    if (filteredQuizGrid) {
        filteredQuizGrid.innerHTML = '';
        if (quizzes.length === 0) {
            showEmptyState(filteredQuizGrid);
            return;
        }
        
        quizzes.forEach(quiz => {
            const quizElement = createQuizElement(quiz);
            filteredQuizGrid.appendChild(quizElement);
        });
    }
}

// Search
function handleSearch() {
    if (!quizSearchInput) return;
    searchTerm = quizSearchInput.value.toLowerCase().trim();
    
    let filteredQuizzes = allQuizData.filter(quiz => 
        quiz.name.toLowerCase().includes(searchTerm)
    );
    
    // Nếu có category/filter, lọc thêm (tích hợp với category/filter)
    if (currentCategory !== 'all') {
        filteredQuizzes = filteredQuizzes.filter(q => q.category === currentCategory);
    }
    if (currentFilter !== 'all') {
        filteredQuizzes = filteredQuizzes.filter(q => q.section === currentFilter);
    }
    
    showFilteredQuizzes(filteredQuizzes);  // Sử dụng hàm mới để hiển thị
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

function createQuizElement(quiz) {
    const quizDiv = document.createElement('div');
    quizDiv.className = 'quiz-item relative bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col';
    quizDiv.innerHTML = `
        <div class="quiz-thumbnail relative overflow-hidden rounded-t-2xl">
            <img src="${quiz.thumbnail}" alt="${quiz.name}" class="w-full h-40 object-cover transform transition-transform duration-500">
            <div class="quiz-stats-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex justify-between text-white text-xs font-semibold opacity-0">
                <span>👥 ${quiz.players}</span>
                <span>⭐ ${quiz.rating}</span>
                <span>🕒 ${quiz.time}</span>
            </div>
        </div>
        <div class="p-4 flex flex-col flex-1">
            <h3 class="quiz-name font-bold text-lg mb-2 text-gray-800 cursor-pointer hover:text-orange-500 transition-colors data-quiz-name="${quiz.name}">${quiz.name}</h3>
            <p class="text-sm text-gray-600 leading-relaxed min-h-[2.5rem] line-clamp-2">${quiz.description}</p>
            
            <div class="flex items-center gap-3 pt-3 border-t border-gray-200 mt-auto">
                <img src="${quiz.authorImg}" alt="${quiz.authorName}" class="w-8 h-8 rounded-full border-2 border-orange-500 object-cover">
                <span class="text-sm font-semibold text-gray-800 flex-1 truncate">${quiz.authorName}</span>
                ${quiz.authorBadge ? `<span class="text-xs bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 px-2 py-1 rounded-full font-bold">${quiz.authorBadge}</span>` : ''}
            </div>
        </div>
    `;
    
    attachQuizEventListeners(quizDiv);
    return quizDiv;
}

function attachQuizEventListeners(quizElement) {
    const quizNameEl = quizElement.querySelector('.quiz-name');
    const quizThumbnail = quizElement.querySelector('.quiz-thumbnail');
    const quizName = quizNameEl?.getAttribute('data-quiz-name');

    // Click on quiz name to go to lecture
    if (quizNameEl && quizName) {
        quizNameEl.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = `lecture.html?quiz=${encodeURIComponent(quizName)}`;
        });
    }

    // Click on thumbnail to go to lecture
    if (quizThumbnail && quizName) {
        quizThumbnail.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = `lecture.html?quiz=${encodeURIComponent(quizName)}`;
        });
    }
}

function showEmptyState(container) {
    container.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="text-6xl mb-4">🔍</div>
            <div class="text-xl text-gray-600 mb-2">Không tìm thấy quiz nào</div>
            <div class="text-sm text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
        </div>
    `;
}

// Load Data
window.addEventListener('load', () => {
    fetch('data/allQuizzes.json')
        .then(response => response.json())
        .then(quizzes => {
            allQuizData = quizzes;
            renderSections(quizzes);
            applyFilter();  // SỬA: Gọi applyFilter() sau khi load để áp dụng category/filter ban đầu
        })
        .catch(error => console.error('Error:', error));
});

function renderSections(quizzes) {
    const sections = {
        recommended: { icon: '⭐', title: 'Quiz đề xuất' },
        trending: { icon: '🔥', title: 'Quiz trending' },
        new: { icon: '✨', title: 'Quiz mới nhất' },
        popular: { icon: '👁️', title: 'Quiz nhiều xem' },
        'most-played': { icon: '🎮', title: 'Quiz nhiều chơi' },
        'hot-players': { icon: '👑', title: 'Quiz từ Hot Player' }
    };

    Object.keys(sections).forEach(sectionKey => {
        const sectionQuizzes = quizzes.filter(q => q.section === sectionKey);
        if (sectionQuizzes.length === 0) return;

        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'mb-12 section-collapsed';
        sectionDiv.setAttribute('data-section', sectionKey);
        
        sectionDiv.innerHTML = `
            <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
                <h2 class="flex items-center gap-3 text-2xl font-bold text-gray-800">
                    <span class="text-3xl">${sections[sectionKey].icon}</span>
                    ${sections[sectionKey].title}
                </h2>
                <a href="#" class="section-link text-orange-500 text-sm font-semibold hover:text-orange-600 transition-colors">xem thêm...</a>
            </div>
            <div class="quiz-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"></div>
        `;

        const grid = sectionDiv.querySelector('.quiz-grid');
        sectionQuizzes.forEach(quiz => {
            grid.appendChild(createQuizElement(quiz));
        });

        const link = sectionDiv.querySelector('.section-link');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sectionDiv.classList.toggle('section-collapsed');
            link.textContent = sectionDiv.classList.contains('section-collapsed') ? 'xem thêm...' : 'thu gọn';
        });

        allSections.appendChild(sectionDiv);
    });
}

console.log('%c🎮 Questions Page Loaded!', 'background: #e07b39; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');