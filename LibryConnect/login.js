const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginMessage = document.getElementById("loginMessage");
const validPassword = "library123";
const storageKey = "libryconnect-auth";

if (localStorage.getItem(storageKey)) {
  window.location.href = "index.html";
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email) {
    loginMessage.textContent = "Enter your library email to continue.";
    emailInput.focus();
    return;
  }

  if (password !== validPassword) {
    loginMessage.textContent = "Password incorrect. Use library123 for this demo.";
    passwordInput.focus();
    passwordInput.select();
    return;
  }

  localStorage.setItem(storageKey, email);
  loginMessage.textContent = "";
  window.location.href = "index.html";
});
