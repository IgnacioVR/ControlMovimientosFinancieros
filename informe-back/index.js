import express from "express";
import routes from './src/routes/routes.js';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [process.env.URL_FRONT],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

//routes
app.use('/', routes);

//inicio
app.listen(port, 'localhost', () => {
    console.log(`App ejecutando en http://localhost:${port}`);
});