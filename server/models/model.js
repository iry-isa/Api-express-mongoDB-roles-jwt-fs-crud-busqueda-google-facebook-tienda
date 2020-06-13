const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    username: String,
    facebookID: String,
    accessToken: String,

}, { coleccion: 'usuario' })
const model = mongoose.model('usuario', Schema)
module.exports = model