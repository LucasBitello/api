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
            res.json({errorUser: "Ops parece que este usuario nom ecxiste"})
        }else{
            Postagem.find({responsavel_id: resolve.id}).sort({data: 'asc'}).then((postagens) => {
                var totalPostagens = postagens.length
                for(var i = 0; i < totalPostagens; i++){
                    postagens[i].position = i
                    if(postagens[i].curtidas_id.indexOf(usuario._id) > -1){
                        postagens[i].se_curtiu = true
                    }
                }
                res.json({
                    postagens: postagens,
                    usuario: usuario
                })
            })
        }
    })
})

router.post('/perfil/memes', (req, res) => {
    const page = req.query
    Postagem.paginate({}, {page, limit: 10})
})

module.exports = router