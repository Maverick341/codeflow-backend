import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(
    cors({
        // origin: '*', 
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
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
import executionRouter from './routes/executeCode.routes.js';
import submissionRouter from './routes/submission.routes.js';
import playlistRouter from './routes/playlist.routes.js';


app.use('/api/v1/healthCheck', healthCheckRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/problems', problemRouter);
app.use('/api/v1/executeCode', executionRouter);
app.use('/api/v1/submission', submissionRouter);
app.use('/api/v1/playlist', playlistRouter);

app.use(errorHandler);

export default app;
