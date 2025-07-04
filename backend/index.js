const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/polos-proximos', async (req, res) => {
  const { lat, lon, raio = 50000 } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat e lon são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'SELECT enderecos_proximos_geojson($1, $2, $3)',
      [lon, lat, raio]
    );
    res.json(JSON.parse(result.rows[0].enderecos_proximos_geojson));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// app.get('/enderecos-proximos-polo', async (req, res) => {
//   const { id, raio = 50000 } = req.query;

//   if (!id) {
//     return res.status(400).json({ error: 'ID do polo é obrigatório' });
//   }

//   try {
//     const result = await pool.query(
//       'SELECT enderecos_proximos_polo($1, $2)',
//       [id, raio]
//     );
//     res.json(JSON.parse(result.rows[0].enderecos_proximos_polo));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erro interno no servidor' });
//   }
// });

app.get('/get-polos-enderecos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT enderecos_geojson()'
    );
    res.json(JSON.parse(result.rows[0].enderecos_geojson));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.get('/get-polos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM polos_nomes_geojson;'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.delete('/del-polo', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID do Polo é obrigatórios' });
  }

  try {
    const result = await pool.query(
      'SELECT deletar_endereco($1);',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.post('/update-polo', async (req, res) => {
  const {
    id,
    nome,
    status,
    mantenedor,
    endereco,
    cep,
    cidade,
    estado,
    qt_alunos,
    razao_social,
    lat,
    lng
  } = req.body;

  if (!id || !nome || !status || !endereco || !cep || !cidade || !estado || !razao_social || !lat || !lng) {
    return res.status(400).json({ error: 'Informação incompleta, não foi possível atualizar o polo' });
  }

  try {
    const result = await pool.query(
      'SELECT update_endereco($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);',
      [id, nome, status, mantenedor, endereco, cep, cidade, estado, qt_alunos, razao_social, lat, lng]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.put('/add-polo', async (req, res) => {
  const {
    nome,
    status,
    mantenedor,
    endereco,
    cep,
    cidade,
    estado,
    qt_alunos,
    razao_social,
    lat,
    lng
  } = req.body;

  if (!nome || !status || !endereco || !cep || !cidade || !estado || !razao_social || !lat || !lng) {
    return res.status(400).json({ error: 'Informação incompleta, não foi possível atualizar o polo' });
  }

  try {
    const result = await pool.query(
      'SELECT adicionar_endereco($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);',
      [nome, status, mantenedor, endereco, cep, cidade, estado, qt_alunos, razao_social, lat, lng]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Servidor rodando na porta ${PORT}`);
});