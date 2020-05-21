const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

//Banco de dados
require('../../models/Usuario')
const Usuario = mongoose.model('usuario')

//Rotas
router.post('/', (req, res) => {
    console.log(req.body)
    Usuario.findOne({$or:[{email: req.body.email}]}).then((usuario) => {
        if(usuario){
            res.json({erro: 'E-mail já cadastrado'})
        }else{
            const novoUsuario = {
                nome: req.body.nome,
                usuario: req.body.usuario,
                email: req.body.email,
                senha: req.body.senha,
                avatar: String("perfil/" + Math.floor(Math.random() * 10) + '.png')
            }

            bcryptjs.genSalt(10, (erro, salt) => {
                if(erro){
                    res.json({erroUser: 'Sinto muito houve um erro, estamos tentanto fazer o melhor para você!! Tente novamente :)', erroAdmin: erro})
                }
                bcryptjs.hash(novoUsuario.senha, salt, (erro, hash) => {
                    if(erro){
                        res.json({erroUser: 'Sinto muito houve um erro, estamos tentanto fazer o melhor para você!! Tente novamente :)', erroAdmin: erro})
                    }else{
                        novoUsuario.senha = hash

                        new Usuario(novoUsuario).save().then(() => {
                            res.json({sucesso: `Muito bem ${novoUsuario.nome}, criamos sua conta agora é só fazer Login! :)`})
                        }).catch((erro) => {
                            res.json({erroUser: 'Sinto muito houve um erro, estamos tentanto fazer o melhor para você!! Tente novamente :)', erroAdmin: erro})
                        })
                    }

                })
            })
        }
    })
})

module.exports = router