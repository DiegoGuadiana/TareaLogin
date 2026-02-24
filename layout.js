async function loadPartial(id, file) {
  const el = document.getElementById(id);
  if (!el) return;
  const res = await fetch(file);
  el.innerHTML = await res.text();
}

function updateHeaderUI() {
  const session = getSession(); 
  const userArea = document.getElementById("user-area");
  const nameEl = document.getElementById("user-name-h");
  const emailEl = document.getElementById("user-email-h");

  const authLinks = document.querySelectorAll('[data-auth="true"]');
  const guestLinks = document.querySelectorAll('[data-guest="true"]');

  if (session) {
    // mostrar usuario
    if (userArea) userArea.style.display = "flex";
    if (nameEl) nameEl.textContent = session.name;
    if (emailEl) emailEl.textContent = session.email;

    // ocultar login/registro
    guestLinks.forEach(a => a.style.display = "none");
    authLinks.forEach(a => a.style.display = "inline-block");

    // logout
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) logoutLink.addEventListener("click", handleLogout);
  } else {
    // no logueado
    if (userArea) userArea.style.display = "none";
    guestLinks.forEach(a => a.style.display = "inline-block");
    authLinks.forEach(a => a.style.display = "none");
  }
}


async function initLayout() {
  await loadPartial("header-slot", "header.html");
  await loadPartial("footer-slot", "footer.html");
  updateHeaderUI();
}