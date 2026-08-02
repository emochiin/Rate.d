import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db/db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Fehlende User-Parameter' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, hashedPassword],
    );
    res.sendStatus(200);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'User bereits vorhanden' });
    }
    console.log(error);
    res.sendStatus(500);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    res
      .status(200)
      .json({ message: 'Login erfolgreich', token: token, userId: user.id });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
