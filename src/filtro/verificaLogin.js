require("dotenv").config();
const jwt = require("jsonwebtoken");
const knex = require("../conexao");

const verificaLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: "Usuário não está autenticado" });
  }

  const token = authorization.replace("Bearer ", "").trim();
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const usuario = await knex("usuarios").where({ id }).first();

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const { senha, ...usuarioInfos } = usuario;

    req.usuario = usuarioInfos;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ mensagem: "Usuário não está autenticado" });
    }
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = verificaLogin;
