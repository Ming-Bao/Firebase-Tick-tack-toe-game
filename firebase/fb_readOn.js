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
// called by fb_readOnRec initiacites a readon on the player1
// moves path in firebase
// Input:
// Return:  
/**************************************************************/
function fb_readOnPlayer1Move(_readStatus, _data) {
  console.log("readon player 1 data= " + _data)
}

/**************************************************************/
// fb_readOnPlayer1Move(_readStatus, _data)
// called by fb_readOnRec initiacites a readon on the player1
// moves path in firebase
// Input:
// Return:  
/**************************************************************/
function fb_readOnPlayer2Move(_readStatus, _data) {
  console.log("readon player 2 data= " + _data)
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
    console.log(fb_pendingLobby.gameName)
    fb_deleteRec(PENDING_LOBBY, fb_pendingLobby.gameName);
  }

/**************************************************************/
// END OF MODULE
/**************************************************************/
