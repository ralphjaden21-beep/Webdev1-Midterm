// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const closeLoginBtn = document.getElementById('closeLoginBtn');
const loginDrawer = document.getElementById('loginDrawer');
const overlay = document.getElementById('overlay');
const loginForm = document.getElementById('loginForm');

// Event Listeners
loginBtn.addEventListener('click', openLoginDrawer);
closeLoginBtn.addEventListener('click', closeLoginDrawer);
overlay.addEventListener('click', closeLoginDrawer);

function openLoginDrawer() {
  loginDrawer.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLoginDrawer() {
  loginDrawer.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Handle form submission
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  // Placeholder for form submission logic
  alert('Login attempt - this is a demo!');
  closeLoginDrawer();
  loginForm.reset();
});

// Social button handling
document.querySelectorAll('.btn-social').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    alert(this.textContent + ' - Demo mode');
  });
});

// Close drawer with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && loginDrawer.classList.contains('active')) {
    closeLoginDrawer();
  }
});

// Handle add to cart buttons
document.querySelectorAll('.btn-add').forEach(button => {
  button.addEventListener('click', function() {
    alert('Added to cart - Demo mode');
  });
});

// Handle meal/plan selection buttons
document.querySelectorAll('.btn-select').forEach(button => {
  button.addEventListener('click', function() {
    alert('Plan selected - Demo mode');
  });
});

console.log('Freshbite app loaded successfully!');
