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
    move: "",
    uid: ""
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

// two player back and forth info
var fb_playerTurn = {

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
    minute = "0" + minute
  }
  fb_pendingLobby.timeStamp = day + "/" + month + "/" + year + " " + hour + ":" + minute;
  console.log(fb_pendingLobby.timeStamp)

  fb_writeRec(PENDING_LOBBY, fb_pendingLobby.gameName, fb_pendingLobby);
  ui_pageSwap("s_lobbyP", "s_activeP");
  fb_readOnRec(PENDING_LOBBY, fb_pendingLobby.gameName + '/' + "pendingStatus", fb_readOnPendingStatus)
}

/**************************************************************/
// fb_initActiveGame()
// Initilises the TTT active game 
// Input:
// Return:  
/**************************************************************/
function fb_initActiveGame(_key) {
  fb_activeLobby.player2.loss = fb_score.localPlayer.loss
  fb_activeLobby.player2.draw = fb_score.localPlayer.draw
  fb_activeLobby.player2.wins = fb_score.localPlayer.wins

  fb_overWriteRec(PENDING_LOBBY, _key, "pendingStatus", true);
  fb_overWriteRec(PENDING_LOBBY, _key, "uid", playerDetails.uid);
  fb_activeLobby.player2.name = playerDetails.name
  console.log(fb_activeLobby)
  fb_writeRec(ACTIVE_LOBBY, playerDetails.uid, fb_activeLobby);
  fb_readOnRec(ACTIVE_LOBBY, playerDetails.uid + "/" + "player1" + "/" + "move", fb_readOnPlayer1Move);
  ui_pageSwap("s_pendingP", "s_gameP");
  ttt_playerTurn = 1
  ttt_lockUnclickedBTN()
  //this is player 2 so disable all the buttons so they they can't make a move
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
    fb_readRec(PENDING_LOBBY, fb_pendingLobby.gameName, false, fb_processP2UID)
    fb_activeLobby.player1.loss = fb_score.localPlayer.loss
    fb_activeLobby.player1.draw = fb_score.localPlayer.draw
    fb_activeLobby.player1.wins = fb_score.localPlayer.wins
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
  console.log("readon player 1 data= " + _data)
  console.log("this is player2")
  var flag = false

  var funcArray = [winFuncP2, loseFuncP2, drawFuncP2]
  var inputArray = ['w','l','d']

  if (_data == ''){flag = true}
  for (var i = 0; i <= inputArray.length; i++){
    if(flag == false){
      if(_data == inputArray[i]){
        console.log("player 2 fb_readOnPlayer1Move loop")
        flag = true
        funcArray[i]()
      }
    }
  }

  //if the game hasn't ended
  if (flag == false) {
  //update the grid with player1's move
  //unlocks all the pieces of the grid that has no symbols on it
  console.log("player 1 has made the move: " + _data)
  ttt_btnHit(_data)
  ttt_unlockUnclickedBTN()
  }
}

/**************************************************************/
// Player 2 win, draw and loss functions
// this is player 2
/**************************************************************/
function winFuncP2() {
  // update score locally
  // update score on firebase
  // clear grid
  alert("player 1 has won")
  ttt_addWin(ttt_playerTurn)
  ttt_addLoss(ttt_playerTurn - 1)
  ttt_resetGame()
}

function loseFuncP2() {
  // update score locally
  // update score on firebase
  // clear grid
  alert("player 1 has lost")
  ttt_addLoss(ttt_playerTurn)
  ttt_addWin(ttt_playerTurn - 1)
  ttt_resetGame()
}

function drawFuncP2() {
  // update score locally
  // update score on firebase
  // clear grid
  alert("player 1 has draw")
  ttt_addDraw()
  ttt_resetGame()
}

/**************************************************************/
// fb_readOnPlayer2Move(_readStatus, _data)
// called by fb_readOnRec, processed the move by player 2
// this is player 1
/**************************************************************/
function fb_readOnPlayer2Move(_readStatus, _data) {
  console.log("readon player 2 data= " + _data);
  console.log("this is player 1")
  var flag = false

  var funcArray = [winFuncP1, loseFuncP1, drawFuncP1]
  var inputArray = ['w','l','d']

  if (_data == ''){flag = true}
  for (var i = 0; i <= inputArray.length; i++){
    if(flag == false){
      if(_data == inputArray[i]){
        console.log("player 1 fb_readOnPlayer2Move loop")
        flag = true
        funcArray[i]
      }
    }
  }

  //if the game hasn't ended
  if (flag == false) {
    //update the grid with player2's move
    //unlocks all the pieces of the grid that has no symbols on it
    console.log("player 2 has made the move: " + _data)
    ttt_btnHit(_data)
    ttt_unlockUnclickedBTN()
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
  alert("player 2 has win")
  ttt_addWin(ttt_playerTurn)
  ttt_addLoss(ttt_playerTurn + 1)
  ttt_resetGame()
}

function loseFuncP1() {
  // update score locally
  // update score on firebase
  // clear grid
  alert("player 2 has lose")
  ttt_addLoss(ttt_playerTurn)
  ttt_addWin(ttt_playerTurn + 1)
  ttt_resetGame()
}

function drawFuncP1() {
  // update score locally
  // update score on firebase
  // clear grid
  alert("player 2 has draw")
  ttt_addDraw()
  ttt_resetGame()
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
    fb_writeRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid + "/" + "player1", fb_activeLobby.player1)
    fb_readOnRec(ACTIVE_LOBBY, fb_activeLobby.player2.uid + "/" + "player2" + "/" + "move", fb_readOnPlayer2Move)
    ttt_playerTurn = 0
    console.log(fb_pendingLobby.gameName)
    fb_deleteRec(PENDING_LOBBY, fb_pendingLobby.gameName);
  }

/**************************************************************/
// END OF MODULE
/**************************************************************/
