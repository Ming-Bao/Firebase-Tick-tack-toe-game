/********************************************************/
// Variables, constants and all that other good stuff
/********************************************************/
var TTT_player = [{
  userName: "Ming X",
  symbol: "x",
  win: 0,
  loss: 0,
  draw: 0
},
              {
  userName: "Steven O",
  symbol: "O",  
  win: 0,
  loss: 0,
  draw: 0
  
}]

var TTT_playerTurn = 1

const TTT_ALLWINCOND = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

var TTT_btnClicked = ["", "", "", "", "", "", "", "", ""];


/********************************************************/
// calls when a button is hit
// passes the id of the button hit
// disables the button that's hit
/********************************************************/
function TTT_btnHit(_btnID) {
  var id = document.getElementById(_btnID);

  document.getElementById("btmText").innerHTML =
  TTT_player[TTT_playerTurn].userName + " Turn"
  TTT_turnSwap();
  id.disabled = true;
  TTT_determinXO(_btnID)
  TTT_determinWin();
}

/********************************************************/
// determins if the TTT_player is X or O 
// changes the button to X or O
/********************************************************/
function TTT_determinXO(_btnID) {
  var id = document.getElementById(_btnID);

  id.innerHTML = TTT_player[TTT_playerTurn].symbol;
  TTT_btnClicked[_btnID] = TTT_player[TTT_playerTurn].symbol;
  id.style.fontSize = "300%";
  id.style.backgroundColor = "aqua";
}

/********************************************************/
// resets all buttons and TTT_btnClicked array
/********************************************************/
function TTT_resetGame() {
  document.getElementById("btmText").innerHTML =
  TTT_player[TTT_playerTurn].userName + " Turn";
  TTT_turnSwap();
  
  for (var i = 0; i <= TTT_ALLWINCOND.length; i++) {
    var id = document.getElementById(i);
    id.disabled = false;
    id.innerHTML = ""
    id.style.backgroundColor = "lightgray"
    TTT_btnClicked[i] = "";
  }
}

/********************************************************/
// determins who wins the game
/********************************************************/
function TTT_determinWin() {
  var WINCONDARR
  var winFlag = false

  // win condition
  for (var i = 0; i < TTT_ALLWINCOND.length; i++) {
    WINCONDARR = TTT_ALLWINCOND[i]
    if (TTT_btnClicked[WINCONDARR[0]] == TTT_player[TTT_playerTurn].symbol && 
        TTT_btnClicked[WINCONDARR[1]] == TTT_player[TTT_playerTurn].symbol &&
        TTT_btnClicked[WINCONDARR[2]] == TTT_player[TTT_playerTurn].symbol) {
      
      console.log((TTT_player[TTT_playerTurn].userName) + " win")
      document.getElementById("btmText").innerHTML =
      TTT_player[TTT_playerTurn].userName + " win"
      winFlag = true;
      TTT_addWinLoss();
    }
  }

  if (winFlag == true) {
    for (var i = 0; i <= TTT_ALLWINCOND.length; i++) {
      document.getElementById(i).disabled = true
    }
  }

  // draw condition
  if (winFlag == false) {
    if (TTT_btnClicked[0] != "" && 
        TTT_btnClicked[1] != "" &&
        TTT_btnClicked[2] != "" &&
        TTT_btnClicked[3] != "" && 
        TTT_btnClicked[4] != "" &&
        TTT_btnClicked[5] != "" &&
        TTT_btnClicked[6] != "" && 
        TTT_btnClicked[7] != "" &&
        TTT_btnClicked[8] != ""){
      console.log("draw");
      TTT_addDraw();
    }
 }
}

/********************************************************/
// adds wins or losses when someone wins
/********************************************************/
function TTT_addWinLoss() {
  TTT_player[TTT_playerTurn].win++
  document.getElementById("win" + TTT_playerTurn).innerHTML = 
  "wins: " + TTT_player[TTT_playerTurn].win
  
  TTT_turnSwap()
  TTT_player[TTT_playerTurn].loss++
  document.getElementById("loss" + TTT_playerTurn).innerHTML = 
  "losses: " + TTT_player[TTT_playerTurn].loss
}
/********************************************************
// adds wins or losses when someonw wins
/********************************************************/
function TTT_addDraw() {
  TTT_player[TTT_playerTurn].draw++
  document.getElementById("draw" + TTT_playerTurn).innerHTML = 
  "draws: " +  TTT_player[TTT_playerTurn].draw
  
  TTT_turnSwap()
  TTT_player[TTT_playerTurn].draw++
  document.getElementById("draw" + TTT_playerTurn).innerHTML = 
  "draws: " +  TTT_player[TTT_playerTurn].draw
}

/********************************************************
// Changes TTT_playerSwap into eithwe 0 or 1
/********************************************************/
function TTT_turnSwap() {
  TTT_playerTurn = 1 - TTT_playerTurn
}

/********************************************************/
// End Of Code
/********************************************************/