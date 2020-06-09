var jwt = require('jsonwebtoken');
var Usuario = require('../models/usuario');

var SEED = require('../config/config').SEED;

// =====================
// Verificar Token
// =====================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });



};

// =====================
// Verifica AdminRole
// =====================
let verificaAdmin_Role = (req, res, next) => {
    var id = req.params.id;
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

// =====================
// Verifica El mismo usuario o admin
// =====================
let verificaADMIN_o_MismoUsuario = (req, res, next) => {

    let usuario = req.usuario;
    var id = req.params.id;
    console.log(usuario._id);
    console.log(id);


    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();

        return;
    } else {

        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es administrador ni es el mismo usuario',
            errors: { message: 'No es administrador, no puede hacer eso' }
        });

    }



};


// =====================
// Verifica token para imagen
// =====================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });


}


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaADMIN_o_MismoUsuario,
    verificaTokenImg,


}