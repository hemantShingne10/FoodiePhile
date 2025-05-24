document.addEventListener("DOMContentLoaded", function () {
  const menuList = document.getElementById("menu-list");
  const addItemForm = document.querySelector(".add-item-form");
  const itemImage = document.getElementById("itemImage");
  const imagePreview = document.getElementById("imagePreview");

  async function fetchMenuItems() {
      try {
          const response = await fetch("/menu/menuItems");
          const menuItems = await response.json();
          menuList.innerHTML = ""; 
          menuItems.forEach((item, index) => {
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${index + 1}</td>
                  <td>${item.name}</td>
                  <td><button class="update-btn" data-id="${item._id}">Update</button></td>
                  <td><button class="remove-btn" data-id="${item._id}">Remove</button></td>
              `;
              menuList.appendChild(row);
          });

          document.querySelectorAll(".update-btn").forEach(button => {
              button.addEventListener("click", () => loadMenuItem(button.dataset.id));
          });

          document.querySelectorAll(".remove-btn").forEach(button => {
              button.addEventListener("click", () => deleteMenuItem(button.dataset.id));
          });

      } catch (error) {
          console.error("Error fetching menu items:", error);
      }
  }

  itemImage.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
              imagePreview.src = e.target.result;
          };
          reader.readAsDataURL(file);
      }
  });

  // Handling Add or Update Menu Item
  addItemForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData();
      formData.append("name", document.getElementById("item-name").value);
      formData.append("description", document.getElementById("item-description").value);
      formData.append("price", document.getElementById("item-price").value);
      formData.append("category", document.getElementById("item-category").value);
      formData.append("image", itemImage.files[0]);

      const itemId = addItemForm.dataset.id; 
      const url = itemId ? `/menu/updateMenuItem/${itemId}` : "/menu/addMenuItem";
      const method = itemId ? "PUT" : "POST";

      try {
          const response = await fetch(url, { method, body: formData });
          const result = await response.json();

          if (response.ok) {
              alert(result.message);
              addItemForm.reset();
              imagePreview.src = "/images/uploadPic.jpg";
              addItemForm.removeAttribute("data-id"); 
              fetchMenuItems(); 
          } else {
            console.error("Server Error Response:", result);
              alert(result.message || "Something went wrong.");
          }
      } catch (error) {
          console.error("Error adding/updating item:", error);
      }
  });

  async function loadMenuItem(itemId) {
      try {
          const response = await fetch(`/menu/menuItems`);
          const menuItems = await response.json();
          const item = menuItems.find(item => item._id === itemId);

          if (item) {
              document.getElementById("item-name").value = item.name;
              document.getElementById("item-description").value = item.description;
              document.getElementById("item-price").value = item.price;
              document.getElementById("item-category").value = item.category;
              imagePreview.src = item.image;
              addItemForm.setAttribute("data-id", itemId);
          }
      } catch (error) {
          console.error("Error loading menu item:", error);
      }
  }

  async function deleteMenuItem(itemId) {
      if (!confirm("Are you sure you want to delete this item?")) return;

      try {
          const response = await fetch(`/menu/deleteMenuItem/${itemId}`, { method: "DELETE" });
          const result = await response.json();

          if (response.ok) {
              alert(result.message);
              fetchMenuItems();
          } else {
              alert(result.message || "Something went wrong.");
          }
      } catch (error) {
          console.error("Error deleting menu item:", error);
      }
  }

  fetchMenuItems();

  const profileBtn = document.getElementById("profileBtn");

  profileBtn.addEventListener("click", () => {
    localStorage.removeItem("admin");
    alert("Logged out successfully!");
    window.location.href = "/";
  });
});
