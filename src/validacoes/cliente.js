const joi = require("joi");

const validacaoCliente = joi.object({
  nome: joi
    .string()
    .min(3)
    .required()
    .pattern(new RegExp(/^[A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/))
    .messages({
      "any.required": "O campo nome é obrigatório",
      "string.empty": "O campo nome é obrigatório",
      "string.pattern.base":
        "O campo nome deve conter apenas caracteres válidos, não deve conter multiplos espaços em branco, e não deve iniciar ou terminar com espaços vazios",
      "string.min": "O campo nome precisa ter, no mínimo, 3 caracteres",
    }),

  email: joi.string().email().required().messages({
    "any.required": "O campo email é obrigatório",
    "string.empty": "O campo email é obrigatório",
    "string.email": "O campo email precisa ser um email válido",
  }),
  cpf: joi
    .string()
    .required()
    .regex(/^\d{11}$/)
    .messages({
      "any.required": "O campo CPF é obrigatório",
      "string.empty": "O campo CPF é obrigatório",
      "string.pattern.base": "O campo CPF deve ter exatamente 11 números e conter apenas caracteres numéricos",
    }),
  cep: joi
    .string()
    .allow(null, "")
    .regex(/^\d{8}$/)
    .messages({
      "string.pattern.base": "O Cep deve ter, exatamente, 8 dígitos e conter apenas caracteres numéricos",
    }),
  numero: joi
    .string()
    .allow(null, "")
    .max(10)
    .messages({
      "string.max": "O campo numero pode conter até 10 caracteres",
    }),
});

module.exports = validacaoCliente;
