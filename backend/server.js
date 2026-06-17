import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import pool from './db/db.js';

const app = express();
const PORT = 3000;

app.use(morgan('tiny'));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`listening to PORT ${PORT}`);
});

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json(result.rows);
});

app.post('/', (req, res) => {
  const data = req.body;
  console.log(data);
  res.sendStatus(201);
});
