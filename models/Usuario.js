const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')
const jwt = require("jsonwebtoken");
const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },

    usuario: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    senha: {
        type: String,
        required: true
    },

    eAdmin: {
        type: Number,
        default: 0
    },

    data: {
        type: Date,
        default: Date.now()
    },

    avatar: {
        type: String
    },

    seguidores: [{
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    }],

    seguindo: [{
        type:  Schema.Types.ObjectId,
        ref: 'usuarios'
    }],

    postagens: [{
        type: Schema.Types.ObjectId,
        required: 'postagens'
    }]
})

Usuario.methods = {
    generateToken() {
        return jwt.sign({ id: this.id }, "secret", {
            expiresIn: 63620121600
        });
  }
};

Usuario.plugin(mongoosePaginate)
mongoose.model('usuario', Usuario)