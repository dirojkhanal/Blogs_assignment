import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { he } from 'zod/v4/locales';

const app = express();


//security middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));


//routes
// ── Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});



//error handling middleware


export default app;