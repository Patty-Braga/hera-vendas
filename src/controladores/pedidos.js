const knex = require("../conexao");

const cadastrarPedido = async (req, res) => {
  const { cliente_id, pedido_produtos, observacao } = req.body;

  try {
    return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso!" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const listarPedidos = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  cadastrarPedido,
  listarPedidos,
};
