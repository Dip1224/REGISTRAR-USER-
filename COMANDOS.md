# Comandos Rápidos

## 🚀 Iniciar Proyecto

### Backend

```bash
cd backend
npm run dev
```

**URL:** http://localhost:3000

### Frontend

```bash
cd frontend
npm run dev
```

**URL:** http://localhost:3001

## 🌐 URLs del Sistema

- **Dashboard:** http://localhost:3001/
- **Registrar:** http://localhost:3001/registrar.html
- **API Backend:** http://localhost:3000/api

## 📦 Instalación (Primera vez)

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## 🔧 Configuración Rápida

### Backend (.env)

```env
SUPABASE_URL=https://jjgcfpueqymjnmrepskc.supabase.co
SUPABASE_ANON_KEY=tu_clave_aqui
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

### Frontend (src/lib/supabaseClient.js)

```javascript
const SUPABASE_URL = "https://jjgcfpueqymjnmrepskc.supabase.co";
const SUPABASE_ANON_KEY = "tu_clave_aqui";
```

## 🛑 Detener Servidores

```bash
# Windows
taskkill /F /IM node.exe

# O presiona Ctrl+C en cada terminal
```

## 📊 Verificar Estado

### Backend

```bash
curl http://localhost:3000
```

### Listar Personas

```bash
curl http://localhost:3000/api/personas
```

## 🔄 Reiniciar con Cambios

Los servidores se reinician automáticamente al detectar cambios:

- **Backend:** Nodemon (auto-restart)
- **Frontend:** Vite (hot-reload)

## 🧹 Limpiar Caché

```bash
# Backend
cd backend
rd /s /q node_modules
npm install

# Frontend
cd frontend
rd /s /q node_modules
npm install
```
