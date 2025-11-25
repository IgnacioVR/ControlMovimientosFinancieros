import express from "express";
import routes from '../src/routes/routes.js';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'DELETE']
}));

//routes
app.use('/', routes);

//inicio
app.listen(port, 'localhost', () => {
    console.log(`App ejecutando en http://localhost:${port}`);
});