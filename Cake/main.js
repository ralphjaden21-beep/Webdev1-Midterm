const cakeData = [
    { name: "Strawberry Cake", price: 45, category: "Specialty", desc: "Fresh strawberry cake with creamy filling and real strawberries", img: "chocolate.jfif" },
    { name: "Chocolate Cake", price: 35, category: "Classic", desc: "Rich and decadent chocolate cake with smooth frosting", img: "strawberry.jfif" },
    { name: "Customize your cake!", price: 50, category: "Custom", desc: "Message us on Facebook for more info", img: "customize.jfif" },
    { name: "Vanilla", price: 35, category: "Classic", desc: "Enjoy the classic taste of our vanilla cake, baked fresh and perfectly sweet", img: "customize.jfif" },
    { name: "Ube", price: 45, category: "Popular", desc: "Soft and fluffy, made with rich purple yam for a sweet and creamy flavor", img: "strawberry.jfif" },
    { name: "Manga Graham", price: 40, category: "Specialty", desc: "Refreshing dessert layered with sweet mangoes, creamy filling, and crushed graham", img: "customize.jfif" },
    { name: "Coffee", price: 40, category: "Specialty", desc: "Soft and flavorful, made with rich coffee for a smooth and satisfying taste", img: "chocolate.jfif" },
    { name: "Japanese Cheesecake", price: 38, category: "Classic", desc: "Rich, creamy, and made with the finest ingredients", img: "strawberry.jfif" },
    { name: "Red Velvet", price: 42, category: "Classic", desc: "Elegant red velvet cake with cream cheese frosting", img: "chocolate.jfif" },
    { name: "Carrot Cake", price: 38, category: "Classic", desc: "Moist carrot cake with walnuts and cream cheese frosting", img: "customize.jfif" },
    { name: "Black Forest", price: 48, category: "Specialty", desc: "Decadent chocolate cake with cherries and whipped cream", img: "chocolate.jfif" },
    { name: "Tiramisu", price: 44, category: "Specialty", desc: "Classic Italian dessert with espresso and mascarpone layers", img: "strawberry.jfif" },
];

const banners = [
    "images/banner.jpeg",
    "images/chocolate.jfif",
    "images/strawberry.jfif",
    "images/customize.jfif"
];

const CART_KEY = "velvetCart";

let cart = [];
let bannerIdx = 0;
let pendingItem = null;
let currentFilter = "";
let currentCategory = "";

// Initialization function
function initApp() {
    console.log("App initializing...", "cakeData length:", cakeData.length);
    
    cart = loadCartFromStorage();
    updateCartCountDisplay();
    
    // Check login status and update navbar
    checkLoginStatus();

    renderCakes();
    
    // Setup Search Event
    const searchBar = document.querySelector('.search-bar');
    if(searchBar) {
        searchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            currentFilter = term;
            applyFilters();
        });
    }

    setInterval(rotateBanner, 4000);

    // If we're on the summary page, render existing cart data.
    updateCart();
    
    console.log("App initialization complete");
}

// Multiple ways to initialize in case window.onload doesn't fire
window.onload = initApp;
document.addEventListener('DOMContentLoaded', initApp);
setTimeout(initApp, 100);

// Unified Render Function with Filter
function renderCakes(filter = "") {
    console.log("renderCakes called with filter:", filter);
    
    const fullGrid = document.getElementById('full-grid');
    const trendGrid = document.getElementById('trending-grid');
    
    // Clear grids
    if(fullGrid) {
        fullGrid.innerHTML = '';
    }
    if(trendGrid) {
        trendGrid.innerHTML = '';
    }

    let trendingCount = 0;
    
    // Loop through all cakes
    for(let i = 0; i < cakeData.length; i++) {
        const cake = cakeData[i];
        
        // Check if cake matches filter
        const nameMatch = cake.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        const categoryMatch = cake.category.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        const noFilter = filter === "";
        
        const shouldShow = nameMatch || categoryMatch || noFilter;
        
        if(shouldShow) {
            const placeholderUrl = `https://via.placeholder.com/300x200?text=${encodeURIComponent(cake.name)}`;
            const imgPath = `images/${cake.img}`;
            
            const html = `
                <div class="cake-card">
                    <span class="category-tag">${cake.category}</span>
                    <div class="cake-image-container">
                        <img src="${imgPath}" alt="${cake.name}" class="cake-image" onerror="this.src='${placeholderUrl}'">
                    </div>
                    <h3 style="color: #3D2817;">${cake.name}</h3>
                    <p style="font-size:0.8rem; color: #000;">${cake.desc}</p>
                    <p><strong style="color: #000;">$${cake.price}</strong></p>
                    <button class="btn-cream" onclick="askConfirm('${cake.name}', ${cake.price})">Add to Cart</button>
                </div>`;
            
            // Add to shop grid (full-grid) - ALL matching items
            if(fullGrid) {
                fullGrid.innerHTML += html;
            }
            
            // Add to home page trending grid - FIRST 3 items only when NO FILTER
            if(trendGrid && filter === "" && trendingCount < 3) {
                trendGrid.innerHTML += html;
                trendingCount++;
            }
        }
    }
    
    console.log("renderCakes complete. fullGrid items:", fullGrid ? fullGrid.children.length : 0, "trendGrid items:", trendGrid ? trendGrid.children.length : 0);
}

function rotateBanner() {
    bannerIdx = (bannerIdx + 1) % banners.length;
    const img = document.getElementById('carousel-img');
    if(img) {
        img.style.opacity = 0;
        setTimeout(() => {
            img.src = banners[bannerIdx];
            img.style.opacity = 1;
        }, 500);
    }
}

// Filter by Category
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active button styling
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    applyFilters();
}

// Apply combined filters (search + category)
function applyFilters() {
    const fullGrid = document.getElementById('full-grid');
    if(!fullGrid) return;
    
    fullGrid.innerHTML = '';
    
    // Loop through all cakes
    for(let i = 0; i < cakeData.length; i++) {
        const cake = cakeData[i];
        
        // Check search match
        const searchMatch = currentFilter === '' || 
                           cake.name.toLowerCase().indexOf(currentFilter.toLowerCase()) !== -1 ||
                           cake.category.toLowerCase().indexOf(currentFilter.toLowerCase()) !== -1;
        
        // Check category match
        const categoryMatch = currentCategory === '' || cake.category === currentCategory;
        
        if(searchMatch && categoryMatch) {
            const placeholderUrl = `https://via.placeholder.com/300x200?text=${encodeURIComponent(cake.name)}`;
            const imgPath = `images/${cake.img}`;
            
            const html = `
                <div class="cake-card">
                    <span class="category-tag">${cake.category}</span>
                    <div class="cake-image-container">
                        <img src="${imgPath}" alt="${cake.name}" class="cake-image" onerror="this.src='${placeholderUrl}'">
                    </div>
                    <h3 style="color: #3D2817;">${cake.name}</h3>
                    <p style="font-size:0.8rem; color: #000;">${cake.desc}</p>
                    <p><strong style="color: #000;">$${cake.price}</strong></p>
                    <button class="btn-cream" onclick="askConfirm('${cake.name}', ${cake.price})">Add to Cart</button>
                </div>`;
            
            fullGrid.innerHTML += html;
        }
    }
}

// Improved Cart Logic
function askConfirm(name, price) {
    pendingItem = { name, price };
    const modal = document.getElementById('cart-modal');
    const msg = document.getElementById('modal-msg');
    const qtyBox = document.getElementById('qty-box');

    msg.innerText = `Add ${name} to your cart?`;
    msg.style.color = '#000';
    qtyBox.style.display = 'none';
    modal.style.display = 'flex';
    
    document.getElementById('modal-yes').onclick = () => {
        if (qtyBox.style.display === 'none') {
            msg.innerText = "How many would you like?";
            qtyBox.style.display = 'block';
        } else {
            const qty = parseInt(document.getElementById('item-qty').value) || 1;
            addToCart(name, price, qty);
            modal.style.display = 'none';
        }
    };

    document.getElementById('modal-no').onclick = () => {
        modal.style.display = 'none';
        pendingItem = null;
    };
}

function addToCart(name, price, qty = 1) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty, id: Date.now() });
    }
    saveCartToStorage();
    updateCartCountDisplay();
}

function closeModal() {
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('item-qty').value = 1;
    pendingItem = null;
}

// Toast Notification Logic
function showToast(message) {
    let toast = document.getElementById('toast');
    if(!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:var(--cream); color:black; padding:15px 25px; border-radius:30px; box-shadow:0 10px 20px rgba(0,0,0,0.2); z-index:3000; font-weight:bold;";
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

function updateCart() {
    updateCartCountDisplay();
    const list = document.getElementById('cart-items');
    if(!list) return;
    
    list.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const subtotal = (item.price * item.qty).toFixed(2);
        list.innerHTML += `<tr style="border-bottom: 1px solid #ddd; color: #000;">
            <td style="padding: 15px; color: #000;">${item.name}</td>
            <td style="padding: 15px; text-align: center; color: #000;">${item.qty}</td>
            <td style="padding: 15px; text-align: right; color: #000;">$${subtotal}</td>
            <td style="padding: 15px; text-align: center;"><button onclick="removeItem(${item.id})" style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button></td>
        </tr>`;
        total += parseFloat(subtotal);
    });
    const totalEl = document.getElementById('total-price');
    if(totalEl) totalEl.innerText = total.toFixed(2);
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        return [];
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
        // Ignore storage errors (private mode, quota, etc.)
    }
}

function getCartQtyCount() {
    return cart.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0);
}

function updateCartCountDisplay() {
    const count = getCartQtyCount();
    document.querySelectorAll('#cart-count').forEach((el) => {
        el.innerText = count;
    });
    saveCartToStorage();
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Check if user is logged in and update navbar
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    
    // Find the login link in navbar
    const navLinks = document.querySelectorAll('nav a');
    let loginLink = null;
    
    for(let link of navLinks) {
        if(link.href.includes('login.html')) {
            loginLink = link;
            break;
        }
    }
    
    if(isLoggedIn && loginLink && userEmail) {
        // User is logged in - show email and logout option
        loginLink.textContent = userEmail + ' (Logout)';
        loginLink.href = '#';
        loginLink.style.cursor = 'pointer';
        loginLink.onclick = function(e) {
            e.preventDefault();
            handleLogout();
        };
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}
