
const connection = require('../db')
const Sequelize = require('sequelize')
const Pulseira = require('./Pulseira')
const Afiliados = connection.define('tbl_pulseira_afiliado', {
    nome: {
        type:Sequelize.STRING
    },
    sobrenome: {
        type:Sequelize.STRING
    },
    status: {
        type:Sequelize.STRING, //Pago, Parcial,
        allowNull:true
    },
    forma_cadastro: {
        type:Sequelize.STRING, //Site, manual
        allowNull:true
    }
},{freezeTableName:true})

Afiliados.belongsTo(Pulseira,{
    foreignKey:'pulseira_id'
})

Afiliados.sync({alter: true}).then(()=>{
   console.log("Tabela Afiliados criada")
})

module.exports = Afiliados
