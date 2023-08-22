require("dotenv").config()
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const flash = require('express-flash')
const auth = require('./middleware/auth')


const PORT = process.env.PORT || 8012

app.use(cookieParser("asdfasfdasfaz"))
app.use(session({
    secret: "sdfsdfsdfgdfgfgh",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 }
}))
app.use(flash())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    let erro = req.flash('erro');
    let msm = req.flash('msm');
    erro = (erro == undefined || erro.length == 0)?undefined:erro
    msm = (msm == undefined || msm.length == 0)?undefined:msm
    res.locals.erro = erro 
    res.locals.msm = msm 
    next();
});

const adminController = require('./controllers/admin/adminController');
const loginController = require('./controllers/loginController');
const apiController = require('./controllers/apiController');
app.use('/admin', auth, adminController)
app.use('/login', loginController)
app.use('/api', apiController)
app.use('/hook', apiController)

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

app.listen(PORT, function() {
    console.log(`Servidor rodando na url http://localhost:${PORT}`)
})
 
