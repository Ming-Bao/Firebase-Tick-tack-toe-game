// pending lobby info
var fb_pendingLobby = {

}

// active lobby info
var fb_activeLobby = {
  gameName: '',
  timeStamp: '',
  pendingStatus: false
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
  fb_activeLobby.gameName = prompt("what is your game name?");

  const time = new Date();
  var minute = time.getUTCMinutes();
  var hour = time.getUTCHours();
  var day = time.getUTCDate();
  var month = time.getUTCMonth() + 1;
  var year = time.getUTCFullYear();
  fb_activeLobby.timeStamp = day + "/" + month + "/" + year + " " + hour + ":" + minute;
  console.log(fb_activeLobby.timeStamp)

  fb_writeRec(PENDING_LOBBY, fb_activeLobby.gameName, fb_activeLobby);
  ui_pageSwap("s_lobbyP", "s_activeP");
  // fb_readOnRec(PENDING_LOBBY, fb_activeLobby.gameName, PENDING_STATUS)
}

/**************************************************************/
// fb_initActiveGame()
// Initilises the TTT active game 
// Input:
// Return:  
/**************************************************************/
function fb_initActiveGame() {
  alert("this button is currently useless");
}

/**************************************************************/
// fb_readOnRec(_path, _key, _data, _function)
// Initilise a readon on a firebase record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
function fb_readOnRec(_path, _key, _data, _processFunc) {
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
// END OF MODULE
/**************************************************************/