// ===============================
// admin.js (Fixed and Enhanced)
// ===============================

// Admin-specific functionality for adding new products

document.addEventListener('DOMContentLoaded', function() {
    // Get the correct form ID from HTML
    const addProductForm = document.querySelector('#product-form');
    
    addProductForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.querySelector('#product-name').value.trim();
        const category = document.querySelector('#product-category').value.trim();
        const price = parseFloat(document.querySelector('#product-price').value);
        const emoji = document.querySelector('#product-emoji').value.trim() || '📦';

        // Validation
        if (!name || !category || isNaN(price) || price <= 0) {
            alert('Please fill all required fields with valid data.');
            return;
        }

        // Generate a new unique ID
        const newId = Math.max(...products.map(p => p.id)) + 1;

        // Create new product object
        const newProduct = {
            id: newId,
            name: name,
            category: category,
            price: price,
            rating: 4.0, // Default rating for new products
            description: `New ${category.toLowerCase()} product: ${name}`,
            icon: emoji
        };

        // Add to products array
        products.push(newProduct);
        
        // Update filtered products and display
        filteredProducts = [...products];
        renderProducts(filteredProducts);
        
        // Reset form
        addProductForm.reset();
        
        // Show success notification
        showNotification('Product added successfully!');
        
        console.log('Product added:', newProduct);
    });
});

// Function to validate admin access (called from HTML button)
function validateAdmin() {
    return isAdmin;
}

// Function to toggle admin features visibility
function toggleAdminFeatures(show) {
    const adminSection = document.getElementById('admin-section');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    if (adminSection) {
        adminSection.style.display = show ? 'block' : 'none';
    }
    
    deleteButtons.forEach(btn => {
        btn.classList.toggle('hidden', !show);
    });
}

// Enhanced product management functions
function editProduct(productId) {
    if (!isAdmin) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newName = prompt('Enter new product name:', product.name);
    if (newName === null) return;
    
    const newPrice = prompt('Enter new price:', product.price);
    if (newPrice === null) return;
    
    const parsedPrice = parseFloat(newPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
        alert('Please enter a valid price.');
        return;
    }
    
    const newCategory = prompt('Enter new category:', product.category);
    if (newCategory === null) return;
    
    // Update product
    product.name = newName.trim();
    product.price = parsedPrice;
    product.category = newCategory.trim();
    
    // Refresh display
    applyFilters();
    showNotification(`${product.name} updated successfully!`);
}

// Bulk operations for admin
function deleteAllProducts() {
    if (!isAdmin) return;
    
    if (confirm('Are you sure you want to delete ALL products? This cannot be undone!')) {
        products.length = 0; // Clear the array
        filteredProducts.length = 0;
        displayProducts([]);
        showNotification('All products deleted!');
    }
}

function exportProducts() {
    if (!isAdmin) return;
    
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'products_export.json';
    link.click();
    
    showNotification('Products exported successfully!');
}

// Admin statistics
function getProductStats() {
    if (!isAdmin) return null;
    
    const totalProducts = products.length;
    const categories = [...new Set(products.map(p => p.category))];
    const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts;
    const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / totalProducts;
    
    return {
        totalProducts,
        totalCategories: categories.length,
        categories,
        averagePrice: avgPrice.toFixed(2),
        averageRating: avgRating.toFixed(1)
    };
}

function showProductStats() {
    if (!isAdmin) return;
    
    const stats = getProductStats();
    const message = `
Product Statistics:
- Total Products: ${stats.totalProducts}
- Categories: ${stats.totalCategories} (${stats.categories.join(', ')})
- Average Price: $${stats.averagePrice}
- Average Rating: ${stats.averageRating} stars
    `;
    
    alert(message);
}

// Initialize admin features when the script loads
if (typeof isAdmin !== 'undefined' && isAdmin) {
    toggleAdminFeatures(true);
}