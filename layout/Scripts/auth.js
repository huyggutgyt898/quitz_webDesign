
            /* ====================== *
      *  Toggle Between        *
      *  Sign Up / Login       *
      * ====================== */
      $(document).ready(function(){
        $('#goRight').on('click', function(){
          $('#slideBox').animate({
            'marginLeft' : '0'
          });
          $('.topLayer').animate({
            'marginLeft' : '100%'
          });
        });
        $('#goLeft').on('click', function(){
          if (window.innerWidth > 769){
            $('#slideBox').animate({
              'marginLeft' : '50%'
            });
          }
          else {
            $('#slideBox').animate({
              'marginLeft' : '20%'
            });
          }
          $('.topLayer').animate({
            'marginLeft': '0'
          });
        });
      });

      /* ====================== *
      *  Initiate Canvas       *
      * ====================== */
      paper.install(window);
      paper.setup(document.getElementById("canvas"));

      // Paper JS Variables
      var canvasWidth, 
          canvasHeight,
          canvasMiddleX,
          canvasMiddleY;

      var shapeGroup = new Group();

      var positionArray = [];

      function getCanvasBounds() {
        // Get current canvas size
        canvasWidth = view.size.width;
        canvasHeight = view.size.height;
        canvasMiddleX = canvasWidth / 2;
        canvasMiddleY = canvasHeight / 2;
        // Set path position
        var position1 = {
          x: (canvasMiddleX / 2) + 100,
          y: 100, 
        };

        var position2 = {
          x: 200,
          y: canvasMiddleY, 
        };

        var position3 = {
          x: (canvasMiddleX - 50) + (canvasMiddleX / 2),
          y: 150, 
        };

        var position4 = {
          x: 0,
          y: canvasMiddleY + 100, 
        };

        var position5 = {
          x: canvasWidth - 130,
          y: canvasHeight - 75, 
        };

        var position6 = {
          x: canvasMiddleX + 80,
          y: canvasHeight - 50, 
        };
        
        var position7 = {
          x: canvasWidth + 60,
          y: canvasMiddleY - 50, 
        };
        
        var position8 = {
          x: canvasMiddleX + 100,
          y: canvasMiddleY + 100, 
        };

        positionArray = [position3, position2, position5, position4, position1, position6, position7, position8];
        };


      /* ====================== *
      * Create Shapes          *
      * ====================== */
      function initializeShapes() {
        // Get Canvas Bounds
        getCanvasBounds();

        var shapePathData = [
          'M231,352l445-156L600,0L452,54L331,3L0,48L231,352', 
          'M0,0l64,219L29,343l535,30L478,37l-133,4L0,0z', 
          'M0,65l16,138l96,107l270-2L470,0L337,4L0,65z',
          'M333,0L0,94l64,219L29,437l570-151l-196-42L333,0',
          'M331.9,3.6l-331,45l231,304l445-156l-76-196l-148,54L331.9,3.6z',
          'M389,352l92-113l195-43l0,0l0,0L445,48l-80,1L122.7,0L0,275.2L162,297L389,352',
          'M 50 100 L 300 150 L 550 50 L 750 300 L 500 250 L 300 450 L 50 100',
          'M 700 350 L 500 350 L 700 500 L 400 400 L 200 450 L 250 350 L 100 300 L 150 50 L 350 100 L 250 150 L 450 150 L 400 50 L 550 150 L 350 250 L 650 150 L 650 50 L 700 150 L 600 250 L 750 250 L 650 300 L 700 350 '
        ];

        for (var i = 0; i <= shapePathData.length; i++) {
          // Create shape
          var headerShape = new Path({
            strokeColor: 'rgba(255, 255, 255, 0.5)',
            strokeWidth: 2,
            parent: shapeGroup,
          });
          // Set path data
          headerShape.pathData = shapePathData[i];
          headerShape.scale(2);
          // Set path position
          headerShape.position = positionArray[i];
        }
      };

      initializeShapes();

      /* ====================== *
      * Animation              *
      * ====================== */
      view.onFrame = function paperOnFrame(event) {
        if (event.count % 4 === 0) {
          // Slows down frame rate
          for (var i = 0; i < shapeGroup.children.length; i++) {
            if (i % 2 === 0) {
              shapeGroup.children[i].rotate(-0.1);
            } else {
              shapeGroup.children[i].rotate(0.1);
            }
          }
        }
      };

      view.onResize = function paperOnResize() {
        getCanvasBounds();

        for (var i = 0; i < shapeGroup.children.length; i++) {
          shapeGroup.children[i].position = positionArray[i];
        }

        if (canvasWidth < 700) {
          shapeGroup.children[3].opacity = 0;
          shapeGroup.children[2].opacity = 0;
          shapeGroup.children[5].opacity = 0;
        } else {
          shapeGroup.children[3].opacity = 1;
          shapeGroup.children[2].opacity = 1;
          shapeGroup.children[5].opacity = 1;
        }
      };



/* LOG_REGIS */
// ĐĂNG KÝ (Sign Up)
function registerUser(e) {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let username = document.getElementById("username-signup").value;
    let password = document.getElementById("password-signup").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra nếu email hoặc username đã tồn tại
    let exists = users.find(u => u.email === email || u.username === username);
    if (exists) {
        showToast("Email hoặc Username đã tồn tại!", "error");
        return;
    }

    // Thêm người dùng mới vào localStorage
    users.push({ email, username, password });
    localStorage.setItem("users", JSON.stringify(users));

    showToast("Đăng ký thành công! Hãy đăng nhập.", "success");

    // Chờ một chút và chuyển đến trang đăng nhập
    setTimeout(() => {
        document.getElementById("goRight").click(); // Chuyển sang form đăng nhập
    }, 1200);
}

// ĐĂNG NHẬP (Login)
function loginUser(e) {
    e.preventDefault();

    let username = document.getElementById("username-login").value;
    let password = document.getElementById("password-login").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Tìm người dùng có username và password chính xác
    let found = users.find(u => u.username === username && u.password === password);

    if (!found) {
        showToast("Sai username hoặc mật khẩu!", "error");
        return;
    }

    // Lưu thông tin đăng nhập vào localStorage
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", username);

    showToast("Đăng nhập thành công!", "success");

    setTimeout(() => {
        window.location.href = "index.html"; // Chuyển đến trang profile
    }, 1200);
}

// LOGOUT
function logoutUser() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");

    showToast("Bạn đã đăng xuất!", "info");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1200);
}



// THÔNG BÁO TOAST
function showToast(message, type = "info") {
    let toast = document.getElementById("toast");

    // Reset class để không bị chồng hiệu ứng cũ
    toast.className = "toast";

    // Thêm class theo loại thông báo
    toast.classList.add(type);

    // Thiết lập nội dung thông báo
    toast.innerText = message;

    // Hiển thị thông báo với hiệu ứng
    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// GỌI HÀM KHI NHẤN SIGN UP
document.getElementById("signUp").addEventListener("click", function(e) {
    registerUser(e);
});

// GỌI HÀM KHI NHẤN LOGIN
document.getElementById("logIn").addEventListener("click", function(e) {
    loginUser(e);
});
