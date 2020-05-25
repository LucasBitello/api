const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

require('../../models/Usuario')
const Usuario = mongoose.model('usuario')

router.get('/verifOn', (req, res) => {
    console.log('veio')
    const resolve = jwt.decode(req.headers.authorization)
    Usuario.findById(resolve.id).then((usuario) => {
        if(usuario){
            res.json({sucesso: true})
        }else{
            res.json({errorUser: 'Ops não foi possivel verificar conta. Feche o APP e tente novamente'})
        }
    }).catch((erro) => {
        res.json({errorUser: 'Ops feche o APP e tente novamente!!!', errorAdmin: erro})
    })
})

module.exports = router