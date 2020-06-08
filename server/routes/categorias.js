const express = require('express');

let { verificaToken, verificaAdmin_Role, } = require('../middlewares/autenticacion');

let app = express();

let Categorias = require('../models/categorias');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categorias', (req, res) => {

    Categorias.find({})
        .sort('descripcion')
        .populate('usuario', 'username email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        })
});

// ============================
// Mostrar una categorias por ID
// ============================
app.get('/categorias/:id', (req, res) => {
    // Categorias.findById(....);

    let id = req.params.id;

    Categorias.findById(id, (err, categoriasDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriasDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }


        res.json({
            ok: true,
            categorias: categoriasDB
        });

    });


});

// ============================
// Crear nueva categorias
// ============================
app.post('/categorias', [verificaToken, verificaAdmin_Role], (req, res) => {
    // regresa la nueva categorias
    // req.usuario._id
    let body = req.body;

    let categorias = new Categorias({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categorias.save((err, categoriasDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriasDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias: categoriasDB
        });


    });


});

// ============================
// Actualizar una categorias por ID
// ============================
app.put('/categorias/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategorias = {
        descripcion: body.descripcion
    };

    Categorias.findByIdAndUpdate(id, descCategorias, { new: true, runValidators: true }, (err, categoriasDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriasDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias: categoriasDB
        });

    });


});


// ============================
// Borrar una categorias por ID
// ============================

app.delete('/categorias/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo un administrador puede borrar categorias
    // Categorias.findByIdAndRemove
    let id = req.params.id;

    Categorias.findByIdAndRemove(id, (err, categoriasDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriasDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categorias Borrada'
        });

    });


});


module.exports = app;