const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const Pagamento = require('../../models/Pagamento/Pagamento')
const Pulseira = require('../../models/Pulseira/Pulseira')

router.post('/notificacao/:referenceId',async(req,res)=>{
    try {
        //Melhorar isso aqui
        console.log('Recebendo notificação')
        console.log(req.body)
        console.log('ID de referência')
        console.log(req.params.referenceId)
        const payment = req.body
        const referenceId = req.params.referenceId
        const model = {
            payment_id:payment.id,
            referecia_id:referenceId,
            char_id:payment.charges[0].id,
            char_status:payment.charges[0].status,
            char_payment_installments:payment.charges?[0].payment_method?.installments:null,
            char_payment_type:payment.charges?[0].payment_method?.type:null,
            char_createdAt:payment.charges[0].createdAt,
            char_paidAt:payment.charges[0].paidAt,
            char_value:payment.charges[0].amount.value,
            char_payment_message:payment.charges[0].payment_response.message,
            char_payment_reference:payment.charges[0].payment_response.reference,
        }
        console.log("Dados atualizado:")
        console.log(model)
        await Pagamento.update(model,{where:{reference_id:referenceId}})
        if (model.char_status == 'PAID') {
            const pagamentoId = await Pagamento.findOne({where:{reference_id:referenceId},attributes:['id']})
            const pulseiras = await Pulseira.findAll({where:{pagamentoId:pagamentoId.id},attributes:['valor_pulseira','id']})
            console.log(`Atualizando dados de ${pulseiras.length} pulseiras`)
            for (const pulseira of pulseiras) {
                await Pulseira.update({
                    status:'PAGO',
                    valor_pago:payment.charges[0].amount.value/100
                },{where:{
                    id:pulseira.id
                }})
            }
        }
        res.json({resp:'ok'})

        //O que fazer quando receber o pagamento...
    } catch (error) {
        if (req.body.notificationCode != null) {
            console.log('Recebemos o token de notificação')
            res.status(200).send('Recebemos o token de notificação')
        }else{
            console.log(error)
            res.status(400).send('Ocorreu um erro durante o processamento dos dados de pagamento')
        }
    }
})

module.exports = router