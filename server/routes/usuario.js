const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role, verificaADMIN_o_MismoUsuario, } = require('../middlewares/autenticacion');

const app = express();


app.get('/usuario', verificaToken, verificaAdmin_Role, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'username email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });


        });


});

app.post('/usuario', [verificaToken, verificaAdmin_Role, verificaADMIN_o_MismoUsuario], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        username: body.username,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {

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

//registro nuevo usuario
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            //usuariotoken: req.usuario
        });


    });

});



// ==========================================
// Actualizar usuario
// ==========================================

app.put('/usuario/:id', [verificaToken, verificaADMIN_o_MismoUsuario,

], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['password', 'img', 'role', 'estado']);

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

    })

});

// ============================================
//   Borrar un usuario por el id
// ============================================

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role, ], function(req, res) {


    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



});



module.exports = app;