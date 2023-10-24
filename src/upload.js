require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});


const uploadImagem = async (req, res) => {
    const { produto_imagem } = req.body

    try {
        const imagemBuffer = fs.readFileSync(produto_imagem);

        const resultado = await cloudinary.uploader.upload(imagemBuffer, {
            resource_type: 'auto'
        });
        console.log('Upload bem sucedido:', resultado);

        return resultado

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = uploadImagem

// const imagem = './imagens-cadastro-produtos/Screenshot_1.png'

// cloudinary.uploader.upload(imagem).then(result => {
//     console.log(result.secure_url);
// })