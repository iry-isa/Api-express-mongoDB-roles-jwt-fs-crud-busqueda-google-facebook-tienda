const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let categoriasSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


module.exports = mongoose.model('Categorias', categoriasSchema);