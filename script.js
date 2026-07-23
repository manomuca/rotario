
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

    if(valor >= 30) return "Purple";

    if(valor >= 20) return "lime";

    if(valor >= 5) return "GreenYellow";

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
filaDiv.style.position = "relative";

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
    let anterior = null;

  for (let i = 0; i <= ultimo; i++) {

    let item = memoria[i];

    // gera o relatório
        if(item.valor < 30) continue;
        let data = new Date(item.data);
        let hora =
            String(item.data.getHours()).padStart(2,"0")+":"+
            String(item.data.getMinutes()).padStart(2,"0")+":"+
            String(item.data.getSeconds()).padStart(2,"0");
        if(anterior !== null){
            txt.value += "Intervalo: ";
            txt.value += (anterior - i);
            txt.value += " jogadas\n";
        }
        txt.value += item.valor.toFixed(2);
        txt.value += "   ";
        txt.value += hora;
        txt.value += "\n";
        anterior = i;
    };
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