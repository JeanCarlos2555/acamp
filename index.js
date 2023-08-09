const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser")
const session = require("express-session")

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

app.get('/', function(req, res){
    res.render('home')
})

app.listen(8012, function() {
    console.log("Servidor rodando na url http://localhost:8012")
})
 
