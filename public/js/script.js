let viewerMain = document.getElementById("visor__main");

let level;
let maxLevel;

let maxHolder;
let maxItems;

let prePost;


let holdersArr = [];
let itemHolderArr = [];
let click = true;

let interval;

let end = false;

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

    //add a listener to the jar container
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

      for (let index2 = 0; index2 < holdersArr[index].length; index2++) {
        let item = document.createElement("DIV");//TODO DIV?
        item.classList.add("pixel-ball"); //TODO change classname
        item.classList.add("color" + holdersArr[index][index2]);
        items.append(item); //*holder.appendChild(item);
      }
      holder.append(items);
      mainHolders.append(holder);
      viewerMain.append(mainHolders);
    }
  }

  if (posAnt === null && posPost === null) {  //TODO rename posAnt & posPost
    generateEnvironment();
  } else {
    editEnvironment(posAnt, posPost);
  }
}

const startEnviroment = () => {
  
  if (holdersArr.length != 0) {
    holdersArr = [];
  }
  if (itemHolderArr.length != 0) {
    itemHolderArr = [];
  }

  //inicioTempo();
  // character = viewerMain.querySelector("#character_1");
  // character.remove();

  let mainSection = document.getElementById("main__section");
  if (mainSection) mainSection.remove();

  const textoTitulo = viewerMain.querySelector("#visor__div__texto"); //TODO rename textTitulo
  // if (titleText) titleText.remove();

  //Constants settings. (These are the parameters with which the game starts, they change with each level)
  // time = 40;
  // Set game parameters (these can be adjusted later)
  level = 0;
  maxLevel = 3;
  maxHolder = 4;
  maxItems = 4;

  gameBoard();
  updateEnvironment();
  // startTime();
  // skyColor(level);
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

       // Swap items between two random positions
       let temp = holdersArr[randomHolder1][randomItem1];
       holdersArr[randomHolder1][randomItem1] =
         holdersArr[randomHolder2][randomItem2];
       holdersArr[randomHolder2][randomItem2] = temp;
    }
  } while (checkingWinningConditions());  // Ensure the board doesn't start solved
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
      // audioWin();
      deleteEnvironment();
      time = 0;
      // skyColor(2);
      startEnd(win);
    } else {
      // audioLevelUp();
      maxItems++;
      maxHolder++;
      deleteEnvironment();
      gameBoard();
      updateEnvironment();
      // skyColor(level);
      // time = baseTime + 10 * level; 
    }
  }
};

//   if (level > 2) {
//     level = 2;
//   }
// //TODO erase?
//   const skies = viewerMain.parentNode;
//   const bg = skies.firstChild.nextSibling;
//   switch (level) {
//     case 0:
//       skies.classList = [...skies.classList].filter(
//         (clase) =>
//           clase != "cieloAzul" &&
//           clase != "cieloInicial" &&
//           clase != "cieloGris" &&
//           clase != "cieloNaranja"
//       );
//       skies.classList.add("cieloGris");

//       bg.classList = [...bg.classList].filter(
//         (clase) =>
//           clase != "fondoGris3" &&
//           clase != "fondoGris2" &&
//           clase != "fondoGris1"
//       );
//       bg.classList.add("fondoGris1");
//       break;
//     case 1:
//       skies.classList.remove("cieloGris");
//       skies.classList.add("cieloNaranja");

//       bg.classList.remove("fondoGris1");
//       bg.classList.add("fondoGris2");
//       break;
//     case 2:
//       skies.classList.remove("cieloNaranja");
//       skies.classList.add("cieloAzul");

//       bg.classList.remove("fondoGris2");
//       bg.classList.add("fondoGris3");
//       break;
//     default:
//       break;
//   }
// };

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
          // audioBallOut();
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
              // audioMovementBack();
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
              // audioMeterBall();
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
          // audioBallOut();
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
              // audioMovementBack();
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
              // audioMeterBall();
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

    viewerMain.append(character);
    // crateStartButton(); //TODO create a redo button
    section__a.addEventListener("click", startEnviroment);
  }, 4000);
}


document.addEventListener("DOMContentLoaded", () => {
  startEnviroment();
});
