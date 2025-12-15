import supabase from '../config/supabaseClient.js';

export const movementsController = {

    //crear movimiento
    async createMovement(req, res) {
        try {
            const { fecha, tipo, monto, descripcion } = req.body;

            // Validación básica
            if (!fecha || !tipo || !monto || !descripcion) {
                return res.status(400).json({ error: 'Todos los campos son requeridos: fecha, tipo, monto, descripcion' });
            }

            // Insertar en Supabase
            const { data, error } = await supabase
                .from('movements')
                .insert([{ fecha, tipo, monto, descripcion }])

            if (error) {
                console.error('Error de Supabase al insertar:', error.message);
                return res.status(400).json({ error: 'No se pudo crear el movimiento', details: error.message });
            }

            return res.status(201).json({
                message: 'Movimiento creado con éxito'
            });
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ error: 'Error inesperado al asignar la tarea', error: error.message });
        }


    },

    //obtener movimientos
    async getMovements(req, res) {
        try {
            const { data, error } = await supabase
                .from('movements')
                .select('fecha, tipo, monto, descripcion');

            if (error) {
                console.error('Error de Supabase:', error.message);
                return res.status(500).json({ error: 'Error al obtener movimientos', details: error.message });
            }

            return res.json(data); // Supabase ya devuelve un array
        } catch (error) {
            console.error('Excepción inesperada (getMovements):', error.message)
            return res.status(500).send({ error: 'Error inesperado al asignar la tarea', error: error.message });
        }
    },

    //obtener balance
    async getBalance(req, res) {
        try {

            const { anio, mes } = req.query;

            if (!anio || !mes) {
                return res.status(400).json({ error: 'Los parámetros año y mes son requeridos' });
            }

            // Convertir a número (la función en Supabase espera NUMERIC)
            const year = Number(anio);
            const month = Number(mes);
            if (isNaN(year) || isNaN(month)) {
                return res.status(400).json({ error: 'Año y mes deben ser valores numéricos' });
            }
            // Llamar a la función SQL directamente
            const { data, error } = await supabase
                .rpc('sp_generate_monthly_report', {
                    p_year: year,
                    p_month: month
                });

            if (error) {
                return res.status(400).json({ error: 'No se pudo generar el informe', details: error.message });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'No hay datos para el mes y año seleccionados' });
            }

            // Supabase devuelve un array; tomamos el primer (y único) registro
            return res.json(data[0]);
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ error: 'Error inesperado al asignar la tarea', error: error.message });
        }
    },
};