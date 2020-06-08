const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', ],
    message: '{VALUE} no es un rol válido'
};


let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    username: {
        type: String,
        required: [true, 'El username es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },

    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },


    //falta la function de oauth
    facebook: {
        type: Boolean,
        default: false
    },


    fecha_registro: { type: Date, required: true },
});


usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('Usuario', usuarioSchema);