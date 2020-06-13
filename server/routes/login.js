const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario');




const app = express();

app.post('/register', (req, res) => {
    Usuario.create(req.body)
        .then(usuario => {
            res.json(usuario);
        }).catch(err => res.json(err));
});


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }


        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });



    });

});

function obtenerMenu(ROLE) {

    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Gráficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'RxJs', url: '/rxjs' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // { titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Categorias', url: '/categorias' },
                { titulo: 'Productos', url: '/productos' },
                { titulo: 'Articulos', url: '/articulos' }
            ]
        }
    ];

    console.log('ROLE', ROLE);

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }


    return menu;

}




// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        username: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };


        if (usuarioDB) {

            if (usuarioDB.google === true) {
                return res.status(200).json({
                    ok: true,
                    err: {
                        message: 'Bienvenido de nuevo'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });

            }

        } else {
            // Si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();

            usuario.username = googleUser.username;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });


            });

        }


    });


});

//  configuraciones de facebook


app.post('/login-with-facebook', async(req, res) => {
    const { accessToken, usuarioID } = req.body

    const response = await fetch(`https: //graph.facebook.com/v3.1/me?access_token${accessToken}&method=get&pretty=0&sdk=joey&supress_http_code=1`)
    const json = await response.json()

    if (json.id === usuarioID) {
        //valid user
        const resp = await usuario.findOne({ facebookID: usuarioID })
        if (resp) {
            res.json({ status: 'ok', data: 'estas conectado' })
        } else {
            const usuarioDB = new usuario({
                username: 'nombre',
                facebookID: usuarioID,
                accessToken

            })
            await usuarioDB.save()
            res.json({
                status: 'ok',
                data: 'Bienvenido otra vez'
            })
        }
        //verifica si el usuario esta en la bd 
    } else {
        res.jon({
                status: 'error',
                data: 'usuario o contraseña incorrectos'
            })
            //no autorizado,mandar el error
    }
});


module.exports = app;