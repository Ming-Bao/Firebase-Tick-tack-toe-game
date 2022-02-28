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

const ALLWINCOND = [
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
/********************************************************/
// calls when a button is hit
// passes the id of the button hit
// disables the button that's hit
/********************************************************/
function buttonHit(_btnID) {
  var id = document.getElementById(_btnID);
  playerTurn = 1 - playerTurn;

  document.getElementById("btmText").innerHTML =
  "Player " + (playerTurn + 1) + " Turn"
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
}

/********************************************************/
// resets all buttons and btnClicked array
/********************************************************/
function resetGame() {
  for (var i = 0; i <= ALLWINCOND.length; i++) {
    var id = document.getElementById(i)
    id.disabled = false;
    id.innerHTML = ""
    id.style.backgroundColor = "lightgray"
    btnClicked[i] = "";
  }
}

/********************************************************/
// determins who wins the game
/********************************************************/
function determinWin() {
  var WINCONDARR
  var winFlag = false
  for (var i = 0; i < ALLWINCOND.length; i++) {
    WINCONDARR = ALLWINCOND[i]
    if (btnClicked[WINCONDARR[0]] == player[playerTurn].symbol && 
        btnClicked[WINCONDARR[1]] == player[playerTurn].symbol &&
        btnClicked[WINCONDARR[2]] == player[playerTurn].symbol) {
      
      console.log("player " + (playerTurn+1) + " win")
      winFlag = true;
      addWinLoss();
    }
  }

  if (winFlag == true) {
    for (var i = 0; i <= ALLWINCOND.length; i++) {
      document.getElementById(i).disabled = true
    }
  }
  
  if (winFlag == false) {
    if (btnClicked[0] != "" && 
        btnClicked[1] != "" &&
        btnClicked[2] != "" &&
        btnClicked[3] != "" && 
        btnClicked[4] != "" &&
        btnClicked[5] != "" &&
        btnClicked[6] != "" && 
        btnClicked[7] != "" &&
        btnClicked[8] != ""){
      console.log("draw");
      addDraw();
    }
 }
}

/********************************************************/
// adds wins or losses when someone wins
/********************************************************/
function addWinLoss() {
  player[playerTurn].win++
  document.getElementById("win" + playerTurn).innerHTML = 
  "wins: " + player[playerTurn].win
  
  playerTurn = 1 - playerTurn
  player[playerTurn].loss++
  document.getElementById("loss" + playerTurn).innerHTML = 
  "losses: " + player[playerTurn].loss
}

/********************************************************/
// adds wins or losses when someone wins
/********************************************************/
function addDraw() {
  player[playerTurn].draw++
  document.getElementById("draw" + playerTurn).innerHTML = 
  "draws: " +  player[playerTurn].draw
  
  playerTurn = 1 - playerTurn
  player[playerTurn].draw++
  document.getElementById("draw" + playerTurn).innerHTML = 
  "draws: " +  player[playerTurn].draw
}
/********************************************************/
// End Of Code
/********************************************************/