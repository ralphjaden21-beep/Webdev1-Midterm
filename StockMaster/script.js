// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const logoutBtns = document.querySelectorAll('#logoutBtn');

// Initialize - Check if user is authenticated
document.addEventListener('DOMContentLoaded', function() {
  const isAuthenticated = sessionStorage.getItem('stockmaster_authenticated');
  if (isAuthenticated !== 'true') {
    loginModal.style.display = 'flex';
  }
});

// Logout functionality
logoutBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    sessionStorage.removeItem('stockmaster_authenticated');
    loginModal.style.display = 'flex';
    loginForm.reset();
  });
});

// Login form submission
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Validate inputs
  if (!username || !password) {
    alert('❌ PLEASE ENTER USERNAME AND PASSWORD');
    return;
  }
  
  // Authentication successful (demo)
  sessionStorage.setItem('stockmaster_authenticated', 'true');
  loginModal.style.display = 'none';
  loginForm.reset();
  console.log('✓ System login successful');
});

// Action button handlers
document.querySelectorAll('.btn-action').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (this.closest('form')) return; // Skip form buttons
    const action = this.textContent.trim();
    console.log(`ACTION TRIGGERED: ${action}`);
  });
});

// Small button handlers
document.querySelectorAll('.btn-small').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const action = this.textContent.trim();
    console.log(`QUICK ACTION: ${action}`);
  });
});

// Search functionality
document.querySelectorAll('.search-input').forEach(input => {
  input.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    console.log(`🔍 SEARCHING: ${searchTerm}`);
  });
});

// Filter functionality
document.querySelectorAll('.filter-select').forEach(select => {
  select.addEventListener('change', function() {
    const filterValue = this.value;
    console.log(`⚙️ FILTER APPLIED: ${filterValue}`);
  });
});

// Add card click handlers
document.querySelectorAll('.add-card').forEach(card => {
  card.addEventListener('click', function() {
    console.log('➕ ADD NEW ITEM');
    alert('➕ ADDING NEW SUPPLIER');
  });
});

console.log('┌─────────────────────────────────────┐');
console.log('│  STOCKMASTER SYSTEM INITIALIZED   │');
console.log('│  Industrial Inventory Management   │');
console.log('└─────────────────────────────────────┘');
