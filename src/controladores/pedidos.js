const knex = require("../conexao");

const cadastrarPedido = () => {
  try {
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const listarPedidos = () => {
  try {
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  cadastrarPedido,
  listarPedidos,
};
