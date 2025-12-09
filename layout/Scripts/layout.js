// SIDEBAR TOGGLE
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

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
const avatarBtn = document.getElementById('avatarBtn');
const avatarDropdown = document.getElementById('avatarDropdown');

if (avatarBtn && avatarDropdown) {
    avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        avatarDropdown.style.display = avatarDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Ẩn dropdown khi click ngoài
    window.addEventListener('click', (e) => {
        if (avatarDropdown && !avatarBtn.contains(e.target) && !avatarDropdown.contains(e.target)) {
            avatarDropdown.style.display = 'none';
        }
    });
}

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
    // Tránh chạy 2 lần
    if (document.getElementById('quizzkit-bg-music')) return;

    // Tạo giao diện + audio
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
            <source src="Sounds/Just for Kicks - Feeling Sunset.mp3" type="audio/mpeg">
            <source src="music/background.ogg" type="audio/ogg">
            Trình duyệt không hỗ trợ âm thanh.
        </audio>
    `);

    const audio = document.getElementById('bgmAudio');
    const toggleBtn = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('musicVolume');
    const hideBtn = document.getElementById('hideMusicUI');
    const showBtn = document.getElementById('showMusicUI');

    // Icon play/pause
    const playIcon = '<i class="fas fa-play text-lg ml-1"></i>';
    const pauseIcon = '<i class="fas fa-pause text-lg"></i>';

    // Khôi phục trạng thái trước đó
    const savedMusic = localStorage.getItem('quizzkit-music');
    const savedVolume = localStorage.getItem('quizzkit-volume') || 0.3;

    audio.volume = savedVolume;
    volumeSlider.value = savedVolume;

    if (savedMusic === 'on') {
        toggleBtn.innerHTML = pauseIcon;
        audio.play().catch(() => {});
    }

    // Bấm nút bật/tắt
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                toggleBtn.innerHTML = pauseIcon;
                localStorage.setItem('quizzkit-music', 'on');
            } else {
                audio.pause();
                toggleBtn.innerHTML = playIcon;
                localStorage.setItem('quizzkit-music', 'off');
            }
        });
    }

    // Điều chỉnh âm lượng
    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            audio.volume = volumeSlider.value;
            localStorage.setItem('quizzkit-volume', volumeSlider.value);
        });
    }

    // Tự động tạm dừng khi rời tab
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !audio.paused) {
            audio.pause();
            if (toggleBtn) toggleBtn.innerHTML = playIcon;
        }
    });

    // Nút ẩn/hiện giao diện
    if (hideBtn) {
        hideBtn.addEventListener('click', () => {
            document.getElementById('quizzkit-bg-music').style.display = 'none';
            showBtn.classList.remove('hidden');
        });
    }

    if (showBtn) {
        showBtn.addEventListener('click', () => {
            document.getElementById('quizzkit-bg-music').style.display = 'flex';
            showBtn.classList.add('hidden');
        });
    }
})();
