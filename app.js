var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () { return _this.span.innerHTML = new Date().toUTCString(); }, 500);
    };
    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
}());
var ColorPikr = (function () {
    function ColorPikr(element) {
        this.DOMElement = element;
        this.DownloadButton = document.getElementById('download-button');
        this.Tiles = new Array();
        var width = "50%";
        var height = "25%";
        for (var i = 0; i < 8; i++) {
            var left = "0";
            var top = (Math.floor(i / 2) * 25) + '%';
            if (!isEven(i)) {
                left = '50%';
            }
            var tile = new ColorTile(i, top, left, width, height);
            this.Tiles.push(tile);
        }
    }
    ColorPikr.prototype.SelectTile = function (index) {
        this.DownloadButton.classList.remove('hide');
        this.Tiles[index].SelectTile();
        this.SelectedTile = this.Tiles[index];
        this.RenderCanvas(this.SelectedTile.Color);
        this.UpdateSaveAttributes();
    };
    ColorPikr.prototype.DeselectTile = function (index) {
        this.DownloadButton.classList.add('hide');
        this.Tiles[index].DeselectTile();
    };
    ColorPikr.prototype.HideDownload = function () {
        this.DownloadButton.classList.add('hide');
    };
    ColorPikr.prototype.ClearSelection = function () {
        this.DownloadButton.classList.add('hide');
        if (this.SelectedTile) {
            this.SelectedTile.DeselectTile();
        }
    };
    ColorPikr.prototype.Shuffle = function () {
        for (var i = 0; i < this.Tiles.length; i++) {
            var tile = this.Tiles[i];
            tile.SetRandomColor();
        }
    };
    ColorPikr.prototype.GoFullScreen = function () {
        document.body.requestFullscreen();
    };
    ColorPikr.prototype.UpdateSaveAttributes = function () {
        var dataURL = this.ColorCanvas.toDataURL();
        var button = document.getElementById('download-button');
        button.setAttribute('download', 'colorpikr-' + this.SelectedTile.Color + '.png');
        button.href = dataURL;
    };
    ColorPikr.prototype.SaveCanvas = function () {
        /*
        var dataURL = this.ColorCanvas.toDataURL();
        var button: HTMLAnchorElement = document.getElementById('download-button') as HTMLAnchorElement;
        button.setAttribute('download', 'colorpikr-' + this.SelectedTile.Color + '.png');
        button.href = dataURL;
        */
    };
    ColorPikr.prototype.Render = function () {
        // prepare the canvas:
        this.ColorCanvas = document.getElementById("save-canvas");
        this.ResizeCanvas();
        for (var i = 0; i < this.Tiles.length; i++) {
            var tile = this.Tiles[i];
            this.DOMElement.appendChild(tile.DOMElement);
        }
        launchFullscreen(document.documentElement);
    };
    ColorPikr.prototype.RenderCanvas = function (color) {
        var ctx = this.ColorCanvas.getContext("2d");
        console.log(color);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.ColorCanvas.width, this.ColorCanvas.height);
    };
    ColorPikr.prototype.ResizeCanvas = function () {
        this.ColorCanvas.width = window.innerWidth;
        this.ColorCanvas.height = window.innerHeight;
        /**
         * Your drawings need to be inside this function otherwise they will be reset when
         * you resize the browser window and the canvas goes will be cleared.
         */
    };
    return ColorPikr;
}());
var ColorTile = (function () {
    function ColorTile(index, top, left, width, height) {
        var _this = this;
        this.DOMElement = document.createElement('div');
        this.defaultClickHolder = function () { colorPikr.SelectTile(index); };
        this.SetRandomColor();
        this.DOMElement.style.top = top;
        this.DOMElement.style.left = left;
        this.DOMElement.style.width = width;
        this.DOMElement.style.height = height;
        this.defaultOnClick();
        this.DOMElement.ondblclick = function () { return _this.DeselectTile(); };
        this.DOMElement.classList.add('tile');
    }
    ColorTile.prototype.defaultOnClick = function () {
        this.DOMElement.onclick = this.defaultClickHolder;
    };
    ColorTile.prototype.interimOnClick = function () {
        var _this = this;
        this.DOMElement.onclick = function () { return _this.DeselectTile(); };
    };
    ColorTile.prototype.SelectTile = function () {
        this.DOMElement.classList.add('selected');
        this.interimOnClick();
    };
    ColorTile.prototype.DeselectTile = function () {
        var _this = this;
        this.DOMElement.classList.add('interim');
        this.DOMElement.classList.remove('selected');
        this.defaultOnClick();
        // Remove interim class after 500ms to ensure we have layering appropriately.
        setTimeout(function () { return _this.removeInterim(); }, 500);
        colorPikr.HideDownload();
    };
    ColorTile.prototype.SetRandomColor = function () {
        this.Color = getRandomColor();
        this.DOMElement.style.backgroundColor = this.Color;
    };
    ColorTile.prototype.removeInterim = function () {
        this.DOMElement.classList.remove('interim');
    };
    return ColorTile;
}());
var colorPikr;
window.onload = function () {
    var el = document.getElementById('palette');
    colorPikr = new ColorPikr(el);
    colorPikr.Render();
};
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function isEven(n) {
    return n % 2 == 0;
}
// Find the right method, call on correct element
function launchFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    }
    else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
    else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    //fixButtons();
}
function fixButtons() {
    var fullscreenEnabled = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
    if (fullscreenEnabled) {
        document.getElementById('fullscreen-exit-btn').classList.remove('hide');
        document.getElementById('fullscreen-btn').classList.add('hide');
    }
    else {
        document.getElementById('fullscreen-btn').classList.remove('hide');
        document.getElementById('fullscreen-exit-btn').classList.add('hide');
    }
}
document.addEventListener('webkitfullscreenchange', fixButtons, false);
document.addEventListener('mozfullscreenchange', fixButtons, false);
document.addEventListener('fullscreenchange', fixButtons, false);
document.addEventListener('MSFullscreenChange', fixButtons, false);
// Whack fullscreen
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    //fixButtons();
}
//# sourceMappingURL=app.js.map