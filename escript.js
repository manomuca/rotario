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

   pedras: [],
  historico: [],
pedrasJogador1: [],
pedrasJogador2: [],
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
========================================= */function adicionarPedraAoJogador(jogador) {

    if (jogo.encerrado) {
        return;
    }

    const ladoA = Number(
        document.getElementById("ladoA").value
    );

    const ladoB = Number(
        document.getElementById("ladoB").value
    );

    const soma = ladoA + ladoB;

    // A pedra só pode ser lançada
    // se a soma for exatamente múltipla de 5
    if (soma % 5 !== 0) {

        alert(
            `A pedra ${ladoA}|${ladoB} não pode ser adicionada.\n\n` +
            `A soma é ${soma} e precisa ser múltipla de 5.`
        );

        return;
    }

    const pedra = {
        a: ladoA,
        b: ladoB
    };

    if (jogador === 1) {

        jogo.pedrasJogador1.push(pedra);

        // Soma os pontos da pedra ao placar do Jogador 1
        jogo.jogadores[1].pontos += soma;

    } else if (jogador === 2) {

        jogo.pedrasJogador2.push(pedra);

        // Soma os pontos da pedra ao placar do Jogador 2
        jogo.jogadores[2].pontos += soma;

    } else {

        return;
    }

    atualizarPedras();
    atualizarResultado();
    atualizarTela();
}


/* =========================================
   REMOVER PEDRA
========================================= */

function removerPedra(jogador, index) {

    if (jogo.encerrado) {
        return;
    }

    let pedra;

    if (jogador === 1) {

        pedra = jogo.pedrasJogador1[index];

        if (!pedra) return;

        jogo.pedrasJogador1.splice(index, 1);

    } else if (jogador === 2) {

        pedra = jogo.pedrasJogador2[index];

        if (!pedra) return;

        jogo.pedrasJogador2.splice(index, 1);

    } else {

        return;
    }

    // Retira do placar os pontos da pedra removida
    const pontos = pedra.a + pedra.b;

    jogo.jogadores[jogador].pontos -= pontos;

    atualizarPedras();
    atualizarResultado();
    atualizarTela();
}


/* =========================================
   MOSTRAR PEDRAS
========================================= */
function atualizarPedras() {

    const container =
        document.getElementById("pedrasSelecionadas");

    container.innerHTML = "";

    // Criar uma proteção caso carregarJogo() tenha apagado essas propriedades
    if (!jogo.pedrasJogador1) jogo.pedrasJogador1 = [];
    if (!jogo.pedrasJogador2) jogo.pedrasJogador2 = [];
    // =========================
    // PEDRAS DO JOGADOR 1
    // =========================

    jogo.pedrasJogador1.forEach(
        (pedra, index) => {

            const elemento =
                document.createElement("div");

            elemento.className =
                "pedra pedra-jogador1";

            elemento.innerHTML = `
                <span>${pedra.a}</span>
                <span>${pedra.b}</span>
            `;

            elemento.title =
                "Pedra do Jogador 1 - clique para remover";

            elemento.onclick = () =>
                removerPedra(1, index);

            container.appendChild(elemento);
        }
    );


    // =========================
    // PEDRAS DO JOGADOR 2
    // =========================

    jogo.pedrasJogador2.forEach(
        (pedra, index) => {

            const elemento =
                document.createElement("div");

            elemento.className =
                "pedra pedra-jogador2";

            elemento.innerHTML = `
                <span>${pedra.a}</span>
                <span>${pedra.b}</span>
            `;

            elemento.title =
                "Pedra do Jogador 2 - clique para remover";

            elemento.onclick = () =>
                removerPedra(2, index);

            container.appendChild(elemento);
        }
    );
    
}

/* =========================================
   CALCULAR TOTAL DAS PEDRAS
========================================= */

function calcularTotalPedras() {

    const p1 = jogo.pedrasJogador1 || [];
    const p2 = jogo.pedrasJogador2 || [];

    const totalP1 = p1.reduce(
        (total, pedra) => total + pedra.a + pedra.b,
        0
    );

    const totalP2 = p2.reduce(
        (total, pedra) => total + pedra.a + pedra.b,
        0
    );

    return {
        jogador1: totalP1,
        jogador2: totalP2,
        total: totalP1 + totalP2
    };
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



}


/* =========================================
   REGISTRAR MÃO
========================================= */
function registrarMao() {

    if (jogo.encerrado) {
        return;
    }

    // =========================
    // VENCEDOR DA MÃO
    // =========================

    const selectVencedor =
        document.getElementById("vencedorMao");

    const vencedor =
        Number(selectVencedor.value);

    if (!vencedor) {

        alert("Selecione quem venceu a mão.");

        return;
    }


    // =========================
    // PEDRAS DOS JOGADORES
    // =========================

    const pedrasJogador1 =
        [...(jogo.pedrasJogador1 || [])];

    const pedrasJogador2 =
        [...(jogo.pedrasJogador2 || [])];


    if (
        pedrasJogador1.length === 0 &&
        pedrasJogador2.length === 0
    ) {

        alert("Nenhuma pedra foi registrada nesta mão.");

        return;
    }


    // =========================
    // VALOR DO TECLADO
    // =========================

    const valorTeclado =
        Number(valorManual) || 0;


    // =========================
    // ARREDONDAMENTO
    // =========================

    const valorArredondado =
        arredondarCinco(valorTeclado);


    // =========================
    // SOMAR AO PLACAR
    // =========================

console.log(valorTeclado);
    jogo.jogadores[vencedor].pontos += valorArredondado;

    // =========================
    // REGISTRAR NO HISTÓRICO
    // =========================

    jogo.historico.push({

        jogador: vencedor,

        pontos: valorArredondado,

        valorTeclado: valorTeclado,

        valorArredondado: valorArredondado,

        pedrasJogador1: pedrasJogador1,

        pedrasJogador2: pedrasJogador2
    });
    atualizarTela();


    // =========================
    // SALVAR
    // =========================

    salvarJogo();


    // =========================
    // VERIFICAR 500 PONTOS
    // =========================

    verificarVencedor();


    // =========================
    // NOVA MÃO
    // =========================

    if (!jogo.encerrado) {

        limparMao();

        atualizarTela();

    }
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
console.log(jogo.jogadores[1].pontos);

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

    jogo.historico.forEach((mao, index) => {

        const tr =
            document.createElement("tr");


        // =========================
        // PEDRAS DO JOGADOR 1
        // =========================
        const pedras1 =            (mao.pedrasJogador1 || [])                .map(p => `${p.a}|${p.b}`)                .join(" ");


        // =========================
        // PEDRAS DO JOGADOR 2
        // =========================        
        const pedras2 =            (mao.pedrasJogador2 || [])                .map(p => `${p.a}|${p.b}`)                .join(" ");


        // =========================
        // PONTUAÇÃO DA MÃO
        // =========================

        const pontos1 =
            mao.jogador === 1
                ? `+${mao.pontos}`
                : "—";

        const pontos2 =
            mao.jogador === 2
                ? `+${mao.pontos}`
                : "—";


        // =========================
        // VALOR DO TECLADO
        // =========================

        const valorTeclado =
            mao.valorTeclado ?? 0;

        const valorArredondado =
            mao.valorArredondado ?? mao.pontos;


        // =========================
        // LINHA DO HISTÓRICO
        // =========================

        tr.innerHTML = `
            <td>${index + 1}</td>

            <td>${pontos1}</td>

            <td>${pontos2}</td>

            
            <td>
            ${valorTeclado}
            →
            ${valorArredondado}
            </td>
            `;
            
            /*<td><strong>J1:</strong>${pedras1 || "—"}<br><strong>J2:</strong>${pedras2 || "—"}</td>*/

        tabela.appendChild(tr);
    });


    // =========================
    // CONTADOR DE MÃOS
    // =========================

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
function atualizarCorVencedor() {

    const select = document.getElementById("vencedorMao");

    if (!select) return;

    // Remove as cores anteriores
    select.classList.remove("jogador1", "jogador2");

    // Aplica a cor do jogador selecionado
    if (select.value === "1") {
        select.classList.add("jogador1");
    }

    if (select.value === "2") {
        select.classList.add("jogador2");
    }
}
const selectVencedor = document.getElementById("vencedorMao");

if (selectVencedor) {
    selectVencedor.value = "";
    atualizarCorVencedor();
}