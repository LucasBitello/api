const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
require('../models/Usuario')
require('../models/Postagem')
const Usuario = mongoose.model('usuario')
const Postagem = mongoose.model('postagens')

router.post('/:id', (req, res) => {
    const resolve = jwt.decode(req.headers.authorization)
    if(resolve.id){
        Usuario.findOne({_id: resolve.id}).then((usuario) => {
            var coment = [String(usuario._id), String(usuario.usuario), String(req.body.coment), String(Math.floor(Math.random() * 65487875))]
            Postagem.updateOne({_id: String(req.params.id)}, {$push: {comentarios_texto: [coment]}}).then(() => {
                res.json('ok')
            }).catch((erro) => {
                res.json({errorUser: 'Não foi possivel fazer o comentario, postagem ja foi deletada', errorAdmin: erro})
            })
        }).catch((erro) => {
            res.json({errorUser: 'Não foi possivel fazer o comentario', errorAdmin: erro})
        })
    }else{
        res.json({errorUser: 'Você precisa fazer login para poder comentar'})
    }
})

router.post('/:id/delet/:idcoment', (req, res) => {
    const resolve = jwt.decode(req.headers.authorization)
    Usuario.findOne({_id: resolve.id}).then((usuario) => {
        if(usuario){
            Postagem.findOne({_id: req.params.id}).then((postagem) => {
                if(postagem){
                    var list = postagem.comentarios_texto
                    var remove = undefined
                    for(var i = 0; i < list.lenght; i++){
                        if(list[i].indexOf(String(req.params.idcoment)) > -1){
                            var remove = i
                        }
                    }
                    list.splice(remove, 1)
                    Postagem.findOneAndUpdate({_id: req.params.id}, {comentarios_texto: list}).then((ok) => {
                        if(ok){
                            res.json({sucess: 'Deletado com sucesso'})
                        }
                    }).catch((erro) => {
                        res.json({errorAdmin: erro, errorUser: 'Nao foi possivel deletar o comentario'})
                    })
                }
            }).catch((erro) => {
                res.json({errorAdmin: erro, errorUser: 'Nao foi possivel deletar o comentario'})
            })
        }
    })
})

module.exports = router