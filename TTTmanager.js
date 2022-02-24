/********************************************************/
// Variables, constants and all that other good stuff
/********************************************************/
var player = [{
  userName: "",
  symbol: "x",
  win: 0,
  loss: 0,
  draw: 0
},
              {
  userName: "",
  symbol: "O",  
  win: 0,
  loss: 0,
  draw: 0
  
}]

playerTurn = 1

const WINCOND = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

var btnClicked = ["", "", "", "", "", "", "", "", ""];

// const XWINCOND1 = ["x", "x", "x", false, false, false, false, false, false];
// const XWINCOND2 = [false, false, false, "x", "x", "x", false, false, false];
// const XWINCOND3 = [false, false, false, false, false, false, "x", "x", "x"];
// const XWINCOND4 = ["x", false, false, "x", false, false, "x", false, false];
// const XWINCOND5 = [false, "x", false, false, "x", false, false, "x", false];
// const XWINCOND6 = [false, false, "x", false, false, "x", false, false, "x"];
// const XWINCOND7 = ["x", false, false, false, "x", false, false, false, "x"];
// const XWINCOND8 = [false, false, "x", false, "x", false, "x", false, false];

// const OWINCOND1 = ["O", "O", "O", false, false, false, false, false, false];
// const OWINCOND2 = [false, false, false, "O", "O", "O", false, false, false];
// const OWINCOND3 = [false, false, false, false, false, false, "O", "O", "O"];
// const OWINCOND4 = ["O", false, false, "O", false, false, "O", false, false];
// const OWINCOND5 = [false, "O", false, false, "O", false, false, "O", false];
// const OWINCOND6 = [false, false, "O", false, false, "O", false, false, "O"];
// const OWINCOND7 = ["O", false, false, false, "O", false, false, false, "O"];
// const OWINCOND8 = [false, false, "O", false, "O", false, "O", false, false];

/********************************************************/
// calls when a button is hit
// passes the id of the button hit
// disables the button that's hit
/********************************************************/
function buttonHit(_btnID) {
  var id = document.getElementById(_btnID);
  console.log ("button hit: " + _btnID);

  playerTurn = 1 - playerTurn;
  id.disabled = true;
  determinXO(_btnID)
  determinWin();
}

/********************************************************/
// determins if the player is X or O 
// changes the button to X or O
/********************************************************/
function determinXO(_btnID) {
  var id = document.getElementById(_btnID);

  id.innerHTML = player[playerTurn].symbol;
  btnClicked[_btnID] = player[playerTurn].symbol;
  id.style.fontSize = "300%";
  id.style.backgroundColor = "aqua";

  console.log(btnClicked);
}

/********************************************************/
// resets all buttons and btnClicked array
/********************************************************/
function resetGame() {
  for (var i = 0; i <= WINCOND.length; i++) {
    var id = document.getElementById(i)
    id.disabled = false;
    id.innerHTML = " "
    id.style.backgroundColor = "lightgray"
    btnClicked[i] = " ";
  }
}

/********************************************************/
// determins who wins the game
/********************************************************/
function determinWin() {
  for (var i = 0; i < WINCOND.length; i++) {
    if (btnClicked[WINCOND.[i, 1]] = player[playerTurn].symbol && 
        btnClicked[WINCOND.[i, 2]] = player[playerTurn].symbol &&
        btnClicked[WINCOND.[i, 3]] = player[playerTurn].symbol) {
          console.log("win")

      
        }
  }
}