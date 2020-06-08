const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Seccion = require('../models/seccion');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/seccion', (req, res) => {

    Seccion.find({})
        .sort('descripcion')
        .populate('usuario', 'username email')
        .exec((err, seccion) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                seccion
            });

        })
});

// ============================
// Mostrar una seccion por ID
// ============================
app.get('/seccion/:id', (req, res) => {
    // Seccion.findById(....);

    let id = req.params.id;

    Seccion.findById(id, (err, seccionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!seccionDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }


        res.json({
            ok: true,
            seccion: seccionDB
        });

    });


});

// ============================
// Crear nueva seccion
// ============================
app.post('/seccion', [verificaToken, verificaAdmin_Role], (req, res) => {
    // regresa la nueva seccion
    // req.usuario._id
    let body = req.body;

    let seccion = new Seccion({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    seccion.save((err, seccionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!seccionDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            seccion: seccionDB
        });


    });


});

// ============================
// Actualizar una seccion por ID
// ============================
app.put('/seccion/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Seccion.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, seccionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!seccionDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            seccion: seccionDB
        });

    });


});


// ============================
// Borrar una seccion por ID
// ============================

app.delete('/seccion/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo un administrador puede borrar categorias
    // Seccion.findByIdAndRemove
    let id = req.params.id;

    Seccion.findByIdAndRemove(id, (err, seccionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!seccionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Seccion Borrada'
        });

    });


});


module.exports = app;