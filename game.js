//создаем функцию-конструктор объекта Game
//передаваемые параметры - сanvasId нашего тетриса, id для доски рекордов
//опции тетриса и id, где будет храниться текущий счет игрока
var Game = function(canvasId,scoreboardId,options,currentScore) {
    //сохраняем созданный объект this в self
    var self = this;
    //вызываем конструктор объекта Арена
    //передаем ему параметры ширины и высоты, а также опции
    self.arena = new Arena(10,20,options);
    self.canvas = document.getElementById(canvasId);
    self.ctx = self.canvas.getContext('2d');
    self.ctx.scale(40,40);
    self.colours = ['#3877FF','#FFE138','#FF8E0D',"#FF0D72",'#0DC2FF','#0DFF72','#F538FF','#FF0000'];
    //функция для создания 3 цветов(для режима цветного тетриса)
    self.coloursGenerator = function() {
        var threeColours = [];
        var currentColour;
        while (threeColours.length < 3) {
            currentColour = self.colours[Math.floor(Math.random()*self.colours.length)];
            if (threeColours.indexOf(currentColour) == '-1') {
                threeColours.push(currentColour);
            }
        }
        return threeColours;
    };
    self.threeColours = self.coloursGenerator();
    //создаем нового игрока. передаем 3 цвета, опции тетриса, и все цвета
    self.player = new Player(self.threeColours,options,self.colours);
    self.sessionRecords = [];
    //сравниваем все рекорд и выводим их в порядке убывания
    //если рекродов нет, то выводим - 'Пока нет рекордов'
    self.topRecords = function() {
        function compareNumeric(a, b) {
            if (Number(a) < Number(b)) return 1;
            if (Number(a) > Number(b)) return -1;
          }
        var records = self.sessionRecords;
        records.sort(compareNumeric);
        var text = 'Очки: ' + self.player.score + '\n';
        records.forEach(function(rec,i) {
            text += i+1 + '. ' + rec + '\n'
        });
        console.log(records);
        if (records == false) {
            text += 'Пока нет рекордов';
        }
        document.getElementById(scoreboardId).innerText = text;
    };
    //прорисовка фигуры. передаем саму фигуру и ее координаты
    self.drawFigure = function(piece,offset) {
        piece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    self.ctx.fillStyle = value;
                    self.ctx.fillRect(x + offset.x,y + offset.y,1,1);
                }
            });
        });
    };
    //общая функция прорисовки
    //очищает поле, рисует накопленные блоки и фигуру игрока
    self.draw = function () {
        //очищаем поле
        self.ctx.fillStyle = '#000';
        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
        var floorColour;
        if (options.djenMode) {
            floorColour = '#000';
        }
        else {
            floorColour = '#800080';
        }
        
        //рисуем заново
        self.drawFigure(self.arena.matx, {x: 0, y: 0}, floorColour);
        self.drawFigure(self.player.matx, self.player.pos);

    };
    //функция сброса - создает новую фигуру, сбрасывает координаты
    //если на поле нельзя поместить фигуру,то сбрасываем счет, очищаем
    //поле, создаем новую фигуру
    self.reset = function() {
        function newPiece() {
            var choosenPiece = self.player.createPiece();
            self.player.matx = choosenPiece.matrix;
            self.player.colour = choosenPiece.colour;
        }
        newPiece();
        self.player.pos.y = 0;
        self.player.pos.x = 0;
        //если мы не можем поместить новую фигуру на поле
        if (self.isMoveNotLegal(self.arena, self.player)) {
            self.arena.matx.forEach(row => row.fill(0));
            if (self.player.score != 0) {
                self.sessionRecords.push(self.player.score);
            }
            self.player.score = 0;
            self.player.pos.y = 0;
            self.player.pos.x = 0;
            newPiece();
        }
    };
    //объединяем фигуру игрока с наколпенными блоками
    self.merge = function(arena, player) {
        self.player.matx.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    self.arena.matx[y + self.player.pos.y][x + self.player.pos.x] = value;
                }
            });
        });
    };
    //проверяем легальность сдвига фигуры
    //если фигура может двигаться, то вернет false
    //а если фигура накладывается на блоки, то вернет true
    self.isMoveNotLegal = function(arena, player) {
        var m = self.player.matx;
        var o = self.player.pos;
        for (var y = 0; y < m.length; ++y) {
            for (var x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                   (self.arena.matx[y + o.y] &&
                    self.arena.matx[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    };
    //двигаем фигуру, если ее перемещение легально
    self.move = function(arena, offset) {
        self.player.pos.x += offset;
        if (self.isMoveNotLegal(arena, self)) {
            self.player.pos.x -= offset;
        }
    }
    //функция для обновления текущего счета на странице
    self.updateScore = function(currentScore) {
        document.getElementById(currentScore).innerText = "Текущий счет - " + self.player.score;
    };
    //функция, которая отвечает за управление тетрисом с клавиатуры
    //управление зависит от options.altControl(true or false)
    self.keyListen = function(e) {
        if (options.altControl) {
            if(e.keyCode == 68) {
                self.move(self.arena,1);
            }
            else if(e.keyCode == 65) {
                self.move(self.arena,-1);
            }
            else if(e.keyCode == 83) {
                self.drop();
            }
            else if(e.keyCode == 87) {
                pass;
            }
        }
        else {
            // сдвиг по стрелкам вправо, влево и вниз
            if(e.keyCode == 39) {
                self.move(self.arena,1);
            }
            else if(e.keyCode == 37) {
                self.move(self.arena,-1);
            }
            else if(e.keyCode == 40) {
                self.drop();
            }
            else if(e.keyCode == 38) {
                self.drop();
            }
        }
    };
    self.dropCount = 0;
    self.prevTime = 0;
    //функция дропа фигуры
    //если после движения фигура накладывается на блок,
    //то вызываем функцию оюъединения и функцию сброса
    //если при это сократился ряд, то добавляем 10 очков
    self.drop = function() {
        self.player.pos.y++;
        if (self.isMoveNotLegal(self.arena, self.player)) {
            self.player.pos.y--;
            self.merge(self.arena, self.player);
            self.reset();
            if (self.arena.sweep()) {
                self.player.score += 10;
            }
        }
        self.dropCount = 0;  
    };
    //функция обновления
    self.update = function(time = 0) {
        //var interval = 800 - self.player.score;
        var interval = 800;
        if (interval < 50) {
            interval = 50;
        }
        var delta = time - self.prevTime;
        self.prevTime = time;
        self.dropCount += delta;
        if (self.dropCount > interval) {
             self.drop();
        }
        self.topRecords();
        self.draw();
        requestAnimationFrame(self.update);
    };
}
