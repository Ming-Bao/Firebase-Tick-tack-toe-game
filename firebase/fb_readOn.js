// pending lobby info
var fb_pendingLobby = {
  gameName: '',
  timeStamp: '',
  pendingStatus: false
}

// active lobby info
var fb_activeLobby = {
  player1:{
    wins: "",
    loss: "",
    draw: "",
    name: "",
    move: ""
  },
  player2:{
    wins: "",
    loss: "",
    draw: "",
    name: "",
    move: "",
    uid: ""
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
  fb_readOnRec(PENDING_LOBBY, fb_pendingLobby.gameName + '/' + "pendingStatus", fb_readOnActiveLobby)
}

/**************************************************************/
// fb_initActiveGame()
// Initilises the TTT active game 
// Input:
// Return:  
/**************************************************************/
function fb_initActiveGame(_key) {
  fb_overWriteRec(PENDING_LOBBY, _key, "pendingStatus", true);
  fb_overWriteRec(PENDING_LOBBY, _key, "uid", playerDetails.uid);
  fb_activeLobby.player2.name = playerDetails.name
  fb_writeRec(ACTIVE_LOBBY, playerDetails.uid, fb_activeLobby);
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
      if (snapshot.val() == null) {
        readStatus = "no record";
        _processFunc(readStatus);
      } else {
        readStatus = "OK";
        let dbData = snapshot.val();
        _processFunc(readStatus, dbData);
      }
    }
  
    function readErr(error) {
      readStatus = "fail";
      console.log(error);
    }
  }

/**************************************************************/
// fb_readOnActiveLobby(_readStatus, _data)
// called by fb_readOnRec
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
  function fb_readOnActiveLobby(_readStatus, _data) {
    if (_data == true) {
      fb_readRec(PENDING_LOBBY, fb_pendingLobby.gameName, false, fb_processP2UID)
    }
  }

/**************************************************************/
// fb_processP2UID(_readStatus, _data)
// called by fb_readOnRec
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
  function fb_processP2UID (_status, _data) {
    fb_activeLobby.player2.uid = _data.uid
  }

/**************************************************************/
// END OF MODULE
/**************************************************************/