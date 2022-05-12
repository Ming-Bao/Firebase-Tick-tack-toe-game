/********************************************************/
// Variables, constants and all that other good stuff
/********************************************************/
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
    var id = document.getElementById(_btnID);
  
    document.getElementById("btmText").innerHTML =
    ttt_player[ttt_playerTurn].userName + " Turn"
    ttt_turnSwap();
    id.disabled = true;
    ttt_determinXO(_btnID)
    ttt_determinWin();
  }
  
  /********************************************************/
  // changes the button clicked to X or O
  // X and O is determined by ttt_playerTurn
  /********************************************************/
  function ttt_determinXO(_btnID) {
    var id = document.getElementById(_btnID);
  
    id.innerHTML = ttt_player[ttt_playerTurn].symbol;
    ttt_btnClicked[_btnID] = ttt_player[ttt_playerTurn].symbol;
    id.style.fontSize = "300%";
    id.style.backgroundColor = "aqua";
  }
  
  /********************************************************/
  // resets all buttons and ttt_btnClicked array
  /********************************************************/
  function ttt_resetGame() {
    document.getElementById("btmText").innerHTML =
    ttt_player[ttt_playerTurn].userName + " Turn";
    ttt_turnSwap();
    document.getElementById("resetBTN").style.display="none";
    
    for (var i = 0; i <= ttt_ALLWINCOND.length; i++) {
      var id = document.getElementById(i);
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
        
        console.log((ttt_player[ttt_playerTurn].userName) + " win")
        document.getElementById("btmText").innerHTML =
        ttt_player[ttt_playerTurn].userName + " win"
        winFlag = true;
        document.getElementById("resetBTN").style.display="block";
        ttt_addWinLoss();
      }
    }
  
    if (winFlag == true) {
      for (var i = 0; i <= ttt_ALLWINCOND.length; i++) {
        document.getElementById(i).disabled = true
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
        document.getElementById("resetBTN").style.display="block";
        ttt_addDraw();
      }
   }
  }
  
  /********************************************************/
  // adds wins or losses when someone wins
  /********************************************************/
  function ttt_addWinLoss() {
    ttt_player[ttt_playerTurn].win++
    document.getElementById("win" + ttt_playerTurn).innerHTML = 
    "wins: " + ttt_player[ttt_playerTurn].win
    
    ttt_turnSwap()
    ttt_player[ttt_playerTurn].loss++
    document.getElementById("loss" + ttt_playerTurn).innerHTML = 
    "losses: " + ttt_player[ttt_playerTurn].loss
  }
  /********************************************************
  // adds wins or losses when someone wins
  /********************************************************/
  function ttt_addDraw() {
    ttt_player[ttt_playerTurn].draw++
    document.getElementById("draw" + ttt_playerTurn).innerHTML = 
    "draws: " +  ttt_player[ttt_playerTurn].draw
    
    ttt_turnSwap()
    ttt_player[ttt_playerTurn].draw++
    document.getElementById("draw" + ttt_playerTurn).innerHTML = 
    "draws: " +  ttt_player[ttt_playerTurn].draw
  }
  
  /********************************************************
  // Changes ttt_playerSwap into either 0 or 1
  /********************************************************/
  function ttt_turnSwap() {
    ttt_playerTurn = 1 - ttt_playerTurn
  }
  
  /**************************************************************/
  // END OF MODULE
  /**************************************************************/