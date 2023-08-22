const express = require("express");
const router = express.Router();
const pulseira = require("../../models/Pulseira")
const pagamento = require("../../models/Pagamento/pagamento");

router.get("/", async (req, res) => {
    const pulseiras = await pulseira.findAll({order: [['id', 'ASC']]});
    res.render("admin", {pulseiras: pulseiras})
})

router.post("/cadpulseira", async (req, res) => {
  
    //Cadastrar pagamento.
    //Methodo = "Dinheiro fisico" // status fisico // cliente nome = nome // cliente email = email@ibc //cliente documento = 0  // cliente phone = 0 // item = pulseira // valor
    const valor = req.body.valor_pago

    axios.post(`/cadpagamento`, valor).then(resposta => {
        
    }).catch(function(erro){
        console.log(erro)
    })
})

router.post("/cadpagamento", async function(req, res) {
    let valor = req.body.valor
    console.log(valor)
    res.send(valor)
    return
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