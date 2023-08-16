function irparaopagamento() {
    total = document.getElementById("total").value

    if (total =="" || total == 0) {
        alert("Informações inválidas!")
    } else {
        alert("Avançando para pagamento!")
    }
}

function selecionarIgreja(igreja) {
    qtde = document.getElementById("qtde").value
    document.getElementById("buttonPagamento").disabled = false;
    if (igreja ==  "") {
        valor = ""
        document.getElementById("buttonPagamento").disabled = true;
    } else if (igreja <= 1) {
        if (qtde < 3) {
            valor = 140 * qtde
        } else {
            valor = 130 * qtde
        }
    } else {
        valor = 110 * qtde
    }
    document.getElementById("total").value = valor
}

function addDependete() {
    igreja = document.getElementById("igreja").value
    qtde = document.getElementById("qtde").value
    qtde++
    document.getElementById("qtde").value = qtde

    html = document.getElementById("nomes").innerHTML
}