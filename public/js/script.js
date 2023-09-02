// function irparaopagamento() {
//     total = document.getElementById("total").value

//     if (total == "" || total == 0) {
//         alert("Informações inválidas!")
//     } else {
//         alert("Avançando para pagamento!")
//     }
// }

async function irparapagamento() {
    let qtde = $("#qtde").val()
    const igreja = $("#igreja").val()
    const nome = $('#nome').val()
    const sobrenome = $('#sobrenome').val()
    if ((!isNaN(parseInt(qtde)) && qtde >= 1)) {
        if (!igreja || igreja == '') {
            return alert('Gentileza selecione a igreja')
        }
        if (!nome || !sobrenome || nome == '' || sobrenome == '') {
            return alert('Gentileza informar nome e sobrenome')
        }
        try {
            const client = {nome:nome,sobrenome:sobrenome}
            const afiliados = []
            for (let index = 2; index <= qtde; index++) {
                const nome = $(`#nome${index}`).val()
                const sobrenome = $(`#sobreNome${index}`).val()
                afiliados.push({nome:nome,sobrenome:sobrenome})
            }
            const request = await axios.post('/api/pg/gerar',{igreja:igreja,client:client,afiliados:afiliados})
            const {payment,pagamentoId} = request.data
            console.log(request.data);
            alert('Você será redirecionado para a tela de pagamento!')
        } catch (error) {
            console.log(error)
           alert('Ocorreu um erro durante o processamento de dados do seu pedido. Recarregue a página e tente novamente!') 
        }
    }
}

function selecionarIgreja(igreja) {
    let qtde = $("#qtde").val()
    let valor = 0
    const disabledButton = $('button.disabledButton')
    disabledButton.prop('disabled', false)
    if (igreja == "") {
        valor = 0
        disabledButton.prop('disabled', true)
    } else {
        valor = (igreja <= 1) ?
            (qtde < 3) ?
                140 * qtde :
                130 * qtde :
            110 * qtde

        $("#total").val(valor)
    }
}

// function addDependete() {
//     igreja = document.getElementById("igreja").value
//     qtde = document.getElementById("qtde").value
//     qtde++
//     document.getElementById("qtde").value = qtde

//     html = document.getElementById("nomes").innerHTML
// }

function addDependete() {
    let qtde = $("#qtde").val()
    const igreja = $("#igreja").val()
    qtde++
    $("#qtde").val(qtde)
    let html = `<hr><div class="mb-3">
          <label for="nome${qtde}" class="form-label">Nome do familiar ${qtde - 1}</label>
          <input type="text" class="form-control" id="nome${qtde}" name="nome_${qtde}" placeholder="Nome do familiar ${qtde - 1}">
        </div>
        <div class="mb-3">
          <label for="sobreNome${qtde}" class="form-labe${qtde}">Sobrenome do familiar ${qtde - 1}</label>
          <input type="text" class="form-control" id="sobreNome${qtde}" name="sobreNome_${qtde}" placeholder="Sobrenome do familiar ${qtde - 1}">
        </div>`
    let valor = 160
    if (igreja == 0 || igreja == 1) {
        if (qtde >= 3) {
            valor = 130
        } else {
            valor = 140
        }
    } else {
        valor = 110
    }

    $("#total").val(valor * qtde)
    const form_afiliados = $("#form_afiliados").html()
    $("#form_afiliados").html(form_afiliados + html)
}


const handleShowModal = ()=>{
    $("#form_afiliados").html('')
    $("#qtde").val(1)
    $("#total").val(0)
}