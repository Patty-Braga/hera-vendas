const express = require("express");
const verificaLogin = require("./filtro/verificaLogin");
const usuarios = require("./controladores/usuarios");
const { login } = require("./controladores/login");
const listarCategorias = require("./controladores/categorias");
const validarRequisicao = require("./intermediarios/validarRequisicao");
const validacaoUsuario = require("./validacoes/usuario");
const validacaoLogin = require("./validacoes/login");
const produtos = require("./controladores/produtos");
const { validacaoProduto } = require("./validacoes/produto");
const cliente = require("./controladores/clientes");
const pedidos = require("./controladores/pedidos");
const validacaoCliente = require("./validacoes/cliente");
const validacaoPedido = require("./validacoes/pedido");
const multer = require("./filtro/multer");

const rotas = express();

rotas.get("/categoria", listarCategorias);
rotas.post(
  "/usuario",
  validarRequisicao(validacaoUsuario),
  usuarios.cadastrarUsuario
);

rotas.post("/login", validarRequisicao(validacaoLogin), login);

rotas.use(verificaLogin);

rotas.get("/usuario", usuarios.detalharUsuario);
rotas.put(
  "/usuario",
  validarRequisicao(validacaoUsuario),
  usuarios.atualizarUsuario
);

rotas.post(
  "/produto",
  multer.single("produto_imagem"),
  validarRequisicao(validacaoProduto),
  produtos.cadastrarProduto
);
rotas.put(
  "/produto/:id",
  multer.single("produto_imagem"),
  validarRequisicao(validacaoProduto),
  produtos.editarProduto
);
rotas.get("/produto", produtos.listarProdutos);
rotas.get("/produto/:id", produtos.detalharProduto);
rotas.delete("/produto/:id", produtos.excluirProduto);

rotas.post(
  "/cliente",
  validarRequisicao(validacaoCliente),
  cliente.cadastrarCliente
);
rotas.put(
  "/cliente/:id",
  validarRequisicao(validacaoCliente),
  cliente.editarCliente
);
rotas.get("/cliente", cliente.listarClientes);
rotas.get("/cliente/:id", cliente.detalharCliente);

rotas.post(
  "/pedido",
  validarRequisicao(validacaoPedido),
  pedidos.cadastrarPedido
);
rotas.get("/pedido", pedidos.listarPedidos);

module.exports = rotas;
