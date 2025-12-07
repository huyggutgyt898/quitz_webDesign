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

// ==================== NHẠC NỀN TOÀN SITE – TỰ ĐỘNG LẶP VÔ HẠN + CÓ NÚT ĐẸP ====================
(function () {
    'use strict';

    const musicUrl = "https://files.catbox.moe/5i8i1l.mp3"; // Thay bằng link nhạc của bạn (bắt buộc HTTPS)

    let unlocked = false;
    let isInjected = false;

    // Hàm tạo toàn bộ cục play + audio
    function injectMusicUI() {
        if (isInjected) return;
        isInjected = true;

        document.body.insertAdjacentHTML('beforeend', `
        <div id="quizzkit-bg-music" class="fixed bottom-5 left-5 z-50 flex items-center gap-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-full shadow-2xl px-4 py-2 border border-gray-200 dark:border-gray-700">
            <button id="musicToggle" class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all">
                <i class="fas fa-play text-lg ml-1"></i>
            </button>
            <div class="flex items-center gap-3">
                <i class="fas fa-music text-purple-600"></i>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Nhạc nền QUIZZKIT</span>
            </div>
            <input type="range" id="musicVolume" min="0" max="1" step="0.05" value="0.3" class="w-28 h-1 accent-purple-600 cursor-pointer rounded-full">
            <button id="hideMusicUI" class="ml-3 text-gray-600 dark:text-gray-300 hover:text-red-500">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <button id="showMusicUI" class="hidden fixed bottom-5 left-5 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-xl">
            <i class="fas fa-music"></i>
        </button>

        <audio id="bgmAudio" loop preload="auto">
            <source src="${musicUrl}" type="audio/mpeg">
        </audio>
        `);

        const audio = document.getElementById('bgmAudio');
        const toggleBtn = document.getElementById('musicToggle');
        const volumeSlider = document.getElementById('musicVolume');
        const hideBtn = document.getElementById('hideMusicUI');
        const showBtn = document.getElementById('showMusicUI');

        const playIcon = '<i class="fas fa-play text-lg ml-1"></i>';
        const pauseIcon = '<i class="fas fa-pause text-lg"></i>';

        // Khôi phục volume + trạng thái
        const savedVolume = localStorage.getItem('quizzkit-volume') || 0.3;
        const savedState = localStorage.getItem('quizzkit-music');

        audio.volume = savedVolume;
        volumeSlider.value = savedVolume;

        if (savedState === 'on' && unlocked) {
            audio.play().catch(() => {});
            toggleBtn.innerHTML = pauseIcon;
        }

        // Nút play/pause
        toggleBtn.onclick = () => {
            if (audio.paused) {
                audio.play().then(() => {
                    toggleBtn.innerHTML = pauseIcon;
                    localStorage.setItem('quizzkit-music', 'on');
                });
            } else {
                audio.pause();
                toggleBtn.innerHTML = playIcon;
                localStorage.setItem('quizzkit-music', 'off');
            }
        };

        volumeSlider.oninput = () => {
            audio.volume = volumeSlider.value;
            localStorage.setItem('quizzkit-volume', volumeSlider.value);
        };

        hideBtn.onclick = () => {
            document.getElementById('quizzkit-bg-music').style.display = 'none';
            showBtn.classList.remove('hidden');
        };

        showBtn.onclick = () => {
            document.getElementById('quizzkit-bg-music').style.display = 'flex';
            showBtn.classList.add('hidden');
        };
    }

    // Unlock autoplay sau lần click đầu tiên
    const unlockAudio = () => {
        if (unlocked) return;
        unlocked = true;
        document.body.removeEventListener('click', unlockAudio);
        document.body.removeEventListener('touchstart', unlockAudio);

        // Nếu người dùng đã bật nhạc trước đó → phát luôn
        if (localStorage.getItem('quizzkit-music') === 'on') {
            const audio = document.getElementById('bgmAudio');
            if (audio) {
                audio.play().catch(() => {});
                const btn = document.getElementById('musicToggle');
                if (btn) btn.innerHTML = '<i class="fas fa-pause text-lg"></i>';
            }
        }
    };

    document.body.addEventListener('click', unlockAudio, { once: true });
    document.body.addEventListener('touchstart', unlockAudio, { once: true });

    // QUAN TRỌNG NHẤT: Theo dõi DOM thay đổi để inject lại ngay lập tức
    const observer = new MutationObserver(() => {
        if (!document.getElementById('quizzkit-bg-music') && !document.getElementById('showMusicUI')) {
            isInjected = false;
            injectMusicUI();
        }
    });

    // Bắt đầu quan sát ngay khi có body
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
        injectMusicUI();
    } else {
        // Trường hợp body chưa có (một số trang load chậm)
        new MutationObserver((_, obs) => {
            if (document.body) {
                obs.disconnect();
                observer.observe(document.body, { childList: true, subtree: true });
                injectMusicUI();
            }
        }).observe(document.documentElement, { childList: true });
    }

    // Dự phòng thêm 2 lần inject nữa cho chắc
    window.addEventListener('load', () => setTimeout(injectMusicUI, 800));
    setTimeout(injectMusicUI, 1500);
})();
