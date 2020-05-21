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
    console.log(req.query)
    if(resolve.id != null){
        Usuario.findOne({_id: resolve.id}).then((usuario) => {
            const {page} = req.query
            Postagem.paginate({}, {page, limit: 2}).then((postagens) => {
                for(var i = 0; i < postagens.docs.length; i++){
                    if(postagens.docs[i].curtidas_id.indexOf(usuario._id) > -1){
                        postagens.docs[i].se_curtiu = true
                    }
                    if(page > 1){
                        postagens.docs[i].position = Number(page) + i
                    }else{
                        postagens.docs[i].position = i * page
                    }
                }
                res.json(postagens)
            })
        })
    }else{
        const {page} = req.query
        Postagem.paginate({}, {page, limit: 2}).then((postagens) => {
            res.json(postagens)
        })
    }
})

module.exports = router