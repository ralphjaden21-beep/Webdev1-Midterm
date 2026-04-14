const cakeData = [
    { name: "Strawberry Cake", price: 399, originalPrice: 499, promo: "Save P100", category: "Specialty", desc: "Fresh strawberry cake with creamy filling and real strawberries", img: "strawberrycake.jpeg" },
    { name: "Chocolate Cake", price: 299, originalPrice: 349, promo: "Promo P50 off", category: "Classic", desc: "Rich and decadent chocolate cake with smooth frosting", img: "chocolatecake.jpeg" },
    { name: "Customize your cake!", price: 599, originalPrice: 699, promo: "Custom deal P100 off", category: "Custom", desc: "Message us on Facebook for more info", img: "customizecake.jpeg" },
    { name: "Vanilla", price: 299, originalPrice: 339, promo: "Sweet pick P40 off", category: "Classic", desc: "Enjoy the classic taste of our vanilla cake, baked fresh and perfectly sweet", img: "vanillacake.jpeg" },
    { name: "Ube", price: 495, originalPrice: 550, promo: "Popular choice P55 off", category: "Popular", desc: "Soft and fluffy, made with rich purple yam for a sweet and creamy flavor", img: "ubecake.jpeg" },
    { name: "Manga Graham", price: 399, originalPrice: 459, promo: "Summer promo P60 off", category: "Specialty", desc: "Refreshing dessert layered with sweet mangoes, creamy filling, and crushed graham", img: "mangacake.jpeg" },
    { name: "Coffee", price: 399, originalPrice: 449, promo: "Coffee break P50 off", category: "Specialty", desc: "Soft and flavorful, made with rich coffee for a smooth and satisfying taste", img: "coffeecake.jpeg" },
    { name: "Japanese Cheesecake", price: 511, originalPrice: 575, promo: "Chef's deal P64 off", category: "Classic", desc: "Rich, creamy, and made with the finest ingredients", img: "japanesecheesecake.jpeg" },
    { name: "Red Velvet", price: 495, originalPrice: 560, promo: "Best seller P65 off", category: "Classic", desc: "Elegant red velvet cake with cream cheese frosting", img: "redvelvetcake.jpeg" },
    { name: "Carrot Cake", price: 399, originalPrice: 455, promo: "Fresh bake P56 off", category: "Classic", desc: "Moist carrot cake with walnuts and cream cheese frosting", img: "carrotcake.jpeg" },
    { name: "Black Forest", price: 599, originalPrice: 680, promo: "Premium deal P81 off", category: "Specialty", desc: "Decadent chocolate cake with cherries and whipped cream", img: "blackforrestcake.jpeg" },
    { name: "Tiramisu", price: 511, originalPrice: 590, promo: "Cafe promo P79 off", category: "Specialty", desc: "Classic Italian dessert with espresso and mascarpone layers", img: "Tiramisucake.jpeg" },
];

const banners = [
    "banner.jpeg",
    "redvelvetcake.jpeg",
    "strawberrycake.jpeg",
    "customizecake.jpeg"
];

const CART_KEY = "velvetCart";

let cart = [];
let bannerIdx = 0;
let pendingItem = null;
let currentFilter = "";
let currentCategory = "";

function formatPeso(value) {
    return `P${Number(value).toLocaleString('en-PH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })}`;
}

function buildCakeCard(cake, placeholderUrl, imgPath) {
    return `
        <div class="cake-card">
            <span class="category-tag">${cake.category}</span>
            <div class="cake-image-container">
                <img src="${imgPath}" alt="${cake.name}" class="cake-image" onerror="this.src='${placeholderUrl}'">
            </div>
            <h3 style="color: #3D2817;">${cake.name}</h3>
            <p style="font-size:0.8rem; color: #000;">${cake.desc}</p>
            <p style="margin: 10px 0 6px;">
                <span style="font-weight: bold; color: #000; font-size: 1.05rem;">${formatPeso(cake.price)}</span>
                <span style="margin-left: 8px; color: #777; text-decoration: line-through;">${formatPeso(cake.originalPrice || cake.price)}</span>
            </p>
            <p style="margin: 0 0 14px; color: #a53f2b; font-size: 0.85rem; font-weight: 600;">${cake.promo || "Fresh baked promo"}</p>
            <button class="btn-cream" onclick="askConfirm('${cake.name}', ${cake.price}, ${cake.originalPrice || cake.price})">Add to Cart</button>
        </div>`;
}

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
            const imgPath = cake.img;
            
            const html = buildCakeCard(cake, placeholderUrl, imgPath);
            
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
            const imgPath = cake.img;
            
            const html = buildCakeCard(cake, placeholderUrl, imgPath);
            
            fullGrid.innerHTML += html;
        }
    }
}

// Improved Cart Logic
function askConfirm(name, price, originalPrice = price) {
    pendingItem = { name, price, originalPrice };
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
            addToCart(name, price, qty, originalPrice);
            modal.style.display = 'none';
        }
    };

    document.getElementById('modal-no').onclick = () => {
        modal.style.display = 'none';
        pendingItem = null;
    };
}

function addToCart(name, price, qty = 1, originalPrice = price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += qty;
        existing.originalPrice = originalPrice;
    } else {
        cart.push({ name, price, originalPrice, qty, id: Date.now() });
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
    let originalTotal = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        const originalSubtotal = (item.originalPrice || item.price) * item.qty;
        list.innerHTML += `<tr style="border-bottom: 1px solid #ddd; color: #000;">
            <td style="padding: 15px; color: #000;">${item.name}</td>
            <td style="padding: 15px; text-align: center; color: #000;">${item.qty}</td>
            <td style="padding: 15px; text-align: right; color: #000;">${formatPeso(subtotal)}</td>
            <td style="padding: 15px; text-align: center;"><button onclick="removeItem(${item.id})" style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button></td>
        </tr>`;
        total += subtotal;
        originalTotal += originalSubtotal;
    });
    const discount = Math.max(0, originalTotal - total);
    const promoOriginalEl = document.getElementById('promo-original');
    const promoDiscountEl = document.getElementById('promo-discount');
    const promoBannerEl = document.getElementById('promo-banner');
    const totalEl = document.getElementById('total-price');
    if(promoOriginalEl) promoOriginalEl.innerText = formatPeso(originalTotal);
    if(promoDiscountEl) promoDiscountEl.innerText = `- ${formatPeso(discount)}`;
    if(promoBannerEl) promoBannerEl.innerText = discount > 0 ? `Promo applied: You saved ${formatPeso(discount)} today.` : 'Add cakes to unlock promo savings.';
    if(totalEl) totalEl.innerText = formatPeso(total);
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) return [];
        return parsed.map(item => ({
            ...item,
            originalPrice: item.originalPrice || item.price
        }));
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
