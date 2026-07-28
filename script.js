
function limparFila(){

    if(!confirm("Deseja realmente limpar toda a memória?")){
        return;
    }

    memoria.fill(null);

    ultimo = -1;

    salvar();

    desenhar();

    document.getElementById("relatorio").value = "";

}
let numero="";
const MAX_POSICOES = 500;
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
    if(valor >= 120) return "#7b0d5a";
    if(valor >= 60) return "#ed0d89";
    if(valor >= 30) return "#0ded14";
    if(valor >= 15) return "GreenYellow";
    if(valor >= 7) return "#f5d209";
    if(valor >= 2.5) return "yellow";
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

    let txt = document.getElementById("relatorio");
    txt.value = "";

    // Cabeçalho
    txt.value += "Data/Hora\tValor\tIntervalo\n";

    let anterior = null;

    for(let i = 0; i <= ultimo; i++){

        let item = memoria[i];

        if(item == null) continue;
        if(item.valor < 30) continue;

        let data = new Date(item.data);

        txt.value += formatarDataHora(data);
        txt.value += "\t";
        txt.value += item.valor.toFixed(2);
        txt.value += "\t";
        txt.value += (anterior == null ? "" : (i - anterior));
        txt.value += "\n";

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
        if(item.valor < 30) continue;

        let data = new Date(item.data);

        let dia =
            String(data.getDate()).padStart(2,"0") + "/" +
            String(data.getMonth()+1).padStart(2,"0");

        // adiciona o dia na lista apenas uma vez
        if(!dias.includes(dia)){
            dias.push(dia);
        }
  
        let indiceDia = dias.indexOf(dia);

        let hora =
  
    data.getHours()*60 +
    data.getMinutes() +
    data.getSeconds()/60;
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

    if(grafico){
        grafico.destroy();
    }

    let ctx = document.getElementById("grafico");

    grafico = new Chart(ctx,{

        type:"scatter",

        data:{

            datasets:[{

                label:"Ocorrências",

                data:pontos,

                pointRadius:3,

                pointBackgroundColor:pontos.map(p=>p.cor),

                pointBorderColor:"#000",

                pointBorderWidth:1

            }]

        },

        options:{

            responsive:true,

plugins:{

    legend:{
        display:false
    },

tooltip:{

    callbacks:{

        label:function(context){

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

            scales:{

                x:{

                    type:"linear",

                    min:-0.5,

                    max:dias.length-0.5,

                    ticks:{

                        stepSize:1,

                        callback:function(value){

                            return dias[value] ?? "";

                        }

                    }

                },

                y:{

min: Math.floor(yMin) - 1,

max: Math.ceil(yMax) + 1,

                    ticks:{

                        stepSize:1,

callback: function(value) {

    let horas = Math.floor(value / 60);
    let minutos = Math.floor(value % 60);

    return String(horas).padStart(2, "0") + ":" +
           String(minutos).padStart(2, "0");

}

                    }

                }

            }

        }

    });

}