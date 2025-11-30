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

// NEW: Carousel Functionality
const slides = document.querySelectorAll('.quiz-carousel__slide');
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');
let currentSlide = 0;
const slideCount = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - index) * 100}%)`;
    });
}

nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slideCount;
    showSlide(currentSlide);
});

prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    showSlide(currentSlide);
});

// Auto-slide every 5 seconds
setInterval(() => {
    currentSlide = (currentSlide + 1) % slideCount;
    showSlide(currentSlide);
}, 5000);

// Initialize first slide
showSlide(0);