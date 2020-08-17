const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRol, verificarUsuario } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificaToken, (req, res) => {
    let status = req.query.status || true;
    let estadoStatus = {
        estado: status
    }
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find(estadoStatus, 'nombre email role estado google img') //EN EL SEGUNDO ARGUMENTO SOLO SON LOS CAMPOS QUE QUIERO VER
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            /**
             * EN EL COUNT DEBE IR LA MISMA CONDICION QUE SE COLOCA EN EL .FIND
             */
            Usuario.countDocuments(estadoStatus, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});

app.post('/usuario', [verificaToken, verificaAdminRol], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        //USUARIODB ES EL USUARIO QUE SE GUARDO EN MONGO
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.put('/usuario/:id', [verificaToken, verificarUsuario, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });
});

app.delete('/usuario/:id', [verificaToken, verificarUsuario, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    /**
     * PARA CAMBIAR SU ESTADO EN LA BASE DE DATOS Y NO SER ACCESIBLE
     */
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

    /**
     * PARA BORRAR FISICAMENTE EL REGISTRO DE LA BASE DE DATOS
     */
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };
    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado en la Base de datos'
    //             }
    //         });
    //     };
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });
});


module.exports = app;