const joi = require("joi");

const validacaoPedido = joi.object({
  cliente_id: joi.number().integer().required().messages({
    "any.required": "O campo cliente_id é obrigatório",
    "number.base": "O campo cliente_id deve ser um número",
    "number.integer": "O campo cliente_id deve ser um número inteiro",
  }),
  observacao: joi.string().max(255).messages({
    "string.max": "O campo observacao precisa ter, no máximo, 255 caracteres",
  }),
  pedido_produtos: joi
    .array()
    .items(
      joi.object({
        produto_id: joi.number().integer().required().messages({
          "any.required": "O campo produto_id é obrigatório",
          "number.base": "O campo produto_id deve ser um número",
          "number.integer": "O campo produto_id deve ser um número inteiro",
        }),
        quantidade_produto: joi.number().integer().required().messages({
          "any.required": "O campo quantidade_produto é obrigatório",
          "number.base": "O campo quantidade_produto deve ser um número",
          "number.integer":
            "O campo quantidade_produto deve ser um número inteiro",
        }),
      })
    )
    .required(),
});

module.exports = validacaoPedido;
