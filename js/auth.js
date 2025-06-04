
// ---- gestión de usuarios en localStorage ----
const USERS_KEY = "usuarios";

function guardarUsuario(email, pass) {
  const lista = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  if (lista.some(u => u.email === email)) throw new Error("El usuario ya existe");
  lista.push({ email, pass });
  localStorage.setItem(USERS_KEY, JSON.stringify(lista));
}

function autenticar(email, pass) {
  const lista = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  return lista.some(u => u.email === email && u.pass === pass);
}

document.addEventListener("DOMContentLoaded", () => {
  // ---- elementos ----
  const loginForm = document.getElementById("loginForm");
  const crearBtn  = document.getElementById("crearCuenta");
  const registerModalEl = document.getElementById("registerModal");
  const registerForm = document.getElementById("registerForm");
  const modalReg = new bootstrap.Modal(registerModalEl);

  // ---- eventos ----
  crearBtn.addEventListener("click", () => modalReg.show());

  // login existente
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const pass  = document.getElementById("password").value;
    if (autenticar(email, pass)) {
      sessionStorage.setItem("usuario", email);
      window.location.href = "panel.html";
    } else {
      alert("Credenciales incorrectas");
    }
  });

  // creación de cuenta
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value.trim();
    const pass  = document.getElementById("regPass").value;
    const pass2 = document.getElementById("regPass2").value;

    if (pass !== pass2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      guardarUsuario(email, pass);
      modalReg.hide();
      sessionStorage.setItem("usuario", email);
      window.location.href = "panel.html";
    } catch (err) {
      alert(err.message);
    }
  });
});
