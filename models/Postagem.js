const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')
const Postagens = new Schema({
    titulo:{
        type: String,
        required: true
    },

    slug:{
        type: String,
        default: Math.random().toString(36).substring(2, 20) + Math.random().toString(36).substring(2, 20)
    },

    largura:{
        type: Number,
        required: true
    },

    altura:{
        type:Number,
        required: true
    },
    
    url:{
        type: String,
        required: true,
    },

    categoria:{
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: false
    },

    data_publicada:{
        type: String,
        required: true
    },

    data_unix: {
        type: String,
        required: true
    },

    comentarios_texto: [{
        type: String
    }],

    comentarios_id: [{
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    }],

    curtidas_id: [{
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    }],

    curtidas_total: {
        type: Number,
        default: 0,
        required: true
    },

    ultima_curtida:{
        type: String,
        default: "0 pessoas"
    },

    responsavel_id: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true
    },

    responsavel_usuario: {
        type: String,
        required: true
    },

    se_curtiu: {
        type: Boolean,
        default: false
    },
    position: {
        type: Number,
        default: 0,
        required: false
    },
    avatar: {
        type: String,
    }
})

Postagens.plugin(mongoosePaginate)
mongoose.model('postagens', Postagens)