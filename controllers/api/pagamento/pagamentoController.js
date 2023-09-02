const express = require('express')
const router = express.Router()
const Pagamento = require('../../../models/Pagamento/Pagamento')
const moment = require('moment')
const gerarPagamento = require('../../../functions/gerarPagamento')
const gerarPulseira = require('../../../functions/gerarPulseira')
const Pulseira = require('../../../models/Pulseira/Pulseira')
const Afiliados = require('../../../models/Pulseira/afiliados')

router.post('/gerar/', async (req, res) => {
    try {
        let { igreja, afiliados, client } = req.body
        console.log(req.body)
        igreja = (isNaN(parseInt(igreja)) || !igreja || igreja < 0)?1:parseInt(igreja)
        if (!client.nome  || !client.sobrenome) {
            return res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza preencher nome e sobrenome!' })
        }
        //Será enviada somente a quantidade de items e o backend vai calcular o valor total e o texto conforme a regra de negócio
        try {
            const items = await gerarPulseira({ igreja, afiliados })
            items.unit_amount = parseInt(parseFloat(items.unit_amount).toFixed(2).replace('.',''))
            // var modelPag = {clientNome:client.nome, clientEmail:client.email,clientDocumento:client.cpf,expiracao:moment().add(20,'minutes'),clientPhone:client.telefone,item:`${items.desc}`,valor:items.total}
            var modelPag = { clientNome: `${client.nome} ${client.sobrenome}`, expiracao: moment().add(20, 'minutes'), item: `${items.desc}`, valor: items.total_amount }
            const pagamento = await Pagamento.create(modelPag)
            modelPag.id = pagamento.id
            modelPag.reference_id = `ibc-pag-${pagamento.id}`
            var modelPulseira = { nome: client.nome, sobrenome: client.sobrenome, igreja: igreja, valor_pulseira: items.unit_amount, qtde_pulseira: items.quantity, valor_total: items.total_amount, forma_cadastro: 'Site', pagamentoId: pagamento.id }
            const payment = await gerarPagamento(modelPag, client, items)
            modelPag.payment_id = payment.id
            modelPag.payment_url = payment.links[1].href

            res.json({ payment: payment.links[1].href, pagamentoId: pagamento.id })

        } catch (error) {
            console.log(error)
            if (modelPag != undefined) {
                if (error.response != undefined) {
                    console.log(error.response.data)
                    modelPag.erro = error.response.data.stringify()
                } else {
                    modelPag.erro = error.toString()
                }
            }
            return res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados de pagamento, gentileza tente novamente!' })
        } finally {
            if (modelPulseira) {
                const pulseira = await Pulseira.create(modelPulseira)
                if (afiliados.length > 0) {
                    const modelAfilados = afiliados.map(a =>(
                        {
                            nome:(a.nome == undefined)?a.nome:client.nome,
                            sobrenome:(a.sobrenome == undefined)?a.sobrenome:client.sobrenome,
                            pulseira_id:pulseira.id,
                            forma_cadastro:'Site'
                        }
                    ))
                    await Afiliados.bulkCreate(modelAfilados)
                }
            }
            if (modelPag != undefined) {
                await Pagamento.update(modelPag, { where: { id: modelPag.id } })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router