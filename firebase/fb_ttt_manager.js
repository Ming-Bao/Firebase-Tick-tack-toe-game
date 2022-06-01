/********************************************************/
// Variables, constants and all that other good stuff
/********************************************************/
// constants
const p1Num = 0
const p2Num = 1

// all the details about the ttt game
var ttt_player = [{
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
  
var ttt_playerTurn = 1

const ttt_ALLWINCOND = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

var ttt_btnClicked = ["", "", "", "", "", "", "", "", ""];


/********************************************************/
// calls when a button is hit
// passes the id of the button hit
// disables the button that's hit
/********************************************************/
function ttt_btnHit(_btnID) {
  var id = document.getElementById("tttBTN" + (_btnID+1));

  document.getElementById("btmText").innerHTML =
  ttt_player[ttt_playerTurn].userName + " Turn"
  id.disabled = true;
  ttt_determinXO(_btnID)
  ttt_determinWin();
  ttt_lockUnclickedBTN();
  if (ttt_playerTurn == 0) {
    fb_writeRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid + "/player1/move", _btnID);
  }
  if (ttt_playerTurn == 1) {
    fb_writeRec(ACTIVE_LOBBY, playerDetails.uid + "/player2/move", _btnID);
  }
}

/********************************************************/
// calls when the opposite person makes a move
// passes the id of the button hit
// disables the button that's hit
/********************************************************/
function fb_ttt_move(_btnID) {
  console.log("fb_ttt_move _btnID = " + _btnID);

  var id = document.getElementById("tttBTN" + _btnID);

  document.getElementById("btmText").innerHTML =
  ttt_player[ttt_playerTurn].userName + " Turn"
  document.getElementById("tttBTN" + (_btnID+1)).disabled = true;

  ttt_determinXO(_btnID)
  ttt_determinWin();

  if (ttt_playerTurn == 0) {
    id.innerHTML = ttt_player[ttt_playerTurn + 1].symbol;
    ttt_btnClicked[_btnID - 1] = ttt_player[ttt_playerTurn + 1].symbol;
    id.style.fontSize = "300%";
    id.style.backgroundColor = "aqua"
  }
  if (ttt_playerTurn == 1) {
    id.innerHTML = ttt_player[ttt_playerTurn - 1].symbol;
    ttt_btnClicked[_btnID - 1] = ttt_player[ttt_playerTurn - 1].symbol;
    id.style.fontSize = "300%";
    id.style.backgroundColor = "aqua"
  }
}

/********************************************************/
// changes the button clicked to X or O
// X and O is determined by ttt_playerTurn
/********************************************************/
function ttt_determinXO(_btnID) {
  var id = document.getElementById("tttBTN" + _btnID);

  id.innerHTML = ttt_player[ttt_playerTurn].symbol;
  ttt_btnClicked[_btnID - 1] = ttt_player[ttt_playerTurn].symbol;
  id.style.fontSize = "300%";
  id.style.backgroundColor = "aqua";
}

/********************************************************/
// resets all buttons and ttt_btnClicked array
/********************************************************/
function ttt_resetGame() {
  document.getElementById("btmText").innerHTML =
  ttt_player[ttt_playerTurn].userName + " Turn";
  document.getElementById("resetBTN").style.display="none";

  if (ttt_playerTurn == 0) {
    fb_writeRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid + "/player1/move", 'c');
  }
  if (ttt_playerTurn == 1) {
    fb_writeRec(ACTIVE_LOBBY, playerDetails.uid + "/player2/move", 'c');
  }
  
  for (var i = 0; i <= ttt_ALLWINCOND.length; i++) {
    var id = document.getElementById("tttBTN" + (i + 1));
    id.disabled = false;
    id.innerHTML = ""
    id.style.backgroundColor = "lightgray"
    ttt_btnClicked[i] = "";
  }
}

/********************************************************/
// determins who wins the game
/********************************************************/
function ttt_determinWin() {
  var WINCONDARR
  var winFlag = false

  // win condition
  for (var i = 0; i < ttt_ALLWINCOND.length; i++) {
    WINCONDARR = ttt_ALLWINCOND[i]
    if (ttt_btnClicked[WINCONDARR[0]] == ttt_player[ttt_playerTurn].symbol && 
        ttt_btnClicked[WINCONDARR[1]] == ttt_player[ttt_playerTurn].symbol &&
        ttt_btnClicked[WINCONDARR[2]] == ttt_player[ttt_playerTurn].symbol) {
          
          console.log("ttt_winNumbers: " + [WINCONDARR[0]] + [WINCONDARR[1]] + [WINCONDARR[2]] + ttt_player[ttt_playerTurn].symbol)
          
          console.log((ttt_player[ttt_playerTurn].userName) + " win")
          document.getElementById("btmText").innerHTML =
          ttt_player[ttt_playerTurn].userName + " win"
          winFlag = true;
          ttt_addWin(ttt_playerTurn);
          if (ttt_playerTurn == 0) {
            ttt_addLoss(ttt_playerTurn + 1)
          }
          if (ttt_playerTurn == 1) {
            ttt_addLoss(ttt_playerTurn - 1)
          }
        }
      }

  if (winFlag == true) {
    for (var i = 0; i <= ttt_ALLWINCOND.length; i++) {
      document.getElementById("tttBTN" + (i + 1)).disabled = true

      if (ttt_playerTurn == 0) {
        fb_writeRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid + "/player1/move", "w");
      }
      if (ttt_playerTurn == 1) {
        fb_writeRec(ACTIVE_LOBBY, playerDetails.uid + "/player2/move", "w");
      }
    }
  }

  // draw condition
  if (winFlag == false) {
    if (ttt_btnClicked[0] != "" && 
        ttt_btnClicked[1] != "" &&
        ttt_btnClicked[2] != "" &&
        ttt_btnClicked[3] != "" && 
        ttt_btnClicked[4] != "" &&
        ttt_btnClicked[5] != "" &&
        ttt_btnClicked[6] != "" && 
        ttt_btnClicked[7] != "" &&
        ttt_btnClicked[8] != ""){
      
      console.log("draw");
      if (ttt_playerTurn == 0) {
        fb_writeRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid + "/player1/move", "d");
      }
      if (ttt_playerTurn == 1) {
        fb_writeRec(ACTIVE_LOBBY, playerDetails.uid + "/player2/move", "d");
      }
      ttt_addDraw();
    }
  }
}

/********************************************************/
// adds wins when someone wins
/********************************************************/
function ttt_addWin(_playerNum) {
  ttt_player[_playerNum].win++
  document.getElementById("win" + _playerNum).innerHTML = 
  "wins: " + ttt_player[_playerNum].win
}

/********************************************************/
// adds loss when someone loses
/********************************************************/
function ttt_addLoss(_playerNum) {
  ttt_player[_playerNum].loss++
  document.getElementById("loss" + _playerNum).innerHTML = 
  "losses: " + ttt_player[_playerNum].loss
}

/********************************************************
// adds wins or losses when someone wins
/********************************************************/
function ttt_addDraw() {
  ttt_player[ttt_playerTurn].draw++
  document.getElementById("draw" + ttt_playerTurn).innerHTML = 
  "draws: " +  ttt_player[ttt_playerTurn].draw

  if (ttt_playerTurn == 0){
    ttt_player[ttt_playerTurn + 1].draw++
    document.getElementById("draw" + "1").innerHTML = 
    "draws: " +  ttt_player[ttt_playerTurn + 1].draw
  }
  if (ttt_playerTurn == 1){
    ttt_player[ttt_playerTurn - 1].draw++
    document.getElementById("draw" + "0").innerHTML = 
    "draws: " +  ttt_player[ttt_playerTurn - 1].draw
  }
}

/********************************************************
// locks all the buttons that's not been clicked
/********************************************************/
function ttt_lockUnclickedBTN() {
  console.log("ttt_lockUnclickedBTN")

  for (var i = 0; i <= ttt_btnClicked.length; i++) {
    if (ttt_btnClicked[i] == '') {
      document.getElementById("tttBTN" + (i+1)).disabled = true;
    }
  }
}

/********************************************************
// unlocks all the buttons that's not been clicked
/********************************************************/
function ttt_unlockUnclickedBTN() {
  console.log("ttt_unlockUnclickedBTN")

  for (var i = 0; i <= ttt_btnClicked.length; i++) {
    if (ttt_btnClicked[i] == '') {
      document.getElementById("tttBTN" + (i+1)).disabled = false;
    }
  }
}

/**************************************************************/
// END OF MODULE
/**************************************************************/