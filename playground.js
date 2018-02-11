//создаем конструктор объекта Arena
Arena = function(width, heigth, options) {
    var self = this;
    this.width = width;
    this.heigth = heigth;
    this.createMatrix = function(){
        var matx = [];
        var h = this.heigth;
        while (h--) {
            matx.push(new Array(this.width).fill(0));
        }
        return matx;
    };
    //создаем матрицу размеров, которые были переданы при инициализации объектра
    this.matx = this.createMatrix();
    //функция сокращения ряда блоков
    //если ряд блоков сократился, то возвращаем true и добавляем новый пустой ряд
    //ряд сокращается только если полностью заполнен блоками.
    //если включени режим цветного тетриса, то для сокращение ряда
    //требуется еще чтобы все блоки ряда были одного цвета
    this.sweep = function() {
        for (var y = self.matx.length - 1; y > 0; --y) {
            var colourLine = new Set();
            for (let x = 0; x < self.matx[y].length; ++x) {
                colourLine.add(self.matx[y][x]);
            }
            if ((! colourLine.has(0) && colourLine.size == 1 && options.colourOnly) 
               || (! colourLine.has(0) && ! options.colourOnly)  ){
                var row = self.matx.splice(y, 1)[0].fill(0);
                self.matx.unshift(row);
                ++y;
                return true;
            }
        }
        return false;
    }

}

//var Playground = new Arena(10,20);
