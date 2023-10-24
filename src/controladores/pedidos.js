const knex = require("../conexao");

const cadastrarPedido = async (req, res) => {
  const { cliente_id, pedido_produtos, observacao } = req.body;
  try {
    const clienteExiste = await knex("clientes")
      .where("id", cliente_id)
      .first();

    if (!clienteExiste) {
      return res.status(404).json({
        mensagem:
          "O cliente informado não existe, informe um cliente válido para prosseguir.",
      });
    }
    const produtosId = pedido_produtos.map(
      (pedido_produtos) => pedido_produtos.produto_id
    );

    const produtoExiste = await knex("produtos").whereIn("id", produtosId);

    if (produtoExiste.length < produtosId.length) {
      return res.status(404).json({
        mensagem: "Produto não encontrado",
      });
    }

    const estoqueValido = pedido_produtos.map((pedido) => {
      const produto = produtoExiste.find((p) => p.id === pedido.produto_id);
      return produto && produto.quantidade_estoque >= pedido.quantidade_produto;
    });

    if (estoqueValido.includes(false)) {
      res.status(422).json({ mensagem: "Estoque insuficiente!" });
    }

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
