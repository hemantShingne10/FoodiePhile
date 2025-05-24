document.addEventListener('DOMContentLoaded', () => {
    let foodCards = document.querySelectorAll(".food-card");
    let dots = document.querySelectorAll(".dot");
    let currentIndex = 0;

    foodCards.forEach((card, index) => {
        card.style.display = index === 0 ? "flex" : "none";
    });

    function showNextCard() {
        foodCards[currentIndex].style.display = "none";  
        dots[currentIndex].classList.remove("active");  

        currentIndex = (currentIndex + 1) % foodCards.length;  

        foodCards[currentIndex].style.display = "flex";  
        dots[currentIndex].classList.add("active");  
    }

    setInterval(showNextCard, 5000);

    // Update Navbar Function
    const updateNavbar = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const navbar = document.querySelector('.nav');
  
      if (user) {
        navbar.innerHTML = `
        <div class="nav-middle">
          <a href="/">Home</a>
          <a href="/menu.html">Menu</a>
          <a href="/aboutUs.html" class="active">About Us</a>
        </div>
        <div class="nav-right">
        <a href="#" class="profile-icon"><i id="profileBtn" class="far fa-user-circle" style="font-size: 28px;"></i></a>
        <a href="/cart.html" class="cart-icon"><i class="fa badge" style="font-size: 25px;" value="0">&#xf07a;</i></a>
        </div>
  
          <!-- Profile Popup -->
          <div id="profilePopup" class="popup" style="display: none;">
            <div class="popup-content">

              <img src="../images/default_profile.jpg" class="profile-picture" style="height: 100px; width: 100px; background-color: #ccc; border-radius: 50%; margin: auto;">

              <h3 id="popupUsername" class="popup-username"></h3>
              <p id="popupEmail" class="popup-email"></p>
              <p id="popupMobile" style="padding-top: 5px;"></p>

              <button id="updateProfileBtn" class="btn">Edit Profile</button>
              <button id="viewOrdersBtn" class="btn">View Orders</button>

              <button id="popupLogoutBtn" class="btn logout-btn">Logout</button>
            </div>
          </div>
        `;

        document.getElementById("updateProfileBtn").addEventListener("click", () => {
          window.location.href = "/profile.html?tab=editProfile"; // Redirect to profile page
        });
  
        document.getElementById("viewOrdersBtn").addEventListener("click", () => {
          window.location.href = "/profile.html?tab=orders"; // Redirect to profile page
        });

        // Function to load user data into popup
        const loadUserInfo = () => {
          if (user) {
            document.getElementById("popupUsername").textContent = user.username || "N/A";
            document.getElementById("popupEmail").textContent = user.email || "N/A";
            document.getElementById("popupMobile").textContent = `Mobile: ${user.mobile}` || "N/A";
          } else {
            alert("Please log in to view your profile.");
            window.location.href = "/signup.html";
          }
        };
  
      // Event Listener: Open Profile Popup
      document.getElementById("profileBtn").addEventListener("click", () => {
        profilePopup.style.display = "block";
        loadUserInfo();
      });

      document.getElementById("popupLogoutBtn").addEventListener("click", () => {
        localStorage.removeItem("user");
        alert("Logged out successfully!");
        window.location.href = "/";
      });
    
      // Close Popup on Outside Click
      window.addEventListener("click", (e) => {
        if (!profilePopup.contains(e.target) && e.target !== profileBtn) {
          profilePopup.style.display = "none";
        }
      });
  
      //Logic to update cart badge
      let cart = user ? JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [] : [];
      const cartBadge = document.querySelector(".cart-icon .badge"); 
      if (cartBadge) {
        cartBadge.setAttribute("value", cart.reduce((total, item) => total + item.quantity, 0)); 
      } else {
        console.error("Cart badge element not found!");
      }
      } else {
        navbar.innerHTML = `
        <div class="nav-middle">
          <a href="/">Home</a>
          <a href="/menu.html">Menu</a>
          <a href="/aboutUs.html" class="active">About Us</a>
        </div>
        <div class="nav-right">
          <a href="/signup.html" id="authLink">Login/Signup</a>
        </div>
        `;
      }
    };

    updateNavbar();
  });
  