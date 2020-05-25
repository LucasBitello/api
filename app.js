const express = require('express')
const app = express()
const session = require('express-session')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

/*Autentição
const passport = require('passport')
require('./config/auth')(passport)
app.use(passport.initialize())
app.use(passport.session())*/

//Conexão com o Banco de Dados
mongoose.Promise = global.Promise
mongoose.connect("mongodb+srv://lucasbitello:gremista7@cluster0-w29te.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology:true}).then(function(){ //conecta ao banco de dados "mymeme"
    console.log("Conectado com sucesso ao banco de dados.")
    }).catch(function(erro){ 
        console.log("Não foi possível conectar ao banco de dados: "+erro)
})

//Armazenamento das info do usuario
app.use(session({
    secret: 'DCMEMES',
    resave: true,
    saveUninitialized: true
}))

// Middleware
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next()
})  

//Permite receber os arquivos encriptografados do cliente
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//caminho para arquivos estáticos
app.use(express.static(path.join(__dirname, "public")))

//Rotas compartilhadas
    //arquivos
        const cadastro = require('./router/mobile/cadastro')
        const login = require('./router/mobile/login')
        const novoPost = require('./router/mobile/novoPost')
        const curtir = require('./router/curtir')
        const coment = require('./router/coment')
        const perfilOuther = require('./router/mobile/perfilOuther')
    //rotas
        app.use('/cadastro', cadastro)
        app.use('/login', login)
        app.use('/novopost', novoPost)
        app.use('/curtirpost', curtir)
        app.use('/coment', coment)
//Rotas Web
    //Arquivos
        const homeWeb = require('./router/web/home') 
    //rotas
        app.use('/', homeWeb)

//Rotas Mobile
    //Arquivos
        const homeMob = require('./router/mobile/home')
        const perfil = require('./router/mobile/perfil')
        const verifOn = require('./router/mobile/verifOn')
    //rotas
        app.use('/mobile', homeMob)
        app.use('/mobile', perfil)
        app.use('/mobile', perfilOuther)
        app.use('/mobile', verifOn)

//Servidor
const PORT = 3000
app.listen(PORT, () => {
    console.log('Servidor executando corretamente')
})