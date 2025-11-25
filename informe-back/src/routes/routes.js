import express from "express";
import { movementsController } from "../controllers/movementsController.js";

const router = express.Router();

//crear movimiento
router.post('/movements', movementsController.createMovement);
//obtener movimientos
router.get('/movements', movementsController.getMovements);
//obtener balance
router.get('/reports/monthly', movementsController.getBalance);

export default router;