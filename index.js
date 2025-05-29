require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: { rejectUnauthorized: false }
});

app.get('/cliente', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM cliente');
  res.json(rows);
});

app.post('/cliente', async (req, res) => {
  const { nombre, apellido, edad, email } = req.body;
  await pool.query('INSERT INTO cliente (nombre, apellido, edad, email) VALUES ($1, $2, $3, $4)', [nombre, apellido, edad, email]);
  res.sendStatus(200);
});

app.put('/cliente/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, edad, email } = req.body;
  await pool.query('UPDATE cliente SET nombre = $1, apellido = $2, edad = $3, email = $4  WHERE id = $5', [nombre, apellido, edad, email, id]);
  res.sendStatus(200);
});

app.delete('/cliente/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM cliente WHERE id = $1', [id]);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
