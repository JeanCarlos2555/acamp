const axios = require('axios')
const Pagamento = require('../models/Pagamento/Pagamento')
const MP_URL = process.env.MP_URL
const MP_TOKEN = process.env.MP_TOKEN
const headers = {
    Authorization:`Bearer ${MP_TOKEN}`
}



async function getPagamento(id) {
    try {
        const pagamento = await Pagamento.findByPk(id)
        if (!pagamento) {
            throw new Error('Pagamento não identificado na base de dados')
        }
        if(pagamento.char_id == null){
            return {erro:'Pagamento ainda não foi identificado'}
        }
        const request = await axios.get(`${MP_URL}/charges/${pagamento.char_id}`,{headers})
        const payment = request.data
        const model = {
            referecia_id:payment.reference_id,
            char_id:payment.id,
            char_status:payment.status,
            char_createdAt:payment.created_at,
            char_value:payment.amount.value / 100,
            char_payment_message:payment.payment_response.message,
            char_payment_reference:payment.payment_response.reference,
        }
        await Pagamento.update(model,{where:{id:pagamento.id}})
        const pag = await Pagamento.findByPk(pagamento.id)
        return pag
    } catch (error) {
        throw new Error(error)
    }
    
}

module.exports = getPagamento