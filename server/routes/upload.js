const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');


/**
 * OPCIONES POR DEFECTO
 */

app.use(fileUpload());
app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    /**
     * VALIDAR SI NO SE HA SELECCIONADO NINGUN ARCHIVO
     */
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    /**
     * VALIDAR TIPO
     */

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos.join(', ')
            }
        });
    }

    /**
     * EXTENSIONES PERMITIDAS
     */

    let archivo = req.files.archivo;
    let archivoSeparado = archivo.name.split('.');
    let extension = archivoSeparado[archivoSeparado.length - 1];

    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extencionesValidas.join(', ')
            }
        });
    }

    /**
     * CAMBIAR EL NOMBRE AL ARCHIVO EN EL BACKEND
     */
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        /**
         * AQUI YA SE QUE LA IMAGEN ESTA EN EL FILE SYSTEM
         */
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).join({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Usuario no existe en la base de datos'
                }
            });
        }


        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'El producto no existe en la base de datos'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathUrlImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    /**
     * VERIFICA SI EL ELEMENTO EXISTE ALMACENADO PARA QUE NO EXISTAN IMAGENES DUPLICADAS
     */
    if (fs.existsSync(pathUrlImagen)) {
        fs.unlinkSync(pathUrlImagen);
    }

}


module.exports = app;