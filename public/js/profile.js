document.addEventListener("DOMContentLoaded", () => {

    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get("tab") || "editProfile"; // Default tab

    showTab(activeTab);

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        document.getElementById("username").value = user.username;
        document.getElementById("email").value = user.email;
        document.getElementById("mobile").value = user.mobile;
    }

    function showProfileNotification(message) {
        const notification = document.getElementById("profileNotification");
        notification.innerHTML = message;
        notification.classList.add("show");

        setTimeout(() => {
            notification.classList.remove("show");
        }, 2000);
    }

    // Handling profile update
    document.getElementById("profileForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const updatedUser = {
            email: document.getElementById("email").value,
            username: document.getElementById("username").value,
            mobile: document.getElementById("mobile").value,
        };

        try {
            const response = await fetch("/api/user/updateProfile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });

            const data = await response.json();
            if (data.success) {
                showProfileNotification("Profile updated successfully!");
                localStorage.setItem("user", JSON.stringify(data.user));
            } else {
                showProfileNotification("Error updating profile: " + data.message);
            }
        } catch (error) {
            console.error("Update Error:", error);
        }
    });

    // Handling adding a new address
    document.getElementById("addressForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const street = document.getElementById("street").value;
        const city = document.getElementById("city").value;
        const pincode = document.getElementById("pincode").value;
        const contact = document.getElementById("contact").value;
        const fullAddress = `${street}, ${city}, ${pincode}, Contact: ${contact}`;

        try {
            const response = await fetch("/api/user/addAddress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, address: fullAddress }),
            });

            const data = await response.json();
            if (data.success) {
                showProfileNotification("Address added successfully!");
                localStorage.setItem("user", JSON.stringify(data.user)); // Update local user data
                setTimeout(() => {
                    window.location.reload();
                },2000);
            } else {
                showProfileNotification("Error adding address: " + data.message);
            }
        } catch (error) {
            console.error("Address Error:", error);
        }
    });

    //Badge Update Logic
    let cart = user ? JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [] : [];
    const cartBadge = document.querySelector(".cart-icon .badge");
    if (cartBadge) {
        cartBadge.setAttribute("value", cart.reduce((total, item) => total + item.quantity, 0));
    } else {
        console.error("Cart badge element not found!");
    }

    // profile popup
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
    profileBtn.addEventListener("click", () => {
        profilePopup.style.display = "block";
        loadUserInfo();
    });

    // Event Listener: Logout Button
    popupLogoutBtn.addEventListener("click", () => {
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

    const ordersContainer = document.getElementById("orders");

    const userEmail = user.email;
    console.log(userEmail);

    if (!userEmail) {
        ordersContainer.innerHTML = "<p style='color: red;'>User not logged in.</p>";
        return;
    }

    // Fetching orders for this user
    fetch(`/api/orders/getUserOrders?email=${encodeURIComponent(userEmail)}`)
        .then(response => response.json())
        .then(orders => {
            if (!orders || orders.length === 0) {
                ordersContainer.innerHTML = "<p>No orders found.</p>";
                return;
            }

            ordersContainer.innerHTML = "";

            orders.forEach(order => {
                const orderLabel = document.createElement("div");
                orderLabel.classList.add("order-label");
                orderLabel.innerHTML = `
                <div><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</div>
                <div><strong>Order ID:</strong> ${order._id}</div>
                <div><strong>Total Price:</strong> ₹${order.totalPrice}</div>
                <div>
                    <strong>Status:</strong> 
                    <span class="status ${order.paymentStatus.toLowerCase()}">${order.paymentStatus}</span>
                </div>
                <span class="toggle-icon">▼</span>
            `;

                let itemsHTML = `
                    <table>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>`;

                if (Array.isArray(order.orderItems)) {
                    order.orderItems.forEach(item => {
                        itemsHTML += `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${item.price}</td>
                                </tr>`;
                    });
                } else {
                    itemsHTML += "<tr><td colspan='3'>No items found</td></tr>";
                }
                itemsHTML += "</table>";

                const orderDetails = document.createElement("div");
                orderDetails.classList.add("order-details");
                orderDetails.style.display = "none";

                orderDetails.innerHTML = `
                        ${itemsHTML}
                        <div class="order-info">
                            <p><strong>Paid Amount:</strong> ${order.paymentStatus === "SUCCESS" ? `₹${order.totalPrice}` : "N/A"}</p>
                            <p><strong>Transaction ID:</strong> ${order.transactionId || "N/A"}</p>
                            <p><strong>Delivery Address:</strong> ${order.deliveryAddress || "Not Available"}</p>
                            <p><strong>Order Status:</strong> ${order.orderStatus || "Not Available"}</p>
                        </div>
                    `;

                // Toggle the order details on click
                orderLabel.addEventListener("click", () => {
                    if (orderDetails.style.display === "none") {
                        orderDetails.style.display = "block";
                        orderLabel.querySelector(".toggle-icon").textContent = "▲";
                    } else {
                        orderDetails.style.display = "none";
                        orderLabel.querySelector(".toggle-icon").textContent = "▼";
                    }
                });

                ordersContainer.appendChild(orderLabel);
                ordersContainer.appendChild(orderDetails);
            });
        })
        .catch(error => {
            console.error("Error fetching orders:", error);
            ordersContainer.innerHTML = "<p style='color: red;'>Failed to load orders.</p>";
        });

    const addressList = document.getElementById("addressList");

    const loadAddressList = () => {
        addressList.innerHTML = ""; // Clear the list

        if (user && user.addresses && user.addresses.length > 0) {
            user.addresses.forEach((address, index) => {
                const li = document.createElement("li");

                // Serial Number
                const serialNumber = document.createElement("span");
                serialNumber.classList.add("serial-number");
                serialNumber.textContent = `${index + 1}.`;

                // Address Text
                const addressText = document.createElement("span");
                addressText.classList.add("address-text");
                addressText.textContent = address;

                // Remove Button
                const removeBtn = document.createElement("button");
                removeBtn.textContent = "Remove";
                removeBtn.classList.add("remove-btn");
                removeBtn.onclick = () => removeAddress(address);

                // Append elements to list item
                li.appendChild(serialNumber);
                li.appendChild(addressText);
                li.appendChild(removeBtn);
                addressList.appendChild(li);
            });
        } else {
            addressList.innerHTML = "<p>No addresses available.</p>";
        }
    };

    // Function to remove address (remains the same)
    const removeAddress = (address) => {
        fetch("/api/user/removeAddress", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, address })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showProfileNotification("Address removed Succesfully")
                    user.addresses = user.addresses.filter(a => a !== address);
                    localStorage.setItem("user", JSON.stringify(user));
                    loadAddressList();
                } else {
                    alert(data.message || "Failed to remove address.");
                }
            })
            .catch(error => console.error("Error removing address:", error));
    };

    // Load addresses on page load
    loadAddressList();

});

// Function to show the correct tab and highlight the active button
function showTab(tabId) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(tabId).classList.add("active");

    document.querySelectorAll(".tab-buttons button").forEach(btn => {
        btn.classList.remove("active-tab");
    });

    const activeButton = document.querySelector(`.tab-buttons button[data-tab="${tabId}"]`);
    if (activeButton) {
        activeButton.classList.add("active-tab");
    }
}