const joi = require("joi");

const validacaoUsuario = joi.object({
  nome: joi
    .string()
    .min(3)
    .required()
    .pattern(new RegExp("^[A-Za-z]+( [A-Za-z]+)*$"))
    .messages({
      "any.required": "O campo nome é obrigatório",
      "string.empty": "O campo nome é obrigatório",
      "string.pattern.base":
        "O campo nome deve conter apenas caracteres válidos",
      "string.min": "O campo nome precisa ter, no mínimo, 3 caracteres",
    }),

  email: joi.string().email().required().messages({
    "any.required": "O campo email é obrigatório",
    "string.empty": "O campo email é obrigatório",
    "string.email": "O campo email precisa ser um email válido",
  }),
  senha: joi
    .string()
    .min(5)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%^&*])"))
    .messages({
      "any.required": "O campo senha é obrigatório",
      "string.empty": "O campo senha é obrigatório",
      "string.min": "O campo senha precisa ter, no mínimo, 5 caracteres",
      "string.pattern.base":
        "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
    }),
});

module.exports = validacaoUsuario;
