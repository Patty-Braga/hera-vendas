const knex = require('../conexao')
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const usuarioEncontrado = await knex('usuarios').where({ email }).first();

        if (usuarioEncontrado) {
            return res.status(400).json({ mensagem: "Este email já pertence a outro usuário" })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);
        console.log(nome, email, senha);

        await knex('usuarios')
            .insert({
                nome,
                email,
                senha: senhaCriptografada
            });

        return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const detalharUsuario = async (req, res) => {

}

const atualizarUsuario = async (req, res) => {

}

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
}