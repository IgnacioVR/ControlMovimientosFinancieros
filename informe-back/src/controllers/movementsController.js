import { pool } from '../config/connectionbd.js';
import { Movement } from '../models/Movement.js';
import supabase from '../config/supabaseClient.js';

export const movementsController = {

    //crear movimiento
    async createMovement(req, res) {
        try {

            const nuevoMovimiento = new Movement(req.body);

            // Validar que el body tenga un objeto
            if (!nuevoMovimiento) {
                return res.status(400).send({ error: 'Los parámetros son requeridos' });
            }
            const result = await pool.query("INSERT INTO movements (fecha, tipo, monto, descripcion) VALUES ($1, $2, $3, $4)",
                [nuevoMovimiento.fecha, nuevoMovimiento.tipo, nuevoMovimiento.monto, nuevoMovimiento.descripcion]);
            return res.status(200).send({ message: 'Tarea asignada con éxito', result });

        } catch (error) {
            console.log(error.message)
            return res.status(500).send({ error: 'Error inesperado al asignar la tarea', error: error.message });
        }


    },

    //obtener movimientos
    async getMovements(req, res) {
        try {
            const result = await pool.query("SELECT fecha, tipo, monto, descripcion FROM movements");
            return res.send(result.rows);
        } catch (error) {
            console.log(error.message)
            return res.status(500).send({ error: 'Error inesperado al asignar la tarea', error: error.message });
        }
    },

    //obtener balance
    async getBalance(req, res) {
        try {

            const { anio, mes } = req.query;
            console.log(anio, mes)
            // Validar que los parámetros existan
            if (!anio || !mes) {
                return res.status(400).send({ error: 'Los parámetros año y mes son requeridos' });
            }

            const result = await pool.query("SELECT * FROM sp_generate_monthly_report($1, $2);", [anio, mes]);
            return res.send(result.rows[0]);
        } catch (error) {
            console.log(error.message)
            return res.status(500).send({ error: 'Error inesperado al asignar la tarea', error: error.message });
        }
    },
};