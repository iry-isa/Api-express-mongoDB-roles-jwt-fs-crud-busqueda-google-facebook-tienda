var express = require('express');

var app = express();

var Producto = require('../models/producto');
var Articulo = require('../models/articulo');
var Usuario = require('../models/usuario');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'productos':
            promesa = buscarProductos(busqueda, regex);
            break;

        case 'articulos':
            promesa = buscarArticulos(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, productos y articulos',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarProductos(busqueda, regex),
            buscarArticulos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                productos: respuestas[0],
                articulos: respuestas[1],
                usuarios: respuestas[2]
            });
        })


});


function buscarProductos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Producto.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            //.populate('categorias')
            .exec((err, productos) => {

                if (err) {
                    reject('Error al cargar los productos', err);
                } else {
                    resolve(productos)
                }
            });
    });
}

function buscarArticulos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Articulo.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('categoria')
            .exec((err, articulo) => {

                if (err) {
                    reject('Error al cargar los articulos', err);
                } else {
                    resolve(articulo)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}



module.exports = app;