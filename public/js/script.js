async function irparapagamento() {
    let qtde = $("#qtde").val()
    const igreja = $("#igreja").val()
    const nome = $('#nome').val()
    const sobrenome = $('#sobrenome').val()
    const isMeia = $(`#isMeia`).val()

    if ((!isNaN(parseInt(qtde)) && qtde >= 1)) {
        if (!igreja || igreja == '') {
            return alert('Gentileza selecione a igreja')
        }
        if (!nome || !sobrenome || nome == '' || sobrenome == '') {
            return alert('Gentileza informar nome e sobrenome')
        }
        try {
            const client = { nome: nome, sobrenome: sobrenome, isMeia: isMeia }
            const afiliados = []
            for (let index = 2; index <= qtde; index++) {
                const nome = $(`#nome${index}`).val()
                const sobrenome = $(`#sobreNome${index}`).val()
                const isMeia = $(`#isMeia${index}`).val()
                afiliados.push({ nome: nome, sobrenome: sobrenome, isMeia, isMeia })
            }
            const request = await axios.post('/api/pg/gerar', { igreja: igreja, client: client, afiliados: afiliados })
            const { payment, pagamentoId } = request.data
            console.log(request.data);
            const button = document.createElement('a')
            button.target = '_blank'
            button.href = payment
            alert('Você será redirecionado para a tela de pagamento!')
            button.click()
        } catch (error) {
            console.log(error)
            alert('Ocorreu um erro durante o processamento de dados do seu pedido. Recarregue a página e tente novamente!')
        }
    }
}

function findValorMes(parametros) {

    return parametros.find(p => moment(p.inicio).isSameOrBefore(moment(), 'day') && moment(p.fim).isSameOrAfter(moment(), 'd'));
}
function calculateValorInteira(pulseira_inteira, igreja, valor_mes) {
    return igreja <= 1 ? (pulseira_inteira >= 3 ? valor_mes.valor_desc : valor_mes.valor) : valor_mes.valor - 30;
}

function handleAddIsMeia(valor) {
    let qtde_inteira = $("#qtde_inteira")
    let qtde_meia = $("#qtde_meia")

    if (valor == 'false') {
        qtde_inteira.val(parseInt(qtde_inteira.val()) + 1)
        qtde_meia.val(parseInt(qtde_meia.val()) - 1)
    } else {
        qtde_inteira.val(parseInt(qtde_inteira.val()) - 1)
        qtde_meia.val(parseInt(qtde_meia.val()) + 1)
    }
    calculaTotal()
}

async function calculaTotal() {
    let qtde_inteira = parseInt($("#qtde_inteira").val())
    let qtde_meia = parseInt($("#qtde_meia").val())
    const igreja = $("#igreja").val()

    const response = await fetch('/json/paramentros.json');
    const parametros = await response.json();
    const valor_mes = findValorMes(parametros);
    const valor_meia = 70 * qtde_meia
    const valor_inteira = (qtde_inteira != 0) ? calculateValorInteira(qtde_inteira, igreja, valor_mes) * qtde_inteira : 0
    const total = parseFloat(valor_meia + valor_inteira).toFixed(2)
    $("#total").val(total)
}

function selecionarIgreja() {
    const igreja = $("#igreja").val()
    const disabledButton = $(".disabledButton")
    if (igreja == "") {
        $("#total").val(0)
        disabledButton.prop('disabled', true)
    } else {
        disabledButton.prop('disabled', false)
    }
    calculaTotal()
}

function addDependete() {
    let qtde = $("#qtde").val()
    const igreja = $("#igreja").val()
    qtde++
    $("#qtde_inteira").val(parseInt($("#qtde_inteira").val()) + 1)
    $("#qtde").val(qtde)
    let html = `<hr><div class="mb-3">
          <label for="nome${qtde}" class="form-label">Nome do familiar ${qtde - 1}</label>
          <input type="text" class="form-control" id="nome${qtde}" name="nome_${qtde}" placeholder="Nome do familiar ${qtde - 1}">
        </div>
        <div class="mb-3">
          <label for="sobreNome${qtde}" class="form-labe${qtde}">Sobrenome do familiar ${qtde - 1}</label>
          <input type="text" class="form-control" id="sobreNome${qtde}" name="sobreNome_${qtde}" placeholder="Sobrenome do familiar ${qtde - 1}">
        </div>
        <div class="mb-3">
          <label for="isMeia${qtde}" class="form-label">Tipo ${qtde - 1}</label>
          <select name="isMeia${qtde}" onchange="handleAddIsMeia(this.value)" id="isMeia${qtde}" class="form-select">
            <option value="false" selected>Inteira</option>
            <option value="true">Meia</option>
          </select>
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

    const form_afiliados = $("#form_afiliados").html()
    $("#form_afiliados").html(form_afiliados + html)

    calculaTotal()
}


const handleShowModal = () => {
    $("#form_afiliados").html('')
    $("#qtde").val(1)
    $("#total").val(0)
}