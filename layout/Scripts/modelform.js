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

const navbarDropdownWrapper = document.querySelector('.navbar-dropdown-wrapper');
const categoryDropdown = document.getElementById('categoryDropdown');

let currentFilter = 'all';
let currentCategory = 'all';
let allQuizData = [];

// ==================== HÀM ĐỌC CATEGORY TỪ URL ====================
function getCurrentCategoryFromURL() {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const valid = ['all','math','physics','chemistry','biology','literature','english','history','geography','computer','civics'];
    return cat && valid.includes(cat) ? cat : 'all';
}

// Cập nhật giao diện: active + text navbar
function updateCategoryDisplay(category) {
    // Active cho các item trong dropdown
    document.querySelectorAll('#categoryDropdown .dropdown-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-category') === category);
    });

    // Đổi text trên navbar (Môn học → Toán học, Tiếng Anh...)
    const textEl = navbarDropdownWrapper?.querySelector('a, span');
    if (textEl) {
        const names = {
            all: 'Tất cả', math: 'Toán học', physics: 'Vật lý', chemistry: 'Hóa học',
            biology: 'Sinh học', literature: 'Ngữ văn', english: 'Tiếng Anh',
            history: 'Lịch sử', geography: 'Địa lý', computer: 'Tin học', civics: 'GDCD'
        };
        textEl.textContent = names[category] || 'Môn học';
    }
}

// Khi load trang: đọc URL → chọn đúng môn
document.addEventListener('DOMContentLoaded', () => {
    currentCategory = getCurrentCategoryFromURL();
    updateCategoryDisplay(currentCategory);
    applyFilter(); // áp dụng ngay nếu có ?category=
});

// Khi người dùng bấm chọn môn trong dropdown
document.querySelectorAll('#categoryDropdown .dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const selectedCat = this.getAttribute('data-category');

        if (selectedCat === currentCategory) return;

        currentCategory = selectedCat;

        // Cập nhật URL (đẹp + hỗ trợ back/forward)
        const url = new URL(location);
        url.searchParams.set('category', selectedCat);
        history.pushState({category: selectedCat}, '', url);

        updateCategoryDisplay(selectedCat);
        applyFilter();
    });
});

// Back/Forward browser
window.addEventListener('popstate', () => {
    const cat = getCurrentCategoryFromURL();
    if (cat !== currentCategory) {
        currentCategory = cat;
        updateCategoryDisplay(cat);
        applyFilter();
    }
});

// Toggle Navbar Dropdown
if (navbarDropdownWrapper && categoryDropdown) {
    navbarDropdownWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        categoryDropdown.classList.toggle('show');
    });
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
    if (filterDropdown && !filterDropdown.contains(e.target) && !filterDropdownBtn?.contains(e.target)) {
        filterDropdown.classList.add('opacity-0', 'invisible');
    }
});

// Filter Options Click
filterOptions.forEach(option => {
    option.addEventListener('click', function() {
        filterOptions.forEach(opt => opt.classList.remove('active', 'bg-orange-50', 'border-orange-500', 'text-orange-600'));
        this.classList.add('active', 'bg-orange-50', 'border-orange-500', 'text-orange-600');
        
        currentFilter = this.dataset.filter;
        filterDropdownBtn.querySelector('.filter-text').textContent = this.textContent.trim();
        filterDropdown.classList.add('opacity-0', 'invisible');
        applyFilter();
    });
});

// Apply Filter + Search
function applyFilter() {
    const searchValue = quizSearchInput?.value.trim().toLowerCase() || '';

    if (currentCategory !== 'all' || currentFilter !== 'all' || searchValue) {
        showFilteredSection(searchValue);
    } else {
        showAllSections();
    }
}

function showAllSections() {
    allSections?.classList.remove('hidden');
    singleSection?.classList.add('hidden');
}

function showFilteredSection(searchTerm = '') {
    allSections?.classList.add('hidden');
    singleSection?.classList.remove('hidden');
    filteredQuizGrid.innerHTML = '';

    let result = allQuizData;

    if (currentCategory !== 'all') {
        result = result.filter(q => q.category === currentCategory);
    }
    if (currentFilter !== 'all') {
        result = result.filter(q => q.section === currentFilter);
    }
    if (searchTerm) {
        result = result.filter(q => q.name.toLowerCase().includes(searchTerm));
    }

    if (result.length === 0) {
        showEmptyState(filteredQuizGrid);
        return;
    }

    result.forEach(quiz => filteredQuizGrid.appendChild(createQuizElement(quiz)));
}

// Search button + Enter key
if (searchBtn) searchBtn.addEventListener('click', () => applyFilter());
if (quizSearchInput) {
    quizSearchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') applyFilter();
    });
}

// Load data + khởi động
window.addEventListener('load', () => {
    fetch('data/allQuizzes.json')
        .then(r => r.json())
        .then(data => {
            allQuizData = data;
            renderSections(data);

            // Chạy lại sau khi load xong để áp dụng URL
            currentCategory = getCurrentCategoryFromURL();
            updateCategoryDisplay(currentCategory);
            applyFilter();
        })
        .catch(err => console.error('Lỗi load quiz:', err));
});
// Create Quiz Element
function createQuizElement(quiz) {
    const quizDiv = document.createElement('div');
    quizDiv.className = 'quiz-item relative bg-white rounded-2xl shadow-md overflow-visible cursor-pointer flex flex-col h-full';
    quizDiv.setAttribute('data-category', quiz.category);
    quizDiv.setAttribute('data-filter', quiz.section);
    
    quizDiv.innerHTML = `
        <!-- Thumbnail - Clickable -->
        <div class="quiz-thumbnail relative w-full h-56 overflow-hidden rounded-t-2xl" data-quiz-name="${quiz.name}">
            <img src="${quiz.thumbnail}" alt="${quiz.alt}" class="w-full h-full object-cover transition-transform duration-300">
            
            <!-- Stats Overlay -->
            <div class="quiz-stats-overlay absolute bottom-0 left-0 right-0 bg-gray-900/80 px-4 py-3 flex justify-between items-center">
                <div class="flex flex-col items-center gap-1 flex-1">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    <span class="text-white text-xs font-semibold">${quiz.views}</span>
                </div>
                <div class="flex flex-col items-center gap-1 flex-1">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    <span class="text-white text-xs font-semibold">${Math.floor(Math.random() * 50)}</span>
                </div>
                <div class="flex flex-col items-center gap-1 flex-1">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                    <span class="text-white text-xs font-semibold">${Math.floor(Math.random() * 20)}</span>
                </div>
            </div>
        </div>

        <!-- Details -->
        <div class="p-5 flex flex-col gap-3 flex-1">
            <h3 class="quiz-name text-lg font-bold text-gray-800 leading-snug min-h-[3.5rem] line-clamp-2 cursor-pointer transition-all" data-quiz-name="${quiz.name}">${quiz.name}</h3>
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
            applyFilter();  // SỬA: Thêm dòng này để áp dụng lọc ngay sau load
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