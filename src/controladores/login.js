require("dotenv").config();
const knex = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await knex("usuarios").where({ email }).first();

    if (!usuario) {
      return res.status(403).json("Email ou Senha inválidos");
    }

    const senhaUsuario = await bcrypt.compare(senha, usuario.senha);

    if (!senhaUsuario) {
      return res.status(403).json("Email ou Senha inválidos");
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET_KEY);

    const { senha: _, ...dadosUsuario } = usuario;
    return res.status(200).json({
      usuario: dadosUsuario,
      token,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  login,
};
