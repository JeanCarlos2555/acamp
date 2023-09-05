const connection = require('../db')
const Sequelize = require('sequelize')


const Pulseira = connection.define('tbl_pulseira', {
    nome: {
        type:Sequelize.STRING
    },
    sobrenome: {
        type:Sequelize.STRING
    },
    isMeia:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    igreja: {
        type:Sequelize.STRING //IBC Teresina, IBC Picos, OUTRAS DENOMINAÇÔES etc
    },
    valor_pulseira: {
        type:Sequelize.FLOAT
    },
    valor_pago: {
        type:Sequelize.FLOAT,
        allowNull:true
    },
    status: {
        type:Sequelize.STRING, //Pago, Parcial
        allowNull:true
    },
    forma_cadastro: {
        type:Sequelize.STRING //Site, manual
    },
    pagamentoId:{
        type:Sequelize.INTEGER,
        allowNull:true
    }
},{freezeTableName:true})

Pulseira.sync({alter: true}).then(()=>{
   console.log("Tabela Pulseira criada")
})

module.exports = Pulseira
