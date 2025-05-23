document.addEventListener("DOMContentLoaded", function () {
  // Burger menu
  const burgerMenu = document.querySelector(".burger-menu");
  const menu = document.querySelector(".menu");

  if (burgerMenu && menu) {
    burgerMenu.onclick = () => menu.classList.toggle("active");
  }

  // Cart toggle
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartButton = document.getElementById("cart-button");
  const closeCart = document.getElementById("close-cart");
  const continueShopping = document.getElementById("continue-shopping");

  const toggleCart = (open) => {
    if (cartSidebar) {
      cartSidebar.classList.toggle("active", open);
    }
    if (cartOverlay) {
      cartOverlay.classList.toggle("active", open);
    }
    document.body.style.overflow = open ? "hidden" : "";
  };

  if (cartButton) {
    cartButton.onclick = (e) => {
      e.preventDefault();
      toggleCart(true);
    };
  }

  if (closeCart) closeCart.onclick = () => toggleCart(false);
  if (continueShopping) continueShopping.onclick = () => toggleCart(false);
  if (cartOverlay) cartOverlay.onclick = () => toggleCart(false);

  // Products dropdown
  const dropdown = document.getElementById("products-dropdown");
  const productsLink = document.getElementById("products-link");
  const container = document.querySelector(".dropdown-container");

  if (productsLink && dropdown) {
    // Click functionality
    productsLink.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });
  }

  if (container && dropdown) {
    // Hover functionality
    container.addEventListener("mouseenter", function () {
      dropdown.classList.add("show");
    });

    container.addEventListener("mouseleave", function () {
      dropdown.classList.remove("show");
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (container && dropdown && !container.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });

  // Basic cart management
  let cartItems = [];

  const updateCart = () => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const cartItemsContainer = document.getElementById("cart-items");

    if (cartCount) cartCount.textContent = count;
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    if (checkoutBtn) checkoutBtn.disabled = count === 0;

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML =
        count === 0
          ? `<div class="empty-cart">
          <i class="bi bi-bag-x"></i>
          <p>Tu carrito está vacío</p>
          <small>Agrega algunos productos para comenzar</small>
        </div>`
          : cartItems
              .map(
                (item) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p class="cart-item-price">$${item.price}</p>
              <div class="cart-item-quantity">
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
              </div>
            </div>
            <button class="remove-item" data-id="${item.id}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `
              )
              .join("");

      // Add event listeners for cart buttons
      cartItemsContainer.querySelectorAll(".quantity-btn").forEach((btn) => {
        btn.onclick = (e) => {
          const id = e.target.dataset.id;
          const action = e.target.dataset.action;
          updateQuantity(id, action === "increase" ? 1 : -1);
        };
      });

      cartItemsContainer.querySelectorAll(".remove-item").forEach((btn) => {
        btn.onclick = (e) => {
          const id = e.target.closest(".remove-item").dataset.id;
          removeItem(id);
        };
      });
    }
  };

  const addToCart = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    updateCart();
  };

  const updateQuantity = (id, change) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        cartItems = cartItems.filter((item) => item.id !== id);
      }
      updateCart();
    }
  };

  const removeItem = (id) => {
    cartItems = cartItems.filter((item) => item.id !== id);
    updateCart();
  };

  // Make functions globally available
  window.addToCart = addToCart;
  window.updateQuantity = updateQuantity;
  window.removeItem = removeItem;

  updateCart();
});
