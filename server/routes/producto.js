const express = require('express');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');

/**
 * OBTENER PRODUCTOS
 */
app.get('/productos', verificaToken, (req, res) => {
    let status = req.query.disponible || true;
    let estadoStatus = {
        disponible: status
    };
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find(estadoStatus, 'nombre precioUni descripcion disponible categoria usuario')
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        Message: 'No se encontro ningun producto en la base de datos'
                    }
                });
            }
            Producto.countDocuments(estadoStatus, (err, conteo) => {
                res.json({
                    ok: true,
                    producto: productoDB,
                    Total_Productos: conteo
                });
            });
        });
});

/**
 * OBTENER UN PRODUCTO POR ID
 */
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'No se encontro ningún producto con ese Id'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});


/**
 * BUSCAR PRODUCTOS
 */

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'No se encontro un producto relacionado con su busqueda'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });

});

/**
 * CREAR PRODUCTOS
 */
app.post('/productos', verificaToken, (req, res) => {
    //GRABAR EL USUARIO, UNA CATEGORIA DEL LISTADO QUE YA TENEMOS
    let body = req.body;
    let id = req.usuario._id;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    Message: 'No se pudo almacenar su producto en la base de datos'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

/**
 * ACTUALIAR EL PRODUCTO
 */
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto en la base de datos para su actualización'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto Actulizado'
        });
    });

});

/**
 * ACTUALIAR EL PRODUCTO
 */
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let status = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, status, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto que desea eliminar'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto Eliminado'
        });
    });
});




module.exports = app;