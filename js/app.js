const STORAGE = "pacientes";

const tabla = document.getElementById("tablaPacientes");
const badgeConteos = document.getElementById("conteos");
const filtro = document.getElementById("filtroEstado");

function getLista() {
  return JSON.parse(localStorage.getItem(STORAGE)) || [];
}

function setLista(lista) {
  localStorage.setItem(STORAGE, JSON.stringify(lista));
}

function renderizar() {
  let lista = getLista();

  // aplica filtro
  const sel = filtro.value;
  if (sel !== "todos") {
    lista = lista.filter(p => p.gravedad === sel);
  }

  const orden = { critico: 0, urgente: 1, moderado: 2, leve: 3 };
  lista.sort((a, b) => orden[a.gravedad] - orden[b.gravedad]);

  tabla.innerHTML = "";
  const conteo = { critico: 0, urgente: 0, moderado: 0, leve: 0 };

  lista.forEach(p => {
    conteo[p.gravedad]++;
    const tr = document.createElement("tr");
    tr.className = `triaje-${p.gravedad}`;
    tr.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.edad}</td>
      <td>${p.genero}</td>
      <td>${p.documento}</td>
      <td>${p.sintomas}</td>
      <td>${p.gravedad.toUpperCase()}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminar('${p.id}')">🗑️</button>
      </td>
    `;
    tabla.appendChild(tr);
  });

  badgeConteos.innerHTML = Object.entries(conteo).map(([g, c]) => {
    const color = g === "critico" ? "danger" : g === "urgente" ? "warning" : g === "moderado" ? "info" : "success";
    return `<span class="badge bg-${color} me-1">${g}: ${c}</span>`;
  }).join("");
}

function eliminar(id) {
  const lista = getLista().filter(p => p.id !== id);
  setLista(lista);
  renderizar();
}

document.getElementById("formularioPaciente").addEventListener("submit", e => {
  e.preventDefault();
  const datos = {
    id: crypto.randomUUID(),
    nombre: document.getElementById("nombre").value.trim(),
    edad: +document.getElementById("edad").value,
    genero: document.getElementById("genero").value,
    documento: document.getElementById("documento").value.trim(),
    sintomas: document.getElementById("sintomas").value.trim(),
    gravedad: document.getElementById("gravedad").value,
    tratamiento: document.getElementById("tratamiento").value.trim(),
    medicamentos: document.getElementById("medicamentos").value.trim(),
    examenes: document.getElementById("examenes").value
  };

  if (datos.documento.length < 5) {
    alert("Documento inválido");
    return;
  }

  const lista = getLista();
  lista.push(datos);
  setLista(lista);

  if (datos.gravedad === "critico") {
    const toastEl = document.getElementById("toastCritico");
    bootstrap.Toast.getOrCreateInstance(toastEl).show();
  }

  renderizar();
  e.target.reset();
});

// eventos
window.addEventListener("DOMContentLoaded", () => {
  filtro.addEventListener("change", renderizar);
  renderizar();
});
