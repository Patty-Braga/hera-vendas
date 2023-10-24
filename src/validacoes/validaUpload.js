const joi = require("joi");

const validarCadastro = async (schema, req, res) => {
    try {
        return await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(400).json({
            mensagem: error.message
        })
    }
}

const validacaoCadastrarProduto = joi.object({
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
    // produto_imagem: joi
    //     .string()
    //     .required()
    //     .regex(/.*\.(jpg|jpeg|png|gif|bmp)$/)
    //     .messages({
    //         "any.required": "O campo produto_imagem é obrigatório",
    //         "string.empty": "O campo produto_imagem é obrigatório",
    //         "string.pattern.base": "O campo produto_imagem deve conter um arquivo de imagem válido. (com extensão .jpg, .jpeg, .png, .gif ou .bmp)."
    //     })

});

module.exports = {
    validarCadastro,
    validacaoCadastrarProduto
}