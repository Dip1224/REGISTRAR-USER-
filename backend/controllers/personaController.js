import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

// Registrar nueva persona
export const registrarPersona = async (req, res) => {
    try {
        const { nombre, imagen_base64, embeddings } = req.body;

        if (!nombre || !imagen_base64) {
            return res.status(400).json({
                success: false,
                message: 'Nombre e imagen son requeridos'
            });
        }

        // Generar ID único
        const personaId = uuidv4();

        // Convertir base64 a buffer
        const base64Data = imagen_base64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Subir imagen a Supabase Storage
        const nombreArchivo = `${personaId}-${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('rostros')
            .upload(nombreArchivo, buffer, {
                contentType: 'image/jpeg',
                upsert: false
            });

        if (uploadError) {
            console.error('Error al subir imagen:', uploadError);
            return res.status(500).json({
                success: false,
                message: 'Error al subir la imagen',
                error: uploadError.message
            });
        }

        // Obtener URL pública de la imagen
        const { data: urlData } = supabase.storage
            .from('rostros')
            .getPublicUrl(nombreArchivo);

        // Preparar datos para insertar
        const personaData = {
            id: personaId,
            nombre: nombre.trim(),
            foto_url: urlData.publicUrl,
            embedding: embeddings || {}
        };

        console.log('📝 Datos a insertar:', JSON.stringify(personaData, null, 2));

        // Insertar registro en la base de datos
        const { data, error } = await supabase
            .from('personas')
            .insert(personaData)
            .select()
            .single();

        if (error) {
            console.error('Error al insertar en BD:', error);
            // Intentar eliminar la imagen subida
            await supabase.storage.from('rostros').remove([nombreArchivo]);
            
            return res.status(500).json({
                success: false,
                message: 'Error al registrar persona',
                error: error.message
            });
        }

        res.status(201).json({
            success: true,
            message: 'Persona registrada exitosamente',
            data: data
        });

    } catch (error) {
        console.error('Error en registrarPersona:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener todas las personas
export const obtenerPersonas = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('personas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener personas',
                error: error.message
            });
        }

        res.json({
            success: true,
            data: data,
            total: data.length
        });

    } catch (error) {
        console.error('Error en obtenerPersonas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener persona por ID
export const obtenerPersonaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('personas')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: 'Persona no encontrada'
            });
        }

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('Error en obtenerPersonaPorId:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar persona
export const actualizarPersona = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, edad, genero } = req.body;

        const actualizacion = {};
        if (nombre) actualizacion.nombre = nombre.trim();
        if (edad !== undefined) actualizacion.edad = edad;
        if (genero !== undefined) actualizacion.genero = genero;

        const { data, error } = await supabase
            .from('personas')
            .update(actualizacion)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: 'Persona no encontrada o error al actualizar'
            });
        }

        res.json({
            success: true,
            message: 'Persona actualizada exitosamente',
            data: data
        });

    } catch (error) {
        console.error('Error en actualizarPersona:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar persona
export const eliminarPersona = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener información de la persona para eliminar la imagen
        const { data: persona } = await supabase
            .from('personas')
            .select('foto_url')
            .eq('id', id)
            .single();

        // Eliminar registro de la base de datos
        const { error } = await supabase
            .from('personas')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar persona',
                error: error.message
            });
        }

        // Intentar eliminar la imagen del storage
        if (persona && persona.foto_url) {
            const nombreArchivo = persona.foto_url.split('/').pop();
            await supabase.storage.from('rostros').remove([nombreArchivo]);
        }

        res.json({
            success: true,
            message: 'Persona eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error en eliminarPersona:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
