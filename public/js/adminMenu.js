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

  searchInput.addEventListener("input", (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredItems = menuData.filter((item) =>
      item.name.toLowerCase().includes(searchText)
    );
    displayMenuItems(filteredItems);
  });

  Object.keys(categoryButtons).forEach((category) => {
    categoryButtons[category].addEventListener("click", () => {
      console.log("Filtering for category:", category);

      const filteredItems = menuData.filter((item) => item.category === category);

      console.log("Filtered Items:", filteredItems);
      displayMenuItems(filteredItems);
    });
  });

  const profileBtn = document.getElementById("profileBtn");

  profileBtn.addEventListener("click", () => {
    localStorage.removeItem("admin");
    alert("Logged out successfully!");
    window.location.href = "/";
  });

  await fetchMenuItems();

});