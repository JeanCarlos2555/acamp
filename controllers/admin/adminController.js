const express = require("express");
const router = express.Router();
const Pulseira = require("../../models/Pulseira/Pulseira")
const Pagamento = require("../../models/Pagamento/Pagamento");

router.get("/", async (req, res) => {
    const pulseiras = await Pulseira.findAll({order: [['id', 'ASC']]});
    res.render("admin", {pulseiras: pulseiras})
})

router.post("/cadpulseira", async (req, res) => {
    let {client,afiliados,valor_pago,igreja} = req.body

    const {items,pulseiras} = await gerarPulseira({ client,igreja, afiliados })
    //method:'ADMIN',reference_id:'ibc-admin-${id},status:0,clientNome,item,valor
    //Cadastrar pagamento.
    //Methodo = "Dinheiro fisico" // status fisico // cliente nome = nome // cliente email = email@ibc //cliente documento = 0  // cliente phone = 0 // item = Pulseira // valor
    const valor = req.body

    console.log(valor)
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

    Pagamento.create({
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