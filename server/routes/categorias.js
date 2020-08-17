const express = require('express');
let { verificaToken, verificaAdminRol, verificarUsuario } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');


/**
 * MOSTRAR TODAS LAS CATEGORIAS
 */

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find()
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        });
});

/**
 * MOSTRAR UNA CATEGORIA POR ID
 */

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                errr
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro una categoria con el Id que se solicito'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/**
 * CREAR UNA CATEGORIA
 */

app.post('/categoria', [verificaToken, verificaAdminRol], (req, res) => {
    let body = req.body;
    let id = req.usuario._id
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/**
 * ACTUALIZAR UNA CATEGORIA
 */

app.put('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    const nombre = req.body.nombre;
    Categoria.findByIdAndUpdate(id, { nombre }, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.satus(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


/**
 * BORRAR CATEGORIAS
 */

app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrada en la base de datos"
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'Categoria Eliminada'
        });

    });

});


module.exports = app;