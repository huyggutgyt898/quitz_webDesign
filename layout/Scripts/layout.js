$(document).ready(function () {
  const $items = $(".menu li");

  $items.on("click", function () {
    $items.removeClass("active");
    $(this).addClass("active");
  });
});

$(document).ready(function () {
  const $items = $(".menu li");

  $items.on("click", function () {
    $items.removeClass("active");
    $(this).addClass("active");
  });

  // Xử lý mở / đóng menu avatar
  $(".avatar-link").on("click", function (e) {
    e.preventDefault();
    $(".dropdown-menu").toggle();
  });

  // Ẩn menu khi click ra ngoài
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".avatar-container").length) {
      $(".dropdown-menu").hide();
    }
  });
});

// Hiệu ứng cuộn hiện dần nội dung
$(window).on("scroll", function () {
  $(".reveal").each(function () {
    const elementTop = $(this).offset().top;
    const scrollBottom = $(window).scrollTop() + $(window).height();

    // Khi phần tử nằm trong vùng nhìn thấy (vào khung hình)
    if (scrollBottom > elementTop + 100) {
      $(this).addClass("show");
    }
  });

  // Footer riêng (xuất hiện khi gần cuối)
  const footer = $(".footer");
  const footerTop = footer.offset().top;
  const scrollBottom = $(window).scrollTop() + $(window).height();
  if (scrollBottom > footerTop - 200) {
    footer.addClass("show");
  }
});

