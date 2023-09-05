const express = require('express')
const router = express.Router()
const Pagamento = require('../../../models/Pagamento/Pagamento')
const moment = require('moment')
const gerarPagamento = require('../../../functions/gerarPagamento')
const gerarPulseira = require('../../../functions/gerarPulseira')
const Pulseira = require('../../../models/Pulseira/Pulseira')

router.post('/gerar/', async (req, res) => {
    try {
        let { igreja, afiliados, client } = req.body
        igreja = (isNaN(parseInt(igreja)) || !igreja || igreja < 0)?1:parseInt(igreja)
        if (!client.nome  || !client.sobrenome) {
            return res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza preencher nome e sobrenome!' })
        }
        //Será enviada somente a quantidade de items e o backend vai calcular o valor total e o texto conforme a regra de negócio
        try {
            const {items,pulseiras} = await gerarPulseira({ client,igreja, afiliados })
           console.log(items)
            const pagDesc = items.reduce((a,i)=>{
                return a + (a == '')?`(${i.quantity}) - ${i.name}`:` | (${i.quantity}) - ${i.name}`
            },'')

            var modelPag = { clientNome: `${client.nome} ${client.sobrenome}`, expiracao: moment().add(20, 'minutes'), item: pagDesc, valor: items.reduce((a,i)=>{return a + i.total_amount},0) }
            const pagamento = await Pagamento.create(modelPag)

            modelPag.id = pagamento.id
            modelPag.reference_id = `ibc-pag-${pagamento.id}`

            var modelPulseira = pulseiras.map(p =>{
                return {...p,forma_cadastro: 'Site', pagamentoId: pagamento.id}
            })
            await Pulseira.bulkCreate(modelPulseira)

            const payment = await gerarPagamento(modelPag, items)
            modelPag.payment_id = payment.id
            modelPag.payment_url = payment.links[1].href
            await Pagamento.update(modelPag, { where: { id: modelPag.id } })

            res.json({ payment: payment.links[1].href, pagamentoId: pagamento.id })

        } catch (error) {
            if (modelPag != undefined) {
                if (error.response != undefined) {
                    console.log(error.response.data)
                    modelPag.erro = error.response.data.stringify()
                } else {
                    modelPag.erro = error.toString()
                }
            }
            return res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados de pagamento, gentileza tente novamente!' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router