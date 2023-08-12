require("dotenv").config()
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser")
const session = require("express-session")
const email = process.env.MAIL_EMAIL
const password = process.env.MAIL_PASS
const porta = 8012

//config
// tamprete Engine
//app.engine('ejs', ejs.engine({defaultLayout: 'main'}));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//body-parser
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({secret: 'kldasjdlaskdjskvnlkmdlas'}))

const ControlerAdmin = require('./controlers/admin/ControlerAdmin');
app.use('/admin', auth, ControlerAdmin)

function auth(req, res, next) {
    next()
}

app.get('/', function(req, res){
    res.render('home')
})

app.get('/programacao', function(req, res){
    res.render('programacoes')
})
app.get('/informacoes', function(req, res){
    res.render('informacoes')
})
app.get('/inscricoes', function(req, res){
    res.render('inscricoes')
})


app.listen(porta, function() {
    console.log(`Servidor rodando na url http://localhost:${porta}`)
})
 
