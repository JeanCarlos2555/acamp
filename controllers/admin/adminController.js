const express = require("express")
const router = express.Router();
const pulseira = require("../../models/Pulseira")
const pagamento = require("../../models/Pagamento/Pagamento");
const { default: axios } = require("axios");

router.get("/", async (req, res) => {
    const pulseiras = await pulseira.findAll({order: [['id', 'ASC']]});
    res.render("admin", {pulseiras: pulseiras})
})

router.post("/cadpulseira", async (req, res) => {
  
    //Cadastrar pagamento.
    //Methodo = "Dinheiro fisico" // status fisico // cliente nome = nome // cliente email = email@ibc //cliente documento = 0  // cliente phone = 0 // item = pulseira // valor
    const valor = req.body.valor_pago
    
    axios.get(`/cadpagamento/${valor}`).then( resposta => {
            console.log(resposta)
        }
    )
})

router.get(`/cadpagamento/:valor`, async function(req, res) {
    let valor = req.params.valor
    const method = "Dinheiro fisico";
    const status = "Finalizado";
    const clientNome = "Admin" 
    const clientEmail = "Admin@ibc"
    const clientDocumento = "0"
    const clientPhone = "0"
    const item = "IBC Teresina - Acamp 2023"

    pagamento.create({
        method: method,
        status: status,
        clientNome: clientNome,
        clientEmail: clientEmail,
        clientDocumento: clientDocumento,
        clientPhone: clientPhone,
        item: item,
        valor: valor
    }).then(function(pagamento){
        res.send(pagamento)
    }).catch(function(erro){
        res.send("Houve um erro: " + erro)
    })

})

module.exports = router