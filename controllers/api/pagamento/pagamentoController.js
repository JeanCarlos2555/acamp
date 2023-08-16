const express = require('express')
const router = express.Router()
const Pagamento = require('../../../models/Pagamento/Pagamento')
const moment = require('moment')
const gerarPagamento = require('../../../functions/gerarPagamento')

router.post('/gerar/',async(req,res)=>{
    try {
        const {items,client} = req.body
        //Será enviada somente a quantidade de items e o backend vai calcular o valor total e o texto conforme a regra de negócio
        try {
            var modelPag = {clientNome:client.nome, clientEmail:client.email,clientDocumento:client.cpf,expiracao:moment().add(20,'minutes'),clientPhone:client.telefone,item:`${items.desc}`,valor:items.total}
            const pagamento = await Pagamento.create(modelPag)
            modelPag.id = pagamento.id
            modelPag.reference_id = `ibc-pag-${pagamento.id}`
            
            const payment = await gerarPagamento(modelPag,client,items)
            modelPag.payment_id = payment.id
            modelPag.payment_url = payment.links[1].href
            res.json({payment:payment.links[1].href,pagamentoId:pagamento.id})
                  
        } catch (error) {
            console.log(error)
            if (modelPag != undefined) {
                if (error.response != undefined) {
                    console.log(error.response.data)
                    modelPag.erro = error.response.data.stringify()
                }else{
                    modelPag.erro = error.toString()
                }
            }
            return res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados de pagamento, gentileza tente novamente!' })
        }finally{
            if (modelPag != undefined) {
                await Pagamento.update(modelPag,{where:{id:modelPag.id}})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router