const knex = require("../conexao");

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    try {
        const listarCategoria = await knex("categorias");

        if (categoria_id > listarCategoria.length) {
            return res.status(404).json({ mensagem: "A categoria informada não existe, informe uma categoria válida para prosseguir." });
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
};

const editarProduto = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const listarProdutos = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const detalharProduto = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    cadastrarProduto,
    editarProduto,
    listarProdutos,
    detalharProduto,
    excluirProduto
}