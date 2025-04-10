document.addEventListener('DOMContentLoaded', () => {
  // Load cart data from sessionStorage
  const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData'));
  
  if (!checkoutData || !checkoutData.cart || checkoutData.cart.length === 0) {
    // If cart is empty, redirect back to the home page
    window.location.href = 'index.html';
    return;
  }
  
  // Populate the checkout items list
  const checkoutItemsList = document.getElementById('checkoutItemsList');
  const checkoutTotal = document.getElementById('checkoutTotal');
  
  // Display each item in the cart
  checkoutData.cart.forEach(item => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    
    // Create the item details with image
    const itemDetails = document.createElement('div');
    itemDetails.className = 'd-flex align-items-center';
    
    // Add image if available
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      img.style.width = '50px';
      img.style.height = '50px';
      img.style.marginRight = '15px';
      img.style.objectFit = 'contain';
      itemDetails.appendChild(img);
    }
    
    // Add item name and quantity
    const nameQuantity = document.createElement('div');
    nameQuantity.innerHTML = `
      <div>${item.name}</div>
      <div class="text-muted">Quantity: ${item.quantity}</div>
    `;
    itemDetails.appendChild(nameQuantity);
    
    // Add price
    const price = document.createElement('div');
    price.className = 'text-end';
    price.innerHTML = `$${(item.price * item.quantity).toFixed(2)}`;
    
    listItem.appendChild(itemDetails);
    listItem.appendChild(price);
    
    checkoutItemsList.appendChild(listItem);
  });
  
  // Display total
  checkoutTotal.textContent = checkoutData.total.toFixed(2);
  
  // Form validation and submission
  const checkoutForm = document.getElementById('checkoutForm');
  
  checkoutForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form fields
    const name = document.getElementById('checkoutName');
    const email = document.getElementById('checkoutEmail');
    const phone = document.getElementById('checkoutPhone');
    const street = document.getElementById('checkoutStreet');
    const zipCode = document.getElementById('checkoutZipCode');
    const city = document.getElementById('checkoutCity');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Remove previous validation errors
    [name, email, phone, street, zipCode, city].forEach(input => {
      input.classList.remove('is-invalid');
    });
    
    // Validate form fields
    let valid = true;
    
    if (name.value.trim().length < 2 || name.value.trim().length > 50) {
      name.classList.add('is-invalid');
      valid = false;
    }
    
    if (!email.value.includes('@') || email.value.trim().length > 50) {
      email.classList.add('is-invalid');
      valid = false;
    }
    
    const phoneRegex = /^[0-9()\-\s]+$/;
    if (!phoneRegex.test(phone.value) || phone.value.trim().length > 50) {
      phone.classList.add('is-invalid');
      valid = false;
    }
    
    if (street.value.trim().length < 2 || street.value.trim().length > 50) {
      street.classList.add('is-invalid');
      valid = false;
    }
    
    const zipCodeRegex = /^\d{5}$/;
    if (!zipCodeRegex.test(zipCode.value)) {
      zipCode.classList.add('is-invalid');
      valid = false;
    }
    
    if (city.value.trim().length < 2 || city.value.trim().length > 50) {
      city.classList.add('is-invalid');
      valid = false;
    }
    
    if (valid) {
      // Prepare receipt data
      const receiptData = {
        cart: checkoutData.cart,
        total: checkoutData.total,
        name: name.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        street: street.value.trim(),
        zipCode: zipCode.value.trim(),
        city: city.value.trim(),
        paymentMethod: paymentMethod,
        orderDate: new Date().toISOString()
      };
      
      // Save receipt data to sessionStorage
      sessionStorage.setItem('receiptData', JSON.stringify(receiptData));
      
      // Clear the cart from localStorage since the order is complete
      localStorage.removeItem('cart');
      
      // Redirect to receipt page
      window.location.href = 'receipt.html';
    }
  });
});