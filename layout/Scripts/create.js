// ========== SIDEBAR & NAVIGATION ==========
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const avatarBtn = document.getElementById('avatarBtn');
const avatarDropdown = document.getElementById('avatarDropdown');

// Click hamburger để mở sidebar
if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    });
}

// Click overlay để đóng sidebar
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

// AVATAR DROPDOWN
if (avatarBtn && avatarDropdown) {
    avatarBtn.addEventListener('click', () => {
        avatarDropdown.style.display = avatarDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Ẩn dropdown khi click ngoài
    window.addEventListener('click', (e) => {
        if (!avatarBtn.contains(e.target) && !avatarDropdown.contains(e.target)) {
            avatarDropdown.style.display = 'none';
        }
    });
}

// NAVBAR ACTIVE STATE
const navItems = document.querySelectorAll('.layout-navbar__item');
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// SIDEBAR ACTIVE STATE
const sidebarItems = document.querySelectorAll('.layout-sidebar__item');
sidebarItems.forEach(item => {
    item.addEventListener('click', function(e) {
        sidebarItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});