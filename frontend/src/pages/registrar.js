import {
  supabase,
  PERSONAS_TABLE,
  ROSTROS_BUCKET,
} from "../lib/supabaseClient.js";

const STORAGE_BUCKET = ROSTROS_BUCKET;
const PERSON_TABLE = PERSONAS_TABLE;

const webcam = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const btnCambiarCamara = document.getElementById("btn-cambiar-camara");
const btnCapturar = document.getElementById("btn-capturar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnRegistrar = document.getElementById("btn-registrar");
const inputNombre = document.getElementById("nombre");
const previewSection = document.getElementById("preview-section");
const fotoPreview = document.getElementById("foto-preview");
const deteccionInfo = document.getElementById("deteccion-info");
const mensaje = document.getElementById("mensaje");

let stream = null;
let fotoCapturada = null;
let camarasDisponibles = [];
let camaraActual = 0;
let usarCamaraFrontal = false; // Para móviles

async function init() {
  try {
    await obtenerCamaras();
    await iniciarCamara();
  } catch (error) {
    mostrarMensaje("Error al acceder a la camara: " + error.message, "error");
    console.error("Error detallado:", error);
  }
}

async function obtenerCamaras() {
  try {
    const dispositivos = await navigator.mediaDevices.enumerateDevices();
    camarasDisponibles = dispositivos.filter((d) => d.kind === "videoinput");

    if (camarasDisponibles.length > 1) {
      btnCambiarCamara.style.display = "block";
    }
  } catch (error) {
    console.error("Error al obtener camaras:", error);
  }
}

async function iniciarCamara() {
  try {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // Detectar si es móvil
    const esMobil =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    let constraints;

    if (esMobil) {
      // Para móviles, usar facingMode
      constraints = {
        video: {
          facingMode: usarCamaraFrontal ? "user" : "environment",
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
        audio: false,
      };
    } else {
      // Para desktop, usar deviceId
      constraints = {
        video: {
          deviceId: camarasDisponibles[camaraActual]?.deviceId,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      };
    }

    console.log("Intentando acceder a la cámara con:", constraints);

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    webcam.srcObject = stream;

    // Invertir video solo en cámara frontal
    if ((esMobil && usarCamaraFrontal) || (!esMobil && camaraActual === 0)) {
      webcam.style.transform = "scaleX(-1)";
    } else {
      webcam.style.transform = "scaleX(1)";
    }

    // Esperar a que el video esté listo
    await new Promise((resolve) => {
      webcam.onloadedmetadata = () => {
        webcam.play();
        resolve();
      };
    });

    const tipoCamara = esMobil
      ? usarCamaraFrontal
        ? "frontal"
        : "trasera"
      : `${camaraActual + 1}`;
    mostrarMensaje(`Camara ${tipoCamara} iniciada correctamente`, "info");
    setTimeout(() => (mensaje.style.display = "none"), 3000);
  } catch (error) {
    console.error("Error al iniciar cámara:", error);
    mostrarMensaje(
      "No se pudo acceder a la camara. Error: " + error.message,
      "error"
    );
  }
}

btnCambiarCamara.addEventListener("click", async () => {
  const esMobil =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (esMobil) {
    // En móvil, cambiar entre frontal y trasera
    usarCamaraFrontal = !usarCamaraFrontal;
  } else {
    // En desktop, cambiar entre cámaras disponibles
    camaraActual = (camaraActual + 1) % camarasDisponibles.length;
  }

  await iniciarCamara();
});

btnCapturar.addEventListener("click", () => {
  const context = canvas.getContext("2d");
  canvas.width = webcam.videoWidth;
  canvas.height = webcam.videoHeight;

  // Si la cámara está invertida, invertir también la captura
  const estaInvertido = webcam.style.transform === "scaleX(-1)";
  if (estaInvertido) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }

  context.drawImage(webcam, 0, 0, canvas.width, canvas.height);

  fotoCapturada = canvas.toDataURL("image/jpeg", 0.9);

  fotoPreview.src = fotoCapturada;
  previewSection.style.display = "block";
  deteccionInfo.innerHTML =
    "<strong>Foto capturada correctamente</strong><br>Ingresa el nombre y haz clic en Registrar";

  btnCapturar.style.display = "none";
  btnReiniciar.style.display = "block";
  btnRegistrar.disabled = false;

  if (stream) {
    stream.getTracks().forEach((track) => (track.enabled = false));
  }
});

btnReiniciar.addEventListener("click", () => {
  fotoCapturada = null;
  previewSection.style.display = "none";
  btnCapturar.style.display = "block";
  btnReiniciar.style.display = "none";
  btnRegistrar.disabled = true;

  if (stream) {
    stream.getTracks().forEach((track) => (track.enabled = true));
  }

  mensaje.style.display = "none";
});

btnRegistrar.addEventListener("click", async () => {
  const nombre = inputNombre.value.trim();

  if (!nombre) {
    mostrarMensaje("Por favor ingresa un nombre", "error");
    inputNombre.focus();
    return;
  }

  if (!fotoCapturada) {
    mostrarMensaje("Por favor captura una foto primero", "error");
    return;
  }

  btnRegistrar.disabled = true;
  btnRegistrar.textContent = "Registrando...";

  try {
    await registrarPersonaEnSupabase(nombre, fotoCapturada);
    mostrarMensaje("Persona registrada exitosamente", "success");

    setTimeout(() => {
      inputNombre.value = "";
      fotoCapturada = null;
      previewSection.style.display = "none";
      btnCapturar.style.display = "block";
      btnReiniciar.style.display = "none";
      btnRegistrar.disabled = true;
      btnRegistrar.textContent = "Registrar Persona";

      if (stream) {
        stream.getTracks().forEach((track) => (track.enabled = true));
      }
    }, 2000);
  } catch (error) {
    console.error("Error:", error);
    mostrarMensaje(
      error.message || "No se pudo registrar a la persona",
      "error"
    );
    btnRegistrar.disabled = false;
    btnRegistrar.textContent = "Registrar Persona";
  }
});

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  mensaje.style.display = "block";
}

window.addEventListener("beforeunload", () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
});

init();

async function registrarPersonaEnSupabase(nombre, imagenBase64) {
  const personaId = generarIdUnico();
  const archivo = `${personaId}-${Date.now()}.jpg`;
  const imagenBlob = await convertirBase64ABlob(imagenBase64);

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(archivo, imagenBlob, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    throw new Error("Error al subir la imagen: " + uploadError.message);
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(archivo);

  const fotoUrl = urlData?.publicUrl;

  if (!fotoUrl) {
    await supabase.storage.from(STORAGE_BUCKET).remove([archivo]);
    throw new Error("No se pudo obtener la URL publica de la imagen");
  }

  const { error: insertError } = await supabase.from(PERSON_TABLE).insert([
    {
      id: personaId,
      nombre,
      foto_url: fotoUrl,
      embedding: {},
    },
  ]);

  if (insertError) {
    await supabase.storage.from(STORAGE_BUCKET).remove([archivo]);
    throw new Error(
      "Error al guardar en la base de datos: " + insertError.message
    );
  }
}

async function convertirBase64ABlob(dataUrl) {
  const respuesta = await fetch(dataUrl);
  return await respuesta.blob();
}

function generarIdUnico() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "persona-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}
