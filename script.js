// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 199.99,
        rating: 4.5,
        description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life.",
        icon: "🎧"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        category: "Electronics",
        price: 299.99,
        rating: 4.2,
        description: "Track your fitness goals with GPS, heart rate monitoring, and water resistance.",
        icon: "⌚"
    },
    {
        id: 3,
        name: "Organic Cotton T-Shirt",
        category: "Clothing",
        price: 29.99,
        rating: 4.0,
        description: "Comfortable and sustainable organic cotton t-shirt in various colors.",
        icon: "👕"
    },
    {
        id: 4,
        name: "JavaScript Programming Guide",
        category: "Books",
        price: 45.99,
        rating: 4.8,
        description: "Comprehensive guide to modern JavaScript programming with practical examples.",
        icon: "📚"
    },
    {
        id: 5,
        name: "Portable Bluetooth Speaker",
        category: "Electronics",
        price: 79.99,
        rating: 4.3,
        description: "Waterproof speaker with 360-degree sound and 12-hour battery life.",
        icon: "🔊"
    },
    {
        id: 6,
        name: "Yoga Mat Premium",
        category: "Sports",
        price: 49.99,
        rating: 4.6,
        description: "Non-slip yoga mat with excellent cushioning for all types of exercises.",
        icon: "🧘"
    },
    {
        id: 7,
        name: "LED Desk Lamp",
        category: "Home",
        price: 39.99,
        rating: 4.1,
        description: "Adjustable LED desk lamp with USB charging port and touch controls.",
        icon: "💡"
    },
    {
        id: 8,
        name: "Running Shoes",
        category: "Sports",
        price: 129.99,
        rating: 4.4,
        description: "Lightweight running shoes with advanced cushioning and breathable mesh.",
        icon: "👟"
    },
    {
        id: 9,
        name: "Wireless Mouse",
        category: "Electronics",
        price: 25.99,
        rating: 4.0,
        description: "Ergonomic wireless mouse with precise tracking and long battery life.",
        icon: "🖱️"
    },
    {
        id: 10,
        name: "Indoor Plant Pot Set",
        category: "Home",
        price: 34.99,
        rating: 4.2,
        description: "Set of 3 ceramic plant pots with drainage holes and saucers.",
        icon: "🪴"
    },
    {
        id: 11,
        name: "Denim Jacket",
        category: "Clothing",
        price: 89.99,
        rating: 4.3,
        description: "Classic denim jacket made from sustainable materials with modern fit.",
        icon: "🧥"
    },
    {
        id: 12,
        name: "Cookbook Collection",
        category: "Books",
        price: 32.99,
        rating: 4.7,
        description: "Collection of healthy recipes from around the world with beautiful photography.",
        icon: "👩‍🍳"
    }
];

let filteredProducts = [...products];
let cart = [];
let isAdmin = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    loadCart();
    
    // Add event listeners for filters
    document.getElementById('category-filter').addEventListener('change', applyFilters);
    document.getElementById('sort-filter').addEventListener('change', applyFilters);
    document.getElementById('min-price').addEventListener('input', applyFilters);
    document.getElementById('max-price').addEventListener('input', applyFilters);
    document.getElementById('rating-filter').addEventListener('change', applyFilters);
    
    // Add event listener for add to cart buttons (using event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            const productName = e.target.dataset.name;
            const productPrice = parseFloat(e.target.dataset.price);
            addToCart(productId, productName, productPrice);
        }
        
        if (e.target.classList.contains('delete-btn')) {
            const productId = parseInt(e.target.dataset.id);
            deleteProduct(productId);
        }
    });
});

function displayProducts(productsToShow) {
    const grid = document.getElementById('product-grid');
    const countElement = document.getElementById('product-count');
    
    countElement.textContent = `Showing ${productsToShow.length} product${productsToShow.length !== 1 ? 's' : ''}`;
    
    if (productsToShow.length === 0) {
        grid.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters to see more results</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.icon}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <div class="product-rating">
                        <span class="stars">${generateStars(product.rating)}</span>
                        <span class="rating-value">${product.rating}</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                        Add to Cart
                    </button>
                    <button class="delete-btn ${isAdmin ? '' : 'hidden'}" data-id="${product.id}">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    if (hasHalf) {
        stars += '☆';
    }
    
    return stars;
}

function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    const ratingFilter = parseFloat(document.getElementById('rating-filter').value) || 0;

    // Filter products
    filteredProducts = products.filter(product => {
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        const matchesRating = product.rating >= ratingFilter;
        
        return matchesCategory && matchesPrice && matchesRating;
    });

    // Sort products
    filteredProducts.sort((a, b) => {
        switch (sortFilter) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'rating-asc':
                return a.rating - b.rating;
            case 'rating-desc':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    displayProducts(filteredProducts);
}

function clearAllFilters() {
    document.getElementById('category-filter').value = '';
    document.getElementById('sort-filter').value = 'name-asc';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('rating-filter').value = '';
    
    filteredProducts = [...products];
    applyFilters();
}

// Cart functionality
function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification(`${productName} added to cart!`);
}

function saveCart() {
    // Using in-memory storage only (localStorage not supported in artifacts)
    // In a real application, you would use localStorage.setItem('cart', JSON.stringify(cart))
}

function loadCart() {
    // Using in-memory storage only (localStorage not supported in artifacts)
    // In a real application, you would use JSON.parse(localStorage.getItem('cart') || '[]')
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Admin functionality
function askAdminAccess() {
    const password = prompt('Enter admin password:');
    if (password === 'admin123') {
        isAdmin = true;
        document.getElementById('admin-section').style.display = 'block';
        displayProducts(filteredProducts); // Refresh to show delete buttons
        showNotification('Admin access granted!');
    } else if (password !== null) {
        alert('Incorrect password!');
    }
}

function deleteProduct(productId) {
    if (!isAdmin) return;
    
    if (confirm('Are you sure you want to delete this product?')) {
        const index = products.findIndex(p => p.id === productId);
        if (index > -1) {
            const deletedProduct = products.splice(index, 1)[0];
            filteredProducts = filteredProducts.filter(p => p.id !== productId);
            displayProducts(filteredProducts);
            showNotification(`${deletedProduct.name} deleted successfully!`);
        }
    }
}

// Function to render products (for compatibility with admin.js)
function renderProducts(productsToRender) {
    displayProducts(productsToRender);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    .product-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
        align-items: center;
    }
`;
document.head.appendChild(style);


 // Cart state - using in-memory storage instead of localStorage for artifact compatibility
 let cartData = [
    { id: 1, name: "Wireless Bluetooth Headphones", price: 89.99, qty: 2 },
    { id: 2, name: "USB-C Cable 6ft", price: 15.99, qty: 1 },
    { id: 3, name: "Portable Phone Charger", price: 29.99, qty: 1 }
  ];

  // Load and display cart items
  function displayCart() {
    const cartContainer = document.getElementById("cart-items");
    
    if (cartData.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart">
          <h3>Your cart is currently empty</h3>
          <p>Add some items to your cart to get started!</p>
          <a href="index.html" class="add-to-cart" style="margin-top: 1rem; display: inline-block; padding: 12px 24px; text-decoration: none;">Continue Shopping</a>
        </div>
      `;
      return;
    }

    let total = 0;

    const cartHTML = `
      <table class="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${cartData.map(item => {
            const itemTotal = item.qty * item.price;
            total += itemTotal;
            return `
              <tr>
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                  </div>
                </td>
                <td>${itemTotal.toFixed(2)}</td>
                <td>
                  <button class="delete-btn" onclick="removeItem(${item.id})">Remove</button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
        <tfoot>
          <tr class="cart-total">
            <td colspan="3">Grand Total</td>
            <td>${total.toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div class="cart-actions">
        <a href="index.html" class="btn-continue">Continue Shopping</a>
        <button class="btn-primary" onclick="checkout()">Proceed to Checkout</button>
        <button class="btn-clear" onclick="clearCart()">Clear Cart</button>
      </div>
    `;

    cartContainer.innerHTML = cartHTML;
  }

  // Update item quantity
  function updateQuantity(itemId, change) {
    const item = cartData.find(item => item.id === itemId);
    if (item) {
      item.qty += change;
      if (item.qty <= 0) {
        removeItem(itemId);
      } else {
        displayCart();
      }
    }
  }

  // Remove item from cart
  function removeItem(itemId) {
    cartData = cartData.filter(item => item.id !== itemId);
    displayCart();
  }

  // Clear entire cart
  function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
      cartData = [];
      displayCart();
    }
  }

  // Checkout function
  function checkout() {
    if (cartData.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    const total = cartData.reduce((sum, item) => sum + (item.qty * item.price), 0);
    alert(`Proceeding to checkout with total: $${total.toFixed(2)}`);
    // In a real application, this would redirect to a checkout page
  }

  // Initialize cart display when page loads
  document.addEventListener("DOMContentLoaded", displayCart);