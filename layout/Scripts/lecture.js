// Lấy param quiz từ URL
const urlParams = new URLSearchParams(window.location.search);
const quizName = decodeURIComponent(urlParams.get('quiz') || '');

const lectureTitle = document.getElementById('lectureTitle');
const lectureDescription = document.getElementById('lectureDescription');
const lectureContent = document.getElementById('lectureContent');
const startQuizBtn = document.getElementById('startQuizBtn');

if (!quizName) {
    if (lectureContent) {
        lectureContent.innerHTML = '<p>Không tìm thấy quiz!</p>';
    }
} else {
    // Load JSON
    fetch('data/lectureData.json')
        .then(response => {
            if (!response.ok) throw new Error('Lỗi load JSON');
            return response.json();
        })
        .then(lectureData => {
            const lecture = lectureData[quizName];
            
            if (!lecture) {
                if (lectureTitle) lectureTitle.textContent = 'Không tìm thấy bài giảng';
                if (lectureDescription) lectureDescription.textContent = '';
                if (lectureContent) lectureContent.innerHTML = '<p>Chưa có bài giảng cho quiz này.</p>';
                return;
            }
            
            if (lectureTitle) lectureTitle.textContent = quizName;
            if (lectureDescription) lectureDescription.textContent = lecture.description;
            if (lectureContent) lectureContent.innerHTML = lecture.content;

            // Nút Ôn tập: Redirect đến quiz.html
            if (startQuizBtn) {
                startQuizBtn.addEventListener('click', () => {
                    window.location.href = `quiz.html?quiz=${encodeURIComponent(quizName)}`;
                });
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            if (lectureContent) {
                lectureContent.innerHTML = '<p>Lỗi load dữ liệu. Thử lại sau.</p>';
            }
        });
}