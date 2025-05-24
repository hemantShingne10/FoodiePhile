document.addEventListener("DOMContentLoaded", async () => {
  const menuContainer = document.getElementById("menuItems");
  const searchInput = document.getElementById("searchInput");
  const loader = document.getElementById("loader");


  const categoryButtons = {
    "Main Course": document.getElementById("mainCourseBtn"),
    "Snacks": document.getElementById("snacksBtn"),
    "Drinks": document.getElementById("drinksBtn"),
    "Dessert": document.getElementById("dessertBtn"),
  };

  let menuData = [];

  let user = JSON.parse(localStorage.getItem("user"));

  const isLoggedIn = () => localStorage.getItem("user") !== null;

  const getCart = () => user ? JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [] : [];

  const saveCart = (cart) => localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));

  // Function to Fetch Menu Items
  const fetchMenuItems = async () => {
    try {
      loader.style.display = "block"; 

      const response = await fetch("/menu/menuItems"); 
      const data = await response.json();
      console.log("Fetched Menu Data:", data);

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      menuData = data;
      displayMenuItems(menuData);
    } catch (error) {
      console.error("Error fetching menu:", error);
      menuContainer.innerHTML = "<p>Failed to load menu. Please try again later.</p>";
    } finally {
      loader.style.display = "none"; 
    }
  };

  // Function to Display Menu Items
  const displayMenuItems = (items) => {
    menuContainer.innerHTML = ""; 

    if (items.length === 0) {
      menuContainer.innerHTML = "<p>No menu items found.</p>";
      return;
    }

    items.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.classList.add("food-item");
      menuItem.dataset.category = item.category;

      menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <h5 class="item-price">Rs. ${item.price.toFixed(2)}</h5>

      <button class="add-to-cart-btn">Add to Cart</button>
    `;

      menuContainer.appendChild(menuItem);

      const addToCartButton = menuItem.querySelector(".add-to-cart-btn");
      addToCartButton.addEventListener("click", () => addToCart(item));
    });
  };

  // Search Functionality
  searchInput.addEventListener("input", (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredItems = menuData.filter((item) =>
      item.name.toLowerCase().includes(searchText)
    );
    displayMenuItems(filteredItems);
  });

  // Category Filtering
  Object.keys(categoryButtons).forEach((category) => {
    categoryButtons[category].addEventListener("click", () => {
      console.log("Filtering for category:", category); 

      const filteredItems = menuData.filter((item) => item.category === category);

      console.log("Filtered Items:", filteredItems); 
      displayMenuItems(filteredItems);
    });
  });

  function showCartNotification(message) {
    const notification = document.getElementById("cartNotification");
    notification.innerHTML = message;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 2000);
  }

  const addToCart = (item) => {
    if (!isLoggedIn()) {
      showCartNotification(`Please Login to your Account First`);
      window.location.href = "/signup.html"; 
      return;
    }

    const cart = getCart();
    let newQuantity = 1; 
    let existingItem = cart.find((cartItem) => cartItem.name === item.name);

    // Modifying Add-to-Cart logic
    if (existingItem) {
      existingItem.quantity += 1;
      newQuantity = existingItem.quantity;
      showCartNotification(`✅ Increased quantity of ${item.name} in the cart.`);
    } else {
      cart.push({ image: item.image, name: item.name, price: item.price, quantity: 1 });
      showCartNotification(`✅ ${item.name} added to cart.`);
    }
    saveCart(cart);
    updateBadge();

    // // Find the correct food item and update its quantity display
    // const foodItems = document.querySelectorAll(".food-item");
    // foodItems.forEach((menuItem) => {
    //   const itemNameElement = menuItem.querySelector("h3");
    //   if (itemNameElement && itemNameElement.textContent.trim() === item.name) {
    //     const quantityElement = menuItem.querySelector(".cart-quantity");
    //     if (quantityElement) {
    //       quantityElement.classList.add("visible"); 
    //       quantityElement.querySelector("span").textContent = newQuantity; 
    //       console.log(`Updated quantity for ${item.name}: ${newQuantity}`);
    //     } else {
    //       console.error("Quantity element not found for", item.name);
    //     }
    //   }
    // });
  };

  const updateBadge = () => {
    setTimeout(() => {
      const badgeElement = document.querySelector(".cart-icon .badge"); 

      if (badgeElement) {
        const cart = getCart();
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        badgeElement.setAttribute("value", totalQuantity);
      } else {
        console.warn(" Badge element not found. It might not be loaded yet.");
      }
    }, 200); 
  };

  // Update Navbar Function
  const updateNavbar = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navbar = document.querySelector(".nav");

    if (user) {
      navbar.innerHTML = `
      <div class="nav-middle">
        <a href="/">Home</a>
        <a href="/menu.html" class="active">Menu</a>
        <a href="/aboutUs.html">About Us</a>
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
      updateBadge(); 

      document.getElementById("updateProfileBtn").addEventListener("click", () => {
        window.location.href = "/profile.html?tab=editProfile"; 
      });

      document.getElementById("viewOrdersBtn").addEventListener("click", () => {
        window.location.href = "/profile.html?tab=orders"; 
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

      // Event Listener: Logout Button
      document.getElementById("popupLogoutBtn").addEventListener("click", () => {
        localStorage.removeItem("user");
        alert("Logged out successfully!");
        window.location.href = "/";
      });

      // Close Popup on Outside Click
      const profilePopup = document.getElementById("profilePopup")
      window.addEventListener("click", (e) => {
        if (!profilePopup.contains(e.target) && e.target !== profileBtn) {
          profilePopup.style.display = "none";
        }
      });
      return; 
    } else {
      navbar.innerHTML = `
      <div class="nav-middle">
        <a href="/">Home</a>
        <a href="/menu.html"  class="active">Menu</a>
        <a href="/aboutUs.html">About Us</a>
      </div>
      <div class="nav-right">
        <a href="/signup.html" id="authLink">Login/Signup</a>
      </div>
      `;
    }
  };

  updateNavbar();
  updateBadge();

  await fetchMenuItems();

});
