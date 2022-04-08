
// pending lobby info
var fb_pending = {

}

// active lobby info
var fb_active = {

}

// two player back and forth info
var fb_playerTurn = {

}

/**************************************************************/
// fb_readOnRec(_path, _key, _data, _function)
// Commit a readon on a DB record 
// Input:  
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