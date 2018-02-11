//главый файл. здесь мы создаем экземпляры объекта Game

//выбираем опции для тетрисов
//colourOnly - режим игры с 3 цветами. блоки сокращаются только когда ряд одного цвета
//altControl - альтернативное управление(wasd)
//djenMode - после падения блок присутствует, но не окрашивается, хардкорный режим
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
//создаем два тетриса
var game1 = new Game('myCanvas','leaderBoard', game1opt,'scoreTetris1');
var game2 = new Game('secondTetris','leaderBoard2', game2opt,'scoreTetris2')
//обновления анимаций и диспетчера событий
requestAnimationFrame(game1.update);
document.addEventListener('keydown',game1.keyListen,false);
document.addEventListener('click',game1.player.colourChanger, false);
requestAnimationFrame(game2.update);
document.addEventListener('keydown',game2.keyListen,false);
document.addEventListener('click',game2.player.colourChanger, false);
