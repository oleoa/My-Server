const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
  },
});

app.use(express.json());

// GET endpoint
app.get('/anyrent', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM anyrent');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST endpoint
app.post('/anyrent', async (req, res) => {
  const { debug } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO anyrent (debug) VALUES ($1) RETURNING *',
      [debug]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
