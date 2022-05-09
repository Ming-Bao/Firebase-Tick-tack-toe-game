/**************************************************************/
// create variables
/**************************************************************/
// firebase paths
const PLAYER_DETAILS = "playerDetails";
const ADMIN = "admin";
const PLACE_HOLDER = "PlaceHolder";
const PENDING_LOBBY = "pendingLobby";
const ACTIVE_LOBBY = "activeLobby";
const PENDING_STATUS = "pendingStatus"

// world variables
var loginStatus = ' ';
var readStatus = ' ';
var writeStatus = ' ';

// player details
var playerDetails = {
  uid: '',
  email: '',
  name: '',
  photoURL: '',
  age: '',
  gender: '',
  phone: '',
  creditCard: '',
  address: '',
  suburb: '',
  city: '',
  postalCode: ''
};

/**************************************************************/
// Initialise Firebase as soon as the program starts
/**************************************************************/
fb_initialise()

/**************************************************************/
// fb_initialise()
// Called by setup
// Initialize firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_initialise() {
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPn9ocZnN7shxOODbVvWIGFPLdwMbGp30",
  authDomain: "comp-2022-ming-bao.firebaseapp.com",
  databaseURL: "https://comp-2022-ming-bao-default-rtdb.firebaseio.com",
  projectId: "comp-2022-ming-bao",
  storageBucket: "comp-2022-ming-bao.appspot.com",
  messagingSenderId: "410692960677",
  appId: "1:410692960677:web:33ebf861c2675ee45fe84c",
  measurementId: "G-270XSW91WG"
};

// Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

/**************************************************************/
// fb_login(_dataRec)
// Login to Firebase
// Input:  to store user info in
// Return: n/a
/**************************************************************/
function fb_login(_dataRec) {
  console.log('fb_login: dataRec= ' + _dataRec);
  firebase.auth().onAuthStateChanged(newLogin);
  document.getElementById("s_loginStatus").innerHTML = "logging in"
  
  function newLogin(user) {
    if (user) {
      // user is signed in
      _dataRec.uid = user.uid;
      _dataRec.email = user.email;
      _dataRec.name = user.displayName;
      _dataRec.photoURL = user.photoURL;
      loginStatus = 'logged in';
      playerDetails.name
      console.log("loginStatus= " + loginStatus);

      // check if this user has logged in before if yes then 
      // go to game page if nogo to the regestration page
      fb_readRec(PLAYER_DETAILS, playerDetails.uid, false, fb_processLogin);
    }
    else {
      // user NOT logged in, so redirect to Google login
      _dataRec = {};
      loginStatus = 'logged out';
      console.log('fb_login: status = ' + loginStatus);

      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  }
}

/**************************************************************/
// fb_logout()
// Logout of Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_logout() {
  console.log('fb_logout: ');
  firebase.auth().signOut();
}

/**************************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/**************************************************************/
function fb_writeRec(_path, _key, _data) {
  console.log('fb_WriteRec: path= ' + _path + '  key= ' + _key + 'data= ' + _data.name + '/' + _data.score);

  writeStatus = "waiting";
  firebase.database().ref(_path + '/' + _key).set(_data,
    function (error) {
      if (error) {
        writeStatus = "failure";
        console.log(error);
      } else {
        writeStatus = "OK";
      }
    });
  console.log("fb_writeRec: exit");
}

/**************************************************************/
// fb_writeRec(_path, _key, _key2, _data)
// Over writes a specific record & key to the DB
// Input:  path to write to, the key, the second key, data to write
// Return: 
/**************************************************************/
function fb_overWriteRec(_path, _key, _key2, _data) {
  console.log('fb_overWriteRec: path= ' + _path + '  key= ' + _key + 'key2= ' + _key2 + 'data= ' + _data.name + '/' + _data.score);

  writeStatus = "waiting";
  firebase.database().ref(_path + '/' + _key + '/' + _key2).set(_data,
    function (error) {
      if (error) {
        writeStatus = "failure";
        console.log(error);
      } else {
        writeStatus = "OK";
      }
    });
  console.log("fb_overWriteRec: exit");
}

/**************************************************************/
// fb_readAll(_path, _data)
// Read all DB records for the path
// Input:  path to read from and Function name that processs the data
// Return:
/**************************************************************/
function fb_readAll(_path, _processData) {
  console.log('fb_readAll: path= ' + _path);

  readStatus = "waiting";
  firebase.database().ref(_path).once("value", gotRecord, readErr);

  function gotRecord(snapshot) {
    if (snapshot.val() == null) {
      readStatus = "no record";
    } else {
      readStatus = "OK";
      _processData("OK", snapshot)
    }
  }

  function readErr(error) {
    readStatus = "fail";
    console.log(error);
  }
}

/**************************************************************/
// fb_readRec(_path, _key, _data, _function)
// Read a DB record 
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
function fb_readRec(_path, _key, _data, _processFunc) {
  console.log('fb_readRec: path= ' + _path + '  key= ' + _key);

  readStatus = "waiting";
  firebase.database().ref(_path + '/' + _key).once("value", gotRecord, readErr);

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
// fb_processPlayerDetails()
// Stores database record in a function
// Input: n/a
// Return: n/a
/**************************************************************/
function fb_processPlayerDetails(_status, _data) {
  _data.uid = dbData.uid;
  _data.name = dbData.name;
  _data.email = dbData.email;
  _data.photoURL = dbData.photoURL;
}

/**************************************************************/
// processPendingLobby()
// Stores database record
// Input: n/a
// Return: n/a
/**************************************************************/
function processPendingLobby(_status, _dbData) {
  ui_removeRow()
  
  _dbData.forEach(
    function(_currentRec) {
      var gameName = _currentRec.val().gameName
      var timeStamp = _currentRec.val().timeStamp
      fb_addToTable(gameName, timeStamp);
    }
  )
}

/**************************************************************/
// fb_addToTable()
// Stores database record
// Input: n/a
// Return: n/a
/**************************************************************/
function fb_addToTable(_gameName, _timeStamp) {
  var table = document.getElementById("t_gameLobby");
  var row = table.insertRow(-1)

  var cell1 = row.insertCell(0)
  var cell2 = row.insertCell(1)
  var cell3 = row.insertCell(2)

  cell1.innerHTML = _gameName
  cell2.innerHTML = _timeStamp
  
  var btn = document.createElement('input');
  btn.type = "button";
  btn.className = "BTNinitActiveGame";
  btn.value = "Join Game";
  btn.onclick = () => { fb_initActiveGame(_gameName);}
  cell3.appendChild(btn);
}

/**************************************************************/
// fb_processHighScore()
// Read a specific DB record used with fb_readRec
// Input: n/a
// Return: n/a
/**************************************************************/
function fb_processHighScore(_status, _data) {
  score.highScore = _data.highScore;
  ui_updateHTML ("GP_highScore", "High Score: " + score.highScore);
}

/**************************************************************/
// fb_processLogin()
// Process the user's login
// Input: n/a
// Return: n/a
/**************************************************************/
function fb_processLogin(_result) {
  console.log("result = " + _result)
  if (_result == "OK") {
    ui_pageSwap("s_startP", "s_lobbyP");
    fb_readRec(ADMIN, playerDetails.uid, false, fb_processAdmin);
  }
  else {
    ui_pageSwap('s_startP', 's_regP');
    document.getElementById("p_regName").innerHTML  = playerDetails.name
    document.getElementById("p_regEmail").innerHTML = playerDetails.email
  }
}

/**************************************************************/
// fb_processAdmin()
// Process if the user is a admin or not
// Input: n/a
// Return: n/a
/**************************************************************/
function fb_processAdmin (_status) {
  console.log("status = " + _status);
  if (_status == "OK") {
    document.getElementById("s_adminBTN").style.display="block";
  }
}
/**************************************************************/
// END OF MODULE
/**************************************************************/
