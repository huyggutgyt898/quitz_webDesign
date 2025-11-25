/*AVATAR*/
const avatarBtn = document.getElementById('avatarBtn');
const avatarDropdown = document.getElementById('avatarDropdown');

avatarBtn.addEventListener('click', () => {
    avatarDropdown.style.display = avatarDropdown.style.display === 'block' ? 'none' : 'block';
});

// Ẩn dropdown khi click ngoài
window.addEventListener('click', (e) => {
    if(!avatarBtn.contains(e.target) && !avatarDropdown.contains(e.target)){
        avatarDropdown.style.display = 'none';
    }
});