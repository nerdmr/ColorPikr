class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }
}

class ColorPikr {
	Tiles: Array<ColorTile>;
	SelectedTile: ColorTile;
	DOMElement: HTMLElement;
	ColorCanvas: HTMLCanvasElement;
	DownloadButton: HTMLElement;

	constructor(element: HTMLElement) {
        this.DOMElement = element;
		this.DownloadButton = document.getElementById('download-button');
		this.Tiles = new Array<ColorTile>();

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

	SelectTile(index: number) {
		this.DownloadButton.classList.remove('hide');
		this.Tiles[index].SelectTile();
		this.SelectedTile = this.Tiles[index];
		this.RenderCanvas(this.SelectedTile.Color);
		this.UpdateSaveAttributes();
	}

	DeselectTile(index: number) {
		this.DownloadButton.classList.add('hide');

		this.Tiles[index].DeselectTile();
	}

	HideDownload() {
		this.DownloadButton.classList.add('hide');
	}

	ClearSelection() {
		this.DownloadButton.classList.add('hide');
		if (this.SelectedTile) {
			this.SelectedTile.DeselectTile();
		}
	}

	Shuffle() {
		for (var i = 0; i < this.Tiles.length; i++) {
			var tile = this.Tiles[i];
			tile.SetRandomColor();
		}
	}

	GoFullScreen() {
		document.body.requestFullscreen();
	}

	UpdateSaveAttributes() {
		var dataURL = this.ColorCanvas.toDataURL();
		var button: HTMLAnchorElement = document.getElementById('download-button') as HTMLAnchorElement;
		button.setAttribute('download', 'colorpikr-' + this.SelectedTile.Color + '.png');
		button.href = dataURL;
	}

	SaveCanvas() {
		/*
		var dataURL = this.ColorCanvas.toDataURL();
		var button: HTMLAnchorElement = document.getElementById('download-button') as HTMLAnchorElement;		
		button.setAttribute('download', 'colorpikr-' + this.SelectedTile.Color + '.png');
		button.href = dataURL;
		*/
	}

	Render() {
		// prepare the canvas:
		this.ColorCanvas = document.getElementById("save-canvas") as HTMLCanvasElement;
		this.ResizeCanvas();		

		for (var i = 0; i < this.Tiles.length; i++) {
			var tile = this.Tiles[i];
			this.DOMElement.appendChild(tile.DOMElement);
		}

		launchFullscreen(document.documentElement);
	}

	RenderCanvas(color) {
		var ctx = this.ColorCanvas.getContext("2d");
		console.log(color);
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, this.ColorCanvas.width, this.ColorCanvas.height);
	}

	ResizeCanvas() {
		this.ColorCanvas.width = window.innerWidth;
		this.ColorCanvas.height = window.innerHeight;

		/**
		 * Your drawings need to be inside this function otherwise they will be reset when 
		 * you resize the browser window and the canvas goes will be cleared.
		 */
	}
}

class ColorTile {
	DOMElement: HTMLElement;
	Color: string;
	Id: string;
	Index: number;

	defaultClickHolder: { (): any; };
	
	constructor(index: number, top:string, left:string, width:string, height:string) {
		this.DOMElement = document.createElement('div');
		this.defaultClickHolder = function() { colorPikr.SelectTile(index) };
		this.SetRandomColor();
		this.DOMElement.style.top = top;
		this.DOMElement.style.left = left;
		this.DOMElement.style.width = width;
		this.DOMElement.style.height = height;
		this.defaultOnClick();
		this.DOMElement.ondblclick = () => this.DeselectTile();
		this.DOMElement.classList.add('tile');
	}

	defaultOnClick() {
		this.DOMElement.onclick = this.defaultClickHolder;
	}
	interimOnClick() {
		this.DOMElement.onclick = () => this.DeselectTile();
	}

	SelectTile() {	
		this.DOMElement.classList.add('selected');
		this.interimOnClick();
	}
	DeselectTile() {
		this.DOMElement.classList.add('interim');
		this.DOMElement.classList.remove('selected');
		this.defaultOnClick();

		// Remove interim class after 500ms to ensure we have layering appropriately.
		setTimeout(() => this.removeInterim(), 500);

		colorPikr.HideDownload();
	}

	SetRandomColor() {
		this.Color = getRandomColor();
		this.DOMElement.style.backgroundColor = this.Color;
	}

	removeInterim() {
		this.DOMElement.classList.remove('interim');
	}
}
var colorPikr: ColorPikr;
window.onload = () => {
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
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if (element.msRequestFullscreen) {
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
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}
	//fixButtons();
}