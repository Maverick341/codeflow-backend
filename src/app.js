import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(
    cors({
        origin: '*', //process.env.CLIENT_URL,
        credentials: false,
        methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import healthCheckRouter from './routes/healthcheck.routes.js';
import authRouter from './routes/auth.routes.js';
import problemRouter from './routes/problem.routes.js';

app.use('/api/v1/healthCheck', healthCheckRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/problems', problemRouter);

app.use(errorHandler);

export default app;
