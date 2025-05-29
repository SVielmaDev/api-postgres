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

app.get('/cliente/:rut', async (req, res) => {
  const { rut } = req.query;

  if (!rut) {
    return res.status(400).json({ error: 'Parámetro "rut" es requerido' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM cliente WHERE rut = $1', [rut]);
    res.json(rows);
  } catch (error) {
    console.error('Error al consultar cliente:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

app.post('/cliente', async (req, res) => {
  const { rut, nombre, apellido, edad, email } = req.body;
  await pool.query('INSERT INTO cliente (rut, nombre, apellido, edad, email) VALUES ($1, $2, $3, $4, $5)', [rut, nombre, apellido, edad, email]);
  res.status(200).json({ mensaje: "Cliente insertado correctamente" });
});

app.put('/cliente/:rut', async (req, res) => {
  const { rut } = req.params;
  const { nombre, apellido, edad, email } = req.body;
  await pool.query('UPDATE cliente SET nombre = $1, apellido = $2, edad = $3, email = $4  WHERE id = $5', [nombre, apellido, edad, email, rut]);
  res.status(200).json({ mensaje: "Cliente actualizado correctamente" });
});

app.delete('/cliente/:rut', async (req, res) => {
  const { rut } = req.params;
  await pool.query('DELETE FROM cliente WHERE id = $1', [rut]);
  res.status(200).json({ mensaje: "Cliente eliminado correctamente" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
