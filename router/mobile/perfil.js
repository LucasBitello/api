const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
require('../../models/Usuario')
require('../../models/Postagem')
const Usuario = mongoose.model('usuario')
const Postagem = mongoose.model('postagens')

router.post('/perfil', (req, res) => {
    const resolve = jwt.decode(req.headers.authorization)
    Usuario.findOne({_id: resolve.id}).then((usuario) => {
        if(!usuario){
            res.json({errorUser: "Ops houve um erro ou o usuário não existe"})
        }else{
            Postagem.find({responsavel_id: resolve.id}).sort({data: 'asc'}).then((postagens) => {
                for(var i = 0; i < postagens.length; i++){
                    postagens[i].position = i
                    if(postagens[i].curtidas_id.indexOf(usuario._id) > -1){
                        postagens[i].se_curtiu = true
                    }
                }
                userDados = {
                    _id: usuario._id,
                    nome: usuario.nome,
                    usuario: usuario.usuario,
                    avatar: usuario.avatar,
                    seguidores: usuario.seguidores,
                    seguindo: usuario.seguindo,
                    postagens: usuario.postagens
                }
                res.json({
                    postagens: postagens,
                    usuario: userDados
                })
            }).catch((erro) => {
                res.json({errorUser: 'Houve um erro ao mostrar seu perfil', errorAdmin: erro})
            })
        }
    }).catch((erro) => {
        res.json({errorUser: 'Houve um erro ao mostrar seu perfil', errorAdmin: erro})
    })
})

router.post('/perfil/memes', (req, res) => {
    const page = req.query
    Postagem.paginate({}, {page, limit: 10})
})

module.exports = router