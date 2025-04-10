/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    
    // Add event listener for cart button
    document.getElementById("cartButton").addEventListener("click", () => {
      const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
      cartModal.show();
    });
    
    // Load cart from localStorage when the page loads
    loadCartFromStorage();
  });

// Cart functionality
let cart = [];

// Function to load cart from localStorage
function loadCartFromStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
  }
}

// Function to save cart to localStorage
function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to add an item to the cart
function addToCart(product) {
  // Check if the product already exists in the cart
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1; // Increment quantity if it exists
  } else {
    cart.push({ ...product, quantity: 1 }); // Add new product to the cart
  }
  updateCartUI();
  saveCartToStorage();
}

// Function to remove item from cart
function removeFromCart(productId) {
  // Find the item in the cart
  const index = cart.findIndex(item => item.id === productId);
  
  if (index !== -1) {
    cart.splice(index, 1); // Remove the item from the cart array
    updateCartUI();
    saveCartToStorage();
  }
}

// Function to clear all items from cart
function clearCart() {
  cart = [];
  updateCartUI();
  saveCartToStorage();
}

// Function to update product quantity in the cart
function updateProductQuantity(productId, newQuantity) {
  const product = cart.find(item => item.id === productId);
  if (product) {
    product.quantity = newQuantity;
    updateCartUI();
    saveCartToStorage();
  }
}

// Function to update the cart UI
function updateCartUI() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  // Update cart count
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

  // Update cart items list
  cartItems.innerHTML = "";
  cart.forEach(item => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";
    listItem.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: contain; margin-right: 10px;">
        <div>
          <div>${item.name}</div>
          <div class="text-muted">$${item.price.toFixed(2)} x 
            <select class="quantity-select" data-id="${item.id}">
              ${Array.from({length: 10}, (_, i) => i + 1)
                .map(num => `<option value="${num}" ${item.quantity === num ? 'selected' : ''}>${num}</option>`)
                .join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <span class="me-2">$${(item.price * item.quantity).toFixed(2)}</span>
        <button class="btn btn-sm btn-danger remove-item-btn" data-id="${item.id}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    cartItems.appendChild(listItem);
  });
  
  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-item-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-id'));
      removeFromCart(productId);
    });
  });

  // Add event listeners to quantity selects
  document.querySelectorAll('.quantity-select').forEach(select => {
    select.addEventListener('change', function() {
      const productId = parseInt(this.getAttribute('data-id'));
      const newQuantity = parseInt(this.value);
      updateProductQuantity(productId, newQuantity);
    });
  });

  // Update total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = total.toFixed(2);
  
  // Enable/disable checkout button based on cart contents
  const checkoutButton = document.getElementById("checkoutButton");
  if (checkoutButton) {
    checkoutButton.disabled = cart.length === 0;
  }

  // Add Clear Cart button functionality
  const clearCartButton = document.getElementById("clearCartButton");
  if (clearCartButton) {
    clearCartButton.disabled = cart.length === 0;
    clearCartButton.addEventListener('click', clearCart);
  }
}

// Function to handle checkout process
function checkout() {
  // Store cart data in sessionStorage for the checkout page
  sessionStorage.setItem("checkoutData", JSON.stringify({
    cart: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }));
  
  // Redirect to checkout page
  window.location.href = "checkout.html";
}

async function loadProducts() {
  try {
    console.log("Hämtar produkter från fakestore...");

    // Hämtar produkter från API
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error(`API-fel: ${response.status}`);

    const products = await response.json();

    // Hitta container
    const container = document.getElementById("products-container");
    if (!container) throw new Error("Fel: Ingen container hittades!");

    // Rensa container innan produkter läggs in 
    container.innerHTML = "";

    // Loopa igenom produkterna
    products.forEach(product => {
        const col = document.createElement("div");
        col.classList.add("col-auto");
        
        col.innerHTML = `
          <div class="card product-card flip-card d-flex flex-column">
            <div class="flip-card-inner flex-grow-1">
              <div class="flip-card-front">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-price">$${product.price}</p>
              </div>
              <div class="flip-card-back">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-description">${product.description}</p>
              </div>
            </div>
            <div class="p-2 mt-auto">
             <button type="button" class="btn btn-yellow order-button w-100 add-to-cart-btn"
               data-id="${product.id}" 
               data-name="${product.title}" 
               data-price="${product.price}" 
               data-image="${product.image}">
               Add to Cart
             </button>
            </div>
          </div>
        `;
        
        container.appendChild(col);
      });
      
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation(); // Stop event from bubbling up to the card
        
        const product = {
          id: parseInt(this.getAttribute('data-id')),
          name: this.getAttribute('data-name'),
          price: parseFloat(this.getAttribute('data-price')),
          image: this.getAttribute('data-image')
        };
        
        addToCart(product);
        
        // Show feedback
        const originalText = this.textContent;
        this.textContent = 'Added!';
        this.classList.add('btn-success');
        
        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove('btn-success');
        }, 1000);
      });
    });

    // Lägger till flip-funktion
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', function() {
         
         if (!event.target.closest('.add-to-cart-btn')) {
           this.classList.toggle('flipped');
         }
        });
    });

  } catch (error) {
      console.error("Fel vid hämtning av produkter:", error);
      document.getElementById("products-container").innerHTML = `<p class="text-danger">Kunde inte ladda produkter. Försök igen senare.</p>`;
  }
}

const orderProductModal = document.getElementById('orderProductModal');
orderProductModal.addEventListener('show.bs.modal', function (event) {
const button = event.relatedTarget;
const productTitle = button.getAttribute('data-product-title');
const productPrice = button.getAttribute('data-product-price');
const productImage = button.getAttribute('data-product-image');
const productDescription = button.getAttribute('data-product-description');

document.getElementById('modalProductTitle').textContent = productTitle;
document.getElementById('modalProductPrice').textContent = "$" + productPrice;
document.getElementById('modalProductImage').src = productImage;
document.getElementById('modalProductDescription').textContent = productDescription;
});


document.getElementById('submitOrderButton').addEventListener('click', function() {
const form = document.getElementById('orderProductForm');
let valid = true;

// Hämtar fält
const orderName = document.getElementById('orderName');
const orderEmail = document.getElementById('orderEmail');
const orderPhone = document.getElementById('orderPhone');
const orderStreet = document.getElementById('orderStreet');
const orderZipCode = document.getElementById('orderZipCode');
const orderCity = document.getElementById('orderCity');

// Tar bort tidigare felmarkeringar
[orderName, orderEmail, orderPhone, orderStreet, orderZipCode, orderCity].forEach(input => {
 input.classList.remove('is-invalid');
});

// Validering av fälten
if (orderName.value.trim().length < 2 || orderName.value.trim().length > 50) {
 orderName.classList.add('is-invalid');
 valid = false;
}
if (!orderEmail.value.includes('@') || orderEmail.value.trim().length > 50) {
 orderEmail.classList.add('is-invalid');
 valid = false;
}
const phoneRegex = /^[0-9()\-\s]+$/;
if (!phoneRegex.test(orderPhone.value) || orderPhone.value.trim().length > 50) {
 orderPhone.classList.add('is-invalid');
 valid = false;
}
if (orderStreet.value.trim().length < 2 || orderStreet.value.trim().length > 50) {
  orderStreet.classList.add('is-invalid');
 valid = false;
}
const zipCodeRegex = /^\d{5}$/; 
if (!zipCodeRegex.test(orderZipCode.value)) {
  orderZipCode.classList.add('is-invalid');
  valid = false;
 }
 if (orderCity.value.trim().length < 2 || orderCity.value.trim().length > 50) {
  orderCity.classList.add('is-invalid');
  valid = false;
 }

if (valid) {
  // Save order details to sessionStorage
  const receiptData = {
    cart: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    name: orderName.value.trim(),
    email: orderEmail.value.trim(),
    phone: orderPhone.value.trim(),
    street: orderStreet.value.trim(),
    zipCode: orderZipCode.value.trim(),
    city: orderCity.value.trim()
  };
  
  // Sparar datan i sessionStorage (datan finns kvar tills fliken stängs)
  sessionStorage.setItem("receiptData", JSON.stringify(receiptData));
 
  // Stänger modalen
  const modalEl = document.getElementById('orderProductModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide(); 
 
  form.reset(); 

  // Omdirigerar till kvitto-sidan
  window.location.href = "receipt.html";
}
});







