// Scripts/leaderboard.js
function leaderboardData() {
    return {
        tab: 'players', // tab mặc định

        // ================== DỮ LIỆU CỦA BẠN (giữ nguyên 100%) ==================
        top10Players: [
            { name: "Nguyễn Nhật Anh", avatar: "https://randomuser.me/api/portraits/men/32.jpg", score: 9850, level: "Legend" },
            { name: "Trần Minh Thư", avatar: "https://randomuser.me/api/portraits/women/65.jpg", score: 9420, level: "Master" },
            { name: "Lê Hoàng Long", avatar: "https://randomuser.me/api/portraits/men/45.jpg", score: 9180, level: "Master" },
            { name: "Phạm Quỳnh Anh", avatar: "https://randomuser.me/api/portraits/women/44.jpg", score: 8950, level: "Diamond" },
            { name: "Hoàng Minh Tuấn", avatar: "https://randomuser.me/api/portraits/men/68.jpg", score: 8720, level: "Diamond" },
            { name: "Đỗ Ngọc Lan", avatar: "https://randomuser.me/api/portraits/women/22.jpg", score: 8510, level: "Platinum" },
            { name: "Vũ Hải Đăng", avatar: "https://randomuser.me/api/portraits/men/86.jpg", score: 8300, level: "Platinum" },
            { name: "Bùi Thu Hương", avatar: "https://randomuser.me/api/portraits/women/90.jpg", score: 8150, level: "Gold" },
            { name: "Ngô Bảo Khánh", avatar: "https://randomuser.me/api/portraits/men/12.jpg", score: 8100, level: "Gold" },
            { name: "Lý Thanh Trúc", avatar: "https://randomuser.me/api/portraits/women/79.jpg", score: 8050, level: "Gold" },
        ],
        hotQuestions: [
            { title: "Bài giảng về Toán học cơ bản", author: "Thầy Giáo Ba", plays: "168.2k" },
            { title: "Bài giảng Tin học cơ bản", author: "Quiz Master", plays: "142.3k" },
            { title: "Bài giảng Vật lý lớp 10", author: "Music Lover", plays: "129.7k" },
            { title: "Bài giảng Lịch sử Việt Nam", author: "Hogwarts VN", plays: "115.4k" },
            { title: "Bài giảng Văn học Việt Nam", author: "Tâm Lý 24h", plays: "98.6k" },
            { title: "Bài giảng Địa lý Việt Nam", author: "Đố Vui VN", plays: "87.1k" },
            { title: "Bài giảng Hóa học cơ bản", author: "Brain Master", plays: "79.3k" },
            { title: "Bài giảng Tiếng Anh giao tiếp", author: "Việt Nam 247", plays: "72.8k" },
            { title: "Bài giảng Sinh học lớp 11", author: "Horror Quiz", plays: "65.9k" },
            { title: "Bài giảng Giáo dục công dân", author: "Tử Vi 24h", plays: "61.2k" },
        ],
        top10Followers: [
            { name: "Thầy Giáo Ba", username: "thaygiaoba", avatar: "https://randomuser.me/api/portraits/men/45.jpg", followers: 28420 },
            { name: "Quiz Master", username: "quizmastervn", avatar: "https://randomuser.me/api/portraits/men/12.jpg", followers: 23700 },
            { name: "Cô Giáo Toán", username: "cogiaotoan", avatar: "https://randomuser.me/api/portraits/women/68.jpg", followers: 18900 },
            { name: "Đố Vui VN", username: "dovui.vn", avatar: "https://randomuser.me/api/portraits/women/33.jpg", followers: 15600 },
            { name: "Trắc Nghiệm 24h", username: "tracnghiem24h", avatar: "https://randomuser.me/api/portraits/men/55.jpg", followers: 14200 },
            { name: "Học Hài", username: "hochail", avatar: "https://randomuser.me/api/portraits/men/78.jpg", followers: 13800 },
            { name: "Câu Đố Mẹo", username: "caudomeo", avatar: "https://randomuser.me/api/portraits/women/21.jpg", followers: 12900 },
            { name: "Brain King", username: "brainkingvn", avatar: "https://randomuser.me/api/portraits/men/89.jpg", followers: 11800 },
            { name: "Quiz Queen", username: "quizqueen", avatar: "https://randomuser.me/api/portraits/women/56.jpg", followers: 11200 },
            { name: "Đố Vui Mỗi Ngày", username: "dovui", avatar: "https://randomuser.me/api/portraits/women/88.jpg", followers: 10500 },
        ],
        top10Creators: [
            { name: "Thầy Giáo Ba", avatar: "https://randomuser.me/api/portraits/men/45.jpg", quizzes: 342, totalPlays: 2850000 },
            { name: "Tâm Lý 24h", avatar: "https://randomuser.me/api/portraits/women/12.jpg", quizzes: 298, totalPlays: 2210000 },
            { name: "Quiz Master", avatar: "https://randomuser.me/api/portraits/men/12.jpg", quizzes: 256, totalPlays: 1890000 },
            { name: "Hogwarts VN", avatar: "https://randomuser.me/api/portraits/women/79.jpg", quizzes: 198, totalPlays: 1670000 },
            { name: "Đố Vui VN", avatar: "https://randomuser.me/api/portraits/women/33.jpg", quizzes: 187, totalPlays: 1540000 },
            { name: "Brain Master", avatar: "https://randomuser.me/api/portraits/men/89.jpg", quizzes: 165, totalPlays: 1320000 },
            { name: "Việt Nam 247", avatar: "https://randomuser.me/api/portraits/men/55.jpg", quizzes: 143, totalPlays: 1190000 },
            { name: "Quiz Queen", avatar: "https://randomuser.me/api/portraits/women/56.jpg", quizzes: 132, totalPlays: 1080000 },
            { name: "Logic Master", avatar: "https://randomuser.me/api/portraits/men/23.jpg", quizzes: 121, totalPlays: 980000 },
            { name: "Đố Vui Pro", avatar: "https://randomuser.me/api/portraits/men/67.jpg", quizzes: 109, totalPlays: 890000 },
        ],

        // ================== PHẦN QUAN TRỌNG: ĐỌC & CẬP NHẬT TAB ==================
        init() {
            // Khi trang load: đọc tab từ URL
            const params = new URLSearchParams(window.location.search);
            const urlTab = params.get('tab');

            const validTabs = ['players', 'questions', 'followers', 'creators'];
            if (urlTab && validTabs.includes(urlTab)) {
                this.tab = urlTab;
            }

            // Khi người dùng đổi tab → tự động cập nhật URL (rất pro)
            this.$watch('tab', (newTab) => {
                const url = new URL(window.location);
                url.searchParams.set('tab', newTab);
                window.history.pushState({}, '', url);
            });
        }
    };
}
