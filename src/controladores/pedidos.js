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
    const pedido = await knex("pedidos")
      .insert({
        cliente_id,
        observacao,
      })
      .returning("*");

    let valorTotalPedido = 0;
    for (let produtoPedido of pedido_produtos) {
      const produto = await knex("produtos").where(
        "id",
        produtoPedido.produto_id
      );
      const pedidoProduto = await knex("pedido_produtos")
        .insert({
          pedido_id: pedido[0].id,
          produto_id: produto[0].id,
          quantidade_produto: produtoPedido.quantidade_produto,
          valor_produto: produto[0].valor,
        })
        .returning("*");

      valorTotalPedido +=
        pedidoProduto[0].quantidade_produto * pedidoProduto[0].valor_produto;
    }

    await knex("pedidos")
      .update("valor_total", valorTotalPedido)
      .where("id", pedido[0].id)
      .returning("*");

    return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso!" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const listarPedidos = async (req, res) => {
  const { cliente_id } = req.query;
  try {
    if (cliente_id) {
      const pedidos = await knex("pedidos")
        .join("pedido_produtos", "pedidos.id", "pedido_produtos.pedido_id")
        .select(
          "pedidos.id as pedido_id",
          "pedidos.valor_total",
          "pedidos.observacao",
          "pedidos.cliente_id",
          "pedido_produtos.id as produto_id",
          "pedido_produtos.quantidade_produto",
          "pedido_produtos.valor_produto",
          "pedido_produtos.produto_id"
        )
        .where("cliente_id", cliente_id);

      const produtos = pedidos.map((pedido) => ({
        id: pedido.produto_id,
        quantidade_produto: pedido.quantidade_produto,
        valor_produto: pedido.valor_produto,
        produto_id: pedido.produto_id,
      }));

      return res.json({
        pedido_id: pedidos[0].pedido_id,
        valor_total: pedidos[0].valor_total,
        observacao: pedidos[0].observacao,
        cliente_id: pedidos[0].cliente_id,
        pedido_produtos: produtos,
      });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  cadastrarPedido,
  listarPedidos,
};
