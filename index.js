require("dotenv").config()
const express = require("express");
const app = express();
const path = require("path");
const moment = require("moment");
const bodyParser = require("body-parser")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const flash = require('express-flash')
const auth = require('./middleware/auth')


const PORT = process.env.PORT || 8013

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
const hookController = require('./controllers/hookController');
const Pagamento = require("./models/Pagamento/Pagamento");
const Pulseira = require("./models/Pulseira/Pulseira");
const getPagamento = require("./functions/getPagamento");
app.use('/admin', auth, adminController)
app.use('/login', loginController)
app.use('/api', apiController)
app.use('/hook', hookController)

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
app.get('/sucesso', async (req, res)=>{
    try {
        const referenceId = req.query.referenceId

        if (!referenceId) {
            console.log('Referência não foi recebida')
            return res.redirect('/')        
        }
        const pagamento = await Pagamento.findOne({where:{reference_id:referenceId},attributes:['id']})
        if (!pagamento) {
            console.log('Pagamento não encontrado na base de dados '+ referenceId)
            return res.redirect('/')   
        }

        const pag = await getPagamento(pagamento.id)
        if (pag.erro != undefined) {
            console.log(pag.erro)
            return res.redirect('/') 
        }
        // console.log(pag)

        const pulseiras = await Pulseira.findAll({where:{pagamentoId:pagamento.id}})
        if (pulseiras.length == 0) {
            console.log('Pulseiras não atreladas ao pagamento '+ pagamento.id)
            return res.redirect('/') 
        }
        if (pag && pag.status == 1) {
            pag.char_createdAt = moment(pag.char_createdAt).format('DD/MM/YYYY HH:mm:SS')
            pag.valor_parcela = parseFloat((pag.char_paid / 100) /  pag.char_payment_installments).toFixed(2)
        }
        
        // console.log(pag)

        res.render('sucesso',{pulseiras,pagamento:pag})
    } catch (error) {
        console.log(error)
        res.redirect('/')        
    }
})

app.get('/impressao', async (req, res)=>{
    try {
        const referenceId = req.query.referenceId

        if (!referenceId) {
            console.log('Referência não foi recebida')
            return res.redirect('/')        
        }
        
        const pagamento = await Pagamento.findOne({where:{reference_id:referenceId},attributes:['char_createdAt','char_payment_installments','char_payment_type','status','id','char_paid']})
        if (!pagamento) {
            console.log('Pagamento não encontrado na base de dados '+ referenceId)
            return res.redirect('/')   
        }
        const pulseiras = await Pulseira.findAll({where:{pagamentoId:pagamento.id}})
        if (pulseiras.length == 0) {
            console.log('Pulseiras não atreladas ao pagamento '+ pulseiras.id)
            return res.redirect('/') 
        }
        if (pagamento && pagamento.status == 1) {
            pagamento.char_createdAt = moment(pagamento.char_createdAt).format('DD/MM/YYYY HH:mm:SS')
            pagamento.valor_parcela = parseFloat((pagamento.char_paid / 100) /  pagamento.char_payment_installments).toFixed(2)
        }else{
            console.log('Pagamento não confirmado')
            return res.redirect('/') 
        }

        res.render('impressao',{pulseiras,pagamento})
    } catch (error) {
        res.redirect('/')        
    }
})

app.listen(PORT, function() {
    console.log(`Servidor rodando na url http://localhost:${PORT}`)
})
 
