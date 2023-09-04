const axios = require('axios')
const moment = require('moment')
const MP_URL = process.env.MP_URL
const MP_TOKEN = process.env.MP_TOKEN
const headers = {
    Authorization:`Bearer ${MP_TOKEN}`
}

async function gerarPagamento(pagamento,items) {
    console.log(`Iniciando um pagamento do tipo checkout, do pagamentoId ${pagamento.reference_id}`)
    try {

        const url = `${MP_URL}/checkouts`
        const body = {
            reference_id: pagamento.reference_id,
            expiration_date: `${moment().add(20,'minutes').format()}`,
            customer:{
                name:pagamento.clientNome,
                // email:client.email,
                // tax_id:client.cpf,
                // phones:[
                //     {
                //         country:55,
                //         area:client.telefone.substr(0,2),
                //         type: "MOBILE",
                //         number: client.telefone.replace(client.telefone.substr(0,2),'') 
                //     }
                // ]
            },
            items:items,
            //items:[{
                // reference_id: items.id,
            //     name:items.desc,
            //     quantity:items.quantity,
            //     unit_amount:items.unit_amount
            // }],
            notification_urls:[`https://ibc.revonmidias.com/hook/pg/notificacao/${pagamento.reference_id}`],
            redirect_url:`https://ibc.revonmidias.com/equilibrium?referenceId=${pagamento.reference_id}`,
            return_url:`https://ibc.revonmidias.com/equilibrium?referenceId=${pagamento.reference_id}`,
        }
        console.log('Criando um checkout. URL: ',url)
        console.log('Corpo da Requisição: ')
        console.log(body)
        const request = await axios.post(url,body,{headers})
        console.log('Retorno da requisição de criação: ')
        console.log(request.data)
        return request.data
    } catch (error) {
        console.log(error.response.data)
        throw new Error(error.toString());
    }
    
}
//testeInativar('CHEC_53E397D5-8591-4212-9886-F7FF24A4238F')
async function testeInativar(id) {
    try {
        console.log("Inativando um checkout: ",id)
        const url = `${MP_URL}/checkouts/${id}/inactivate`
        console.log("URL da inativação: ",url)
        const request = await axios.post(url,{},{headers})
        console.log('Retorno da requisição da inativação: ')
        console.log(request.data)
    } catch (error) {
        console.log(error)
    }
}


module.exports = gerarPagamento