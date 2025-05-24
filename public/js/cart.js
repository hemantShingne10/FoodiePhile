document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.getElementById("cartList");
  const cartContainer = document.getElementById("cartContainer");
  const emptyCartMessage = document.getElementById("emptyCartMessage");
  const cartSummary = document.getElementById("cartSummary");
  const totalPriceElement = document.getElementById("totalPrice");
  const finalTotalElement = document.getElementById("finalTotal");
  const addMoreItemsBtn = document.getElementById("addMoreItemsBtn");
  const orderSummaryList = document.getElementById("orderSummaryList");
  const proceedToPaymentBtn = document.getElementById("proceedToPaymentBtn");
  const profileBtn = document.getElementById("profileBtn");
  const profilePopup = document.getElementById("profilePopup");
  const popupLogoutBtn = document.getElementById("popupLogoutBtn");

  const addressDropdown = document.getElementById("addressDropdown");
  const addNewAddressBtn = document.getElementById("addNewAddressBtn")
  const orderSummaryAddress = document.getElementById("orderSummaryAddress");

  const cartBadge = document.querySelector(".cart-icon .badge");

  let user = JSON.parse(localStorage.getItem("user"));
  let cart = user ? JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [] : [];

  // Function to update cart badge value
  const updateCartBadge = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.setAttribute("value", totalItems);
    if (totalItems === 0) {
      cartBadge.setAttribute("value", "");
    }
  };

  // Function to render cart items
  const renderCart = () => {
    cartList.innerHTML = "";
    let totalPrice = 0;

    if (cart.length === 0) {
      emptyCartMessage.style.display = "block";
      cartSummary.style.display = "none";
      cartHeadings.style.display = "none";
      return;
    }

    emptyCartMessage.style.display = "none";
    cartSummary.style.display = "block";
    cartHeadings.style.display = "block";

    cart.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <span>${item.name} - ₹${item.price}</span>
        <span>
          <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
          ${item.quantity}
          <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
        </span>
        <span>₹${item.price * item.quantity}</span>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;
      cartList.appendChild(listItem);
      totalPrice += item.price * item.quantity;
      finalTotal = totalPrice + 50;
    });

    totalPriceElement.textContent = totalPrice;
    finalTotalElement.textContent = finalTotal;
    updateCartBadge();
  };

  // Add More Items Button
  if (addMoreItemsBtn) {
    addMoreItemsBtn.addEventListener('click', () => {
      window.location.href = 'menu.html';
    });
  } else {
    console.error('Add More Items button not found! Check the HTML for the correct ID.');
  }

  // Error message for the address dropdown
  const addressError = document.createElement("p");
  addressError.id = "addressError";
  addressError.style.color = "red";
  addressError.style.fontSize = "0.9rem";
  addressError.style.display = "none";
  addressError.textContent = "Please select the delivery address.";
  addressDropdown.parentNode.appendChild(addressError);

  // Add New Address Button
  if (addNewAddressBtn) {
    addNewAddressBtn.addEventListener('click', () => {
      window.location.href = 'profile.html';
    });
  } else {
    console.error('Add New Address button not found! Check the HTML for the correct ID.');
  }

  const orderSummaryContainer = document.getElementById("orderSummaryContainer");
  orderSummaryBtn.addEventListener("click", () => {
    console.log("Order Summary button clicked");

    const selectedAddress = addressDropdown.options[addressDropdown.selectedIndex]?.text;

    if (!selectedAddress || addressDropdown.selectedIndex === 0) {
      addressError.style.display = "block";
      return;
    }

    addressError.style.display = "none";

    const mainElement = document.querySelector("main");
    if (!mainElement) {
      console.error("Main element not found!");
      return;
    }

    // Populating order summary
    orderSummaryList.innerHTML = "";
    let cartTotal = 0;

    cart.forEach((item) => {
      const summaryItem = document.createElement("li");
      summaryItem.innerHTML = `
           <span>${item.name} </span>
           <span> ${item.quantity} </span>
           <span> ₹${item.price * item.quantity} </span>
         `;
      orderSummaryList.appendChild(summaryItem);
      cartTotal += item.price * item.quantity;
    });

    document.getElementById("orderSummaryCartTotal").textContent = cartTotal;
    document.getElementById("orderSummaryTotalPrice").textContent = cartTotal + 50;
    orderSummaryAddress.innerHTML = `<strong> Delivery Address: </strong> ${selectedAddress}`;

    // Hiding cart and showing order summary
    console.log("Hiding cart, showing order summary");
    cartContainer.style.display = "none";
    orderSummaryContainer.style.display = "block";
    console.log("Cart should be hidden now.");
  });

  document.getElementById("backToCartBtn").addEventListener("click", () => {
    cartContainer.style.display = "block";
    orderSummaryContainer.style.display = "none";
  });

  // Handle Quantity and Remove Buttons from cart page
  cartList.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("quantity-btn")) {
      const index = parseInt(target.dataset.index);
      const action = target.dataset.action;

      if (action === "increase") {
        cart[index].quantity++;
      } else if (action === "decrease" && cart[index].quantity > 1) {
        cart[index].quantity--;
      }

      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
      renderCart();
    }

    if (target.classList.contains("remove-btn")) {
      const index = parseInt(target.dataset.index);
      cart.splice(index, 1);
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
      location.reload();
      renderCart();

    }
  });

  renderCart();

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

  const updateProfileBtn = document.getElementById("updateProfileBtn");
  const viewOrdersBtn = document.getElementById("viewOrdersBtn");
  updateProfileBtn.addEventListener("click", () => {
    window.location.href = "/profile.html?tab=editProfile";
  });

  viewOrdersBtn.addEventListener("click", () => {
    window.location.href = "/profile.html?tab=orders";
  });

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

  // Load addresses into the dropdown
  const loadAddressDropdown = () => {
    if (user && user.addresses && user.addresses.length > 0) {
      addressDropdown.innerHTML = `
        <option value="" disabled selected>Select Delivery Address</option>
      `;
      user.addresses.forEach((address) => {
        const option = document.createElement("option");
        option.value = address;
        option.textContent = address;
        addressDropdown.appendChild(option);
      });
    } else {
      addressDropdown.innerHTML = `
        <option value="" disabled>No addresses available</option>
      `;
    }
  };
  // Call loadAddressDropdown on page load to populate addresses
  loadAddressDropdown();


  console.log("Checking Cashfree SDK...");

  setTimeout(() => {
    if (typeof Cashfree === "undefined") {
      console.error("Cashfree SDK failed to load!");
      alert("Payment system error! Please refresh the page.");
    } else {
      console.log("Cashfree SDK Loaded:", Cashfree);
    }
  }, 2000); // Wait 2 seconds for script to load

  // Proceed to Payment
  proceedToPaymentBtn.addEventListener("click", async () => {
    console.log("Proceed to Payment button clicked");
    const selectedAddress = addressDropdown.options[addressDropdown.selectedIndex]?.value;
    if (!user) {
      alert("Please log in to proceed with payment.");
      return;
    }

    const deliveryCharge = 50;
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryCharge;

    const orderId = "ORDER_" + new Date().getTime(); // Unique Order ID
    console.log(orderId);

    try {
      // Step 1: Create Order in Database
      const orderResponse = await fetch("/api/orders/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          orderId,
          deliveryAddress: selectedAddress,
          orderItems: cart,
          totalPrice,
        }),
      });
      const orderData = await orderResponse.json();
      console.log("Order Created:", orderData);

      // Step 2: Generate Cashfree Payment Order
      const paymentResponse = await fetch("/api/payments/create-payment-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: totalPrice,
          customerName: user.username,
          customerEmail: user.email,
          customerPhone: user.mobile,
        }),
      });
      const paymentData = await paymentResponse.json();
      console.log("Payment Session:", paymentData); //Log the response

      const cashfree = Cashfree({
        mode: "sandbox",
      });

      if (paymentData && paymentData.payment_session_id) {
        let checkoutOptions = {
          paymentSessionId: paymentData.payment_session_id,
          redirectTarget: "_self",
          returnUrl: `http://localhost:3000/cart.html?order_id=${orderId}`,
          redirectOnFailure: true  
        };
        console.log("Redirecting with:", checkoutOptions);
        cashfree.checkout(checkoutOptions);
      } else {
        alert("Failed to initiate payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error: ", error);
      alert("Something went wrong. Please try again.");
    }
  });

  async function handlePaymentResponse() {
    console.log("Handling payment response...");

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("order_id");
    const transactionId = urlParams.get("transaction_id");
    const status = urlParams.get("status");

    console.log("Order ID:", orderId);
    console.log("Payment Status:", status);
    console.log("Transaction ID:", transactionId);

    if (!orderId) {
      console.warn("No order ID found. Redirecting to cart without query parameters...");
      setTimeout(() => removeQueryParams(), 3000);
      return;
    }
    if (status === "FAILED" || status === "EXPIRED" || status === "CANCELLED") {
      alert(`Payment Failed. Please try again.`);
      return;
    }

    try {
      const response = await fetch("/api/payments/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, transactionId }),
      });

      const data = await response.json();
      console.log("Payment status from backend:", data);
      console.log(data.transactionId);
      console.log(data.totalPrice);

      if (data.success && data.paymentStatus === "SUCCESS") {
        showPopup("success", "Order Placed Successfully!", orderId, data.totalPrice, data.transactionId);

        localStorage.removeItem(`cart_${user.email}`);
        console.log("Order placed successfully! A confirmation email has been sent.");
      } else {
        showPopup("failure", "Payment Failed!", "Try again later");
      }

    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Error verifying payment. Please refresh the page.");
    } finally {
      setTimeout(() => removeQueryParams(), 1000);
    }
  }

  function showPopup(status, message, orderId = "", totalPrice = "", transactionId = "") {
    const popup = document.getElementById("paymentPopup");
    const popupMessage = document.getElementById("paymentPopupMessage");
    const popupOrderId = document.getElementById("paymentPopupOrderId");
    const popupTransId = document.getElementById("paymentPopupTransId");
    const popupTotalPrice = document.getElementById("paymentPopupTotalPrice");

    if (status === "success") {
      popupMessage.innerHTML = `<span style="color: green;"><svg xmlns="http://www.w3.org/2000/svg" height="23" width="23" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#23b80f" d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg> ${message}</span>`;
      popupOrderId.innerHTML = `<strong>Order ID:</strong> ${orderId}`;
      popupTotalPrice.innerHTML = `<strong>Amount Paid:</strong> ${totalPrice}`;
      popupTransId.innerHTML = `<strong>Transaction ID:</strong> ${transactionId}`;
    } else {
      popupMessage.innerHTML = `<span style="color: red;"><svg xmlns="http://www.w3.org/2000/svg" height="23" width="23" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#ff0000" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg> ${message}</span>`;
      popupOrderId.innerHTML = ""; 
      popupTransId.innerHTML = orderId; 
    }

    popup.style.display = "flex"; 

    // Close on outside click
    popup.addEventListener("click", (event) => {
      if (event.target === popup) {
        closePopup(status);
      }
    });
  }

  function closePopup(status = "") {
    document.getElementById("paymentPopup").style.display = "none";

    if (status === "success") {
      location.reload();
    }
  }

  function removeQueryParams() {
    console.log("Cleaning URL parameters...");
    const newURL = window.location.pathname;
    window.history.replaceState({}, document.title, newURL);
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("order_id")) {
    console.log("Detected payment response. Processing...");
    handlePaymentResponse();
  }

});

