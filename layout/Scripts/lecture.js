// Lấy param quiz từ URL
const urlParams = new URLSearchParams(window.location.search);
const quizName = decodeURIComponent(urlParams.get('quiz') || '');

if (!quizName) {
    document.getElementById('lectureContent').innerHTML = '<p>Không tìm thấy quiz!</p>';
} else {
    // Load JSON
    fetch('data/lectureData.json')
        .then(response => {
            if (!response.ok) throw new Error('Lỗi load JSON');
            return response.json();
        })
        .then(lectureData => {
            const lecture = lectureData[quizName] || { description: 'Không tìm thấy', content: '<p>Chưa có bài giảng.</p>' };
            document.getElementById('lectureTitle').textContent = quizName;
            document.getElementById('lectureDescription').textContent = lecture.description;
            document.getElementById('lectureContent').innerHTML = lecture.content;

            // Nút Ôn tập: Redirect đến quiz.html
            document.getElementById('startQuizBtn').addEventListener('click', () => {
                window.location.href = `quiz.html?quiz=${encodeURIComponent(quizName)}`;
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
            document.getElementById('lectureContent').innerHTML = '<p>Lỗi load dữ liệu. Thử lại sau.</p>';
        });
}