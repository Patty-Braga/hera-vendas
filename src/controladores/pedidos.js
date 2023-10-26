const transportador = require("../services/nodemailer");
const knex = require("../conexao");
const compiladorHtml = require("../utils/compiladorHtml");

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
      return res.status(422).json({ mensagem: "Estoque insuficiente!" });
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

      await knex("produtos")
        .where("id", produtoPedido.produto_id)
        .update({
          quantidade_estoque: knex.raw("quantidade_estoque - ?", [
            produtoPedido.quantidade_produto,
          ]),
        });

      valorTotalPedido +=
        pedidoProduto[0].quantidade_produto * pedidoProduto[0].valor_produto;
    }

    const pedidoFinalizado = await knex("pedidos")
      .update("valor_total", valorTotalPedido)
      .where("id", pedido[0].id)
      .returning("*");

    const html = await compiladorHtml("./src/templates/pedidoConcluido.html", {
      nomeCliente: clienteExiste.nome,
      numeroPedido: pedidoFinalizado[0].id,
      valorTotal: (pedidoFinalizado[0].valor_total / 100).toFixed(2),
      observacao: pedidoFinalizado[0].observacao || "Sem Observações",
    });

    transportador.sendMail({
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
      to: `${clienteExiste.nome} <${clienteExiste.email}>`,
      subject: "Pedido Realizado com Sucesso",
      html,
    });

    return res.status(201).json({ mensagem: "Pedido realizado com sucesso!" });
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

      if (pedidos.length === 0) {
        return res.status(404).json({
          mensagem:
            "Não existem pedidos para o cliente informado ou o cliente não está cadastrado",
        });
      }

      const produtos = pedidos.map((pedido) => ({
        id: pedido.pedido_id,
        quantidade_produto: pedido.quantidade_produto,
        valor_produto: pedido.valor_produto,
        produto_id: pedido.produto_id,
      }));

      return res.status(200).json([
        {
          pedido: {
            id: pedidos[0].pedido_id,
            valor_total: pedidos[0].valor_total,
            observacao: pedidos[0].observacao,
            cliente_id: pedidos[0].cliente_id,
          },
          pedido_produtos: produtos,
        },
      ]);
    } else {
      const pedidos = await knex
        .select("id", "valor_total", "observacao", "cliente_id")
        .from("pedidos");

      const pedidosEProdutos = pedidos.map((pedido) => ({
        pedido: pedido,
        pedido_produtos: [],
      }));

      for (let pedido of pedidosEProdutos) {
        const produtos = await knex
          .select(
            "id",
            "quantidade_produto",
            "valor_produto",
            "pedido_id",
            "produto_id"
          )
          .from("pedido_produtos")
          .where("pedido_id", pedido.pedido.id);
        pedido.pedido_produtos = produtos;
      }

      return res.status(200).json(pedidosEProdutos);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  cadastrarPedido,
  listarPedidos,
};
