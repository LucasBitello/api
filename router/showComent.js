const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Postagem')
const Postagem = mongoose.model('postagens')  
require('../models/Usuario')
const Usuario = mongoose.model('usuario')

const findAvatar = async function(param){
    var user = await Usuario.findOne(param)
    return user.avatar
}

router.post('/:id/', (req, res) => {
    var {page} = req.query
    //var coment = [String(usuario._id), String(usuario.usuario), String(req.body.coment), String(Math.floor(Math.random() * 65487875))
    Postagem.findById(req.params.id).skip(10-page).then((postagem) => {
        if(postagem){
            var array_id = []
            for(i = 0; i < postagem.comentarios_texto.length; i++){
                array_id.push(postagem.comentarios_texto[i][0])
            }
            Usuario.find({_id: {$in: array_id}}).then((users) => {
                for(i = 0; i < users.length; i++){
                    for(o = 0; o < postagem.comentarios_texto.length; o++){
                        if(users[i]._id == postagem.comentarios_texto[o][0]){
                            var avatar = users[i].avatar
                            postagem.comentarios_texto[o].push(String(avatar))
                        }
                    }
                }
                console.log(postagem.comentarios_texto)
                res.json(postagem.comentarios_texto)
            })
        }
    })
})

module.exports = router