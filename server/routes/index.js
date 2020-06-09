const express = require('express');

const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categorias'));
app.use(require('./producto'));
app.use(require('./seccion'));
app.use(require('./articulo'));
app.use(require('./upload'));
app.use(require('./imagenes'));
app.use(require('./date'));



module.exports = app;