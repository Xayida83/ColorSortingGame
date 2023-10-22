let visor__main=document.getElementById("visor__main")
let MAXfrascos=4;
let MAXbolas=4;


/*const audioFondo = () => {
    //debugger
    let audio = new Audio('./assets/audio/backgroundAudio.mp3');
    audio.volume = 0.2;
    audio.play();
}*/


const iniciaEntorno = (e) => {
    let frascos=document.createDocumentFragment();
    for (let index = 0; index < MAXfrascos; index++) {
        let frasco=document.createElement("DIV")
        frasco.classList.add("visor__frasco")
        let bolas=document.createDocumentFragment();
        for (let index = 0; index < MAXbolas; index++) {
            let bola=document.createElement("DIV")
            bola.innerText=Math.random()*MAXfrascos;
            bolas.append(bola)
        }
        bolas.append(frasco)
        frascos.append(frasco)
    }
    visor__main.append(frascos)
}


visor__main.addEventListener("click",iniciaEntorno)
//document.addEventListener("DOMContentLoaded",audioFondo)