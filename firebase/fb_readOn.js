
// pending lobby info
var fb_pendingLobby = {
  city: '',
  phone: ''
}

// active lobby info
var fb_activeLobby = {

}

// two player back and forth info
var fb_playerTurn = {

}

/**************************************************************/
// fb_createPendingLobby()
// Call the functions and create the pending game lobby
// Input:
// Return:  
/**************************************************************/
function fb_createPendingLobby() {
  fb_readAll(PLAYER_DETAILS, processPendingLobby);
  ui_pageSwap("s_lobbyP", "s_pendingP");
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