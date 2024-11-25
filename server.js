const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'database-octalab.cngqwss00euo.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'fastariam2024',
  database: 'octaLab'
});

app.use(bodyParser.json());

app.post('/dados', async (req, res) => {
  const { sensor_id, temperatura, pressao } = req.body;

  console.log("Dados recebidos: ", req.body);

  if (!sensor_id || (temperatura === undefined && pressao === undefined)) {
    return res.status(400).send('Dados inválidos.');
  }

  try {
    const connection = await pool.getConnection();

    if (temperatura !== undefined) {
      const [result] = await connection.execute(
        'INSERT INTO temperaturas (sensor_id, temperatura) VALUES (?, ?)',
        [sensor_id, temperatura]
      );
      console.log('Dados de temperatura inseridos:', result);
    }

    if (pressao !== undefined) {
      const [result] = await connection.execute(
        'INSERT INTO pressoes (sensor_id, pressao) VALUES (?, ?)',
        [sensor_id, pressao]
      );
      console.log('Dados de pressão inseridos:', result);
    }

    connection.release();
    res.send('Dados recebidos com sucesso.');
  } catch (error) {
    console.error('Erro ao inserir dados no banco de dados:', error);
    res.status(500).send('Erro ao inserir dados no banco de dados.');
  }
});

app.get("/", (req, res) => {
  res.json({msg: "Sucesso"});
});

app.get("/teste", (req, res) => {
  res.json({msg: "Teste!"});
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});