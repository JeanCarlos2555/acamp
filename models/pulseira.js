const db = require("./db")

const pulseira = db.sequelize.define('tbl_pulseira', {
    nome: {
        type: db.Sequelize.STRING
    },
    sobre_nome: {
        type: db.Sequelize.STRING
    },
    igreja: {
        type: db.Sequelize.STRING //IBC Teresina, IBC Picos, OUTRAS DENOMINAÇÔES etc
    },
    valor_pulseira: {
        type: db.Sequelize.DECIMAL
    },
    qtde_pulseira: {
        type: db.Sequelize.INTEGER
    },
    valor_total: {
        type: db.Sequelize.DECIMAL
    },
    valor_pago: {
        type: db.Sequelize.DECIMAL
    },
    status: {
        type: db.Sequelize.STRING //Pago, Parcial
    }
},{freezeTableName:true})

pulseira.sync({alter: true})

module.exports = pulseira
