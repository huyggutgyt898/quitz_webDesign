// LECTURE PAGE - FINAL VERSION

const urlParams = new URLSearchParams(window.location.search);
const quizName = decodeURIComponent(urlParams.get('quiz') || '');

let likeCount = 128;
let dislikeCount = 12;
let commentCount = 45;
let isLiked = false;
let isDisliked = false;
let savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
let isSaved = savedQuizzes.includes(quizName);

// Navbar dropdown toggle
const navbarDropdownWrapper = document.querySelector('.navbar-dropdown-wrapper');
const categoryDropdown = document.getElementById('categoryDropdown');
const categoryDropdownItems = document.querySelectorAll('#categoryDropdown .dropdown-item');

// Toggle Navbar Category Dropdown
if (navbarDropdownWrapper && categoryDropdown) {
    navbarDropdownWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        categoryDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbarDropdownWrapper.contains(e.target)) {
            categoryDropdown.classList.remove('show');
        }
    });
}

// Category Dropdown Items
categoryDropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        categoryDropdownItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        
        // Close dropdown
        if (categoryDropdown) {
            categoryDropdown.classList.remove('show');
        }
        
        // Navigate to modelform with category filter
        window.location.href = `modelform.html?category=${category}`;
    });
});

// Load lecture data
if (quizName) {
    fetch('data/lectureData.json')
        .then(response => response.json())
        .then(data => {
            const lecture = data[quizName];
            if (lecture) {
                document.getElementById('lectureTitle').textContent = quizName;
                document.getElementById('lectureDescription').textContent = lecture.description;
                document.getElementById('lectureContent').innerHTML = lecture.content;
            }
        })
        .catch(error => console.error('Error loading lecture:', error));
}

// Start quiz button
const startQuizBtn = document.getElementById('startQuizBtn');
if (startQuizBtn) {
    startQuizBtn.addEventListener('click', () => {
        window.location.href = `quiz.html?quiz=${encodeURIComponent(quizName)}`;
    });
}

// Save button
const saveBtn = document.getElementById('saveBtn');
if (saveBtn) {
    // Set initial state
    updateSaveButton();
    
    saveBtn.addEventListener('click', function() {
        if (isSaved) {
            // Unsave
            savedQuizzes = savedQuizzes.filter(name => name !== quizName);
            isSaved = false;
        } else {
            // Save
            savedQuizzes.push(quizName);
            isSaved = true;
        }
        
        localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
        updateSaveButton();
    });
}

function updateSaveButton() {
    if (!saveBtn) return;
    
    if (isSaved) {
        saveBtn.classList.add('active');
        saveBtn.querySelector('.save-text').textContent = 'Đã lưu';
    } else {
        saveBtn.classList.remove('active');
        saveBtn.querySelector('.save-text').textContent = 'Lưu';
    }
}

// Like button
const likeBtn = document.getElementById('likeBtn');
const likeCountEl = document.getElementById('likeCount');
const dislikeBtn = document.getElementById('dislikeBtn');
const dislikeCountEl = document.getElementById('dislikeCount');

if (likeBtn) {
    likeBtn.addEventListener('click', function() {
        if (isLiked) {
            // Unlike
            isLiked = false;
            likeCount--;
            this.classList.remove('active');
        } else {
            // Like
            isLiked = true;
            likeCount++;
            this.classList.add('active');
            
            // Remove dislike if active
            if (isDisliked) {
                isDisliked = false;
                dislikeCount--;
                dislikeBtn.classList.remove('active');
                dislikeCountEl.textContent = dislikeCount;
            }
        }
        likeCountEl.textContent = likeCount;
    });
}

// Dislike button
if (dislikeBtn) {
    dislikeBtn.addEventListener('click', function() {
        if (isDisliked) {
            // Remove dislike
            isDisliked = false;
            dislikeCount--;
            this.classList.remove('active');
        } else {
            // Dislike
            isDisliked = true;
            dislikeCount++;
            this.classList.add('active');
            
            // Remove like if active
            if (isLiked) {
                isLiked = false;
                likeCount--;
                likeBtn.classList.remove('active');
                likeCountEl.textContent = likeCount;
            }
        }
        dislikeCountEl.textContent = dislikeCount;
    });
}

// Comment button - Toggle comment section
const commentBtn = document.getElementById('commentBtn');
const commentSection = document.getElementById('commentSection');

if (commentBtn && commentSection) {
    commentBtn.addEventListener('click', function() {
        commentSection.classList.toggle('open');
        this.classList.toggle('active');
    });
}

// Post comment
const postCommentBtn = document.getElementById('postCommentBtn');
const commentInput = document.getElementById('commentInput');
const commentsList = document.getElementById('commentsList');

if (postCommentBtn && commentInput && commentsList) {
    postCommentBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (text) {
            // Create new comment
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-item p-4 rounded-lg';
            commentDiv.innerHTML = `
                <div class="flex gap-3">
                    <img src="Images/Avatar.jpg" alt="User" class="w-10 h-10 rounded-full">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-semibold text-gray-800">Bạn</span>
                            <span class="text-sm text-gray-500">Vừa xong</span>
                        </div>
                        <p class="text-gray-700">${text}</p>
                    </div>
                </div>
            `;
            
            // Add to top of list
            commentsList.insertBefore(commentDiv, commentsList.firstChild);
            
            // Clear input
            commentInput.value = '';
            
            // Update count
            commentCount++;
            document.getElementById('commentCount').textContent = commentCount;
        }
    });
}

// Share button - Copy link
const shareBtn = document.getElementById('shareBtn');
const shareNotification = document.getElementById('shareNotification');

if (shareBtn && shareNotification) {
    shareBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            
            // Show notification
            shareNotification.classList.add('show');
            
            // Hide after 2 seconds
            setTimeout(() => {
                shareNotification.classList.remove('show');
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Đã sao chép link!');
        }
    });
}