const axios = require('axios')
const Pagamento = require('../models/Pagamento/Pagamento')
const Pulseira = require('../models/Pulseira/Pulseira')
const MP_URL = process.env.MP_URL
const MP_TOKEN = process.env.MP_TOKEN
const headers = {
    Authorization: `Bearer ${MP_TOKEN}`
}



async function getPagamento(id) {
    try {
        const pagamento = await Pagamento.findByPk(id)
        if (!pagamento) {
            throw new Error('Pagamento não identificado na base de dados')
        }
        if (pagamento.char_id == null) {
            return { erro: 'Pagamento ainda não foi identificado' }
        }
        const request = await axios.get(`${MP_URL}/charges/${pagamento.char_id}`, { headers })
        const payment = request.data
        const model = {
            payment_id: payment.id,
            referencia_id: pagamento.referencia_id,
            char_id:payment.char_id,
            char_paid: 0,
            char_status:payment.status,
            char_createdAt:payment.created_at,
            char_paidAt:payment.paid_at,
            char_value:payment.amount.value,
        };
        
        if (payment.amount.summary) {
            const { summary } = payment.amount;
            model.char_total = summary.total;
            model.char_paid = summary.paid;
        }

        model.char_payment_message = payment.payment_response.message;
        model.char_payment_reference = payment.payment_response.reference;

        const paymentMethod = payment.payment_method;

        model.char_payment_type = paymentMethod.type;
        model.char_payment_installments = paymentMethod.installments;
        model.char_payment_capture = paymentMethod.capture;
        model.char_payment_capture_before = paymentMethod.capture_before;

        if (paymentMethod.pix) {
            model.char_payment_holder = paymentMethod.pix.holder.name;
            model.char_payment_tax_id = paymentMethod.pix.holder.tax_id;
        } else if (paymentMethod.card) {
            model.char_payment_holder = paymentMethod.card.holder.name;
        }
        switch (payment.status) {
            case 'PAID':
                model.status = 1
                break;
            case 'DECLINED':
            case 'CANCELED':
                model.status = 2
                break;
            default:
                model.status = 0
                break;
        }

        console.log(model.status)

        if (model.status != pagamento.status) {
            await Pagamento.update(model, { where: { id: pagamento.id } })

            const pag = await Pagamento.findByPk(pagamento.id)
            const pulseiras = await Pulseira.findAll({ where: { pagamentoId: pagamento.id }, attributes: ['id'] })
            console.log(`Atualizando dados de ${pulseiras.length} pulseiras`)
            for (const pulseira of pulseiras) {
                await Pulseira.update({
                    status: (model.status == 1) ? 'PAGO' : (model.status == 2) ? 'CANCELADO' : 'PENDENTE',
                    valor_pago: (model.char_paid) ? ((model.char_paid / 100) / pulseiras.length) : 0
                }, {
                    where: {
                        id: pulseira.id
                    }
                })
            }

            return pag
        } else {
            return pagamento
        }

    } catch (error) {
        console.log(error)
        return { erro: 'Oorreu um erro durante a consulta do pagamento' }
    }

}

module.exports = getPagamento