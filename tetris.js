var game1opt = {
    colourOnly: false,
    altControl: false,
    djenMode: false,
}
var game2opt = {
    colourOnly: true,
    altControl: true,
    djenMode: false,
}
var game1 = new Game('myCanvas','leaderBoard', game1opt,'scoreTetris1');
var game2 = new Game('secondTetris','leaderBoard2', game2opt,'scoreTetris2')
requestAnimationFrame(game1.update);
document.addEventListener('keydown',game1.keyListen,false);
document.addEventListener('click',game1.player.colourChanger, false);
requestAnimationFrame(game2.update);
document.addEventListener('keydown',game2.keyListen,false);
document.addEventListener('click',game2.player.colourChanger, false);