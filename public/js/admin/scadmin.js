const form_cadastrar = document.getElementById("form_cadastrar")

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
          <input type="text" class="form-control" id="sobreNome${qtde}" name="sobreNome_${qtde}" placeholder="Sobrenome do familiar ${qtde-1}">
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

form_cadastrar.addEventListener("submit", (click) => {
   click.preventDefault();
   qtde = document.getElementById("qtde_pulseira").value
   valor_total = document.getElementById("total_apagar").value
   valor_pago = document.getElementById("valor_pago").value
   validador = true
   erro = ""

   //valida se o valor pago está em branco
   if (valor_pago == "") {
    validador = false
    erro = "\nERRO 0: Nenhum valor foi estipulado!"
   }

    //Validar se o valor total é menor que o valor pago
    if (parseFloat(valor_total) < parseFloat(valor_pago)) {
        validador = false
        erro = "\nERRO 1: O valor pago não pode ser maior que o valor total das pulseiras!"
    }


   //Validador dos campos de nomes
   for (let i = 1; i <= qtde; i++) {    
    nome = document.getElementById(`nome${i}`).value
    sobrenomme = document.getElementById(`sobrenome${i}`).value
     if (nome == "" || sobrenomme == "") {
        validador = false
        msg = "\nErro 2: Existem campos de Nome e/ou sobre nome não preenchidos!"
     }
     console.log(nome + "     " + sobrenomme)
   }


   //Validador
   if (validador == true) {
    form_cadastrar.submit()
   } else {
    erro = erro + msg
    alert(erro)
   }
   
})