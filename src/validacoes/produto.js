const joi = require("joi");

const validacaoProduto = joi.object({
    descricao: joi
        .string()
        .min(5)
        .max(150)
        .required()
        .pattern(new RegExp(/^(?!.*  )[\p{L}\p{N}\s!@#$%^&*()_+-=,.<>;:'"\\/[\]]*$/u))
        .messages({
            "any.required": "O campo descricao é obrigatório",
            "string.empty": "O campo descricao é obrigatório",
            "string.min": "O campo descricao precisa ter, no mínimo, 5 caracteres",
            "string.max": "O campo descricao precisa ter, no máximo, 150 caracteres",
            "string.pattern.base": "O campo descricao não deve conter multiplos espaços em branco",
        }),
    quantidade_estoque: joi
        .number()
        .integer()
        .required()
        .messages({
            "any.required": "O campo quantidade_estoque é obrigatório",
            "number.base": "O campo quantidade_estoque deve ser um número",
            "number.integer": "O campo quantidade_estoque deve ser um número inteiro",
        }),
    valor: joi
        .number()
        .integer()
        .required()
        .messages({
            "any.required": "O campo valor é obrigatório",
            "number.base": "A campo valor deve ser um número",
            "number.integer": "A campo valor deve ser um número inteiro",
        }),
    categoria_id: joi
        .number()
        .integer()
        .required()
        .messages({
            "any.required": "O campo categoria_id é obrigatório",
            "number.base": "A campo categoria_id deve ser um número",
            "number.integer": "A campo categoria_id deve ser um número inteiro",
        }),
});

module.exports = validacaoProduto;