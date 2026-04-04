// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.querySelectorAll('#logoutBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const twofaForm = document.getElementById('twofaForm');
const backToLoginBtn = document.getElementById('backToLoginBtn');

// Initialize - Check if user is authenticated
document.addEventListener('DOMContentLoaded', function() {
  const isAuthenticated = sessionStorage.getItem('ledgerflow_authenticated');
  if (isAuthenticated !== 'true') {
    loginModal.style.display = 'flex';
  }
});

// Logout functionality
logoutBtn.forEach(btn => {
  btn.addEventListener('click', function() {
    sessionStorage.removeItem('ledgerflow_authenticated');
    loginModal.style.display = 'flex';
    loginForm.style.display = 'flex';
    twofaForm.style.display = 'none';
    loginForm.reset();
    twofaForm.reset();
  });
});

// Login form submission
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Validate inputs
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  // Show 2FA form
  setTimeout(() => {
    loginForm.style.display = 'none';
    twofaForm.style.display = 'flex';
    document.getElementById('twofa-code').focus();
  }, 300);
});

// 2FA form submission
twofaForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const code = document.getElementById('twofa-code').value;
  
  // Validate 2FA code
  if (code.length !== 6 || isNaN(code)) {
    alert('Please enter a valid 6-digit code');
    return;
  }
  
  // Simulate 2FA verification
  if (code === '123456' || code.match(/^\d{6}$/)) {
    // Authentication successful
    sessionStorage.setItem('ledgerflow_authenticated', 'true');
    loginModal.style.display = 'none';
    loginForm.reset();
    twofaForm.reset();
    loginForm.style.display = 'flex';
    
    // Show success message
    alert('✓ Authentication successful! Welcome to LedgerFlow.');
  } else {
    alert('Invalid authentication code. Please try again.');
  }
});

// Back to login button
backToLoginBtn.addEventListener('click', function(e) {
  e.preventDefault();
  twofaForm.style.display = 'none';
  loginForm.style.display = 'flex';
  loginForm.reset();
  twofaForm.reset();
});

// Format 2FA code input (only numbers)
document.getElementById('twofa-code').addEventListener('input', function(e) {
  this.value = this.value.replace(/[^0-9]/g, '');
  if (this.value.length === 6) {
    // Auto-submit when 6 digits are entered
    // Commented out for user preference
    // twofaForm.dispatchEvent(new Event('submit'));
  }
});

// Action button handlers
document.querySelectorAll('.btn-action').forEach(btn => {
  btn.addEventListener('click', function() {
    const action = this.textContent.trim();
    console.log(`Action: ${action}`);
    // Add your action handlers here
  });
});

// Add to cart / action handlers
document.querySelectorAll('.btn-action-small').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const action = this.textContent.trim();
    console.log(`Quick action: ${action}`);
  });
});

// Search functionality
document.querySelectorAll('.search-input').forEach(input => {
  input.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    console.log(`Searching for: ${searchTerm}`);
    // Add your search logic here
  });
});

// Filter functionality
document.querySelectorAll('.filter-select').forEach(select => {
  select.addEventListener('change', function() {
    const filterValue = this.value;
    console.log(`Filter changed to: ${filterValue}`);
    // Add your filter logic here
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Escape key - close modals
  if (e.key === 'Escape' && loginModal.style.display === 'flex') {
    // Don't allow closing without authentication
  }
});

console.log('LedgerFlow app loaded successfully!');
console.log('Demo 2FA code: 123456');
