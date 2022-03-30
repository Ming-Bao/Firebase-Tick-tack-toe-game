/**************************************************************/
// Variables
/**************************************************************/
// RegEx
const APLHA_EXP = /^[a-zA-Z ]+$/
const NUM_EXP = /^[0-9]+$/;
const ALPHA_NUM_EXP = /^[0-9a-zA-Z ]+$/

/**************************************************************/
// fb_regBTN
// stores the user's input into playerDetails and validates it
// if they're all good then write the user input to firebase
/**************************************************************/
function reg_BTN() {
  var error;
  var flag = true;

  //  Save user's details from the form into my details object
  //  ENSURE THE OBJECT NAME THE PROGRAM SAVES TO IS CORRECT; 
  //  its currently details
  playerDetails.age = Number(reg_getFormItemValue("f_reg", 0));
  error = reg_validate(playerDetails.age, NUM_EXP, 16, 100);
  if (error != "") {
    flag = false;
    alert("age error");
  }

  playerDetails.gender = reg_getFormItemValue("f_reg", 1);
  error = reg_validate(playerDetails.gender, APLHA_EXP);
  if (error != "") {
    flag = false;
    alert("gender error");
  }

  playerDetails.phone = Number(reg_getFormItemValue("f_reg", 2));
  error = reg_validate(playerDetails.phone, NUM_EXP, 100000000, 999999999);
  if (error != "") {
    flag = false;
    alert("phone error");
  }

  playerDetails.creditCard = Number(reg_getFormItemValue("f_reg", 3));
  error = reg_validate(playerDetails.creditCard, NUM_EXP, 100000000000000, 999999999999999);
  if (error != "") {
    flag = false;
    alert("card error");
  }

  playerDetails.address = reg_getFormItemValue("f_reg", 4);
  error = reg_validate(playerDetails.address, ALPHA_NUM_EXP);
  if (error != "") {
    flag = false;
    alert("address error");
  }

  playerDetails.suburb = reg_getFormItemValue("f_reg", 5);
  error = reg_validate(playerDetails.suburb, APLHA_EXP);
  if (error != "") {
    flag = false;
    alert("suburb error");
  }

  playerDetails.city = reg_getFormItemValue("f_reg", 6);
  error = reg_validate(playerDetails.city, APLHA_EXP);
  if (error != "") {
    flag = false;
    alert("city error");
  }

  playerDetails.postalCode = Number(reg_getFormItemValue("f_reg", 7));
  error = reg_validate(playerDetails.postalCode, NUM_EXP, 1000, 9999);
  if (error != "") {
    flag = false;
    alert("postalCode error");
  }

  console.table(playerDetails);

  // if input are good then
  if (flag == true){
  fb_writeRec(PLAYER_DETAILS, playerDetails.uid, playerDetails);
  //fb_readRec(ADMIN, playerDetails.uid, false, fb_processAdmin);
  ui_gamePageReaveal();
  }
}

/**************************************************************/
// reg_getFormItemValue(_elementId, _item)
// Called by reg_regDetailsEntered
// Returns the value of the form's item
// Input:  element id & form item number
// Return: form item's value
/**************************************************************/
function reg_getFormItemValue(_elementId, _item) {
  return document.getElementById(_elementId).elements.item(_item).value;
}

/**************************************************************/
// reg_validate()
// validates user inputs
/**************************************************************/
function reg_validate(_input, _regEX, _minNum, _maxNum) {
  var errMsg = "";

  errMsg = _regEX.test(_input);
  if (errMsg && errMsg != "") {
    // valid input 
    errMsg = "";
    if (_regEX == NUM_EXP) {
      if (_input > _maxNum || _input < _minNum) {
        errMsg = "error";
      }
    }
  } else {
    errMsg = "error";
  }
  return errMsg
}

/***************************************************************/
//    END OF PROG
/***************************************************************/