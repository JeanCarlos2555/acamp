function MundarValorAdmin(igreja) {
    qtde = document.getElementById("qtde_pulseira").value
    if (igreja == 0 || igreja == 1) {
        if (qtde >= 3 ) {
            valor = "130.00"
        } else {
            valor = "140.00"
        }
    } else {
        valor = "110.00"
    }
    document.getElementById("valor_pulseira").value = valor
    document.getElementById("total_apagar").value = valor * qtde
}

function mudarQtdePulseiras() {
    qtde = document.getElementById("qtde_pulseira").value
    igreja = document.getElementById("igreja").value
    qtde++
    document.getElementById("qtde_pulseira").value = qtde
    html = `<hr><div class="mb-3">
          <label for="nome${qtde}" class="form-label">Nome do familiar ${qtde-1}</label>
          <input type="text" class="form-control" id="nome${qtde}" name="nome_${qtde}" placeholder="Nome do familiar ${qtde-1}">
        </div>
        <div class="mb-3">
          <label for="sobreNome${qtde}" class="form-labe${qtde}">Sobrenome do familiar ${qtde-1}</label>
          <input type="text" class="form-control" id="sobreNome${qtde}" nome="sobreNome_${qtde}" placeholder="Sobrenome do familiar ${qtde-1}">
        </div>`
        if (igreja == 0 || igreja == 1) {
            if (qtde >= 3 ) {
                valor = "130.00"
            } else {
                valor = "140.00"
            }
        } else {
            valor = "110.00"
        }
    
    document.getElementById("valor_pulseira").value = valor
    document.getElementById("total_apagar").value = valor * qtde
    campos_forms = document.getElementById("campos_forms").innerHTML
    document.getElementById("campos_forms").innerHTML = campos_forms + html
}