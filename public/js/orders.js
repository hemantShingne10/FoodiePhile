document.addEventListener("DOMContentLoaded", () => {
  const activeOrdersList = document.getElementById("activeOrdersList");
  const completedOrdersList = document.getElementById("completedOrdersList");
  const activeOrdersTab = document.getElementById("activeOrdersTab");
  const completedOrdersTab = document.getElementById("completedOrdersTab");

  // Fetch and display orders on page load
  fetchOrders();

  // Tab toggle functionality
  activeOrdersTab.addEventListener("click", () => {
    activeOrdersTab.classList.add("active");
    completedOrdersTab.classList.remove("active");
    activeOrdersList.style.display = "block";
    completedOrdersList.style.display = "none";
  });

  completedOrdersTab.addEventListener("click", () => {
    completedOrdersTab.classList.add("active");
    activeOrdersTab.classList.remove("active");
    activeOrdersList.style.display = "none";
    completedOrdersList.style.display = "block";
    fetchCompletedOrders();
  });

  // Fetch active orders from the server
  async function fetchOrders() {
    try {
      const response = await fetch("/api/orders/getOrders");
      const orders = await response.json();
      displayActiveOrders(orders.filter((order) => order.orderStatus === "ACTIVE" && order.paymentStatus === "SUCCESS"));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  function displayActiveOrders(orders) {
    activeOrdersList.innerHTML = "";

    if (orders.length === 0) {
      activeOrdersList.innerHTML = "<li>No active orders.</li>";
      return;
    }

    orders.forEach((order) => {
      const createdAt = new Date(order.createdAt);
      const formattedDate = createdAt.toLocaleDateString("en-GB");
      const formattedTime = createdAt.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const orderItem = document.createElement("li");
      orderItem.className = "order-item";
      orderItem.innerHTML = `
          <div class="order-header">
            <span>Order ID: ${order.orderId}</span>
            <span>Email: ${order.userEmail}</span>
            <span>${formattedDate} | ${formattedTime}</span>
           </div>
  
          <div class="order-details">
            <div class="order-details-header">
              <span>Item Name</span>
              <span>Quantity</span>
              <span>Price (₹)</span>
            </div>
            <ul>
              ${order.orderItems
          .map(
            (item) =>
              `<li>
                      <span>${item.name}</span>
                      <span>${item.quantity}</span>
                      <span>${item.price * item.quantity}</span>
                    </li>`
          )
          .join("")}
            </ul>
          </div>
  
          <p class="delivery-address"><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
  
          <div class="order-footer">
            <span><strong>Paid Amount:</strong> ₹${order.totalPrice.toFixed(2)}</span>
            <span><strong>Trancastion ID: </strong>${order.transactionId}</span>
            <button class="completed-btn" data-id="${order.orderId}">Completed</button>
          </div>
        `;

      activeOrdersList.appendChild(orderItem);
    });

    document.querySelectorAll(".completed-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const orderId = btn.getAttribute("data-id");
        console.log("Order ID from button:", orderId);
        await markOrderCompleted(orderId);
      });
    });
  }

  async function markOrderCompleted(orderId) {
    try {
      const response = await fetch("/api/orders/markCompleted", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchOrders();
      } else {
        alert(data.error || "Failed to mark order as completed.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to mark order as completed.");
    }
  }

  // Fetch completed orders
  async function fetchCompletedOrders() {
    try {
      const response = await fetch("/api/orders/getOrders");
      const orders = await response.json();
      completedOrdersList.innerHTML = "";

      const completedOrders = orders.filter(order => order.orderStatus === "COMPLETED" && order.paymentStatus === "SUCCESS");
      if (!completedOrders.length) {
        completedOrdersList.innerHTML = "<p>No completed orders.</p>";
        return;
      }

      completedOrders.forEach(order => {
        completedOrdersList.appendChild(createCompletedOrderItem(order));
      });
    } catch (err) {
      console.error("Error fetching completed orders:", err);
    }
  }

  function createCompletedOrderItem(order) {
    const createdAt = new Date(order.createdAt);
    const formattedDate = `${createdAt.getDate().toString().padStart(2, "0")}/${(createdAt.getMonth() + 1).toString().padStart(2, "0")}/${createdAt.getFullYear()}`;
    const formattedTime = `${createdAt.getHours().toString().padStart(2, "0")}:${createdAt.getMinutes().toString().padStart(2, "0")}`;

    const orderItem = document.createElement("div");
    orderItem.className = "order-item";

    orderItem.innerHTML = `
<div class="completed-header">
  <span>Order ID: ${order.orderId}</span>
  <span>Email: ${order.userEmail}</span>
  <span>${formattedDate} | ${formattedTime}</span>
</div>
<div class="completed-details">
  <div class="order-details-header1">
    <span>Item Name</span><span>Quantity</span><span>Price</span>
  </div>
  <ul class="order-items-list">
    ${order.orderItems
        .map(
          (item) => `
        <li class="order-item-row">
          <span>${item.name}</span>
          <span>${item.quantity}</span>
          <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        </li>`
        )
        .join("")}
  </ul>
  <p class="delivery-address"><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
  <p><strong>Paid Amount:</strong> ₹${order.totalPrice.toFixed(2)}</p>
</div>
    `;

    const header = orderItem.querySelector(".completed-header");
    const details = orderItem.querySelector(".completed-details");

    header.addEventListener("click", () => {
      header.classList.toggle("active");
      details.style.display = details.style.display === "block" ? "none" : "block";
    });

    return orderItem;
  }

  const profileBtn = document.getElementById("profileBtn");

  profileBtn.addEventListener("click", () => {
    localStorage.removeItem("admin");
    alert("Logged out successfully!");
    window.location.href = "/";
  });
});
