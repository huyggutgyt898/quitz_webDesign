// Scripts/settings.js - Chỉ chạy ở trang settings
const themeSwitch = document.getElementById('themeSwitch');
const themeText = document.getElementById('themeText');
const body = document.body;

// Khôi phục theme
if (localStorage.getItem('quizzkit-theme') === 'dark') {
    body.classList.add('dark-mode');
    themeSwitch.checked = true;
    themeText.textContent = 'Chế độ tối';
} else {
    body.classList.remove('dark-mode');
    themeSwitch.checked = false;
    themeText.textContent = 'Chế độ sáng';
}

// Bấm nút đổi theme
themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        body.classList.add('dark-mode');
        themeText.textContent = 'Chế độ tối';
        localStorage.setItem('quizzkit-theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        themeText.textContent = 'Chế độ sáng';
        localStorage.setItem('quizzkit-theme', 'light');
    }
});