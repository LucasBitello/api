const express = require('express')
const router = express.Router()
const fs = require('fs')
const sizeOf = require('image-size')
const Multer  = require('multer');
const jwt = require('jsonwebtoken')

const multer = Multer({
    storage: Multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/memes')
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg'){
                cb(null, true);
            }else{
                return cb(null, false, new Error('I don\'t have a clue!'));
            }
        },
        filename: (req, res, cb) => {
            var nome = res.originalname.split('.').pop()
            cb(null, String(Date.now())+'-'+ String(Math.random()).split('.').pop() + '.' + nome)
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

//Banco de dados
    const mongoose = require('mongoose')
    require('../../models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('../../models/Usuario')
    const Usuario = mongoose.model('usuario')

router.post('/', multer.single('meme'), (req, res) => {
    const resolve = jwt.decode(req.headers.authorization)
    var dimensions = sizeOf('public/memes/'+req.file.filename)
    console.log(dimensions)
    Usuario.findOne({_id: resolve.id}).then((usuario) => {
        if(usuario){
            var data_sem_format = new Date()
                var mes = data_sem_format.getMonth()+1
                var dia = data_sem_format.getDate()
                var hora = data_sem_format.getHours()
                var minuto = data_sem_format.getMinutes()
                if(mes <= 9){
                    var mes = String("0"+mes)
                }
                if(dia <= 9){
                    var dia = String("0"+dia)
                }
                if(hora <= 9){
                    var hora = String("0"+hora)
                }
                if(minuto <= 9){
                    var minuto = String("0"+minuto)
                }
            var data_format = String(dia+"/"+mes+"/"+data_sem_format.getFullYear()+" as "+hora+":"+minuto);

            const novaPostagem = {
                titulo: String(req.body.titulo),
                slug: req.body.slug,
                largura: dimensions.width,
                altura: dimensions.height,
                url: req.file.filename,
                responsavel_id: usuario._id,
                responsavel_usuario: usuario.usuario,
                data_publicada: data_format,
                data_unix: Date.now(),
                avatar: usuario.avatar
            }

            new Postagem(novaPostagem).save().then((x) => {
                var list = usuario.postagens
                list.unshift(x._id)
                Usuario.findOneAndUpdate({_id: resolve.id}, {postagens: list}).then(()=>{
                    res.send({sucesso: 'Enviado com sucesso'})
                }).catch((erro) => {
                    console.log(erro)
                    res.send({errorUser: 'Erro ao enviar a imagem', errorAdmin: erro})
                })
            }).catch((erro) => {
                console.log(erro)
                res.send({errorUser: 'Erro ao enviar a imagem', errorAdmin: erro})
            })
        }
    })
})
router.post('/deletar/:id', (req, res) => {
    const resolve = req.headers.authorization
    Usuario.findOne({_id: resolve.id}).then((usuario) => {
        if(usuario){
            const posts = usuario.postagens
            const pos = posts.indexOf(req.params.id)
            if(pos > -1){
                posts.split(pos, 1)
            }
            Postagem.findByIdAndDelete(req.params.id).then((ok) => {
                Usuario.findOneAndUpdate({_id: resolve.id}, {postagens: posts}).then(()=> {
                    res.json({sucesso: 'deletado'})
                }).catch((erro) => {
                    res.json({errorUser: 'Nos desculpe houve um erro, estamos sempre tentando fazer o melhor para você', errorAdmin: erro})
                })
            }).catch((erro) => {
                res.json({errorUser: 'Nos desculpe houve um erro, estamos sempre tentando fazer o melhor para você', errorAdmin: erro})
            })
        }
    }).catch((erro) => {
        res.json({errorUser: 'Nos desculpe houve um erro, estamos sempre tentando fazer o melhor para você', errorAdmin: erro})
    })
})
module.exports = router