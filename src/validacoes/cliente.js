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
            "string.pattern.base": "O campo nome deve conter apenas caracteres válidos, não deve conter multiplos espaços em branco, e não deve iniciar ou terminar com espaços vazios",
            "string.min": "O campo nome precisa ter, no mínimo, 3 caracteres",
        }),

    email: joi.string().email().required().messages({
        "any.required": "O campo email é obrigatório",
        "string.empty": "O campo email é obrigatório",
        "string.email": "O campo email precisa ser um email válido",
    }),
    cpf: joi
        .number()
        .integer()
        .required()
        .min(10000000000)
        .max(99999999999)
        .messages({
            'number.base': 'O CPF deve ser um número',
            'number.integer': 'O CPF deve ser um número inteiro',
            'number.min': 'O CPF deve ter exatamente 11 dígitos',
            'number.max': 'O CPF deve ter exatamente 11 dígitos',
            'any.required': 'O CPF é obrigatório',
        }),
});

module.exports = validacaoCliente