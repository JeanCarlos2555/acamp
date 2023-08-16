const express = require('express')
const router = express.Router()

const pagamentoController = require('./api/pagamento/pagamentoController')

router.use('/pg',pagamentoController)


module.exports = router