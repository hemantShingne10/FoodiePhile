document.addEventListener('DOMContentLoaded', () => {
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const userLoginForm = document.getElementById('loginForm');
  const adminLoginForm = document.getElementById("adminLoginForm");
  const signupForm = document.getElementById('signupForm');
  const loginAdminLink = document.getElementById("loginAdmin");
  const loginUserLink = document.getElementById("loginUser");
  const loginUserPwdLink = document.getElementById("loginUserPwd");
  const forgotPwdLink = document.getElementById("forgotPassword");
  const resetPwdForm = document.getElementById("resetPwdForm");

  // Tab switching functionality
  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');

    userLoginForm.classList.add('active');
    signupForm.classList.remove('active');

    adminLoginForm.classList.remove('active');
    resetPwdForm.classList.remove('active');
  });

  signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');

    signupForm.classList.add('active');
    userLoginForm.classList.remove('active');

    adminLoginForm.classList.remove('active');
    resetPwdForm.classList.remove('active');
  });

  // Switch to Admin Login Form
  if (loginAdminLink) {
    loginAdminLink.addEventListener("click", (e) => {
      e.preventDefault();

      loginTab.classList.add('active');
      signupTab.classList.remove('active');

      userLoginForm.classList.remove('active');
      signupForm.classList.remove('active');

      adminLoginForm.classList.add('active');
    });
  }

  // Switch back to User Login Form
  if (loginUserLink) {
    loginUserLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginTab.classList.add('active');
      signupTab.classList.remove('active');

      adminLoginForm.classList.remove('active');

      userLoginForm.classList.add('active');
    });
  }

  // Switching to forgetPwd form and back to login form
  if (forgotPwdLink) {
    forgotPwdLink.addEventListener("click", (e) => {
      e.preventDefault();

      loginTab.classList.add('active');
      signupTab.classList.remove('active');

      userLoginForm.classList.remove('active');
      signupForm.classList.remove('active');

      resetPwdForm.classList.add('active');
    });
  }

  if (loginUserPwdLink) {
    loginUserPwdLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginTab.classList.add('active');
      signupTab.classList.remove('active');

      resetPwdForm.classList.remove('active');

      userLoginForm.classList.add('active');
    });
  }

  function showSignupNotification(message) {
    const notification = document.getElementById("signupNotification");
    notification.innerHTML = message;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 2000); 
  }

  resetPwdForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("resetPwdEmail").value;

    const response = await fetch("/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const result = await response.json();
    showSignupNotification(result.message);
  });

  //show password eye
  document.querySelectorAll(".password-container").forEach(container => {
    const passwordInput = container.querySelector("input");
    const togglePassword = container.querySelector(".eye-icon i");

    togglePassword.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash"); 

        // Hide password again after 3 seconds
        setTimeout(() => {
          passwordInput.type = "password";
          togglePassword.classList.remove("fa-eye-slash");
          togglePassword.classList.add("fa-eye"); 
        }, 3000);
      } else {
        passwordInput.type = "password";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye"); 
      }
    });
  });

  // Handle Login Form Submission
  userLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showSignupNotification('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem('user', JSON.stringify(data.user));

        showSignupNotification(data.message || 'Login successful!');
        updateNavbar(); 

        setTimeout(() => {
          setTimeout(() => {
            window.location.href = '/menu.html';
          }, 1000); 
        }, 1000);
      } else {
        alert(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong during login.');
    }
  });

  // Handle Signup Form Submission
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const mobile = document.getElementById('signupMobile').value.trim();

    if (!username || !email || !password || !mobile) {
      alert('Please fill in all fields.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }

    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, mobile }),
      });

      const data = await response.json();

      if (response.ok) {
        showSignupNotification(data.message || '✅ Signup successful! Now Please Login...');
      
        setTimeout(() => {
          setTimeout(() => {
            window.location.href = '/signup.html';
          }, 1000);
        }, 2000);
      } else {
        alert(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong during signup.');
    }
  });

  // Event listener for admin login form submission
  adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    try {
      const response = await fetch("/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('admin', JSON.stringify(data.admin));
        alert(data.message);
        window.location.href = "/orders.html";
      } else {
        alert(data.message); 
      }
    } catch (err) {
      console.error("Error logging in:", err);
      alert("Something went wrong. Please try again later.");
    }
  });

  // Update Navbar Function
  const updateNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navbar = document.querySelector('.nav');

    if (user) {
      navbar.innerHTML = `
        <div class="nav-middle">
          <a href="/" class="active">Home</a>
          <a href="/menu.html">Menu</a>
          <a href="/aboutUs.html">About Us</a>
        </div>
        <div class="nav-right">
          <a href="#" class="profile-icon"><i id="profileBtn" class="far fa-user-circle" style="font-size: 28px;"></i></a>
          <a href="/cart.html" class="cart-icon"><i class="fa badge" style="font-size: 25px;" value="0">&#xf07a;</i></a>
        </div>

        <!-- Profile Modal -->
        <div id="profileModal" style="display:none;">
          <div class="modal-content">
            <button id="closeProfileModal" class="close-btn">&times;</button>
            <h2>Profile Details</h2>
            <div class="profile-details">
              <p><strong>Username:</strong> <span id="modalUsername">${user.username}</span></p>
              <p><strong>Email:</strong> <span id="modalEmail">${user.email}</span></p>
              <p><strong>Phone:</strong> <span id="modalPhone">${user.mobile || "N/A"}</span></p>
            </div>
            <button id="logoutBtn" class="logout-btn">Logout</button>
          </div>
        </div>
      `;

      // Add functionality for opening and closing the profile modal
      const profileModal = document.getElementById("profileModal");

      // Open Profile Modal
      document.getElementById("profileBtn").addEventListener("click", () => {
        profileModal.style.display = "block";
      });

      // Close Profile Modal
      document.getElementById("closeProfileModal").addEventListener("click", () => {
        profileModal.style.display = "none";
      });

      // Close Modal on Outside Click
      window.addEventListener("click", (e) => {
        if (e.target === profileModal) {
          profileModal.style.display = "none";
        }
      });

      // Logout Button Functionality
      document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        alert('Logged out successfully!');
        window.location.reload();
      });

    } else {
      navbar.innerHTML = `
      <div class="nav-middle">
        <a href="/">Home</a>
        <a href="/menu.html">Menu</a>
        <a href="/aboutUs.html">About Us</a>
      </div>
      <div class="nav-right">
        <a href="/signup.html" id="authLink"  class="active">Login/Signup</a>
      </div>
      `;
    }
  };

  updateNavbar();
});
