document.addEventListener('DOMContentLoaded', () => {
  // Get the receipt data from sessionStorage
  const receiptData = JSON.parse(sessionStorage.getItem('receiptData'));
  
  if (!receiptData) {
    // If receipt data doesn't exist, redirect back to the home page
    window.location.href = 'index.html';
    return;
  }
  
  // Display order date
  const orderDate = receiptData.orderDate ? 
    new Date(receiptData.orderDate).toLocaleString() : 
    new Date().toLocaleString();
  document.getElementById('orderDate').textContent = `Order Date: ${orderDate}`;
  
  // Display shipping information
  document.getElementById('receiptName').textContent = receiptData.name;
  document.getElementById('receiptEmail').textContent = receiptData.email;
  document.getElementById('receiptPhone').textContent = receiptData.phone;
  document.getElementById('receiptAddress').textContent = 
    `${receiptData.street}, ${receiptData.zipCode} ${receiptData.city}`;
  
  // Display payment method if available
  if (receiptData.paymentMethod) {
    const paymentText = receiptData.paymentMethod === 'card' ? 'Credit Card' : 'PayPal';
    document.getElementById('receiptPaymentMethod').textContent = paymentText;
  }
  
  // Calculate total items and display order summary
  const totalItems = receiptData.cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('receiptItemCount').textContent = totalItems;
  document.getElementById('receiptTotal').textContent = receiptData.total.toFixed(2);
  
  // Display order items
  const receiptItemsContainer = document.getElementById('receiptItems');
  
  receiptData.cart.forEach(item => {
    const row = document.createElement('tr');
    
    // Create product cell with image and name
    const productCell = document.createElement('td');
    productCell.className = 'd-flex align-items-center';
    
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      img.style.width = '50px';
      img.style.height = '50px';
      img.style.marginRight = '15px';
      img.style.objectFit = 'contain';
      productCell.appendChild(img);
    }
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = item.name;
    productCell.appendChild(nameSpan);
    
    // Create other cells
    const priceCell = document.createElement('td');
    priceCell.textContent = `$${item.price.toFixed(2)}`;
    
    const quantityCell = document.createElement('td');
    quantityCell.textContent = item.quantity;
    
    const subtotalCell = document.createElement('td');
    subtotalCell.className = 'text-end';
    subtotalCell.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
    
    // Add cells to row
    row.appendChild(productCell);
    row.appendChild(priceCell);
    row.appendChild(quantityCell);
    row.appendChild(subtotalCell);
    
    // Add row to table
    receiptItemsContainer.appendChild(row);
  });
});