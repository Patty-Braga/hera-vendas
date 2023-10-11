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
    try {
        const usuarioAutenticado = req.usuario;

        if (!usuarioAutenticado) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        const { id, nome, email } = usuarioAutenticado;

        return res.status(200).json({
            id,
            nome,
            email,
        });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro durante a busca do usuário' });
    }
}

const atualizarUsuario = async (req, res) => {
    const { id } = req.usuario;
    const { nome, email, senha } = req.body;

    try {
        const usuarioExiste = await knex('usuarios').where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json({ mensagem: 'Usuario não encontrado' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        if (email !== req.usuario.email) {
            const emailUsuarioExiste = await knex('usuarios')
                .where({ email })
                .first();

            if (emailUsuarioExiste) {
                return res.status(400).json({ mensagem: 'O Email já existe.' });
            }
        }

        await knex('usuarios')
            .where({ id })
            .update({
                nome,
                email,
                senha: senhaCriptografada,
            });

        return res.status(201).send({ mensagem: 'Usuário editado com sucesso' });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
}