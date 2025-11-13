import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verificarConexion } from './config/supabase.js';
import personaRoutes from './routes/personaRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de Registro Facial funcionando correctamente',
        version: '1.0.0'
    });
});

// Rutas de la API
app.use('/api/personas', personaRoutes);

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
const iniciarServidor = async () => {
    try {
        // Verificar conexión a Supabase
        const conexionExitosa = await verificarConexion();
        
        if (!conexionExitosa) {
            console.log('\n⚠️  Advertencia: No se pudo verificar la conexión con Supabase');
            console.log('Asegúrate de configurar correctamente el archivo .env\n');
        }

        app.listen(PORT, () => {
            console.log('╔════════════════════════════════════════╗');
            console.log(`║  🚀 Servidor corriendo en puerto ${PORT}  ║`);
            console.log('╚════════════════════════════════════════╝');
            console.log(`\n📍 URL: http://localhost:${PORT}`);
            console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

iniciarServidor();
