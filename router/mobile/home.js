const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
//Banco de Dados
    const mongoose = require('mongoose')
    require('../../models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('../../models/Usuario')
    const Usuario = mongoose.model('usuario')

router.post('/', (req, res) => {
    const resolve = jwt.decode(req.headers.authorization)
    if(resolve.id){
        Usuario.findOne({_id: resolve.id}).then((usuario) => {
            const {page} = req.query
            Postagem.paginate({}, {page, limit: 5}).then((postagens) => {
                for(var i = 0; i < postagens.docs.length; i++){
                    var id_para_avatar = postagens.docs[i].responsavel_id
                    Usuario.findOne({_id: id_para_avatar}).then((user_para_avatar) => {
                        postagens.docs[i].avatar = String(user_para_avatar.avatar) || 'https://thumbs.dreamstime.com/z/imita%C3%A7%C3%A3o-do-fundo-transparente-69028332.jpg'
                    }).catch((erro) => {
                        console.log(erro)
                    })
                    if(postagens.docs[i].curtidas_id.indexOf(usuario._id) > -1){
                        postagens.docs[i].se_curtiu = true
                    }
                    postagens.docs[i].position = (Number(page)*5 + i) - 5
                }
                res.json(postagens)
            }).catch((erro) => {
                res.json({errorUser: 'Erro ao listar os memes', errorAdmin: erro})
            })
        })
    }
})

module.exports = router