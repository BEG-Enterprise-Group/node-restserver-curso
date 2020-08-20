const express = require('express');
const fs = require('fs');
let app = express();
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');


app.get('/imagenes/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let imagen = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);
    let noImagePath = path.resolve(__dirname, '../assets/imagen_no_encontrada.png');
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(noImagePath);
    }


});






module.exports = app;