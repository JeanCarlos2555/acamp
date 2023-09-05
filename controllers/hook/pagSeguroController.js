const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const Pagamento = require('../../models/Pagamento/Pagamento')
const Pulseira = require('../../models/Pulseira/Pulseira')

router.post('/notificacao/:referenceId', async (req, res) => {
    try {
        console.log('Recebendo notificação');
        console.log(req.body);
        console.log('ID de referência');
        console.log(req.params.referenceId);

        const payment = req.body;
        const referenceId = req.params.referenceId;

        if (!payment || !referenceId) {
            throw new Error('Requisição inválida');
        }
        const pagamento = await Pagamento.findOne({ where: { reference_id: referenceId } })
        if (!pagamento) {
            throw new Error('Referência não encontrada na base de dados');
        }

        const model = {
            payment_id: payment.id,
            referencia_id: referenceId,
            char_paid: 0
        };

        if (payment.charges && payment.charges.length > 0) {
            const charge = payment.charges[0];

            model.char_id = charge.id;
            model.char_status = charge.status;
            model.char_createdAt = charge.createdAt;
            model.char_paidAt = charge.paidAt;
            model.char_value = charge.amount.value;

            if (charge.amount.summary) {
                const { summary } = charge.amount;
                model.char_total = summary.total;
                model.char_paid = summary.paid;
            }

            model.char_payment_message = charge.payment_response.message;
            model.char_payment_reference = charge.payment_response.reference;

            const paymentMethod = charge.payment_method;

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
            switch (charge.status) {
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

        }
        console.log("Dados atualizado:")
        console.log(model)
        await Pagamento.update(model, { where: { id: pagamento.id } })
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
        res.json({ resp: 'ok' })

    } catch (error) {
        console.error(error);
        res.status(400).send('Ocorreu um erro durante o processamento dos dados de pagamento');
    }
});

module.exports = router