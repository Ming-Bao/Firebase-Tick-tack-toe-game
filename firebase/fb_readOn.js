// pending lobby info

var fb_pendingLobby = {
  gameName: '',
  timeStamp: '',
  pendingStatus: false
}

// active lobby info
var fb_activeLobby = {
  player1:{
    wins: 0,
    loss: 0,
    draw: 0,
    name: "",
    move: ""
  },
  player2:{
    wins: 0,
    loss: 0,
    draw: 0,
    name: "",
    move: ""
  }
}

var fb_score = {
  localPlayer: {
    wins: 0,
    loss: 0,
    draw: 0
  },
  onlinePlayer: {
    wins: 0,
    loss: 0,
    draw: 0    
  }
}

/**************************************************************/
// fb_createPendingTable()
// Call the functions and create the pending game lobby
// Input:
// Return:  
/**************************************************************/
function fb_createPendingTable() {
  fb_readAll(PENDING_LOBBY, processPendingLobby);
  ui_pageSwap("s_lobbyP", "s_pendingP");
}

/**************************************************************/
// fb_createPendingLobby()
// Call the functions and create the pending game lobby
// Input:
// Return:  
/**************************************************************/
function fb_createPendingLobby() {
  fb_pendingLobby.gameName = prompt("what is your game name?");

  const time = new Date();
  var minute = time.getUTCMinutes();
  var hour = time.getUTCHours();
  var day = time.getUTCDate();
  var month = time.getUTCMonth() + 1;
  var year = time.getUTCFullYear();

  if (minute < 10) {
    minute = "0" + minute;
  }
  fb_pendingLobby.timeStamp = day + "/" + month + "/" + year + " " + hour + ":" + minute;
  console.log(fb_pendingLobby.timeStamp);

  fb_writeRec(PENDING_LOBBY, fb_pendingLobby.gameName, fb_pendingLobby);
  ui_pageSwap("s_lobbyP", "s_activeP");
  fb_readOnRec(PENDING_LOBBY, fb_pendingLobby.gameName + '/' + "pendingStatus", fb_readOnPendingStatus);
}

/**************************************************************/
// fb_initActiveGame()
// Initilises the TTT active game 
// Input:
// Return:  
/**************************************************************/
function fb_initActiveGame(_key) {
  fb_activeLobby.player2.loss = fb_score.localPlayer.loss;
  fb_activeLobby.player2.draw = fb_score.localPlayer.draw;
  fb_activeLobby.player2.wins = fb_score.localPlayer.wins;

  fb_overWriteRec(PENDING_LOBBY, _key, "pendingStatus", true);
  fb_overWriteRec(PENDING_LOBBY, _key, "uid", playerDetails.uid);
  fb_activeLobby.player2.name = playerDetails.name;
  console.log("fb_activeLobby: " + fb_activeLobby);
  fb_writeRec(ACTIVE_LOBBY, playerDetails.uid, fb_activeLobby);
  fb_readOnRec(ACTIVE_LOBBY, playerDetails.uid + "/" + "player1" + "/" + "move", fb_readOnPlayer1Move);
  fb_readOnRec(ACTIVE_LOBBY, playerDetails.uid + "/" + "player1" + "/" + "name", fb_readOnUpdatePlayer1NameAndScore);
  ui_pageSwap("s_pendingP", "s_gameP");
  ttt_playerTurn = 1;
  ttt_lockUnclickedBTN();
  //this is player 2 so disable all the buttons so they they can't make a move
}

/**************************************************************/
// fb_readOnUpdatePlayer1NameAndScore()
// reads the active lobby record and updates the score and name
// in game
/**************************************************************/
function fb_readOnUpdatePlayer1NameAndScore(_readStatus, _data) {
  if (_data != "") {
    fb_readRec(ACTIVE_LOBBY, playerDetails.uid, false, fb_updatePlayer1NameAndScore);
  }
}

/**************************************************************/
// fb_readOnRec(_path, _key, _function)
// Initilise a readon on a firebase record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
function fb_readOnRec(_path, _key, _processFunc) {
    console.log('fb_readRec: path= ' + _path + '  key= ' + _key);
  
    readStatus = "waiting";
    firebase.database().ref(_path + '/' + _key).on("value", gotRecord, readErr);
  
    function gotRecord(snapshot) {
      let dbData = snapshot.val();
      if (dbData == null) {
        readStatus = "no record";
        _processFunc(readStatus);
      } else {
        readStatus = "OK";
        _processFunc(readStatus, dbData);
      }
    }
  
    function readErr(error) {
      readStatus = "fail";
      console.log(error);
    }
  }

/**************************************************************/
// fb_readOnPendingStatus(_readStatus, _data)
// called by fb_readOnRec
// Input:
// Return:  
/**************************************************************/
function fb_readOnPendingStatus(_readStatus, _data) {
  console.log("fb_readOnPendingStatus: data = " + _data);

  if (_data == true) {
    fb_readRec(PENDING_LOBBY, fb_pendingLobby.gameName, false, fb_processP2UID);
    fb_activeLobby.player1.loss = fb_score.localPlayer.loss;
    fb_activeLobby.player1.draw = fb_score.localPlayer.draw;
    fb_activeLobby.player1.wins = fb_score.localPlayer.wins;
    fb_activeLobby.player1.name = playerDetails.name;
    ui_pageSwap("s_activeP", "s_gameP");
  }
}

/**************************************************************/
// fb_readOnPlayer1Move(_readStatus, _data)
// called by fb_readOnRec, processed the move by player 1
// this is player 2
/**************************************************************/
function fb_readOnPlayer1Move(_readStatus, _data) {
  console.log("fb_readOnPlayer1Move: player 1 data= " + _data);
  console.log("fb_readOnPlayer1Move: this is player2");
  var flag = false;

  var funcArray = [winFuncP2, loseFuncP2, drawFuncP2, clearFuncP2, endFuncP2];
  var inputArray = ['w','l','d','c','e'];

  if (_data === '' || _data == null){
  flag = true
  console.log("player2 readon first move")} 

  for (var i = 0; i <= inputArray.length; i++){
    if(_data != ''){
      if(_data == inputArray[i]){
        console.log("fb_readOnPlayer1Move: player 2 fb_readOnPlayer1Move loop");
        flag = true;
        funcArray[i]();
      }
    }
  }

  //if the game hasn't ended
  if (flag == false) {
    //update the grid with player1's move
    //unlocks all the pieces of the grid that has no symbols on it
    console.log("fb_readOnPlayer1Move: player 1 has made the move: " + _data);
    fb_ttt_move(_data);
    ttt_unlockUnclickedBTN();
  }
}

/**************************************************************/
// Player 2 win, draw, clear and loss functions
// this is player 2
/**************************************************************/
function winFuncP2() {
  // update score locally
  // update score on firebase
  // clear grid 
  ttt_addWin(ttt_playerTurn - 1);
  ttt_addLoss(ttt_playerTurn);
  fb_score.localPlayer.wins = ttt_player[ttt_playerTurn].win;
  fb_score.localPlayer.loss = ttt_player[ttt_playerTurn].loss;
  fb_writeRec(SCORE, playerDetails.uid, fb_score.localPlayer);
  ttt_lockUnclickedBTN();
  document.getElementById("resetBTN").style.display="block";
  document.getElementById("btmText").innerHTML = ttt_player[ttt_playerTurn-1].userName + " Won";
}

function loseFuncP2() {
  // update score locally
  // update score on firebase
  // clear grid
  ttt_addLoss(ttt_playerTurn);
  ttt_addWin(ttt_playerTurn - 1);
  ttt_lockUnclickedBTN();
  document.getElementById("resetBTN").style.display="block";
  document.getElementById("btmText").innerHTML = ttt_player[ttt_playerTurn-1].userName + " Lost";
}

function drawFuncP2() {
  // update score locally
  // update score on firebase
  // clear grid
  ttt_addDraw();
  ttt_lockUnclickedBTN();
  document.getElementById("resetBTN").style.display="block";
  document.getElementById("btmText").innerHTML = "You Draw!";
  fb_score.localPlayer.draw = ttt_player[ttt_playerTurn].draw;
  fb_writeRec(SCORE, playerDetails.uid, fb_score.localPlayer);
}

function clearFuncP2() {
  console.log("clear func p2")
  ttt_resetGame(true);
  ttt_lockUnclickedBTN();
  document.getElementById("btmText").innerHTML = ttt_player[ttt_playerTurn-1].userName + " Turn";
}

function endFuncP2() {
  ui_pageSwap('s_gameP', 's_lobbyP');
  fb_deleteRec(ACTIVE_LOBBY, playerDetails.uid);
}

/**************************************************************/
// fb_readOnPlayer2Move(_readStatus, _data)
// called by fb_readOnRec, processed the move by player 2
// this is player 1
/**************************************************************/
function fb_readOnPlayer2Move(_readStatus, _data) {
  console.log("readon player 2 data= " + _data);
  console.log("this is player 1");
  var flag = false

  var funcArray = [winFuncP1, loseFuncP1, drawFuncP1, clearFuncP1, endFuncP1];
  var inputArray = ['w','l','d','c','e'];

  if (_data === '' || _data == null){flag = true}
  for (var i = 0; i <= inputArray.length; i++){
    if(flag == false){
      if(_data == inputArray[i]){
        console.log("player 1 fb_readOnPlayer2Move loop");
        document.getElementById("btmText").innerHTML = ttt_player[ttt_playerTurn].userName + " Turn";
        flag = true;
        funcArray[i]();
      }
    }
  }

  //if the game hasn't ended
  if (flag == false) {
    //update the grid with player2's move
    //unlocks all the pieces of the grid that has no symbols on it
    console.log("player 2 has made the move: " + _data);
    fb_ttt_move(_data);
    ttt_unlockUnclickedBTN();
  }
}

/**************************************************************/
// Player 1 win, draw and loss functions
// this is player 1
/**************************************************************/
function winFuncP1() {
  // update score locally
  // update score on firebase
  // clear grid  
  ttt_addWin(ttt_playerTurn + 1);
  ttt_addLoss(ttt_playerTurn);
  fb_score.localPlayer.wins = ttt_player[ttt_playerTurn].win;
  fb_score.localPlayer.loss = ttt_player[ttt_playerTurn].loss;
  fb_writeRec(SCORE, playerDetails.uid, fb_score.localPlayer);
  ttt_lockUnclickedBTN();
  document.getElementById("resetBTN").style.display="block";
  document.getElementById("btmText").innerHTML = ttt_player[ttt_playerTurn+1].userName + " Won";
}

function loseFuncP1() {
  // update score locally
  // update score on firebase
  // clear grid
  ttt_addLoss(ttt_playerTurn);
  ttt_addWin(ttt_playerTurn + 1);
  ttt_lockUnclickedBTN();
  document.getElementById("resetBTN").style.display="block";
  document.getElementById("btmText").innerHTML = ttt_player[ttt_playerTurn+1].userName + " Lost";
}

function drawFuncP1() {
  // update score locally
  // update score on firebase
  // clear grid
  ttt_addDraw()
  document.getElementById("resetBTN").style.display="block";
  ttt_lockUnclickedBTN();
  document.getElementById("btmText").innerHTML = "You Draw!";
}

function clearFuncP1() {
  console.log("clear func p1");
  ttt_resetGame(true);
  ttt_lockUnclickedBTN();
  document.getElementById("btmText").innerHTML = ttt_player[ttt_playerTurn+1].userName + " Turn";
}

function endFuncP1() {
  ui_pageSwap('s_gameP', 's_lobbyP');
  fb_deleteRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid);

}

/**************************************************************/
// fb_processP2UID(_readStatus, _data)
// called by fb_readOnPendingStatus
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
  function fb_processP2UID (_status, _data) {
    console.log("fb_processP2UID");
    fb_activeLobby.player2.uid = _data.uid;
    fb_writeRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid + "/" + "player1", fb_activeLobby.player1);
    fb_readOnRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid + "/" + "player2" + "/" + "move", fb_readOnPlayer2Move);
    fb_readRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid, false, fb_updatePlayer2NameAndScore);
    ttt_playerTurn = 0;
    console.log(fb_pendingLobby.gameName);
    fb_deleteRec(PENDING_LOBBY, fb_pendingLobby.gameName);
    //this is player 1
  }

/**************************************************************/
// fb_updatePlayer1NameAndScore()
// Stores database record in an object then updates both player's name
// and both player's score
// Input: n/a
// Return: n/a
/**************************************************************/
function fb_updatePlayer1NameAndScore(_readStatus, _data) {
  fb_activeLobby.player1.name = _data.player1.name;
  fb_activeLobby.player2.name = _data.player2.name;
  document.getElementById("p1Name").innerHTML = fb_activeLobby.player1.name;
  document.getElementById("p2Name").innerHTML = fb_activeLobby.player2.name;
  ttt_player[0].userName = fb_activeLobby.player1.name;
  ttt_player[1].userName = fb_activeLobby.player2.name;

  fb_score.onlinePlayer.wins = _data.player1.wins;
  fb_score.onlinePlayer.loss = _data.player1.loss;
  fb_score.onlinePlayer.draw = _data.player1.draw;
  

  ttt_player[0].win = fb_score.onlinePlayer.wins;
  ttt_player[0].draw = fb_score.onlinePlayer.draw;
  ttt_player[0].loss = fb_score.onlinePlayer.loss;

  ttt_player[1].win = fb_score.localPlayer.wins;
  ttt_player[1].draw = fb_score.localPlayer.draw;
  ttt_player[1].loss = fb_score.localPlayer.loss;

  document.getElementById("win0").innerHTML = "Wins: " + ttt_player[0].win;
  document.getElementById("loss0").innerHTML = "Loss: " + ttt_player[0].loss;
  document.getElementById("draw0").innerHTML = "Draw: " + ttt_player[0].draw;

  document.getElementById("win1").innerHTML = "Wins: " + ttt_player[1].win;
  document.getElementById("loss1").innerHTML = "Loss: " + ttt_player[1].loss;
  document.getElementById("draw1").innerHTML = "Draw: " + ttt_player[1].draw;
}

/**************************************************************/
// fb_readOnUpdatePlayer2NameAndScore()
// Stores database record in an object then updates both player's name
// and both player's score
// Input: n/a
// Return: n/a
/**************************************************************/
function fb_updatePlayer2NameAndScore(_readStatus, _data) {
  fb_activeLobby.player1.name = _data.player1.name;
  fb_activeLobby.player2.name = _data.player2.name;
  document.getElementById("p1Name").innerHTML = fb_activeLobby.player1.name;
  document.getElementById("p2Name").innerHTML = fb_activeLobby.player2.name;
  ttt_player[0].userName = fb_activeLobby.player1.name;
  ttt_player[1].userName = fb_activeLobby.player2.name;

  fb_score.onlinePlayer.wins = _data.player2.wins;
  fb_score.onlinePlayer.loss = _data.player2.loss;
  fb_score.onlinePlayer.draw = _data.player2.draw;
  

  ttt_player[1].win = fb_score.onlinePlayer.wins;
  ttt_player[1].draw = fb_score.onlinePlayer.draw;
  ttt_player[1].loss = fb_score.onlinePlayer.loss;

  ttt_player[0].win = fb_score.localPlayer.wins;
  ttt_player[0].draw = fb_score.localPlayer.draw;
  ttt_player[0].loss = fb_score.localPlayer.loss;

  document.getElementById("win0").innerHTML = "Wins: " + ttt_player[0].win;
  document.getElementById("loss0").innerHTML = "Loss: " + ttt_player[0].loss;
  document.getElementById("draw0").innerHTML = "Draw: " + ttt_player[0].draw;

  document.getElementById("win1").innerHTML = "Wins: " + ttt_player[1].win;
  document.getElementById("loss1").innerHTML = "Loss: " + ttt_player[1].loss;
  document.getElementById("draw1").innerHTML = "Draw: " + ttt_player[1].draw;
}

/**************************************************************/
// fb_endGame()
// writes e to firebase and change the page to the lobby page
/**************************************************************/
function fb_endGame() {
  ui_pageSwap('s_gameP', 's_lobbyP');

  if (ttt_playerTurn == 0) {
    fb_writeRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid + "/player1/move", 'e');
    //fb_deleteRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid);
  }
  if (ttt_playerTurn == 1) {
    fb_writeRec(ACTIVE_LOBBY, playerDetails.uid + "/player2/move", 'e');
    //fb_deleteRec(ACTIVE_LOBBY, playerDetails.uid);
  }
}
/**************************************************************/
// END OF MODULE
/**************************************************************/