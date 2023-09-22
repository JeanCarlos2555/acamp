
const Sequelize = require("sequelize");

//Conexao com o banco de dados da Kaju
const DB_USER = process.env.DB_USER
const DB_NAME = process.env.DB_NAME
const DB_HOST = process.env.DB_HOST
const DB_PASS = process.env.DB_PASS

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'postgres',
    query:{raw:true},
    logging: false
})  

sequelize.authenticate().then(function(){
    console.log('Conectado com sucesso!.')
}).catch(function(erro){
    console.log('Erro ao se conectar: '+erro)
})

module.exports = sequelize