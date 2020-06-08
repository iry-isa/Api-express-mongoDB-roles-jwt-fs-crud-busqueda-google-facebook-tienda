const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Articulo = require('../models/articulo');



// default options
app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', function(req, res, next) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    // Valida tipo de colección
    let tiposValidos = ['productos', 'articulos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', ')
            }
        })
    }
    // Obtener nombre del archivo
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'pdf'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre al archivo
    // 183912kuasidauso-123.jpg
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds()  }.${ extension }`;

    // Mover el archivo del temporal a un path
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });

        // Aqui, imagen cargada
        subirPorTipo(tipo, id, nombreArchivo, res);
        (id);


    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuarioDB) => {

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }


            var pathViejo = '../../uploads/usuarios/' + usuarioDB.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            (usuarioDB);
            usuarioDB.img = nombreArchivo;

            usuarioDB.save((err, usuarioActualizado) => {

                //usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuarioDB: usuarioActualizado
                });

            })


        });

    }

    if (tipo === 'productos') {

        Producto.findById(id, (err, producto) => {

            if (!producto) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El producto no existe',
                    errors: { message: 'El producto no existe' }
                });
            }

            var pathViejo = '../../uploads/productos/' + producto.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            producto.img = nombreArchivo;

            producto.save((err, productoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de médico actualizada',
                    producto: productoActualizado
                });

            })

        });
    }

    if (tipo === 'articulos') {

        Articulo.findById(id, (err, articulos) => {

            if (!articulos) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Articulo no existe',
                    errors: { message: 'Articulo no existe' }
                });
            }

            var pathViejo = '../../uploads/articulos/' + articulo.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            articulos.img = nombreArchivo;

            articulos.save((err, articuloActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de articulos actualizada',
                    articulos: articuloActualizado
                });

            })

        });
    }


}



module.exports = app;