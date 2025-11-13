import express from 'express';
import {
    registrarPersona,
    obtenerPersonas,
    obtenerPersonaPorId,
    actualizarPersona,
    eliminarPersona
} from '../controllers/personaController.js';

const router = express.Router();

// Rutas para personas
router.post('/registrar', registrarPersona);
router.get('/', obtenerPersonas);
router.get('/:id', obtenerPersonaPorId);
router.put('/:id', actualizarPersona);
router.delete('/:id', eliminarPersona);

export default router;
