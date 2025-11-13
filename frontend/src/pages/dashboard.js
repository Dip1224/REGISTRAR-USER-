import { supabase, PERSONAS_TABLE } from "../lib/supabaseClient.js";

const totalPersonas = document.getElementById("total-personas");
const personasActivas = document.getElementById("personas-activas");
const listaPersonas = document.getElementById("lista-personas");

async function init() {
  await cargarPersonas();
}

async function cargarPersonas() {
  try {
    listaPersonas.innerHTML = '<p class="loading">Cargando...</p>';

    console.log('Intentando cargar personas desde Supabase...');
    
    const { data, error } = await supabase
      .from(PERSONAS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    console.log('Respuesta de Supabase:', { data, error });

    if (error) {
      console.error('Error de Supabase:', error);
      throw error;
    }

    const personas = data || [];
    console.log(`Se encontraron ${personas.length} personas`);

    totalPersonas.textContent = personas.length;
    personasActivas.textContent = personas.length; // Todas están activas por defecto

    if (personas.length === 0) {
      listaPersonas.innerHTML =
        '<p class="loading">No hay personas registradas aun</p>';
      return;
    }

    listaPersonas.innerHTML = personas
      .map(
        (persona) => `
            <div class="persona-card">
                <img src="${persona.foto_url}" alt="${persona.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect width=%22200%22 height=%22200%22 fill=%22%23ddd%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22%23999%22>Sin foto</text></svg>'">
                <h4>${persona.nombre}</h4>
                ${
                  persona.edad
                    ? `<p style="font-size: 0.85rem; color: #64748b;">Edad: ${persona.edad}</p>`
                    : ""
                }
                ${
                  persona.genero
                    ? `<span class="badge activo">${
                        persona.genero === "M" ? "Masculino" : "Femenino"
                      }</span>`
                    : ""
                }
                <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;">
                    ${formatearFecha(persona.created_at)}
                </p>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error al cargar personas:", error);
    listaPersonas.innerHTML = `
            <p class="loading" style="color: #ef4444;">
                Error al cargar datos desde Supabase: ${error.message || 'Error desconocido'}
            </p>
        `;
  }
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const opciones = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return fecha.toLocaleDateString("es-ES", opciones);
}

init();
setInterval(cargarPersonas, 30000);
