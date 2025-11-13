# Sistema de Registro Facial

Sistema completo de registro facial con frontend web y backend conectado a Supabase.

## 🚀 Características

- ✅ Captura de fotos con webcam
- ✅ Registro de personas en base de datos
- ✅ Dashboard con estadísticas
- ✅ Almacenamiento de imágenes en Supabase Storage
- ✅ Diseño responsive (móvil y desktop)
- ✅ Interfaz minimalista

## 📋 Requisitos

- Node.js v16 o superior
- Cuenta en Supabase (gratuita)
- Navegador web moderno con cámara

## 🔧 Instalación

### 1. Configurar Supabase

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. En **SQL Editor**, ejecuta:

```sql
-- Crear tabla de personas
CREATE TABLE IF NOT EXISTS public.personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL UNIQUE,
    embedding JSONB NOT NULL,
    edad INTEGER,
    genero TEXT CHECK (genero IN ('M','F')) DEFAULT NULL,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    foto_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

4. En **Storage**, crea un bucket público llamado `rostros`
5. Copia tus credenciales:
   - Project URL
   - anon/public key

### 2. Configurar Backend

```bash
cd backend
npm install
```

Edita `backend\.env` con tus credenciales:
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_publica
PORT=3000
```

### 3. Configurar Frontend

Edita `frontend\src\lib\supabaseClient.js` con tus credenciales:
```javascript
const SUPABASE_URL = 'tu_url_de_supabase';
const SUPABASE_ANON_KEY = 'tu_clave_publica';
```

Instala dependencias:
```bash
cd frontend
npm install
```

## 🎯 Ejecutar el Proyecto

### Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Servidor corriendo en: **http://localhost:3000**

### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Aplicación disponible en: **http://localhost:3001**

## 📱 Uso

1. Abre **http://localhost:3001** en tu navegador
2. Ve a "Registrar" para agregar personas
3. Permite acceso a la cámara
4. Captura una foto
5. Ingresa el nombre
6. Haz clic en "Registrar Persona"
7. Verifica en el Dashboard

## � Estructura del Proyecto

```
REGISTRO/
├── backend/              # API Node.js + Express
│   ├── config/          # Configuración Supabase
│   ├── controllers/     # Lógica de negocio
│   ├── routes/          # Rutas API
│   ├── middleware/      # Middleware
│   └── server.js        # Servidor principal
│
└── frontend/            # Interfaz web (Vite)
    ├── css/            # Estilos
    ├── src/            # JavaScript
    ├── index.html      # Dashboard
    └── registrar.html  # Registro
```

## 🌐 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Estado del servidor |
| POST | `/api/personas/registrar` | Registrar persona |
| GET | `/api/personas` | Listar personas |
| GET | `/api/personas/:id` | Obtener persona |
| PUT | `/api/personas/:id` | Actualizar persona |
| DELETE | `/api/personas/:id` | Eliminar persona |

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- Supabase Client
- UUID para IDs únicos

### Frontend
- Vite (dev server)
- Vanilla JavaScript
- Supabase Client
- WebRTC (MediaDevices API)

## ✅ Checklist de Configuración

- [ ] Cuenta en Supabase creada
- [ ] Tabla `personas` creada
- [ ] Bucket `rostros` creado (público)
- [ ] Credenciales copiadas en `backend\.env`
- [ ] Credenciales copiadas en `frontend\src\lib\supabaseClient.js`
- [ ] Dependencias instaladas (backend y frontend)
- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 3001

## 📝 Notas

- Las imágenes se almacenan en formato JPEG
- El campo `embedding` está preparado para almacenar vectores faciales
- Las credenciales de Supabase deben configurarse en ambos lados (backend y frontend)

---

**Sistema de Registro Facial © 2025**


```
REGISTRO/
├── backend/              # Servidor Node.js + Express
│   ├── config/          # Configuración de Supabase
│   ├── controllers/     # Lógica de negocio
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middleware personalizado
│   ├── server.js        # Punto de entrada
│   └── package.json
│
└── frontend/            # Interfaz web minimalista
    ├── css/            # Estilos
    ├── src/pages/      # Lógica de páginas
    ├── index.html      # Dashboard
    └── registrar.html  # Página de registro
```

## 📋 Requisitos Previos

- Node.js v16 o superior
- Cuenta en Supabase (gratuita)
- Navegador web moderno (Chrome, Firefox, Edge)
- Cámara web

## 🔧 Configuración de Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Espera a que el proyecto se inicialice

### 2. Crear la Tabla de Personas

Ve a **SQL Editor** y ejecuta:

```sql
-- Crear tabla de personas
CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    foto_url TEXT NOT NULL,
    embeddings JSONB,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para búsquedas rápidas
CREATE INDEX idx_personas_nombre ON personas(nombre);
CREATE INDEX idx_personas_activo ON personas(activo);

-- Habilitar RLS (Row Level Security)
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso público (ajustar según necesidades)
CREATE POLICY "Permitir todo acceso público" ON personas
    FOR ALL USING (true);
```

### 3. Crear Bucket de Storage

1. Ve a **Storage** en el panel de Supabase
2. Haz clic en "Create bucket"
3. Nombre: `rostros`
4. Selecciona **Public bucket**
5. Haz clic en "Create bucket"

### 4. Obtener Credenciales

1. Ve a **Settings** > **API**
2. Copia:
   - **Project URL** (SUPABASE_URL)
   - **anon/public key** (SUPABASE_ANON_KEY)

## 🛠️ Instalación del Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Edita el archivo .env con tus credenciales de Supabase
notepad .env
```

Contenido del archivo `.env`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-publica-aqui
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5500
```

### Iniciar el Backend

```bash
# Modo desarrollo (con auto-restart)
npm run dev

# Modo producción
npm start
```

El servidor estará corriendo en: `http://localhost:3000`

## 🌐 Instalación del Frontend

```bash
# Navegar a la carpeta frontend
cd frontend

# Opción 1: Usar Python
python -m http.server 5500

# Opción 2: Usar npx http-server
npx http-server -p 5500

# Opción 3: Usar PHP
php -S localhost:5500

# Opción 4: Usar Live Server en VS Code
# 1. Instalar extensión "Live Server"
# 2. Click derecho en index.html > "Open with Live Server"
```

El frontend estará disponible en: `http://localhost:5500`

## 🎯 Uso del Sistema

### 1. Dashboard

- Abre `http://localhost:5500`
- Verás estadísticas de personas registradas
- Lista de todas las personas con sus fotos

### 2. Registrar Persona

1. Navega a "Registrar" en el menú
2. Permite el acceso a la cámara
3. Captura una foto
4. Ingresa el nombre completo
5. Haz clic en "Registrar Persona"
6. La persona se guardará en Supabase

## 📡 API Endpoints

### Personas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/personas/registrar` | Registrar nueva persona |
| GET | `/api/personas` | Obtener todas las personas |
| GET | `/api/personas/:id` | Obtener persona por ID |
| PUT | `/api/personas/:id` | Actualizar persona |
| DELETE | `/api/personas/:id` | Eliminar persona |

### Ejemplo de Registro

```javascript
const response = await fetch('http://localhost:3000/api/personas/registrar', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nombre: 'Juan Pérez',
        imagen_base64: 'data:image/jpeg;base64,/9j/4AAQ...',
        embeddings: null
    })
});

const data = await response.json();
console.log(data);
```

## 🎨 Características del Frontend

- ✅ Diseño minimalista sin iconos/emojis
- ✅ Interfaz responsiva
- ✅ Captura de fotos con webcam
- ✅ Soporte para múltiples cámaras
- ✅ Vista previa de fotos
- ✅ Validación de formularios
- ✅ Mensajes de éxito/error
- ✅ Actualización automática del dashboard

## 🔒 Seguridad

### Recomendaciones de Producción

1. **Habilitar RLS personalizado en Supabase**:
```sql
-- Ejemplo: Solo permitir INSERT y SELECT
CREATE POLICY "Permitir inserción" ON personas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir lectura" ON personas
    FOR SELECT USING (true);
```

2. **Usar HTTPS en producción**
3. **Validar datos en el backend**
4. **Implementar autenticación de usuarios**
5. **Limitar tamaño de archivos**

## 🐛 Solución de Problemas

### Error: "No se pudo acceder a la cámara"
- Verifica que el navegador tenga permisos
- Usa HTTPS o localhost
- Revisa la consola del navegador

### Error: "Error de conexión con Supabase"
- Verifica las credenciales en `.env`
- Asegúrate de que el proyecto de Supabase esté activo
- Revisa que la tabla `personas` exista

### Error: "CORS"
- Verifica que `FRONTEND_URL` esté correctamente configurado en `.env`
- Asegúrate de que el backend esté corriendo

### Las imágenes no se cargan
- Verifica que el bucket `rostros` sea público
- Revisa la configuración de Storage en Supabase

## 📝 Notas Adicionales

- Las imágenes se almacenan en formato JPEG
- Límite de tamaño: 50MB por imagen
- Las URLs de las imágenes son públicas
- Se genera un UUID único para cada persona

## 🔄 Próximas Mejoras

- [ ] Detección facial con TensorFlow.js
- [ ] Generación de embeddings faciales
- [ ] Sistema de asistencia
- [ ] Reportes y estadísticas avanzadas
- [ ] Autenticación de usuarios
- [ ] Panel de administración

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

---

**Desarrollado con ❤️ para sistemas de asistencia facial**
