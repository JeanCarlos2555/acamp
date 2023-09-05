const Sequelize = require("sequelize")
const connection = require("../db")
const Pulseira = require("../Pulseira/Pulseira");

const Pagamento = connection.define('tbl_pagamentos',{
    method:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:'Checkout'
    },
    reference_id:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    payment_id:{
        type:Sequelize.STRING,
        allowNull:true
    },
    char_id:{
        type:Sequelize.STRING,
        allowNull:true
    },
    char_status:{
        type:Sequelize.STRING,
        allowNull:true
    },
    char_createdAt:{
        type:Sequelize.DATE,
        allowNull:true
    },
    char_paidAt:{
        type:Sequelize.DATE,
        allowNull:true
    },
    char_value:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    char_payment_message:{
        type:Sequelize.STRING,
        allowNull:true
    },
    char_payment_reference:{
        type:Sequelize.STRING,
        allowNull:true
    },
    char_payment_type:{
        type:Sequelize.STRING,
        allowNull:true
    },
    char_payment_installments:{
        type:Sequelize.INTEGER,
        allowNull:true,
        defaultValue:1
    },
    char_payment_capture:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    char_payment_capture_before:{
        type:Sequelize.STRING,
        allowNull:true
    },
    char_payment_holder:{
        type:Sequelize.STRING,
        allowNull:true
    },
    char_payment_tax_id:{
        type:Sequelize.STRING,
        allowNull:true
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:0
    },
    clientNome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    clientEmail:{
        type:Sequelize.STRING,
        allowNull:true
    },
    clientDocumento:{
        type:Sequelize.STRING,
        allowNull:true
    },
    clientPhone:{
        type:Sequelize.STRING,
        allowNull:true
    },
    item:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    valor:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    expiracao:{
        type:Sequelize.DATE,
        allowNull:true
    },
    qrcode:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    qrcode_id:{
        type:Sequelize.STRING,
        allowNull:true
    },
    qrcode_png:{
        type:Sequelize.STRING,
        allowNull:true
    },
    payment_url:{
        type:Sequelize.STRING,
        allowNull:true
    },
    erro:{
        type:Sequelize.TEXT,
        allowNull:true
    }
},
{freezeTableName:true})

Pagamento.belongsTo(Pulseira, {
  foreignKey: 'pulseiraId'
});
  
Pagamento.sync({alter: true}).then(()=>{
   console.log("Tabela Pagamento criada")
})

module.exports = Pagamento