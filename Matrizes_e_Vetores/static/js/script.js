
/*
    * Este JavaScript atualmente permite testar a interface
    * sem o backend Python.
    *
    * Quando o Flask/FastAPI estiver pronto, as funções
    * verificarMatriz() e calcularVetores() poderão enviar
    * os dados para o backend através de fetch().
    */

function selecionarOperacao(tipo, botao) {
    document.querySelectorAll('.operacao-btn')
        .forEach(btn => btn.classList.remove('ativo'));

    botao.classList.add('ativo');

    document.getElementById('secaoMatriz')
        .classList.toggle('ativa', tipo === 'matriz');

    document.getElementById('secaoVetor')
        .classList.toggle('ativa', tipo === 'vetor');

    document.getElementById('resultadoConteudo').innerHTML =
        '<div class="placeholder">Configure a operação no painel ao lado.</div>';
}

function gerarMatriz() {
    const linhas = parseInt(document.getElementById('linhas').value);
    const colunas = parseInt(document.getElementById('colunas').value);
    const container = document.getElementById('matrizInputs');

    container.innerHTML = '';

    if (linhas < 1 || colunas < 1) {
        return;
    }

    container.style.gridTemplateColumns =
        `repeat(${colunas}, minmax(0, 1fr))`;

    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {
            const input = document.createElement('input');

            input.type = 'number';
            input.value = '0';
            input.dataset.linha = i;
            input.dataset.coluna = j;

            container.appendChild(input);
        }
    }
}

function obterMatriz() {
    const linhas = parseInt(document.getElementById('linhas').value);
    const colunas = parseInt(document.getElementById('colunas').value);
    const inputs = document.querySelectorAll('#matrizInputs input');

    const matriz = [];

    for (let i = 0; i < linhas; i++) {
        matriz[i] = [];

        for (let j = 0; j < colunas; j++) {
            const index = i * colunas + j;
            matriz[i][j] = Number(inputs[index].value);
        }
    }

    return matriz;
}

function verificarMatriz() {
    const erro = document.getElementById('erroMatriz');
    erro.style.display = 'none';

    const matriz = obterMatriz();
    const linhas = matriz.length;
    const colunas = matriz[0].length;

    if (linhas !== colunas) {
        mostrarResultado(`
            <div class="status nenhuma">
                A matriz não é quadrada.
            </div>
            <p style="text-align:center;">
                Uma matriz simétrica ou antissimétrica precisa ser quadrada.
            </p>
        `);
        return;
    }

    let simetrica = true;
    let antissimetrica = true;

    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {

            if (matriz[i][j] !== matriz[j][i]) {
                simetrica = false;
            }

            if (matriz[i][j] !== -matriz[j][i]) {
                antissimetrica = false;
            }
        }
    }

    let classe;
    let mensagem;

    if (simetrica && antissimetrica) {
        classe = 'simetrica';
        mensagem = 'A matriz é simultaneamente simétrica e antissimétrica.';
    } else if (simetrica) {
        classe = 'simetrica';
        mensagem = 'A matriz é SIMÉTRICA.';
    } else if (antissimetrica) {
        classe = 'antissimetrica';
        mensagem = 'A matriz é ANTISSIMÉTRICA.';
    } else {
        classe = 'nenhuma';
        mensagem = 'A matriz não é simétrica nem antissimétrica.';
    }

    mostrarResultado(`
        <div class="status ${classe}">
            ${mensagem}
        </div>

        ${renderizarMatriz(matriz)}
    `);
}

function renderizarMatriz(matriz) {
    const colunas = matriz[0].length;

    let html = `
        <div class="matriz-visual"
                style="grid-template-columns: repeat(${colunas}, 65px);">
    `;

    matriz.forEach(linha => {
        linha.forEach(valor => {
            html += `<input type="text" value="${valor}" readonly>`;
        });
    });

    html += '</div>';

    return html;
}

function calcularVetores() {
    const erro = document.getElementById('erroVetor');
    erro.style.display = 'none';

    const ax = Number(document.getElementById('ax').value);
    const ay = Number(document.getElementById('ay').value);
    const bx = Number(document.getElementById('bx').value);
    const by = Number(document.getElementById('by').value);

    const operacao = document.getElementById('operacaoVetor').value;

    let rx;
    let ry;
    let simbolo;

    if (operacao === 'soma') {
        rx = ax + bx;
        ry = ay + by;
        simbolo = '+';
    } else {
        rx = ax - bx;
        ry = ay - by;
        simbolo = '-';
    }

        
    // fetch('/vetor', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({
    //         a: [ax, ay],
    //         b: [bx, by],
    //         operacao: operacao
    //     })
    // })
    // .then(response => response.blob())
    // .then(blob => {
    //     const url = URL.createObjectURL(blob);
    //     mostrarResultado(`
    //         <div class="grafico">
    //             <img src="${url}" alt="Gráfico dos vetores">
    //         </div>
    //     `);
    // });

    mostrarResultado(`
        <div class="status simetrica">
            Resultante: R = (${rx}, ${ry})
        </div>

        <div class="grafico">
            <div style="text-align:center; padding:30px;">
                <h2>Gráfico 2D</h2>
                <p>
                    A resultante de
                    A ${simbolo} B
                    é:
                </p>
                <strong style="font-size:24px;">
                    (${rx}, ${ry})
                </strong>

                <p style="color:#6b7280; margin-top:20px;">
                    O gráfico será retornado pelo backend Python.
                </p>
            </div>
        </div>
    `);
}

function mostrarResultado(html) {
    document.getElementById('resultadoConteudo').innerHTML = html;
}

// Cria a matriz inicial ao carregar a página.
gerarMatriz();