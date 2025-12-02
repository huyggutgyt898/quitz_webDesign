$(document).ready(function() {
  // Hiệu ứng di chuyển thanh active-bar theo menu đang chọn
  const $bar = $(".active-bar");
  const $items = $(".menu li");

  function moveActiveBar($item) {
    const offsetTop = $item.position().top;
    $bar.css({ top: offsetTop + 20 + "px" });
  }

  // Di chuyển khi click
  $items.on("click", function() {
    $items.removeClass("active");
    $(this).addClass("active");
    moveActiveBar($(this));
  });

  // Hover menu
  $items.hover(
    function() {
      $(this).css("transform", "translateX(8px)");
    },
    function() {
      $(this).css("transform", "translateX(0)");
    }
  );

  // Nút chỉnh avatar
  $(".edit-btn").on("click", function() {
    showAvatarOptions();
  });
});


// ================= AVATAR ===================

const avatarImages = [
  "Images/Avatar.jpg",
  "Images/A2.jpg",
  "Images/A3.jpg",
];

const avatarSelector = document.getElementById("avatarSelector");
const avatarList = document.getElementById("avatarList");
const changeAvatarBtn = document.getElementById("changeAvatarBtn");
const closeSelectorBtn = document.getElementById("closeSelectorBtn");

// Hiển thị popup chọn avatar
function showAvatarOptions() {
  avatarList.innerHTML = "";

  avatarImages.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;

    img.addEventListener("click", () => {

      // ✔ Đổi toàn bộ avatar có alt="avatar"
      document.querySelectorAll('img[alt="avatar"]').forEach(a => {
        a.src = src;
      });

      avatarSelector.style.display = "none";
    });

    avatarList.appendChild(img);
  });

  avatarSelector.style.display = "flex";
}

changeAvatarBtn.addEventListener("click", showAvatarOptions);

closeSelectorBtn.addEventListener("click", () => {
  avatarSelector.style.display = "none";
});

/*Đổi tên*/
document.getElementById("changeNameBtn").addEventListener("click", function () {
    const newName = prompt("Nhập tên mới:");
    if (newName && newName.trim() !== "") {
        document.getElementById("displayName").textContent = newName;
    }
});
