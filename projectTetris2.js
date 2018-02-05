//подцепляем канвас и увеличиваем размер фигур в 40 раз
var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d');
ctx.scale(40,40);

//создаем поле
var arena = createMatrix(10, 20);

//функция для создания фигур. содержит в себе форму фигуры
//в виде двумерного массива и цвет фигуры
function createPiece(name)
{
    var pieces = ['line','foursquare','T','L','Z','S','J'];
    var name = pieces[Math.floor(Math.random()*pieces.length)];
    var piece = {};
    if (name === 'line') {
        piece = {
            matrix:[[0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],],
            colour:"#FF0D72"
        }
    } else if (name === 'L') {
        piece = {
            matrix:[[0, 2, 0],
                    [0, 2, 0],
                    [0, 2, 2],],
            colour:'#0DC2FF',
        }
    } else if (name === 'J') {
        piece = {
            matrix:[[0, 3, 0],
                    [0, 3, 0],
                    [3, 3, 0],],
            colour:'#0DFF72',
        }
    } else if (name === 'foursquare') {
        piece = {
            matrix:[[4, 4],
                    [4, 4]],
            colour:'#F538FF',
        }
    } else if (name === 'Z') {
        piece = {
            matrix:[[5, 5, 0],
                    [0, 5, 5],
                    [0, 0, 0]],
            colour:'#FF8E0D',
        }
    } else if (name === 'S') {
        piece = {
            matrix:[[0, 6, 6],
                    [6, 6, 0],
                    [0, 0, 0],],
            colour:'#FFE138',
        }
    } else if (name === 'T') {
        piece = {
            matrix:[[0, 7, 0],
                    [7, 7, 7],
                    [0, 0, 0],],
            colour:'#3877FF',
        }
    }
    return piece;
}

//функция создания игрового поля
function createMatrix(w, h) {
    var matx = [];
    while (h--) {
        matx.push(new Array(w).fill(0));
    }
    return matx;
}

//счетчик и интервал, превышая который счетчик обнулится, а фигура упадет на шаг вниз
var dropCount = 0;
var interval = 800;
var prevTime = 0;

//функция обновления игрового поля
function update(time = 0) {
    var delta = time - prevTime;
    prevTime = time;
    dropCount += delta;
    if (dropCount > interval) {
        drop();
    }
    draw();
    requestAnimationFrame(update);
}

//прорисовка фигур по их массивам и сдвигу
function drawFigure(piece, offset,colour){
    piece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = colour;
                ctx.fillRect(x + offset.x,y + offset.y,1,1);
            }
        });
    });
}

//проверка на движение стрелочками
function playerMove(offset) {
    player.pos.x += offset;
    if (isMoveLegal(arena, player)) {
        player.pos.x -= offset;
    }
}

//проверяем, есть ли полностью заполненный ряд
//если есть, то удаляем его
function arenaSweep() {
    var rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        var row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

//прорисовка фигур и поля
function draw() {
    //очищаем поле
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var purple = '#800080'
    //рисуем заново
    drawFigure(arena, {x: 0, y: 0}, purple);
    drawFigure(player.matx, player.pos, player.colour);
}

//игрок - его текущая позиция его фигуры
//сама фигура и ее цвет
var player = {
    pos: {x:0, y:0},
    matx: createPiece().matrix,
    colour: createPiece().colour,
}

//добавляем текущую фигуру к блоку
function merge(arena, player) {
    player.matx.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

//функция сброса
//возвращает игрока в начало
//выбирает новую фигуру и цвет
function playerReset() {
    var pieces = ['line','foursquare','T','L','Z','S','J'];
    var item = pieces[Math.floor(Math.random()*pieces.length)];   
    player.matx = createPiece(item).matrix;
    player.colour = createPiece(item).colour;
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matx[0].length / 2 | 0);
    //если мы не можем поместить новую фигуру на поле
    //то игра заканчивается с сообщением "GAME OVER"
    if (isMoveLegal(arena, player)) {
        arena.forEach(row => row.fill(0));
        alert("GAME OVER");
        document.location.reload();
    }
}

//проверяем допустимо ли данное движение
//проверяем по уже уложенным блокам
//и по стенкам тетриса
function isMoveLegal(arena, player) {
    var m = player.matx;
    var o = player.pos;
    for (var y = 0; y < m.length; ++y) {
        for (var x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}



//считываем кнопки
function keyDownHandler(e) {
    // сдвиг по стрелкам вправо, влево и вниз
    if(e.keyCode == 39) {
        playerMove(1);
    }
    else if(e.keyCode == 37) {
        playerMove(-1);
    }
    else if(e.keyCode == 40) {
        drop();
    }
}

//когда фигура достигла дна - добавляем ее к основанию
//выбираем новую фигуру
//проверяем на наличие полностью заполненного ряда
//сбрасываем таймер падения фигуры
function drop() {
    player.pos.y++;
    if (isMoveLegal(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
    }
    dropCount = 0;
}


update();
document.addEventListener('keydown',keyDownHandler,false)
