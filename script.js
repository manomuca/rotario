
function limparFila(){

    if(!confirm("Deseja realmente limpar toda a fila?")){

        return;

    }

    fila=[];

    localStorage.removeItem("filaValores");

    desenhar();

}
let numero="";

let fila=[];
//let historico = [];
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

fila.unshift({
    valor: valor,
    data: new Date()
});    
    //registrarHistorico(valor);
    salvar();

    desenhar();
    gerarRelatorio();  
    limpar();

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

    let div = document.getElementById("fila");
    
    div.innerHTML = "";
    
    fila.forEach((item,indice)=>{
        
        let valor = (typeof item === "number") ? item : item.valor;
        
        let celula = document.createElement("div");
        
        celula.className = "item";
        
        celula.style.background = obterCor(valor);
        celula.style.color = obterCorTexto(valor);
        
        celula.innerHTML = valor.toFixed(1);
    celula.onclick = function () {
            editarItem(indice);
        };
        div.appendChild(celula);

    });

}

function salvar(){

    localStorage.setItem("filaValores",JSON.stringify(fila));

}

function carregar(){

    let dados = localStorage.getItem("filaValores");

    if(dados){

        fila = JSON.parse(dados);

        // Converte a data de string para Date
        fila.forEach(item => {
            if (item.data) {
                item.data = new Date(item.data);
            }
        });

        desenhar();

    }

}

carregar();

function excluirUltimo() {
    if (fila.length === 0) return;

    fila.shift();      // Remove o último inserido
    salvar();
    desenhar();
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

    fila.forEach((item, indice)=>{

        if(item.valor < 30) return;

        let hora =
            String(item.data.getHours()).padStart(2,"0")+":"+
            String(item.data.getMinutes()).padStart(2,"0")+":"+
            String(item.data.getSeconds()).padStart(2,"0");

        if(anterior !== null){

            txt.value += "Intervalo: ";
            txt.value += (anterior - indice);
            txt.value += " jogadas\n";

        }

        txt.value += item.valor.toFixed(2);
        txt.value += "   ";
        txt.value += hora;
        txt.value += "\n";

        anterior = indice;

    });

}

function editarItem(indice){

    let valor = fila[indice].valor;

    numero = Math.round(valor * 10).toString();
console.log("valor");
console.log("numero");
    atualizarVisor();

    fila.splice(indice, 1);

    salvar();

    desenhar();

    gerarRelatorio();

}