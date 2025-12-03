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
// ============== CHUNG CHO TOÀN BỘ WEBSITE: SÁNG / TỐI ==============
(function () {
    const savedTheme = localStorage.getItem('quizzkit-theme');

    // Nếu người dùng đã chọn tối trước đó → bật dark mode
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
    }

    // Tạo nút chuyển theme (nếu trang có phần tử #themeBtn hoặc #themeSwitch)
    const themeBtn = document.getElementById('themeBtn') || document.getElementById('themeSwitch');
    const themeText = document.getElementById('themeText');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            document.body.classList.toggle('dark');

            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('quizzkit-theme', 'dark');
                if (themeText) themeText.textContent = 'Chế độ tối';
            } else {
                localStorage.setItem('quizzkit-theme', 'light');
                if (themeText) themeText.textContent = 'Chế độ sáng';
            }
        });
    }
})();
//hết khúc sáng tối
