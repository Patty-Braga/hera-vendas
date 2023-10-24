const knex = require("../conexao");
const { validarCadastro, validacaoCadastrarProduto } = require('../validacoes/validaUpload')
const { uploadImagem } = require("../upload");


const cadastrarProduto = async (req, res) => {
  const { id } = req.usuario;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { originalname, mimetype, buffer } = req.file


  try {
    await validarCadastro(validacaoCadastrarProduto, req, res)
    const quantidadeCategoria = await knex("categorias");

    const produtoExiste = await knex("produtos")
      .whereRaw("LOWER(descricao) = ? ", [descricao.trim().toLowerCase()])
      .first();

    if (produtoExiste) {
      return res.status(400).json({ mensagem: "Produto já cadastrado." });
    }

    if (categoria_id > quantidadeCategoria.length) {
      return res.status(404).json({
        mensagem:
          "A categoria informada não existe, informe uma categoria válida para prosseguir.",
      });
    }

    let produto = await knex("produtos").insert({
      descricao: descricao.trim(),
      quantidade_estoque,
      valor,
      categoria_id,
    }).returning('*');

    const id = produto[0].id

    const imagem = await uploadImagem(
      `produtos/${id}/${originalname}`,
      buffer,
      mimetype
    )

    produto = await knex('produtos').update({
      produto_imagem: imagem.url
    }).where({ id }).returning('*')

    const produtoCadastrado = {
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
      produto_imagem: imagem.url
    }

    return res.status(200).json(produtoCadastrado);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const editarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { id } = req.params;

  try {
    const produto = await knex("produtos").where({ id }).first();

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const produtoExiste = await knex("produtos")
      .whereRaw("LOWER(descricao) = ?", [descricao.trim().toLowerCase()])
      .whereNot("id", id)
      .first();

    if (produtoExiste) {
      return res
        .status(400)
        .json({ mensagem: "Descrição pertence a outro produto" });
    }

    await knex("produtos").where({ id }).update({
      descricao: descricao.trim(),
      quantidade_estoque,
      valor,
      categoria_id,
    });

    return res.status(201).json({ mensagem: "Produto alterado com sucesso!" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const listarProdutos = async (req, res) => {
  const { categoria_id } = req.query;
  try {
    const query = knex.select("*").from("produtos");

    if (categoria_id) {
      const categoriaExiste = await knex("*")
        .from("categorias")
        .where("id", categoria_id)
        .first();

      if (!categoriaExiste) {
        return res.status(404).json({
          mensagem: "Categoria não encontrada",
        });
      }
      query.where("categoria_id", categoria_id);
    }

    const listaProdutos = await query;
    return res.status(200).json(listaProdutos);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const detalharProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produtoEncontrado = await knex
      .select("*")
      .from("produtos")
      .where({ id })
      .first();

    if (!produtoEncontrado) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    return res.status(200).json(produtoEncontrado);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const excluirProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await knex("produtos").where({ id }).first();

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    await knex("produtos").where({ id }).del();

    return res.status(200).json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  cadastrarProduto,
  editarProduto,
  listarProdutos,
  detalharProduto,
  excluirProduto,
};
