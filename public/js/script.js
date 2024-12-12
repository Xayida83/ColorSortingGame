let viewerMain = document.getElementById("visor__main");

let level;
let maxLevel;
let maxHolder;
let maxItems;
let character;
let prePost;
let time;
let baseTime = 40;

let holdersArr = [];
let itemHolderArr = [];
let click = true;

let interval;

let end = false;


//inicializo el audio de fondo de forma global como audioBg
let audioBg = new Audio("./assets/audio/musicaBackground.wav");
audioBg.volume = 0.1;
audioBg.loop = true;


const audioBallOut = () => {
  let audio = new Audio("./assets/audio/sacarBola.wav");
  audio.volume = 0.6;
  audio.play();
};

const audioMeterBall = () => {
  let audio = new Audio("./assets/audio/meterBola.wav");
  audio.volume = 0.6;
  audio.play();
};

const audioMovementBack = () => {
  let audio = new Audio("./assets/audio/movimientoFallido.wav");
  audio.volume = 0.4;
  audio.play();
};

const audioLevelUp = () => {
  let audio = new Audio("./assets/audio/lvlUp.wav");
  audio.volume = 0.5;
  audio.play();
};

const audioLose = () => {
  let audio = new Audio("./assets/audio/juegoPerdido.mp3");
  audio.volume = 0.4;
  audio.play();
};

const audioWin = () => {
  let audio = new Audio("./assets/audio/juegoGanado.wav");
  audio.volume = 0.4;
  audio.play();
};

function updateEnvironment(posAnt = null, posPost = null) {
  function editEnvironment(posAnt, posPost) {
    const mainHolders = document.getElementById("main__frascos"); //TODO change classname

    while (mainHolders.children[posAnt].children.length > 0) {
      mainHolders.children[posAnt].removeChild(
        mainHolders.children[posAnt].firstChild
      );
    }

    for (let index = 0; index < holdersArr[posAnt].length; index++) {
      let item = document.createElement("DIV"); //TODO DIV?
      item.classList.add("pixel-ball");
      item.classList.add("color" + holdersArr[posAnt][index]);
      mainHolders.children[posAnt].append(item);
    }

    if (posAnt != posPost) {
      while (mainHolders.children[posPost].children.length > 0) {
        mainHolders.children[posPost].removeChild(
          mainHolders.children[posPost].firstChild
        );
      }

      for (let index = 0; index < holdersArr[posPost].length; index++) {
        let item = document.createElement("DIV"); //TODO DIV?
        item.classList.add("pixel-ball");
        item.classList.add("color" + holdersArr[posPost][index]);
        mainHolders.children[posPost].append(item);
      }
    }
  }

  function generateEnvironment() {
    let mainHolders = document.createElement("DIV"); //TODO DIV?
    mainHolders.style.display = "flex";
    mainHolders.style.justifyContent = "center";    //TODO innerstyling?
    mainHolders.style.position = "relative";
    mainHolders.style.top = "130px";
    mainHolders.id = "main__frascos";

    //Añado un listener al contenedor de los frascos
    mainHolders.addEventListener("click", handleMove);

    let holders = document.createDocumentFragment(); //TODO outcomment?
    for (let index = 0; index < holdersArr.length; index++) {
      let holder = document.createElement("DIV");
      holder.classList.add("visor__frasco");
      holder.style.height = (40 * maxItems + 15).toString() + "px";
      holder.id = "frasco" + index;
      holder.style.position = "relative";
      holder.style.top = "0";
      
      let items = document.createDocumentFragment();
      //frasco.addEventListener("click", accionFrasco);

      for (let index2 = 0; index2 < holdersArr[index].length; index2++) {
        let item = document.createElement("DIV");//TODO DIV?
        item.classList.add("pixel-ball"); //TODO change classname
        item.classList.add("color" + holdersArr[index][index2]);
        items.append(item); //*holder.appendChild(item);
      }
      holder.append(items);
      mainHolders.append(holder);
      // holder.append(holder);
      viewerMain.append(mainHolders);
      //visor__main.append(frascos);
    }
  }

  if (posAnt === null && posPost === null) {  //TODO rename posAnt & posPost
    generateEnvironment();
  } else {
    editEnvironment(posAnt, posPost);
  }
}

const startEnviroment = () => {
  if (!audioBg.paused) {
    audioBg.pause();
    audioBg.currentTime = 0;
  }

  audioBg.play();

  if (holdersArr.length != 0) {
    holdersArr = [];
  }
  if (itemHolderArr.length != 0) {
    itemHolderArr = [];
  }

  //inicioTempo();
  character = viewerMain.querySelector("#character_1");
  character.remove();

  let mainSection = document.getElementById("main__section");
  mainSection.remove();

  textoTitulo = viewerMain.querySelector("#visor__div__texto"); //TODO rename textTitulo
  if (textoTitulo != null) {
    textoTitulo.remove();
  }

  //Constants settings. (These are the parameters with which the game starts, they change with each level)
  time = 40;
  level = 0;
  maxLevel = 3;
  maxHolder = 4;
  maxItems = 4;

  gameBoard();
  updateEnvironment();
  startTime();
  skyColor(level);
};

function gameBoard() {
  //leave two empty holders so one can play.
  for (let index = 0; index < maxHolder; index++) {
    itemHolderArr = [];
    holdersArr.push(itemHolderArr);
    if (index < maxHolder - 2) {
      for (let index2 = 0; index2 < maxItems; index2++) {
        itemHolderArr.push(index);
      }
    }
  }

  do {
    //shuffle the balls as many times as there are balls per holder.
    for (let index = 0; index < maxHolder * (maxHolder - 2); index++) {
      const randomHolder1 = Math.floor(Math.random() * (maxHolder - 2));
      const randomItem1 = Math.floor(Math.random() * maxItems);
      const randomHolder2 = Math.floor(Math.random() * (maxHolder - 2));
      const randomItem2 = Math.floor(Math.random() * maxItems);

      let aux = holdersArr[randomHolder1][randomItem1]; //TODO aux? 
      holdersArr[randomHolder1][randomItem1] =
        holdersArr[randomHolder2][randomItem2];
      holdersArr[randomHolder2][randomItem2] = aux;
    }
  } while (checkingWinningConditions()); // if reverse the check, the board starts sorted
  // check that the generated board is not generated starts sorted
}

const startTime = () => {
  const viewerHeaderTimer = document.getElementById(
    "visorHeader__div__temporizador"
  );
  viewerHeaderTimer.classList.add("temporizadorOn"); //TODO rename classname temporizadorOn

  let minutes = Math.floor(time / 60).toString();
  let seconds = Math.floor(time % 60).toString();
  viewerHeaderTimer.children[1].textContent =
    minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0");

  interval = setInterval(() => {
    time--;

    let minutes = Math.floor(time / 60).toString();
    let seconds = Math.floor(time % 60).toString();

    viewerHeaderTimer.children[1].textContent =
      minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0");

    if (time == 0) {
      debugger;
      ganado = false;
      audioLose();
      deleteEnvironment();
      startEnd(ganado);
    }
  }, 1000);
};

function loadCharacter() { //TODO outcomment
  let character = document.createElement("IMG");
  character.style.position = "absolute";
  character.style.zIndex = "30";
  character.style.height = "400px";
  character.style.width = "400px";
  character.style.left = "650px";
  character.style.top = "90px";
  character.id = "character_1";
  character.alt = "Theo_personaje"
  debugger;
  character.src = "assets/png/character2.png";
  return character;
}

const homeIntro = () => {
  createTitle("Sort the colors", "BallSortPuzzle");

  setTimeout(() => {
    visor__div__texto.remove(); //TODO rename visor__div__texto
    createTitle(null, "Ayuda a Theo a encontrar los colores");
    tituloPequeño.style.top = "160px";

    setTimeout(() => {
      visor__div__texto.remove();
      debugger;
      character = loadCharacter();
      viewerMain.append(character);
      crateStartButton();
      section__a.addEventListener("click", startEnviroment);
    }, 4000);
  }, 4000);
};

function createTitle(largeText = null, smallText = null) {
  visor__div__texto = document.createElement("DIV");
  visor__div__texto.id = "visor__div__texto";

  tituloGrande = document.createElement("H1");
  tituloGrande.textContent = largeText;
  tituloGrande.classList.add("letraTituloGrande");

  if (smallText) {
    tituloPequeño = document.createElement("H2");
    tituloPequeño.textContent = smallText;
    tituloPequeño.classList.add("letraTituloPeq");
  }

  visor__div__texto.append(tituloGrande);
  if (smallText) {
    visor__div__texto.append(tituloPequeño);
  }
  viewerMain.append(visor__div__texto);
}

const gain = () => {
  let win = checkingWinningConditions();
  console.log("ganar" + win);

  //Now the TAD and environment should be reset and the level will go up
//There are only three levels
  if (win) {
    level++;
    holdersArr = [];
    itemHolderArr = [];
    if (level == maxLevel) {
      audioWin();
      deleteEnvironment();
      time = 0;
      skyColor(2);
      startEnd(win);
    } else {
      audioLevelUp();
      maxItems++;
      maxHolder++;
      deleteEnvironment();
      gameBoard();
      updateEnvironment();
      skyColor(level);
      time = baseTime + 10 * level; //cada nivel aumenta 10 segundos
    }
  }
};

const skyColor = (level) => {
  if (level > 2) {
    level = 2;
  }
//TODO erase?
  const skies = viewerMain.parentNode;
  const bg = skies.firstChild.nextSibling;
  switch (level) {
    case 0:
      skies.classList = [...skies.classList].filter(
        (clase) =>
          clase != "cieloAzul" &&
          clase != "cieloInicial" &&
          clase != "cieloGris" &&
          clase != "cieloNaranja"
      );
      skies.classList.add("cieloGris");

      bg.classList = [...bg.classList].filter(
        (clase) =>
          clase != "fondoGris3" &&
          clase != "fondoGris2" &&
          clase != "fondoGris1"
      );
      bg.classList.add("fondoGris1");
      break;
    case 1:
      skies.classList.remove("cieloGris");
      skies.classList.add("cieloNaranja");

      bg.classList.remove("fondoGris1");
      bg.classList.add("fondoGris2");
      break;
    case 2:
      skies.classList.remove("cieloNaranja");
      skies.classList.add("cieloAzul");

      bg.classList.remove("fondoGris2");
      bg.classList.add("fondoGris3");
      break;
    default:
      break;
  }
};

const deleteEnvironment = () => {
  const main__frascos = document.getElementById("main__frascos");

  if (main__frascos != null) {
    main__frascos.remove();
  }
};

const handleMove = (e) => {
  if (e.target.classList.length > 0) {
    if (e.target.nodeName === "DIV") {
      console.log(e.target.id);

      if (e.target.classList[0].startsWith("pixel")) {
        if (click) {
          audioBallOut();
          prePost = parseInt(e.target.parentNode.id.slice(6));

          let numberOfItems = holdersArr[prePost].length; //Cada bola mide 40px
          //The item must be approximately 75 px above the holder (not counting possible margin or padding)
          e.target.parentNode.firstChild.style.top =
            "-" + ((maxItems - numberOfItems) * 40 + 75).toString() + "px";

          click = false;
        } else {
          posicionMeter = parseInt(e.target.parentNode.id.slice(6));
          console.log("posicionMeter: " + posicionMeter);

          let top1Value = holdersArr[prePost][0];
          let top2Value = holdersArr[posicionMeter][0];
          console.log("values" + top1Value + top2Value);

          if (holdersArr[posicionMeter].length > 0) {
            if (prePost == posicionMeter || top1Value != top2Value) {
              audioMovementBack();
              updateEnvironment(prePost, posicionMeter);
              click = true;
            }
          }
          if (
            !click &&
            prePost != posicionMeter &&
            posicionMeter >= 0 &&       //TODO rename posicionMeter
            posicionMeter < holdersArr.length
          ) {
            if (holdersArr[posicionMeter].length < maxItems) {
              holdersArr[posicionMeter].unshift(
                holdersArr[prePost].shift()
              );
              audioMeterBall();
              updateEnvironment(prePost, posicionMeter);
              click = true;
            }
          }
          /*else{
        posicionMeter=parseInt(e.target.parentNode.id.slice(6));
        const main__frascos=document.getElementById("main__frascos");
        console.log(main__frascos)
        main__frascos.children[posicionMeter].firstChild.style.top="0px";
        click=true;
      }*/
          gain();  //TODO how to rename gain?
        }
      }

      if (e.target.id.startsWith("frasco")) {
        console.log(click);
        let positionMeter;
        console.log(e.target.id.slice(6));
        if (click) {
          console.log("sacar");
          audioBallOut();
          //bolaCambio = e.target.parentNode.firstChild.classList[1].slice(5);
          prePost = parseInt(e.target.id.slice(6));

          let numberItems = holdersArr[prePost].length; //Cada bola mide 40px
          //La bola ha de estar 75 px encima del frasco aprox (sin contar posible margin o padding)
          e.target.firstChild.style.top =
            "-" + ((maxItems - numberItems) * 40 + 75).toString() + "px";

          click = false;
        } else {
          positionMeter = parseInt(e.target.id.slice(6));
          console.log("posicionMeter: " + positionMeter);

          let topValue1 = holdersArr[prePost][0];
          let topValue2 = holdersArr[positionMeter][0];
          console.log("values" + topValue1 + topValue2);

          if (holdersArr[positionMeter].length > 0) {
            if (prePost == positionMeter || topValue1 != topValue2) {
              audioMovementBack();
              updateEnvironment(prePost, positionMeter);
              click = true;
            }
          }

          if (
            !click &&
            prePost != positionMeter &&
            positionMeter >= 0 &&
            positionMeter < holdersArr.length
          ) {
            if (holdersArr[positionMeter].length < maxItems) {
              holdersArr[positionMeter].unshift(
                holdersArr[prePost].shift()
              );
              audioMeterBall();
              updateEnvironment(prePost, positionMeter);
              click = true;
            }
          } else {
            const main__frascos = document.getElementById("main__frascos");
            console.log(main__frascos);

            click = true;
          }
          gain();
        }
      }
    }
  }
};

function checkingWinningConditions() {
  let win = true;
  let contadorLlenas = 0;

  for (let index = 0; index < holdersArr.length; index++) {
    if (holdersArr[index].length == maxItems) {
      contadorLlenas++;
      let index2 = 1;
      let bolaComprobar = holdersArr[index][0];
      while (win && index2 < holdersArr[index].length) {
        if (bolaComprobar != holdersArr[index][index2]) {
          win = false;
        }
        index2++;
      }
    }
  }
  if (contadorLlenas != maxHolder - 2) {
    win = false;
  }
  return win;
}

function startEnd(win) {
  turnOffTimer();

  if (win) {
    console.log("WON");
    createTitle(
      "You have won!",
      "You sorted out the items"
    );
  } else {
    console.log("No win");
    createTitle("End", "You have lost");
  }

  setTimeout(() => {
    visor__div__texto.remove();

    if (win) {
      createTitle("TRY AGAIN", "BEAT YOUR RECORD!");
    } else {
      createTitle("TRY AGAIN", "YOU CAN DO IT!");
    }

    character = loadCharacter();
    viewerMain.append(character);
    crateStartButton();
    section__a.addEventListener("click", startEnviroment);
  }, 4000);
}

function turnOffTimer() {
  const gameBoard = viewerMain.previousElementSibling.querySelector(
    "#visorHeader__div__temporizador"
  );
  gameBoard.children[1].textContent = "00:00";
  clearInterval(interval);
}

function crateStartButton() {
  main__section = document.createElement("SECTION");
  section__a = document.createElement("A");
  a__img = document.createElement("IMG");

  main__section.classList.add("main__boton");
  main__section.id = "main__section";
  a__img.classList.add("a__boton");
  a__img.src = "assets/png/—Pngtree—start button in pixel art_7949383 (1).png";
  section__a.href = "#";
  a__img.alt = "Imagen_start";

  main__section.append(section__a);
  section__a.append(a__img);
  viewerMain.appendChild(main__section);
}

document.addEventListener("DOMContentLoaded", homeIntro);
