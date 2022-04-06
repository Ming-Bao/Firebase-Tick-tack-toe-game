/**************************************************************/
// Swaps Page
/**************************************************************/
function ui_pageSwap(_hide, _show) {
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
// END OF MODULE
/**************************************************************/
