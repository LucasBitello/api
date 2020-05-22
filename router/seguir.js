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
    }else{
        res.json({errorUser: 'Você precisa logar para fazer isto'})
    }
})

router.get('/parardeseguir/:id', (req, res) => {
    const resolve = jwt.decode(req.headers.authorization)
    if(resolve.id){
        Usuario.findOne({_id: resolve.id}).then((usuariologado) => {
            Usuario.findOne({_id: req.params.id}).then((outrousuario) => {
                var index_seguindo_logado = usuariologado.seguindo.indexOf(req.params.id)
                if(index_seguindo_logado > -1){
                    usuariologado.seguindo.splice(index_seguindo_logado, 1)
                }
                var index_seguidores_outro = outrousuario.seguidores.indexOf(resolve.id)
                if(index_seguidores_outro > -1){
                    outrousuario.seguidores.splice(index_seguidores_outro, 1)
                }
            }).catch((erro)=>{
                res.json({errorUser: 'Ops tente novamente'})
            })
        }).catch((erro)=>{
            res.json({errorUser: 'Ops tente novamente'})
        })
    }else{
        res.json({errorUser: 'Você precisa logar seguir alguém'})
    }
})

module.exports = router