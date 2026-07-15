
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

        visor.value=numero+".0";

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

    if(valor>=4) return "SpringGreen";

    if(valor>=1.5) return "Lime";

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


