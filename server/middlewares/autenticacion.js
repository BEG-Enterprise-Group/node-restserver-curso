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
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario no tiene privilegios de administrador'
            }
        });
    }

};



module.exports = {
    verificaToken,
    verificaAdminRol
};