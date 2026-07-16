
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

    fila.unshift(valor);

    salvar();

    desenhar();

    limpar();

}

function obterCor(valor){

    if(valor>=25) return "Purple";

    if(valor>=16) return "Green";

    if(valor>=10) return "greenyellow";

    if(valor>=4) return "lime";

    if(valor>=2.5) return "yellow";

    return "Red";


}

function desenhar(){

    let div=document.getElementById("fila");

    div.innerHTML="";

    fila.forEach((valor)=>{

        let item=document.createElement("div");

        item.className="item";

        item.style.background=obterCor(valor);

        if(valor>=1.5 && valor<20){

            item.style.color="black";

        }else{

            item.style.color="white";

        }

        item.innerHTML=valor.toFixed(1);

        div.appendChild(item);

    });

}

function salvar(){

    localStorage.setItem("filaValores",JSON.stringify(fila));

}

function carregar(){

    let dados=localStorage.getItem("filaValores");

    if(dados){

        fila=JSON.parse(dados);

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

function analisarFaixa(min, max){

    let posicoes = [];

    // Inverte a fila para analisar em ordem cronológica
    let dados = [...fila].reverse();

    dados.forEach((valor, indice)=>{
        if(valor >= min && valor < max){
            posicoes.push(indice);
        }
    });

    let intervalos = [];

    for(let i=1; i<posicoes.length; i++){
        intervalos.push(posicoes[i]-posicoes[i-1]);
    }

    return {
        faixa: min.toFixed(2)+" até "+max.toFixed(2),
        ocorrencias: posicoes.length,
        intervalos
    };
}
function gerarRelatorio(){

    const faixas = [
        [5,10],
        [10,15],
        [15,20],
        [20,25],
        [25,30],
        [30,40],
        [40,50],
        [50,100],
        [100,9999]
    ];

    let texto="";

    faixas.forEach(f=>{

        let r = analisarFaixa(f[0],f[1]);

        texto+="=================================\n";
        texto+=r.faixa+"\n";
        texto+="Ocorrências: "+r.ocorrencias+"\n";
        texto+="Intervalos:\n";

        texto+=r.intervalos.join(" - ");

        texto+="\n\n";
    });

    console.log(texto);
    alert(texto);
}
