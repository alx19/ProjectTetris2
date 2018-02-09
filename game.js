var Game = function(canvasId,scoreboardId,options,currentScore) {
    var self = this;
    self.arena = new Arena(10,20,options);
    self.canvas = document.getElementById(canvasId);
    self.ctx = self.canvas.getContext('2d');
    self.ctx.scale(40,40);
    self.colours = ['#3877FF','#FFE138','#FF8E0D',"#FF0D72",'#0DC2FF','#0DFF72','#F538FF','#FF0000'];
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
    self.player = new Player(self.threeColours,options,self.colours);
    self.sessionRecords = [];
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
        if (self.isMoveLegal(self.arena, self.player)) {
            self.arena.matx.forEach(row => row.fill(0));
            if (self.player.score != 0) {
                self.sessionRecords.push(self.player.score);
            }
            self.player.score = 0;
            self.player.pos.y = 0;
            self.player.pos.x = 0;
            newPiece();
            //document.location.reload();
        }
    };
    self.merge = function(arena, player) {
        self.player.matx.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    self.arena.matx[y + self.player.pos.y][x + self.player.pos.x] = value;
                }
            });
        });
    };
    self.isMoveLegal = function(arena, player) {
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
    self.move = function(arena, offset) {
        self.player.pos.x += offset;
        if (self.isMoveLegal(arena, self)) {
            self.player.pos.x -= offset;
        }
    }
    self.updateScore = function(currentScore) {
        document.getElementById(currentScore).innerText = "Текущий счет - " + self.player.score;
    };
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
    self.drop = function() {
        self.player.pos.y++;
        if (self.isMoveLegal(self.arena, self.player)) {
            self.player.pos.y--;
            self.merge(self.arena, self.player);
            self.reset();
            if (self.arena.sweep()) {
                self.player.score += 10;
            }
        }
        self.dropCount = 0;  
    };
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
        //self.updateScore(currentScore);
        requestAnimationFrame(self.update);
    };
}