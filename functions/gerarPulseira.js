const parametros = require('../public/json/paramentros.json')
const moment = require('moment')


async function gerarPulseira({ client, igreja, afiliados }) {
    try {
        const valor_mes = findValorMes(parametros);
        const valor_meia = 70
        const pulseiras = generatePulseiraList({ clientes: [client, ...afiliados], igreja, valor_meia, valor_inteira: valor_mes.valor });
        const pulseira_inteira = pulseiras.filter(p => p.isMeia == false)
        const pulseira_meia = pulseiras.filter(p => p.isMeia == true)
        const items = [];

        if (pulseira_inteira.length > 0) {
            const unit_amount = calculateValorInteira(pulseira_inteira, igreja, valor_mes);
            items.push({
                name: `${pulseira_inteira.length} Pulseira(s) INTEIRA para ACAMP 2023 IBC THE`,
                unit_amount:  parseInt(parseFloat(unit_amount).toFixed(2).replace('.','')),
                quantity: pulseira_inteira.length,
                total_amount: unit_amount * pulseira_inteira.length,
            });
            for (const pulseira of pulseira_inteira) {
                pulseira.valor_pulseira = unit_amount
            }
        }

        if (pulseira_meia.length > 0) {
            items.push({
                name: `${pulseira_meia.length} Pulseira(s) MEIA para ACAMP 2023 IBC THE`,
                unit_amount:  parseInt(parseFloat(valor_meia).toFixed(2).replace('.','')),
                quantity: pulseira_meia.length,
                total_amount: valor_meia * pulseira_meia.length,
            });
        }

        if (items.length > 0) {
            const retornoPulseiras = pulseira_inteira.concat(pulseira_meia)
            return { items, pulseiras: retornoPulseiras };
        } else {
            throw new Error('Gentileza informar dados dos cliente e dos afiliados');
        }
    } catch (error) {
        console.log(error);
        throw new Error('Ocorreu um erro durante o processamento de dados da pulseira');
    }
}

function findValorMes(parametros) {
    return parametros.find(p => moment(p.inicio).isSameOrBefore(moment(), 'day') && moment(p.fim).isSameOrAfter(moment(), 'd'));
}

function generatePulseiraList({ igreja, clientes, valor_meia, valor_inteira }) {
    return clientes
        .filter(cliente => cliente.nome && cliente.sobrenome)
        .map(cliente => ({
            nome: cliente.nome,
            sobrenome: cliente.sobrenome,
            igreja: igreja,
            valor_pulseira: (cliente.isMeia == true || cliente.isMeia == 'true') ? valor_meia : valor_inteira,
            isMeia: cliente.isMeia == true || cliente.isMeia == 'true'
        }));
}

function calculateValorInteira(pulseira_inteira, igreja, valor_mes) {
    return igreja <= 1 ? (pulseira_inteira.length >= 3 ? valor_mes.valor_desc : valor_mes.valor) : 116;
}



module.exports = gerarPulseira