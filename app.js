const USERS_KEY = "users";
const SESSION_KEY = "currentUser";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}


function makeToken() {
  return (crypto?.randomUUID ? crypto.randomUUID() : (Date.now() + "-" + Math.random()));
}

function setSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    token: makeToken(),         
    name: user.name,
    email: user.email,
    createdAt: Date.now()        
  }));
}

function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ===== REGISTRO =====
function handleRegister(e) {
  e.preventDefault();

  const name = document.querySelector("#reg-name").value.trim();
  const email = document.querySelector("#reg-email").value.trim();
  const pass = document.querySelector("#reg-pass").value;
  const pass2 = document.querySelector("#reg-pass2").value;

  if (!name || !email || !pass || !pass2) return alert("Completa todos los campos.");
  if (pass !== pass2) return alert("Las contraseñas no coinciden.");
  if (findUserByEmail(email)) return alert("Ese correo ya está registrado.");

  const users = getUsers();
  const newUser = {
    id: (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())),
    name,
    email,
    password: pass 
  };

  users.push(newUser);
  saveUsers(users);

  console.log("Usuario registrado:", newUser);
  alert("Registro exitoso. Ahora inicia sesión.");
  window.location.href = "login.html";
}

// ===== LOGIN =====
function handleLogin(e) {
  e.preventDefault();

  const email = document.querySelector("#login-email").value.trim();
  const pass = document.querySelector("#login-pass").value;

  if (!email || !pass) return alert("Ingresa correo y contraseña.");

  const user = findUserByEmail(email);
  if (!user || user.password !== pass) return alert("Credenciales incorrectas.");

  setSession(user); 
  console.log("Login correcto:", getSession());
  window.location.href = "home.html";
}

function requireAuth() {
  const s = getSession();
  if (!s || !s.token) window.location.href = "login.html";
}

function paintUser(selector) {
  const el = document.querySelector(selector);
  const s = getSession();
  if (el && s) el.textContent = s.name;
}

function handleLogout(e) {
  if (e) e.preventDefault();
  clearSession();
  window.location.href = "login.html";
}