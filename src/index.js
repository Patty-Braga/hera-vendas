require('dotenv').config()
const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);

const port = 3005

app.listen(port, () => console.log(`Servidor on na porta: ${port} 🚀`))
