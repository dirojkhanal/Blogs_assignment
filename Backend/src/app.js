import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandlers } from './middlewares/errorHandlers.js';
import { notFound } from './middlewares/notFound.js';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
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
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);


//error handling middleware
app.use(errorHandlers);
app.use(notFound);


export default app;