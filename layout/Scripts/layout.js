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
