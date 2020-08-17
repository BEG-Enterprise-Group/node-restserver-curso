const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la categria es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        //PREGUNTAR ESTO 
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} las categorias deben ser únicas y no repetirse' });
module.exports = mongoose.model('Categoria', categoriaSchema);