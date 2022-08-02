/**************************************************************/
// Swaps Page
/**************************************************************/
function ui_pageSwap(_hide, _show) {
  console.log("hide: " + _hide + "show: " + _show);
  document.getElementById(_hide).style.display="none";
  document.getElementById(_show).style.display="block";
}

/**************************************************************/
// change the scene from the any page to the game page
/**************************************************************/
function ui_gamePageReaveal () {
  console.log("game page reveal")
  document.getElementById("s_gameP").style.display="block";
  document.getElementById("s_startP").style.display="none";
  document.getElementById("s_regP").style.display="none";
}

/**************************************************************/
// ui_removeRow()
// removes all the rows in the table
// Input: n/a
// Return: n/a
/**************************************************************/
function ui_removeRow() {
  var tableHeaderRowCount = 1;
  var table = document.getElementById('t_gameLobby');
  var rowCount = table.rows.length;
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
    table.deleteRow(tableHeaderRowCount); 
  }
}

/**************************************************************/
// END OF MODULE
/**************************************************************/