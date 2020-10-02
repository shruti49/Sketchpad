
const Tool_SCREEENGRAB = "screenGrab";
const Tool_OBJECTGRAB = "objectGrab";

const Tool_PENCILBRUSH = "pencilBrush";
const Tool_SPRAYBRUSH = "sprayBrush";

const SHAPE_LINE = "line";
const SHAPE_RECTANGLE = "rectangle";
const SHAPE_CIRCLE = "circle";
const SHAPE_POLYLINE = "circle";
const SHAPE_TRIANGLE = "circle";
const SHAPE_ELLIPSE = "circle";
const SHAPE_POLYGON = "circle";

class Paint {
	constructor(canvasId) {
		this.canvasId = canvasId;
		this.mousePress = false;
		this.canvas = new fabric.Canvas(this.canvasId, {
			selection: false,
			backgroundColor: "lightblue",
			isDrawingMode: true
		});
	}

	set activatedTool(tool) {
		this.tool = tool;
		console.log(this.tool);
	}

	set lineWidth(linewidth) {
		this.line_Width = linewidth;
		this.context.lineWidth = this.line_Width;
		console.log(linewidth);
	}

	set selectedColor(color) {
		this.color = color;
		this.context.strokeStyle = this.color;
		console.log(color);
	}

	init() {
		//this.canvas.setCursor("crosshair");
		this.canvas.on("mouse:down", (event) => this.onMouseDown(event));
		switch (this.tool) {
			case Tool_PENCILBRUSH:
                // this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);              
                // this.canvas.freeDrawingBrush.color = "black";
                // this.canvas.freeDrawingBrush.width = 5;
				break;
				default:
					break;
		}
	}

	onMouseDown(event) {
		this.canvas.on("mouse:move", (event) => this.onMouseMove(event)); 
		this.mousePress = true;
		console.log("mousedown", event.target);
		switch (this.tool) {
			case Tool_PENCILBRUSH:
				//this.canvas.isDrawingMode = true;
				break;
				default:
					break;
		}
		this.canvas.renderAll();

	}

	onMouseMove(event) {
		this.canvas.on("mouse:up", (event) => this.onMouseUp(event));

		console.log(this.mousePress);
		if(this.mousePress === true) {
			console.log("mousemove", event.target);
		}
		this.canvas.renderAll();
	}

	onMouseUp(event) {
		this.mousePress = false;
		console.log(this.mousePress);
		console.log("mouseup", event);
	}
}
//INITIALIZING PAINT CLASS
let paint = new Paint(myCanvas);
paint.init();
paint.activatedTool = Tool_PENCILBRUSH;

	document.querySelectorAll("[data-brush]").forEach((item, i) => {
		item.addEventListener("click", (event) => {
			document.querySelector("[data-brush].selectedTool").classList.toggle("selectedTool");
			item.classList.toggle("selectedTool");
			let activeTool = item.getAttribute("data-brush");
			paint.activatedTool = activeTool;
		});
	});


	// 	onMouseMove(event) {
	// 		this.canvas.onmousemove = (event) => this.onMouseMove(event);
	// 		this.currentPos = getMouseCoordinates(event, this.canvas);

	// 		switch (this.tool) {
	// 			case Tool_LINE:
	// 			case Tool_RECTANGLE:
	// 			case Tool_CIRCLE:
	// 				this.drawShape();
	// 				break;
	// 			case Tool_PENCIL:
	// 				this.draw(this.line_Width);
	// 				break;
	// 			case Tool_ERASER:
	// 				this.context.clearRect(
	// 					this.currentPos.x,
	// 					this.currentPos.y,
	// 					this.line_Width,
	// 					this.line_Width
	// 				);
	// 				break;
	// 			default:
	// 				break;
	// 		}
	// 	}

	// 	onMouseUp(event) {
	// 		//IF tool is rectange then push rectangle
	// 		if (this.tool === Tool_RECTANGLE) {
	// 			this.shapes.push({
	// 				a: this.startPos.x,
	// 				b: this.startPos.y,
	// 				width: this.currentPos.x - this.startPos.x,
	// 				height: this.currentPos.y - this.startPos.y,
	// 				isDragging: false,
	// 			});
	// 			//this.canvas.add(rect);
	// 		} //IF tool is circle then push circle
	// 		else if (this.tool === Tool_CIRCLE) {
	// 			this.shapes.push({
	// 				a: this.startPos.x,
	// 				b: this.startPos.y,
	// 				radius: circleDistanceFormula(this.startPos, this.currentPos),
	// 				sAngle: 0,
	// 				eAngle: 2 * Math.PI,
	// 				counterclockwise: false,
	// 				isDragging: false,
	// 			});
	// 		} //IF tool is pencil then push pencil drawing
	// 		else if (this.tool === Tool_PENCIL) {
	// 			this.shapes.push({ a: this.startPos.x, b: this.startPos.y });
	// 		} else if (this.tool === Tool_LINE) {
	// 		}

	// 		console.log(this.shapes);

	// 		this.canvas.onmousemove = null;
	// 		document.onmouseup = null;
	// 	}


	// }



	// //RANGE SLIDER
	// let slider = document.getElementById("rangeSlider");

	// noUiSlider.create(slider, {
	// 	start: [5],
	// 	tooltips: true,
	// 	range: {
	// 		min: [0],
	// 		max: [20],
	// 	},
	// 	format: wNumb({
	// 		decimals: 0,
	// 	}),
	// });

	// slider.noUiSlider.on("update", function (values, handle) {
	// 	paint.lineWidth = values[handle];
	// 	paint.eraserSize = values[handle];
	// });

	// //COLOR SELECTOR
	// let color = document.getElementById("myColor");
	// color.onchange = function () {
	// 	paint.selectedColor = this.value;
	// };



	// document.querySelectorAll("[data-command]").forEach((item, i) => {
	// 	item.addEventListener("click", (event) => {
	// 		let command = item.getAttribute("data-command");
	// 		if (command === "undo") {
	// 			paint.undoCommand();
	// 		} else if (command === "download") {
	// 			let canvas = document.getElementById("canvas");
	// 			let image = canvas.toDataURL("image/png", 1.0).replace("images/png", "images/octet-stream");
	// 			let link = document.createElement("a");
	// 			link.download = "bmc.png";
	// 			link.href = image;
	// 			link.click();
	// 		}
	// 	});
	// });

	// function openFullscreen(e) {
	// 	const ele = document.querySelector(".canvas-container");
	// 	if (!document.fullscreenElement) {
	// 		ele.requestFullscreen().catch((err) => {
	// 			alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
	// 		});
	// 	} else {
	// 		document.exitFullscreen();
	// 	}
	// }

	// document.querySelector("#maxBtn").addEventListener("click", openFullscreen);

	// $("#maxBtn").click(function () {
	// 	$(this).find("i").toggleClass("fa-compress-alt fa-expand-alt");
	// });
