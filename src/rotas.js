const express = require('express');
const verificaLogin = require('./filtro/verificaLogin');
const usuarios = require('./controladores/usuarios');
const { login } = require('./controladores/login');
const { listarCategorias } = require('./controladores/categorias');

const rotas = express();

rotas.get('/categoria', listarCategorias);

rotas.post('/usuario', usuarios.cadastrarUsuario);

rotas.post('/login', login);

rotas.use(verificaLogin);

rotas.get('/usuario', usuarios.detalharUsuario);
rotas.put('/usuario', usuarios.atualizarUsuario);

module.exports = rotas;