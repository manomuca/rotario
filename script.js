
function limparFila(){

    if(!confirm("Deseja realmente limpar toda a memória?")){
        return;
    }
if (confirm("Deseja salvar a sessão antes de limpar?")) {

    salvarJSON();

}
    memoria.fill(null);

    ultimo = -1;

    salvar();

    desenhar();

    document.getElementById("relatorio").value = "";

}
let numero="";
const MAX_POSICOES = 1000;
let indiceEdicao = -1;
let memoria = new Array(MAX_POSICOES).fill(null);
let grafico = null;
let ultimo = -1;
let COLUNAS = Number(localStorage.getItem("colunasFila")) || 12;
//let COLUNAS = 10;
const TAM = 55;
function digitar(n){

    numero+=n;

    atualizarVisor();

}

function atualizarVisor(){

    if(numero.length==0){
        visor.value="";
        return;
    }



    if(numero.length==1){
        visor.value=numero+"0.";
        return;
    }

    let inteiro=numero.slice(0,-1);
    let decimal=numero.slice(-1);

    visor.value=inteiro+"."+decimal;
    
}


function apagar(){

    numero=numero.slice(0,-1);

    atualizarVisor();

}

function limpar(){

    numero="";

    atualizarVisor();

}

function inserir(){
    if(visor.value=="") return;
    let valor=parseFloat(visor.value);

if (indiceEdicao != -1) {
    memoria[indiceEdicao].valor = valor;
    memoria[indiceEdicao].data = new Date();
    indiceEdicao = -1;
} else {
    memoria[ultimo + 1] = {
    valor: valor,
    data: new Date()
    };
    ultimo++;
}
salvar();
desenhar();
gerarRelatorio();  
limpar();
  if (ultimo >= MAX_POSICOES - 1) {
        alert("Memória cheia!");
        return;
    }
}
function obterCor(valor){
    if(valor >= 5550) return "#ADFF2F";
    if(valor >= 1500) return "#7b0d5a";
    if(valor >= 101) return "#0ded14";
    if(valor >= 50) return "#f70505";
    if(valor >= 20) return "#f5d209";
    if(valor >= 2.5) return "#FFFF00";
    if(valor >= 1.5) return "#757373";

    return "#757373";

}

function obterCorTexto(valor){

    if(valor >= 30) return "white";

    if(valor >= 20) return "white";

    if(valor >= 5) return "black";

    if(valor >= 2.5) return "black";

    if(valor >= 1.5) return "lime";

    return "red";

}

function desenhar(){
console.log("ultimo =", ultimo, "MAX =", MAX_POSICOES);
    if (ultimo >= MAX_POSICOES) {
    ultimo = -1;
    memoria = new Array(MAX_POSICOES).fill(null);
}
    const filaDiv = document.getElementById("fila");
    filaDiv.innerHTML = "";
    const TAM = 40;
    let linhas = Math.ceil((ultimo + 1) / COLUNAS);
    console.log("linhas =", linhas, "COLUNAS =", COLUNAS, "total =", COLUNAS * linhas);
    filaDiv.style.height = (linhas * TAM) + "px";
    
    for(let indice = 0; indice <= ultimo; indice++){
        
        let item = memoria[indice];
        let valor = item.valor;
        let celula = document.createElement("div");
        celula.className = "item";
        celula.style.background = obterCor(valor);
        celula.style.color = obterCorTexto(valor);
        celula.innerHTML = valor.toFixed(1);
        celula.onclick = () => editarItem(indice);
        celula.style.position = "absolute";
        let linha = Math.floor(indice / COLUNAS);
        let coluna = COLUNAS - 1 - (indice % COLUNAS);
        
        filaDiv.style.position = "relative";
        const TAM = 40;
        
        celula.style.left = (coluna * TAM) + "px";
        celula.style.bottom = (linha * TAM) + "px";
        filaDiv.appendChild(celula);

    };

}


function salvar(){

    localStorage.setItem("memoria", JSON.stringify({
        memoria: memoria,
        ultimo: ultimo
    }));

}

function carregar(){

    document.getElementById("lblColunas").textContent = COLUNAS;

    let dados = localStorage.getItem("memoria");

    if(!dados) return;
    
    dados = JSON.parse(dados);
    memoria = dados.memoria;
    
    ultimo = dados.ultimo;

    // Reconverte as datas para objetos Date
    for(let i = 0; i <= ultimo; i++){

        if(memoria[i] != null){

            memoria[i].data = new Date(memoria[i].data);

        }

    }

    desenhar();

}

carregar();

function excluirUltimo() {

    if (ultimo < 0) return;

    memoria[ultimo] = null;

    ultimo--;

    salvar();

    desenhar();

    gerarRelatorio();
}

document.addEventListener("keydown", function(e){

    if(e.key >= "0" && e.key <= "9"){
        digitar(e.key);
    }

    if(e.key === "Backspace"){
        apagar();
    }

    if(e.key === "Delete"){
        limpar();
    }

    if(e.key === "Enter"){
        inserir();
    }
});
function gerarRelatorio(){

    // Mudamos para innerText pois agora usamos uma tag <span> ou <div> no letreiro
    let txt = document.getElementById("relatorio");
    txt.innerText = "";

  

    let anterior = null;

    for(let i = 0; i <= ultimo; i++){

        let item = memoria[i];

        if(item == null) continue;
        if(item.valor < 90) continue;

        let data = new Date(item.data);

        // Se não for a primeira ocorrência do letreiro, adiciona um separador visual
        if (txt.innerText !== "ÚLTIMAS: ") {
            txt.innerText += "   •   "; 
        }

        // Monta a informação em linha reta (Horizontal)
        txt.innerText += "[" + formatarDataHora(data) + "]";
        txt.innerText += " Valor: " + item.valor.toFixed(2);
        txt.innerText += " Intervalo: " + (anterior == null ? "Primeira" : (i - anterior));

        anterior = i;
    }
    
    gerarGrafico();
}

function editarItem(indice){

    
    let item = memoria[indice];
    
    numero = item.valor.toFixed(1).replace(".", "");
    
    atualizarVisor();
    indiceEdicao = indice;
    
    console.log(ultimo);
    console.log(memoria);
}
function alterarColunas(incremento){

    COLUNAS += incremento;

   if (isNaN(COLUNAS) || COLUNAS < 3) return;

    localStorage.setItem("colunasFila", COLUNAS);

    document.getElementById("lblColunas").innerHTML = COLUNAS;

    desenhar();

}
function formatarDataHora(data){

    return String(data.getDate()).padStart(2,"0") + "/" +
           String(data.getMonth() + 1).padStart(2,"0") + "/" +
           data.getFullYear() + " " +
           String(data.getHours()).padStart(2,"0") + ":" +
           String(data.getMinutes()).padStart(2,"0") + ":" +
           String(data.getSeconds()).padStart(2,"0");

}
function gerarGrafico(){
    let dias = [];
    let pontos = [];
    let anterior = null;
    let yMin = Infinity;
    let yMax = -Infinity;

    // Monta os pontos
    for(let i = 0; i <= ultimo; i++){
        let item = memoria[i];

        if(item == null) continue;
        if(item.valor < 100) continue;

        let data = new Date(item.data);
        let dia = String(data.getDate()).padStart(2,"0") + "/" +
                  String(data.getMonth()+1).padStart(2,"0");

        // adiciona o dia na lista apenas uma vez
        if(!dias.includes(dia)){
            dias.push(dia);
        }
  
        let indiceDia = dias.indexOf(dia);

        // Converte o horário em minutos totais do dia
        let hora = data.getHours() * 60 + data.getMinutes() + data.getSeconds() / 60;
        
        yMin = Math.min(yMin, hora);
        yMax = Math.max(yMax, hora);

        pontos.push({
            x: indiceDia,
            y: hora,
            valor: item.valor,
            intervalo: (anterior == null ? null : i - anterior),
            cor: obterCor(item.valor),
            data: data
        });
        anterior = i;
    }

    // PROTEÇÃO: Se não houver pontos válidos, aborta para não quebrar o gráfico
    if (pontos.length === 0) {
        if(grafico) grafico.destroy();
        return; 
    }

    let intervalo = yMax - yMin; // minutos
    let altura = Math.max(10, intervalo * 4);
    document.getElementById("graficoArea").style.height = altura + "px";

    if(grafico){
        grafico.destroy();
    }

    let ctx = document.getElementById("grafico");

    grafico = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [{
                label: "Ocorrências",
                data: pontos,
                pointRadius: 3,
                pointBackgroundColor: pontos.map(p => p.cor),
                pointBorderColor: "#000",
                pointBorderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // IMPORTANTE: Permite que o Chart.js respeite a altura dinâmica do seu "graficoArea"
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context){
                            let p = context.raw;
                            if (p.intervalo == null) {
                                return [
                                    "Primeira ocorrência",
                                    "Valor: " + p.valor.toFixed(1)
                                ];
                            }
                            return [
                                "Ocorrência: " + p.intervalo,
                                "Valor: " + p.valor.toFixed(1)
                            ];
                        }
                    }
                },
            },
            scales: {
                x: {
                    type: "linear",
                    min: -0.5,
                    max: dias.length - 0.5,
                    ticks: {
                        stepSize: 1, // CORRIGIDO: Avança de 1 em 1 dia na legenda
                        maxTicksLimit: 15, // Evita que os dias fiquem sobrepostos se houverem muitos
                        callback: function(value){
                            return dias[value] ?? "";
                        }
                    }
                },
                y: {
                    type: "linear",
                    min: Math.floor(yMin) - 5, // Margem de segurança um pouco maior
                    max: Math.ceil(yMax) + 5,
                    ticks: {
                        stepSize: 59, // Mantido: Linhas de grade a cada 30 minutos
                        callback: function(value) {
                            let horas = Math.floor(value / 60);
                            let minutos = Math.floor(value % 60);
                            
                            // Garante que não exiba horários inválidos por conta das margens (ex: -1h ou 25h)
                            if (horas < 0 || horas >= 24) return ""; 

                            return String(horas).padStart(2, "0") + ":" +
                                   String(minutos).padStart(2, "0");
                        }
                    }
                }
            }
        }
    });
}
function salvarJSON() {

    // Cria uma cópia somente dos registros utilizados
    // e inverte a ordem para salvar do mais recente
    // para o mais antigo.
    const memoriaParaSalvar = [...memoria]
        .slice(0, ultimo + 1)
        .reverse();


    let dados = {

        dataExportacao: new Date().toISOString(),

        colunas: COLUNAS,

        memoria: memoriaParaSalvar.map(item => {

            if (item == null) return null;

            return {

                valor: item.valor,

                data: formatarDataHora(
                    new Date(item.data)
                )

            };

        })

    };


    let texto =
        JSON.stringify(dados, null, 4);


    let blob =
        new Blob([texto], {
            type: "application/json"
        });


    let link =
        document.createElement("a");


    // ==========================================
    // NOME DO ARQUIVO
    // Usa a data do topo da matriz
    // ==========================================

    let dataTopo;

    if (memoria[0] && memoria[0].data) {

        dataTopo =
            new Date(memoria[0].data);

    } else {

        dataTopo =
            new Date();

    }


    let dia =
        String(dataTopo.getDate())
            .padStart(2, "0");

    let mes =
        String(dataTopo.getMonth() + 1)
            .padStart(2, "0");

    let ano =
        dataTopo.getFullYear();

    let hora =
        String(dataTopo.getHours())
            .padStart(2, "0");

    let minuto =
        String(dataTopo.getMinutes())
            .padStart(2, "0");

    let segundo =
        String(dataTopo.getSeconds())
            .padStart(2, "0");


    let nome =
        "Fila_" +
        dia + "-" +
        mes + "-" +
        ano + "_" +
        hora + "-" +
        minuto + "-" +
        segundo +
        ".json";


    link.href =
        URL.createObjectURL(blob);

    link.download = nome;

    link.click();

    URL.revokeObjectURL(link.href);

}

// 1. Faz o botão do seu HTML acionar o input oculto
function importarJSON() {
    document.getElementById("arquivoJSON").click();
}
function lerJSON(event) {

    // Pega o primeiro arquivo da lista [0]
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function(e) {

        try {

            const dadosImportados = JSON.parse(e.target.result);

            if (!Array.isArray(dadosImportados)) {

                alert("Formato de arquivo inválido! Deve ser uma lista [].");

                return;

            }


            // =====================================================
            // PRIMEIRA IMPORTAÇÃO
            // =====================================================

            if (memoria.length === 0 || ultimo === -1) {

                memoria.fill(null);

                ultimo = -1;

                const dadosOrdenados =
                    [...dadosImportados].reverse();

                const totalItens =
                    Math.min(
                        dadosImportados.length,
                        MAX_POSICOES
                    );


                for (let i = 0; i < totalItens; i++) {

                    const item = dadosOrdenados[i];

                    let valor =
                        parseFloat(item.valor);


                    let dataTexto =
                        item.SpinTime ||
                        item.data ||
                        "";

                    dataTexto =
                        String(dataTexto);


                    let dataObj;


                    if (
                        dataTexto &&
                        dataTexto.includes("/")
                    ) {

                        const [dataPart, horaPart] =
                            dataTexto.split(" ");

                        const [dia, mes, ano] =
                            dataPart.split("/");

                        dataObj =
                            new Date(
                                `${ano}-${mes}-${dia}T${horaPart}`
                            );

                    }

                    else if (
                        dataTexto &&
                        dataTexto.trim() !== ""
                    ) {

                        dataObj =
                            new Date(dataTexto);

                    }

                    else {

                        dataObj =
                            new Date();

                    }


                    memoria[i] = {

                        valor: valor,

                        data:
                            isNaN(dataObj.getTime())
                                ? new Date()
                                : dataObj

                    };


                    ultimo = i;

                }


                salvar();

                desenhar();

                gerarRelatorio();


                alert(
                    `${totalItens} rodadas importadas com sucesso!`
                );

            }


            // =====================================================
            // SEGUNDA IMPORTAÇÃO EM DIANTE
            // =====================================================

            else {

                // Último horário que já existe na memória
                const ultimoHorario =
                    new Date(
                        memoria[ultimo].data
                    );


                // O JSON vem do mais recente
                // para o mais antigo.
                //
                // Invertemos para ficar:
                // antigo -> recente

                const dadosOrdenados =
                    [...dadosImportados].reverse();


                let indiceEncontrado = -1;


                // Procura o último horário
                // que já existe na memória

                for (
                    let i = 0;
                    i < dadosOrdenados.length;
                    i++
                ) {

                    const item =
                        dadosOrdenados[i];


                    let dataTexto =
                        item.SpinTime ||
                        item.data ||
                        "";

                    dataTexto =
                        String(dataTexto);


                    let dataObj;


                    if (
                        dataTexto &&
                        dataTexto.includes("/")
                    ) {

                        const [dataPart, horaPart] =
                            dataTexto.split(" ");

                        const [dia, mes, ano] =
                            dataPart.split("/");

                        dataObj =
                            new Date(
                                `${ano}-${mes}-${dia}T${horaPart}`
                            );

                    }

                    else {

                        dataObj =
                            new Date(dataTexto);

                    }


                    if (
                        isNaN(dataObj.getTime())
                    ) {

                        continue;

                    }


                    if (
                        dataObj.getTime() ===
                        ultimoHorario.getTime()
                    ) {

                        indiceEncontrado = i;

                        break;

                    }

                }


                // Horário não encontrado
                if (indiceEncontrado === -1) {

                    alert(
                        "O horário do último registro da memória não foi encontrado no JSON."
                    );

                    event.target.value = "";

                    return;

                }


                // =================================================
                // ADICIONA SOMENTE OS REGISTROS NOVOS
                // =================================================

                let adicionados = 0;


                for (
                    let i = indiceEncontrado + 1;
                    i < dadosOrdenados.length;
                    i++
                ) {

                    if (
                        ultimo >= MAX_POSICOES - 1
                    ) {

                        break;

                    }


                    const item =
                        dadosOrdenados[i];


                    let valor =
                        parseFloat(item.valor);


                    let dataTexto =
                        item.SpinTime ||
                        item.data ||
                        "";

                    dataTexto =
                        String(dataTexto);


                    let dataObj;


                    if (
                        dataTexto &&
                        dataTexto.includes("/")
                    ) {

                        const [dataPart, horaPart] =
                            dataTexto.split(" ");

                        const [dia, mes, ano] =
                            dataPart.split("/");

                        dataObj =
                            new Date(
                                `${ano}-${mes}-${dia}T${horaPart}`
                            );

                    }

                    else {

                        dataObj =
                            new Date(dataTexto);

                    }


                    if (
                        isNaN(dataObj.getTime())
                    ) {

                        continue;

                    }


                    ultimo++;


                    memoria[ultimo] = {

                        valor: valor,

                        data: dataObj

                    };


                    adicionados++;

                }


                salvar();

                desenhar();

                gerarRelatorio();


                alert(
                    `${adicionados} novas rodadas adicionadas com sucesso!`
                );

            }


            // Limpa o campo para permitir
            // importar o mesmo arquivo novamente

            event.target.value = "";


        }

        catch (erro) {

            alert(
                "Erro ao ler o arquivo JSON. Verifique a estrutura."
            );

            console.error(erro);

        }

    };


    leitor.readAsText(arquivo);

}

async function carregarGraficoArquivo(){

    const arquivo =
        document.getElementById("selectGrafico").value;

    if(!arquivo) return;

    try{

        const resposta =
            await fetch( arquivo);

        if(!resposta.ok){

            throw new Error(
                "Não foi possível carregar " + arquivo
            );

        }

        const dados =
            await resposta.json();

        if(!Array.isArray(dados)){

            alert("O arquivo não possui uma lista válida.");

            return;

        }

        gerarGraficoArquivo(dados);

    }

catch(erro){

    console.error("ERRO COMPLETO:", erro);

    alert(
        erro.message
    );

}

}
function gerarGraficoArquivo(dados){

    // 1. Inverte o array para ler do mais antigo para o mais novo (Ordem Cronológica)
    let dadosCronologicos = [...dados].reverse();

    let dias = [];
    let pontos = [];

    let anterior = null;

    let yMin = Infinity;
    let yMax = -Infinity;


    for(let i = 0; i < dadosCronologicos.length; i++){

        let item = dadosCronologicos[i];

        if(!item) continue;

        // SEU FILTRO: (Ajuste ou remova se os valores reais forem menores que 100)
        // if(parseFloat(item.valor) <= 100) continue;


        // 2. CORREÇÃO DO FORMATO DA DATA (Transforma "DD/MM/YYYY HH:mm:ss" em algo que o JS entende)
        let partes = item.data.split(" ");
        let dataPartes = partes[0].split("/");
        let horaPartes = partes[1].split(":");
        
        // Ano, Mês (0-11), Dia, Hora, Minuto, Segundo
        let data = new Date(
            dataPartes[2], 
            dataPartes[1] - 1, 
            dataPartes[0], 
            horaPartes[0], 
            horaPartes[1], 
            horaPartes[2]
        );

        if(isNaN(data.getTime())) continue;


        let dia =
            String(data.getDate()).padStart(2,"0") + "/" +
            String(data.getMonth()+1).padStart(2,"0");


        if(!dias.includes(dia)){

            dias.push(dia);

        }


        let indiceDia =
            dias.indexOf(dia);


        let hora =
            data.getHours() * 60 +
            data.getMinutes() +
            data.getSeconds() / 60;


        yMin = Math.min(yMin,hora);
        yMax = Math.max(yMax,hora);


        pontos.push({

            x:indiceDia,

            y:hora,

            valor:parseFloat(item.valor),

            intervalo:
                anterior === null
                    ? null
                    : i - anterior,

            cor:obterCor(parseFloat(item.valor)),

            data:data

        });


        anterior = i;

    }


    if(grafico){

        grafico.destroy();

    }


    let ctx =
        document.getElementById("grafico");


    grafico = new Chart(ctx,{

        type:"scatter",

        data:{

            datasets:[{

                label:"Ocorrências",

                data:pontos,

                pointRadius:5, // Aumentei um pouco para melhor visualização

                pointBackgroundColor:
                    pontos.map(p => p.cor),

                pointBorderColor:"#000",

                pointBorderWidth:1

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    display:false
                },

                tooltip:{

                    callbacks:{

                        label:function(context){

                            let p =
                                context.raw;


                            if(p.intervalo === null){

                                return [

                                    "Primeira ocorrência",

                                    "Valor: " +
                                    p.valor.toFixed(2)

                                ];

                            }


                            return [

                                "Ocorrência: " +
                                p.intervalo,

                                "Valor: " +
                                p.valor.toFixed(2)

                            ];

                        }

                    }

                }

            },


            scales:{

                x:{

                    type:"linear",

                    min:-0.5,

                    max:dias.length - 0.5,

                    ticks:{

                        stepSize: 1,

                        callback:function(value){

                            return dias[value] ?? "";

                        }

                    }

                },


                y:{

                    min:Math.max(0, Math.floor(yMin) - 5), // Evita valores negativos no gráfico de tempo

                    max:Math.min(1440, Math.ceil(yMax) + 5), // Trava no limite máximo de minutos do dia

                    ticks:{

                        stepSize:60,

                        callback:function(value){

                            let horas =
                                Math.floor(value / 60);

                            let minutos =
                                Math.floor(value % 60);


                            return (
                                String(horas)
                                    .padStart(2,"0")
                                +
                                ":" +
                                String(minutos)
                                    .padStart(2,"0")
                            );

                        }

                    }

                }

            }

        }

    });

}
