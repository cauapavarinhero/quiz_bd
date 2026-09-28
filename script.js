let respostasUsuario = JSON.parse(sessionStorage.getItem('quiz_completo_json')) || {};

document.addEventListener("DOMContentLoaded", function() {
    const botoesOpcao = document.querySelectorAll('.botao-opcao');

    botoesOpcao.forEach(botao => {
        botao.addEventListener('click', function(event) {
            event.preventDefault();
            const idPergunta = this.getAttribute('data-pergunta');
            const grupoBotoes = document.querySelectorAll(`.botao-opcao[data-pergunta="${idPergunta}"]`);
            
            grupoBotoes.forEach(btn => btn.style.pointerEvents = 'none');

            const eCorreto = this.getAttribute('data-correta') === 'true';
            
            if (eCorreto) {
                this.classList.add('correta');
            } else {
                this.classList.add('errada');
                grupoBotoes.forEach(btn => {
                    if (btn.getAttribute('data-correta') === 'true') {
                        btn.classList.add('correta');
                    }
                });
            }

            respostasUsuario[idPergunta] = {
                resposta: this.getAttribute('data-resposta'),
                status: eCorreto ? "Acertou" : "Errou"
            };

            sessionStorage.setItem('quiz_completo_json', JSON.stringify(respostasUsuario));
        });
    });

    // Se estivermos na página de resultados, já dispara o salvamento no banco
    if (document.getElementById('res-nome')) {
        enviarResultadoParaBanco();
    }
});

function mudarDePagina(proximaPagina) {
    window.location.href = proximaPagina;
}

function mostrarResultadoFinal() {
    const dadosAcumulados = sessionStorage.getItem('quiz_completo_json');
    const blocoJson = document.querySelector('#bloco-json');
    if (blocoJson && dadosAcumulados) {
        blocoJson.innerHTML = `<pre style="white-space: pre-wrap; margin: 0; color: #32cd32; font-family: monospace;">${JSON.stringify(JSON.parse(dadosAcumulados), null, 2)}</pre>`;
    }
}

//enviar os dados da tela final pro Banco
async function enviarResultadoParaBanco() {
    let url = "http://localhost:3000/salvar-resultado";

    //Ajuste os IDs caso a pagina final tyenha outro nome;
    let object = {
        nome: document.getElementById("res-nome") ? document.getElementById("res-nome").innerText : "Anônimo",
        idade: document.getElementById("res-idade") ? parseInt(document.getElementById("res-idade").innerText) || 0 : 0,
        time: document.getElementById("res-time") ? document.getElementById("res-time").innerText : "Não informado",
        acertos: document.getElementById("res-acertos") ? parseInt(document.getElementById("res-acertos").innerText) || 0 : 0,
        aproveitamento: document.getElementById("res-porcentagem") ? document.getElementById("res-porcentagem").innerText : "0%"
    };

    const options = {  
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },  
        method: "POST",  
        body: JSON.stringify(object)  
    };

    try {
        let resp = await fetch(url, options);
        let dados = await resp.json();
        console.log("Sucesso:", dados.mensagem);
    } catch (erro) {
        console.error("Erro ao enviar dados para o banco:", erro);
    }
}