const knex = require("../conexao");

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    try {
        const quantidadeCategoria = await knex("categorias");

        if (categoria_id > quantidadeCategoria.length) {
            return res.status(404).json({
                mensagem:
                    "A categoria informada não existe, informe uma categoria válida para prosseguir.",
            });
        }

        await knex("produtos").insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
        });

        return res
            .status(201)
            .json({ mensagem: "Produto cadastrado com sucesso!" });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const editarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { id } = req.usuario;
    try {

        const produtoExiste = await knex("produtos").where({ categoria_id }).first();

        if (!produtoExiste) {
            return res.status(404).json({ mensagem: "Produto não existe ou não pertence ao usuário logado." });
        }

        await knex("produtos").insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        });

        return res.status(201).json({ mensagem: "Produto cadastrado com sucesso!" });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;
    try {
        const query = knex.select("*").from("produtos");

        if (categoria_id) {
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
    try {
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
