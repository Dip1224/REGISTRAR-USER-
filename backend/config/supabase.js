import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Error: Las credenciales de Supabase no están configuradas');
    console.log('Por favor configura SUPABASE_URL y SUPABASE_ANON_KEY en el archivo .env');
    process.exit(1);
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para verificar conexión
export async function verificarConexion() {
    try {
        const { data, error } = await supabase
            .from('personas')
            .select('count')
            .limit(1);
        
        if (error) throw error;
        
        console.log('✅ Conexión a Supabase establecida correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con Supabase:', error.message);
        return false;
    }
}
