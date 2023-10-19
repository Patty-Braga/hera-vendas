const knex = require("../conexao");
const axios = require("axios");

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, numero } = req.body;
  try {
    const clienteEmail = await knex("clientes").where({ email }).first();
    const clienteCpf = await knex("clientes").where({ cpf }).first();

    if (clienteCpf) {
      return res
        .status(400)
        .json({ mensagem: "Este CPF já pertence a outro cliente" });
    }

    if (clienteEmail) {
      return res
        .status(400)
        .json({ mensagem: "Este email já pertence a outro cliente" });
    }

    if (cep) {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
      if (data.erro === true) {
        return res.status(404).json({ mensagem: "Cep não existe" });
      }
      await knex("clientes").insert({
        nome,
        email,
        cpf,
        cep,
        rua: data.logradouro,
        numero,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      });

      return res
        .status(201)
        .json({ mensagem: "Cliente cadastrado com sucesso!" });
    }

    await knex("clientes").insert({
      nome,
      email,
      cpf,
      cep,
      numero,
    });

    return res
      .status(201)
      .json({ mensagem: "Cliente cadastrado com sucesso!" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const listarClientes = async (req, res) => {
  try {
    const clientes = await knex.select("*").from("clientes");

    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const detalharCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const clienteEncontrado = await knex
      .select("*")
      .from("clientes")
      .where({ id })
      .first();

    if (!clienteEncontrado) {
      return res.status(404).json({ mensagem: "Cliente não encontrado" });
    }

    return res.status(200).json(clienteEncontrado);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const editarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, cpf, cep, numero } = req.body;

    const clienteExistente = await knex('clientes').where({ id }).first();

    if (!clienteExistente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    const emailExiste = await knex('clientes').where('email', email).whereNot('id', id).first();
    if (emailExiste) {
      return res.status(400).json({ mensagem: 'Email já pertence a outro cliente' });
    }

    const cpfExiste = await knex('clientes').where('cpf', cpf).whereNot('id', id).first();
    if (cpfExiste) {
      return res.status(400).json({ mensagem: 'CPF já pertence a outro cliente' });
    }

    const clienteAtualizado = {
      nome,
      email,
      cpf,
      numero,
    };

    if (cep) {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
      const { data } = response;

      if (data.erro) {
        return res.status(400).json({ mensagem: 'CEP inválido ou não encontrado' });
      }

      clienteAtualizado.cep = cep;
      clienteAtualizado.rua = data.logradouro;
      clienteAtualizado.bairro = data.bairro;
      clienteAtualizado.cidade = data.localidade;
      clienteAtualizado.estado = data.uf;
    }

    await knex('clientes').where({ id }).update(clienteAtualizado);

    return res.status(200).json({ mensagem: 'Dados atualizados com sucesso' });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrarCliente,
  listarClientes,
  detalharCliente,
  editarCliente,
};
