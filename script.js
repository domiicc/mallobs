const data = [
  // Tu misma estructura de semestres y ramos que ya te entregué arriba (idéntica).
  // Puedes copiarla desde el script anterior.
];

const estadoRamos = {};
const indexRamos = {};
const dependientes = {};

function inicializarIndices() {
  data.forEach(sem => {
    sem.ramos.forEach(ramo => {
      indexRamos[ramo.nombre] = ramo;
      estadoRamos[ramo.nombre] = "bloqueado";
    });
  });
}

function construirDependientes() {
  for (const ramoNombre in indexRamos) {
    dependientes[ramoNombre] = [];
  }
  for (const ramoNombre in indexRamos) {
    const requisitos = indexRamos[ramoNombre].requisitos;
    requisitos.forEach(req => {
      if (dependientes[req]) dependientes[req].push(ramoNombre);
    });
  }
}

function requisitosCumplidos(ramoNombre) {
  const requisitos = indexRamos[ramoNombre].requisitos;
  return requisitos.every(r => estadoRamos[r] === "aprobado");
}

function actualizarEstados() {
  for (const ramoNombre in estadoRamos) {
    if (estadoRamos[ramoNombre] !== "aprobado") {
      estadoRamos[ramoNombre] = requisitosCumplidos(ramoNombre) ? "desbloqueado" : "bloqueado";
    }
  }
}

function renderizarMalla() {
  const container = document.getElementById("malla-container");
  container.innerHTML = "";

  data.forEach(sem => {
    const divSem = document.createElement("div");
    divSem.className = "semestre";

    const titulo = document.createElement("h2");
    titulo.textContent = sem.semestre;
    divSem.appendChild(titulo);

    sem.ramos.forEach(ramo => {
      const divRamo = document.createElement("div");
      divRamo.className = "ramo " + estadoRamos[ramo.nombre];
      divRamo.textContent = ramo.nombre;
      divRamo.title = "Requisitos: " + (ramo.requisitos.length ? ramo.requisitos.join(", ") : "Ninguno");

      if (estadoRamos[ramo.nombre] === "desbloqueado") {
        divRamo.addEventListener("click", () => aprobarRamo(ramo.nombre));
      } else if (estadoRamos[ramo.nombre] === "aprobado") {
        divRamo.addEventListener("click", () => desaprobarRamo(ramo.nombre));
      }

      divSem.appendChild(divRamo);
    });

    container.appendChild(divSem);
  });
}

function aprobarRamo(nombre) {
  if (estadoRamos[nombre] === "desbloqueado") {
    estadoRamos[nombre] = "aprobado";
    guardarProgreso();
    actualizarEstados();
    renderizarMalla();
  }
}

function desaprobarRamo(nombre) {
  if (estadoRamos[nombre] === "aprobado") {
    estadoRamos[nombre] = "bloqueado";
    guardarProgreso();
    actualizarEstados();
    renderizarMalla();
  }
}

function guardarProgreso() {
  localStorage.setItem("estadoMalla", JSON.stringify(estadoRamos));
}

function cargarProgreso() {
  const guardado = localStorage.getItem("estadoMalla");
  if (guardado) {
    const estadoGuardado = JSON.parse(guardado);
    for (const ramo in estadoGuardado) {
      estadoRamos[ramo] = estadoGuardado[ramo];
    }
  }
}

function iniciar() {
  inicializarIndices();
  construirDependientes();
  cargarProgreso();
  actualizarEstados();
  renderizarMalla();
}

window.onload = iniciar;
