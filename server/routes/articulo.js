const express = require('express');

const { verificaToken, verificaAdmin_Role, verificaADMIN_o_MismoUsuario } = require('../middlewares/autenticacion');


let app = express();
let Articulo = require('../models/articulo');


// ===========================
//  Obtener articulos
// ===========================
app.get('/articulos', (req, res) => {
    // trae todos los articulos
    // populate: usuario seccion
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Articulo.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'username email')
        .populate('seccion', 'descripcion')
        .exec((err, articulos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                articulos
            });


        })

});

// ===========================
//  Obtener un articulo por ID
// ===========================
app.get('/articulos/:id', (req, res) => {
    // populate: usuario seccion
    // paginado
    let id = req.params.id;

    Articulo.findById(id)
        .populate('usuario', 'username email')
        .populate('seccion', 'titulo')
        .exec((err, articuloDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!articuloDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                articulo: articuloDB
            });

        });

});

// ===========================
//  Buscar articulos
// ===========================
app.get('/articulos/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Articulo.find({ titulo: regex })
        .populate('seccion', 'titulo')
        .exec((err, articulos) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                articulos
            })

        })


});



// ===========================
//  Crear un nuevo articulo
// ===========================
app.post('/articulos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una seccion del listado 

    let body = req.body;

    let articulo = new Articulo({
        usuario: req.usuario._id,
        titulo: body.titulo,
        descripcion: body.descripcion,
        disponible: body.disponible,
        seccion: body.seccion,

    });

    articulo.save((err, articuloDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            articulo: articuloDB
        });

    });

});

// ===========================
//  Actualizar un articulo
// ===========================
app.put('/articulos/:id', [verificaToken, verificaADMIN_o_MismoUsuario], (req, res) => {
    // grabar el usuario
    // grabar una seccion del listado 

    let id = req.params.id;
    let body = req.body;

    Articulo.findById(id, (err, articuloDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!articuloDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        articuloDB.titulo = body.titulo;
        articuloDB.seccion = body.seccion;
        articuloDB.disponible = body.disponible;
        articuloDB.descripcion = body.descripcion;
        articuloDB.id = req.usuario.id

        articuloDB.save((err, articuloGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                articulo: articuloGuardado
            });

        });

    });


});

// ===========================
//  Borrar un articulo
// ===========================
app.delete('/articulos/:id', [verificaToken, verificaADMIN_o_MismoUsuario], (req, res) => {

    let id = req.params.id;

    Articulo.findById(id, (err, articuloDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!articuloDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        articuloDB.disponible = false;

        articuloDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                articulo: productoBorrado,
                mensaje: 'Articulo borrado'
            });

        })

    })


});

module.exports = app;