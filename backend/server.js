import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import authRouter from './routes/auth.js';
import mediaRouter from './routes/media.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(morgan('tiny'));
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/media', mediaRouter);

app.listen(PORT, () => {
  console.log(`listening to PORT ${PORT}`);
});
