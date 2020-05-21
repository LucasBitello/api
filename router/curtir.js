const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
require('../models/Usuario')
require('../models/Postagem')
const Usuario = mongoose.model('usuario')
const Postagem = mongoose.model('postagens')

router.get('/:id', (req, res) => {
    const resolve = jwt.decode(req.headers.authorization)
    Usuario.findOne({_id: resolve.id}).then((usuario) => {
        if(usuario){
            Postagem.findOne({_id: String(req.params.id)}).then((postagem) => {
                if(postagem.curtidas_id.indexOf(String(resolve.id)) > -1){
                    const total = Number(postagem.curtidas_total) - 1
                    Postagem.updateOne({_id: req.params.id}, {$pull: {curtidas_id: {$in: [usuario._id]}}, $unset: {ultima_curtida: ''}, curtidas_total: total}).then(() => {
                        res.json({sucesso: 'ok'})
                    }).catch((erro) => {
                        console.log(erro)
                        res.json({errorUser: 'Ops houve um erro', errorAdmin: erro})
                    })
                }else{
                    const total = Number(postagem.curtidas_total) + 1
                    Postagem.updateOne({_id: String(req.params.id)}, {$push: {curtidas_id: resolve.id}, ultima_curtida: String(usuario.usuario), curtidas_total: Number(total)}).then(() => {
                        res.json({sucesso: 'ok'})
                    }).catch((erro) => {
                        res.json({errorUser: 'Ops houve um erro', errorAdmin: erro})
                    })
                }
            })
        }
    }).catch((erro) => {
        res.json({errorUser: 'Ops houve um erro', errorAdmin: erro})
    })
})

module.exports = router