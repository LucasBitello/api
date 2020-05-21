const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

require('../models/Usuario')
const Usuario = mongoose.model('usuario')

router.get('/seguir/:id', (req, res) => {
    const resolve = jwt.decode(req.headers.authorization)
    if(resolve.id){
        Usuario.findByIdAndUpdate(req.params.id, {$push: {seguidores: resolve.id}}).then(() => {
            Usuario.findByIdAndUpdate(resolve.id, {$push: {seguindo: req.params.id}}).then(() => {
                res.json({sucess: `seguindo`})
            }).catch((erro) => {
                res.json({errorUser: 'Erro ao seguir o usuario, nos desculpe, PFF tente novamente', errorAdmin: erro})
            })
        }).catch((erro) => {
            res.json({errorUser: 'Erro ao seguir o usuario, nos desculpe, PFF tente novamente', errorAdmin: erro})
        })
    }
})

module.exports = router