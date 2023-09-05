const parametros = require('../json/paramentros.json')
const moment = require('moment')

async function gerarPulseira({igreja,afiliados}) {
    try {
        const valor_mes = parametros.find(p =>{
            if (moment(p.inicio).isSameOrBefore(moment(),'day') && moment(p.fim).isSameOrAfter(moment(),'d')) {
                return true
            }else{
                return false
            }
        })
        const afiliadosValidos = afiliados.map(a =>{
            if (a.nome != '' && a.sobrenome != '') {
                return a
            }
        })
        const quantity = (afiliadosValidos != undefined && afiliadosValidos.length != 0)?afiliadosValidos.length +1:1

        const valor = (igreja <= 1)?
            (quantity >=3)?
                valor_mes.valor_desc:
                valor_mes.valor:
            valor_mes.valor - 30

        const retorno = {
            desc:`${quantity} Pulseiras para ACAMP 2023 IBC THE`,
            unit_amount:valor,
            quantity:quantity,
            total_amount:valor * quantity
        }
        console.log("Resumo retornado")
        console.log(retorno)
       return retorno
    } catch (error) {
        console.log(error)
        throw new Error('Ocorreu um erro durante o processamento de dados da pulseira')
    }
}

gerarPulseira({igreja:1,afiliados:[1,2]})

module.exports = gerarPulseira