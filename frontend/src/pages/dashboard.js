import { supabase, PERSONAS_TABLE } from '../lib/supabaseClient.js';

const totalPersonas = document.getElementById('total-personas');
const personasActivas = document.getElementById('personas-activas');
const listaPersonas = document.getElementById('lista-personas');

async function init() {
    await cargarPersonas();
}

async function cargarPersonas() {
    try {
        listaPersonas.innerHTML = '<p class="loading">Cargando...</p>';

        const { data, error } = await supabase
            .from(PERSONAS_TABLE)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        const personas = data || [];

        totalPersonas.textContent = personas.length;
        personasActivas.textContent = personas.length; // Todas están activas por defecto

        if (personas.length === 0) {
            listaPersonas.innerHTML = '<p class="loading">No hay personas registradas aun</p>';
            return;
        }

        listaPersonas.innerHTML = personas.map(persona => `
            <div class="persona-card">
                <img src="${persona.foto_url}" alt="${persona.nombre}">
                <h4>${persona.nombre}</h4>
                ${persona.edad ? `<p style="font-size: 0.85rem; color: #64748b;">Edad: ${persona.edad}</p>` : ''}
                ${persona.genero ? `<span class="badge activo">${persona.genero === 'M' ? 'Masculino' : 'Femenino'}</span>` : ''}
                <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;">
                    ${formatearFecha(persona.created_at)}
                </p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar personas:', error);
        listaPersonas.innerHTML = `
            <p class="loading" style="color: #ef4444;">
                Error al cargar datos desde Supabase. Revisa tu conexion.
            </p>
        `;
    }
}

function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
}

init();
setInterval(cargarPersonas, 30000);
