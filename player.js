//создаем конструктор объекта Player
var Player = function(threeColours,options,colours) {
    var self = this;
    this.pos = {x:0, y:0};
    this.score = 0;
    //создаем новую фигуру
    //фигура создается рандомно
    //за фигурой закреплен 1 из 8 цветов
    //если options.colourOnly == true, то цвет
    //выбирается рандом из списка 3х цветов(которые
    //создаются в Game и передаются в конструктор)
    this.createPiece = function() {
        var pieces = ['line','foursquare','T','underT','L','Z','S','J'];
        var name = pieces[Math.floor(Math.random()*pieces.length)];
        var piece = {};
        piece.colour = threeColours[Math.floor(Math.random()*threeColours.length)];
        piece.type = name;
        if (name === 'line') {
            if (!options.colourOnly) {
                piece.colour = colours[3];
            }
            piece.matrix = [[0, piece.colour, 0, 0],
                        [0, piece.colour, 0, 0],
                        [0, piece.colour, 0, 0],
                        [0, piece.colour, 0, 0],];        
        } else if (name === 'L') {
            if (!options.colourOnly) {
                piece.colour = colours[4];
            }
            piece.matrix = [[0, piece.colour, 0],
                            [0, piece.colour, 0],
                            [0, piece.colour, piece.colour]];  
        } else if (name === 'J') {
            if (!options.colourOnly) {
                piece.colour = colours[5];
            }
            piece.matrix = [[0, piece.colour, 0],
                            [0, piece.colour, 0],
                            [piece.colour, piece.colour, 0]];
        } else if (name === 'foursquare') {
            if (!options.colourOnly) {
                piece.colour = colours[6];
            }
            piece.matrix = [[piece.colour, piece.colour],
                            [piece.colour, piece.colour]];
        } else if (name === 'Z') {
            if (!options.colourOnly) {
                piece.colour = colours[2];
            }
            piece.matrix = [[piece.colour, piece.colour,0],
                            [0,piece.colour, piece.colour]];
        } else if (name === 'S') {
            if (!options.colourOnly) {
                piece.colour = colours[1];
            }
            piece.matrix = [[0,piece.colour, piece.colour],
                            [piece.colour, piece.colour,0]];
        } else if (name === 'T') {
            if (!options.colourOnly) {
                piece.colour = colours[0];
            }
            piece.matrix = [[0,piece.colour, 0],
                            [piece.colour, piece.colour,piece.colour]];
        } else if (name === 'underT') {
            if (!options.colourOnly) {
                piece.colour = colours[7];
            }
            piece.matrix = [[piece.colour, piece.colour,piece.colour],
                            [0,piece.colour, 0]];
        }
        return piece;
    };
    this.piece = this.createPiece();
    this.matx = this.piece.matrix;
    this.colour = this.piece.colour;
    //функция смена цвета по клику
    //невозможно использование, когда очков меньше 5
    this.colourChanger = function() {
        if (this.score >= 5) {
            var oldColour = this.colour;
            var coloursSet = colours;
            if (threeColours) {
                coloursSet = threeColours;
            }    
            while (oldColour == this.colour){
                this.colour = coloursSet[Math.floor(Math.random()*coloursSet.length)]
            }
            this.matx.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        this.matx[y][x] = this.colour;
                    }
                });
            });
            this.score -= 5;
        }
    };
}
