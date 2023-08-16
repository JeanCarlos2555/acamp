const express = require('express')
const router = express.Router()

const pagSeguroController = require('./hook/pagSeguroController')

router.use('/pg',pagSeguroController)


module.exports = router