
//Não será usada a principio

const connection = require('../db')
const Pulseira = require('./Pulseira')
const Pagamento = require('../Pagamento/Pagamento')

const PulseiraPagamento = connection.define('tbl_pulseira_pagamento',{},{freezeTableName:true})

PulseiraPagamento.belongsTo(Pulseira,{
    foreignKey:'pulseira_id'
})

PulseiraPagamento.belongsTo(Pagamento,{
    foreignKey:'pagamento_id'
})

PulseiraPagamento.sync({alter: true}).then(()=>{
   console.log("Tabela PulseiraPagamento criada")
})

module.exports = PulseiraPagamento
