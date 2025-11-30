// SIDEBAR TOGGLE
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Click hamburger để mở sidebar
hamburgerMenu.addEventListener('click', () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
});

// Click overlay để đóng sidebar
sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

// AVATAR DROPDOWN
const avatarBtn = document.getElementById('avatarBtn');
const avatarDropdown = document.getElementById('avatarDropdown');

avatarBtn.addEventListener('click', () => {
    avatarDropdown.style.display = avatarDropdown.style.display === 'block' ? 'none' : 'block';
});

// Ẩn dropdown khi click ngoài
window.addEventListener('click', (e) => {
    if (!avatarBtn.contains(e.target) && !avatarDropdown.contains(e.target)) {
        avatarDropdown.style.display = 'none';
    }
});

// NAVBAR ACTIVE STATE
const navItems = document.querySelectorAll('.layout-navbar__item');
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// Show/hide password function
function loadQuestionsPage(event) {
    event.preventDefault();
    document.querySelector('.home-content').style.display = 'none';
    document.getElementById('questionIframe').style.display = 'block';
    updateActiveNav('questions');
}

function loadHomePage(event) {
    event.preventDefault();
    document.querySelector('.home-content').style.display = 'block';
    document.getElementById('questionIframe').style.display = 'none';
    updateActiveNav('home');
}

function updateActiveNav(activePage) {
    const navItems = document.querySelectorAll('.layout-navbar__item');
    navItems.forEach(item => item.classList.remove('active'));
    
    navItems.forEach(item => {
        if (item.getAttribute('onclick')?.includes(activePage)) {
            item.classList.add('active');
        }
    });
}