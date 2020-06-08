var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var articuloSchema = new Schema({
    titulo: { type: String, required: [true, 'El titulo es necesario'] },
    descripcion: { type: String, required: true },
    img: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    seccion: { type: Schema.Types.ObjectId, ref: 'Seccion', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Articulo', articuloSchema);