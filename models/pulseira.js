const connection = require('./db')
const Sequelize = require('sequelize')


const Pulseira = connection.define('tbl_pulseira', {
    nome: {
        type:Sequelize.STRING
    },
    sobre_nome: {
        type:Sequelize.STRING
    },
    igreja: {
        type:Sequelize.STRING //IBC Teresina, IBC Picos, OUTRAS DENOMINAÇÔES etc
    },
    valor_pulseira: {
        type:Sequelize.DECIMAL
    },
    qtde_pulseira: {
        type:Sequelize.INTEGER
    },
    valor_total: {
        type:Sequelize.DECIMAL
    },
    valor_pago: {
        type:Sequelize.DECIMAL
    },
    status: {
        type:Sequelize.STRING //Pago, Parcial
    },
    forma_cadastro: {
        type:Sequelize.STRING //Site, manual
    }
},{freezeTableName:true})

Pulseira.sync({alter: true}).then(()=>{
    console.log("Tabela Pulseira criada")
})

module.exports = Pulseira
