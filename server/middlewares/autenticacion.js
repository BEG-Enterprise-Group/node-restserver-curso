const jwt = require('jsonwebtoken');
/**
 * VERIFICAR TOKEN
 */

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEMILLA_AUTENTICACION, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Error de Autenticación de usuario'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

/**
 * VERIFICA ADMIN ROL
 */

let verificaAdminRol = (req, res, next) => {
    let usuario = req.usuario;
    let id = req.params.id;
    if (usuario.role === 'ADMIN_ROLE') {
        if (id === req.usuario._id) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'No se puede cambiar el rol de su mismo usuario debe Hacerlo un SuperAdministrador'
                }
            });
        } else {
            next();
        }
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario no tiene privilegios de administrador'
            }
        });
    }

};

/**
 * VERIFICAR QUE NO SE MODIFIQUEN LA INTEGRIDAD DE DATOS DE UN MISMO USUARIO
 */

let verificarUsuario = (req, res, next) => {
    let id = req.params.id;
    if (id === req.usuario._id) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No se puede cambiar el rol de su mismo usuario debe Hacerlo un SuperAdministrador'
            }
        });
    } else {
        next();
    }
};


module.exports = {
    verificaToken,
    verificaAdminRol,
    verificarUsuario
};