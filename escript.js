/* =========================================
   DOMINÓ - PONTA DE CINCO
========================================= */


/* =========================================
   ESTADO DO JOGO
========================================= */
let valorManual = "";
let jogo = {
    jogadores: {
        1: {
            nome: "Jogador 1",
            pontos: 0
        },

        2: {
            nome: "Jogador 2",
            pontos: 0
        }
    },

    historico: [],

    pedras: [],

    jogadorBateu: null,

    encerrado: false
};


/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    carregarJogo();

    atualizarTela();

    document
        .getElementById("nomeJogador1")
        .addEventListener("input", atualizarNome);

    document
        .getElementById("nomeJogador2")
        .addEventListener("input", atualizarNome);

});


/* =========================================
   SELECIONAR JOGADOR QUE BATEU
========================================= */

function selecionarJogador(jogador) {

    if (jogo.encerrado) {
        return;
    }

    jogo.jogadorBateu = jogador;

    document
        .getElementById("btnJogador1")
        .classList.remove("selecionado");

    document
        .getElementById("btnJogador2")
        .classList.remove("selecionado");


    document
        .getElementById(`btnJogador${jogador}`)
        .classList.add("selecionado");


    atualizarResultado();
}


/* =========================================
   ADICIONAR PEDRA
========================================= */

function adicionarPedra() {

    if (jogo.encerrado) {
        return;
    }

    const ladoA = Number(
        document.getElementById("ladoA").value
    );

    const ladoB = Number(
        document.getElementById("ladoB").value
    );


    const pedra = {
        a: ladoA,
        b: ladoB
    };


    jogo.pedras.push(pedra);
atualizarDisplayTotal();
    atualizarPedras();

    atualizarResultado();

}


/* =========================================
   REMOVER PEDRA
========================================= */

function removerPedra(index) {

    if (jogo.encerrado) {
        return;
    }

    jogo.pedras.splice(index, 1);

    atualizarPedras();

    atualizarResultado();

}


/* =========================================
   MOSTRAR PEDRAS
========================================= */

function atualizarPedras() {

    const container =
        document.getElementById("pedrasSelecionadas");


    container.innerHTML = "";


    jogo.pedras.forEach((pedra, index) => {

        const elemento =
            document.createElement("div");

        elemento.className = "pedra";

        elemento.innerHTML = `
            <span>${pedra.a}</span>
            <span>${pedra.b}</span>
        `;


        elemento.title =
            "Clique para remover";


        elemento.onclick = () =>
            removerPedra(index);


        container.appendChild(elemento);

    });

}


/* =========================================
   CALCULAR TOTAL DAS PEDRAS
========================================= */

function calcularTotalPedras() {



    // Caso contrário, utiliza o sistema
    // tradicional das pedras.

    return jogo.pedras.reduce(
        (total, pedra) => {

            return total +
                pedra.a +
                pedra.b;

        },
        0
    );

}


/* =========================================
   ARREDONDAR PARA MÚLTIPLO DE 5
========================================= */

function arredondarCinco(valor) {

    return Math.round(valor / 5) * 5;

}


/* =========================================
   ATUALIZAR RESULTADO
========================================= */

function atualizarResultado() {

    const total =
        calcularTotalPedras();


    const arredondado =
        arredondarCinco(total);


    document
        .getElementById("totalPedras")
        .textContent = total;


    document
        .getElementById("totalArredondado")
        .textContent = arredondado;


    document
        .getElementById("pontosMao")
        .textContent = arredondado;

}


/* =========================================
   REGISTRAR MÃO
========================================= */

function registrarMao() {

    if (jogo.encerrado) {
        return;
    }


    if (!jogo.jogadorBateu) {

        alert("Selecione quem bateu.");

        return;
    }


    if (jogo.pedras.length === 0) {

        alert(
            "Adicione as pedras que ficaram com o adversário."
        );

        return;
    }


    const total =
        calcularTotalPedras();


    const pontos =
        arredondarCinco(total);


    const jogador =
        jogo.jogadorBateu;


    jogo.jogadores[jogador].pontos += pontos;


    jogo.historico.push({

        jogador: jogador,

        pontos: pontos,

        totalPedras: total,

        pedras: [...jogo.pedras]

    });


    salvarJogo();


    verificarVencedor();


    limparMao();

    atualizarTela();

}


/* =========================================
   VERIFICAR VENCEDOR
========================================= */

function verificarVencedor() {

    const jogador1 =
        jogo.jogadores[1];

    const jogador2 =
        jogo.jogadores[2];


    let vencedor = null;


    if (jogador1.pontos >= 500) {
        vencedor = 1;
    }

    else if (jogador2.pontos >= 500) {
        vencedor = 2;
    }


    if (!vencedor) {
        return;
    }


    jogo.encerrado = true;


    document
        .getElementById("textoVencedor")
        .textContent =
        `${jogo.jogadores[vencedor].nome} venceu com ${jogo.jogadores[vencedor].pontos} pontos!`;


    document
        .getElementById("modalVencedor")
        .classList.add("ativo");


    salvarJogo();

}


/* =========================================
   LIMPAR NOVA MÃO
========================================= */

function limparMao() {

    jogo.pedras = [];

    jogo.jogadorBateu = null;

    valorManual = "";

    document
        .getElementById("btnJogador1")
        .classList.remove("selecionado");


    document
        .getElementById("btnJogador2")
        .classList.remove("selecionado");


    atualizarPedras();
atualizarDisplayTotal();
    atualizarResultado();

}


/* =========================================
   DESFAZER ÚLTIMA MÃO
========================================= */

function desfazerMao() {

    if (jogo.historico.length === 0) {

        alert("Não existe nenhuma mão para desfazer.");

        return;
    }


    if (!confirm(
        "Deseja desfazer a última mão?"
    )) {
        return;
    }


    const ultima =
        jogo.historico.pop();


    jogo.jogadores[ultima.jogador].pontos -=
        ultima.pontos;


    jogo.encerrado = false;


    document
        .getElementById("modalVencedor")
        .classList.remove("ativo");


    salvarJogo();

    atualizarTela();

}


/* =========================================
   NOVA PARTIDA
========================================= */

function novaPartida() {

    if (!confirm(
        "Deseja iniciar uma nova partida? Todos os pontos serão zerados."
    )) {
        return;
    }


    const nome1 =
        document.getElementById("nomeJogador1").value
        || "Jogador 1";


    const nome2 =
        document.getElementById("nomeJogador2").value
        || "Jogador 2";


    jogo = {

        jogadores: {

            1: {
                nome: nome1,
                pontos: 0
            },

            2: {
                nome: nome2,
                pontos: 0
            }

        },

        historico: [],

        pedras: [],

        jogadorBateu: null,

        encerrado: false

    };


    document
        .getElementById("modalVencedor")
        .classList.remove("ativo");


    limparMao();

    salvarJogo();

    atualizarTela();

}


/* =========================================
   ATUALIZAR NOMES
========================================= */

function atualizarNome() {

    jogo.jogadores[1].nome =
        document.getElementById("nomeJogador1").value
        || "Jogador 1";


    jogo.jogadores[2].nome =
        document.getElementById("nomeJogador2").value
        || "Jogador 2";


    atualizarBotoes();

    salvarJogo();

}


/* =========================================
   ATUALIZAR TELA
========================================= */

function atualizarTela() {

    document
        .getElementById("nomeJogador1")
        .value =
        jogo.jogadores[1].nome;


    document
        .getElementById("nomeJogador2")
        .value =
        jogo.jogadores[2].nome;


    document
        .getElementById("pontuacaoJogador1")
        .textContent =
        jogo.jogadores[1].pontos;


    document
        .getElementById("pontuacaoJogador2")
        .textContent =
        jogo.jogadores[2].pontos;


    document
        .getElementById("progressoJogador1")
        .style.width =
        Math.min(
            jogo.jogadores[1].pontos / 500 * 100,
            100
        ) + "%";


    document
        .getElementById("progressoJogador2")
        .style.width =
        Math.min(
            jogo.jogadores[2].pontos / 500 * 100,
            100
        ) + "%";


    atualizarBotoes();

    atualizarHistorico();

    atualizarPedras();

    atualizarResultado();

}


/* =========================================
   ATUALIZAR BOTÕES
========================================= */

function atualizarBotoes() {

    document
        .getElementById("btnJogador1")
        .textContent =
        jogo.jogadores[1].nome;


    document
        .getElementById("btnJogador2")
        .textContent =
        jogo.jogadores[2].nome;

}


/* =========================================
   HISTÓRICO
========================================= */

function atualizarHistorico() {

    const tabela =
        document.getElementById("historico");


    tabela.innerHTML = "";


    jogo.historico.forEach(
        (mao, index) => {

            const tr =
                document.createElement("tr");


            const pontos1 =
                mao.jogador === 1
                    ? `+${mao.pontos}`
                    : "—";


            const pontos2 =
                mao.jogador === 2
                    ? `+${mao.pontos}`
                    : "—";


            const pedras =
                mao.pedras
                    .map(p => `${p.a}|${p.b}`)
                    .join(" ");


            tr.innerHTML = `

                <td>${index + 1}</td>

                <td>${pontos1}</td>

                <td>${pontos2}</td>

                <td>${pedras}</td>

            `;


            tabela.appendChild(tr);

        }
    );


    document
        .getElementById("contadorMaos")
        .textContent =
        `${jogo.historico.length} ${
            jogo.historico.length === 1
                ? "mão"
                : "mãos"
        }`;

}


/* =========================================
   SALVAR
========================================= */

function salvarJogo() {

    localStorage.setItem(
        "dominoPontaCinco",
        JSON.stringify(jogo)
    );

}


/* =========================================
   CARREGAR
========================================= */

function carregarJogo() {

    const dados =
        localStorage.getItem(
            "dominoPontaCinco"
        );


    if (!dados) {
        return;
    }


    try {

        const salvo =
            JSON.parse(dados);


        jogo = salvo;


        if (!jogo.pedras) {
            jogo.pedras = [];
        }


        if (!jogo.historico) {
            jogo.historico = [];
        }


    }

    catch (erro) {

        console.error(
            "Erro ao carregar partida:",
            erro
        );

    }

}
/* =========================================
   TECLADO NUMÉRICO
========================================= */

function digitarNumero(numero) {

    if (jogo.encerrado) {
        return;
    }

    // Limita o valor para evitar números exagerados
    if (valorManual.length >= 3) {
        return;
    }

    valorManual += numero.toString();

    atualizarDisplayTotal();

    atualizarResultado();
}


/* =========================================
   APAGAR ÚLTIMO NÚMERO
========================================= */

function apagarNumero() {

    if (jogo.encerrado) {
        return;
    }

    valorManual =
        valorManual.slice(0, -1);

    atualizarDisplayTotal();

    atualizarResultado();
}


/* =========================================
   LIMPAR VALOR
========================================= */

function limparNumero() {

    if (jogo.encerrado) {
        return;
    }

    valorManual = "";

    atualizarDisplayTotal();

    atualizarResultado();
}


/* =========================================
   ATUALIZAR DISPLAY
========================================= */

function atualizarDisplayTotal() {

    const display =
        document.getElementById("displayTotal");

    display.textContent =
        valorManual === ""
            ? "0"
            : valorManual;
}