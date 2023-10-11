const express = require("express");
const verificaLogin = require("./filtro/verificaLogin");
const usuarios = require("./controladores/usuarios");
const { login } = require("./controladores/login");
const { listarCategorias } = require("./controladores/categorias");
const validarRequisicao = require("./intermediarios/validarRequisicao");
const validacaoUsuario = require("./validacoes/usuario");
const validacaoLogin = require("./validacoes/login");

const rotas = express();

rotas.get("/categoria", listarCategorias);
rotas.post("/usuario", validarRequisicao(validacaoUsuario), usuarios.cadastrarUsuario);

rotas.post("/login", validarRequisicao(validacaoLogin), login);

rotas.use(verificaLogin);

rotas.get("/usuario", usuarios.detalharUsuario);
rotas.put("/usuario", validarRequisicao(validacaoUsuario), usuarios.atualizarUsuario);

module.exports = rotas;
