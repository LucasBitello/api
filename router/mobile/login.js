const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')

//Banco de dados
const mongoose = require('mongoose')
require('../../models/Usuario')
const Usuario = mongoose.model('usuario')

router.post('/', (req, res) => {
    console.log('vei')
    const {email, senha} = req.body
    Usuario.findOne({email: email}).then((usuario) => {
        if(!usuario){
            res.json({errorUser: 'Este E-Mail não existe'})
        }else{
            bcryptjs.compare(senha, usuario.senha, (erro, ok) => {
                if(ok){
                    return res.json({
                        token: usuario.generateToken(),
                        usuario: usuario.usuario
                    })
                }else{
                    return res.json({errorUser: 'Senha incorreta'})
                }
            })
        }
    }).catch((erro) => {
        res.json({errorAdmin: erro})
    })
})

module.exports = router