window.sketchpad = () => {

    const Tool_SCREEENGRAB = "screenGrab";
    const Tool_OBJECTGRAB = "objectGrab";
    const Tool_PENCILBRUSH = "pencilBrush";
    const Tool_SPRAYBRUSH = "sprayBrush";
    const Tool_LINE = "line";
    const Tool_RECTANGLE = "rectangle";
    const Tool_CIRCLE = "circle";
    const Tool_ERASER = "eraser";
    const Tool_TEXT = "text";
    const Tool_CLEAR = "clear";
    let canvasContainer = document.querySelector(".canvas-container");
    let canvasToolbaar1 = document.querySelector(".canvas-toolbar_1");
    let canvasToolbaar2 = document.querySelector(".canvas-toolbar_2");
    let widthLabel = document.querySelector("#label-width");
    let font_size = document.querySelector("#fontSize");
    let file_input = document.querySelector("#fileInput");
    let mycolor = document.getElementById("myColor");
    let drawingLineWidthEl = document.getElementById("line-width");

    let selectedTool = "pencilBrush";
    let mousePressed = false;
    let isRedoing = false;
    let drawings = [];
    let origX;
    let origY;
    let currentX;
    let currentY;
    let rect;
    let circle;
    let line;
    let cursor;
    let width;
    let height;
    let reader = new FileReader();

    const initCanvas = (id) => {
        return new Fabric.Canvas(id, {
            selection: false,
            backgroundColor: "#fff",
            isDrawingMode: false,
        });
    };

    const canvas = initCanvas("mycanvas");

    width = canvasContainer.clientWidth ;
    height = canvasContainer.clientHeight - (canvasToolbaar1.clientHeight + canvasToolbaar2.clientHeight);
    canvas.setWidth(width);
    canvas.setHeight(height);


    function reportWindowSize() {
        width = canvasContainer.clientWidth;
        height = canvasContainer.clientHeight - (canvasToolbaar1.clientHeight + canvasToolbaar2.clientHeight);
        canvas.setHeight(height);
        canvas.setWidth(width);
        canvas.renderAll();
    }

    window.addEventListener('resize', reportWindowSize);

    Fabric.Object.prototype.transparentCorners = false;
    Fabric.Object.prototype.cornerColor = 'blue';
    Fabric.Object.prototype.cornerStyle = 'circle';


    mycolor.onchange = function () {
        canvas.freeDrawingBrush.color = this.value;
    };

    drawingLineWidthEl.onchange = function () {
        canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        widthLabel.innerHTML = this.value;
    };

    var newITextFromText = function (textObj) {
        return new fabric.IText("", {
            top: textObj.top,
            left: textObj.left,
            fontSize: textObj.fontSize,
            fontFamily: textObj.fontFamily
        });
    }

    //font_size.onchange = function () {
    //    cursor.setFontSize(this.val);
    //};

    const imageAdded = (e) => {
        const file = document.querySelector("#fileInput").files[0];
        reader.readAsDataURL(file);
    }

    const ImageUploader = () => {
        canvas.isDrawingMode = false;
        file_input.addEventListener(("change"), imageAdded);
        reader.addEventListener(("load"), () => {
            fabric.Image.fromURL(reader.result, img => {
                canvas.add(img);
                canvas.requestRenderAll();
            });
        });
    }
    ImageUploader();

    const toggleTool = (tool) => {
        switch (tool) {
            case Tool_SCREEENGRAB:
                //canvas.setCursor("grab");
                break;
            case Tool_OBJECTGRAB:
                //canvas.setCursor("move");
                canvas.forEachObject(function (o) {
                    o.set({ selectable: true }).setCoords();
                }).selection = true;  
                break;
            case Tool_PENCILBRUSH:
                //canvas.setCursor("crosshair");
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush = new Fabric.PencilBrush(canvas);              
                canvas.freeDrawingBrush.color = mycolor.value;
                canvas.freeDrawingBrush.width = 14;
                break;
            case Tool_SPRAYBRUSH:
                //canvas.setCursor("crosshair");
                canvas.freeDrawingBrush = new Fabric.SprayBrush(canvas);
                canvas.freeDrawingBrush.color = mycolor.value;
                canvas.freeDrawingBrush.width = 14;
                break;
            case Tool_ERASER:
                //canvas.setCursor("default");
                break;
            case Tool_RECTANGLE:
            case Tool_LINE:
            case Tool_CIRCLE:
                //canvas.setCursor("crosshair");
                canvas.forEachObject(function (o) {
                    o.selectable = false;
                }).selection = false;
                break;
            case Tool_TEXT:
                canvas.selection = true;
                canvas.isDrawingMode = false;
                cursor = new fabric.Text("Aa", {
                    fontSize: 20
                });
                cursor.lockScalingX = true;
                cursor.lockScalingY = true;
                cursor.lockUniScaling = true;

                canvas.add(cursor);
                var hoverTarget = {
                    obj: null,
                    type: null
                };
                break;
            case Tool_CLEAR:
                canvas.clear()
                break;
            default:
                break;
        }
        canvas.renderAll();
        console.log("toggle :>> ", tool);
    };

    toggleTool(selectedTool);

    canvas.on("mouse:down", (event) => {
        mousePressed = true;
        let pointer = canvas.getPointer(event.e);
        origX = pointer.x;
        origY = pointer.y;

        if (mousePressed) {
            switch (selectedTool) {
                case Tool_SCREEENGRAB:
                    canvas.isDrawingMode = false;
                    canvas.setCursor("grabbing");
                    break;

                case Tool_ERASER:
                    canvas.selection = false;
                    canvas.setCursor("default");
                    canvas.isDrawingMode = true;

                    //let pointer = canvas.getPointer(event.e);
                    //context.clearRect(
                    //	points.x,
                    //	pointer.y,
                    //	drawingLineWidthEl.value,
                    //	drawingLineWidthEl.value
                    //);
                    break;
                case Tool_LINE:
                    canvas.selection = false;
                    canvas.isDrawingMode = false;
                    canvas.setCursor("crosshair");
                    var points = [pointer.x, pointer.y, pointer.x, pointer.y];
                    line = new Fabric.Line(points, {
                        originX: 'center',
                        originY: 'center',
                        stroke: mycolor.value,
                        strokeWidth: parseInt(drawingLineWidthEl.value, 10) || 1,
                        fill: 'rgba(0,0,0,0)',
                    });
                    canvas.add(line);
                    break;
                case Tool_CIRCLE:
                   // canvas.isDrawingMode = false;
                    canvas.setCursor("crosshair");
                    circle = new Fabric.Circle({
                        left: origX,
                        top: origY,
                        radius: 1,
                        strokeWidth: parseInt(drawingLineWidthEl.value, 10) || 1,
                        stroke: mycolor.value,
                        fill: 'rgba(0,0,0,0)',
                        selectable: true,
                        originX: 'center',
                        originY: 'center'
                    });
                    canvas.add(circle);
                    break;
                case Tool_RECTANGLE:
                    canvas.isDrawingMode = false;
                    canvas.setCursor("crosshair");
                    rect = new Fabric.Rect({
                        left: origX,
                        top: origY,
                        stroke: mycolor.value,
                        strokeWidth: parseInt(drawingLineWidthEl.value, 10) || 1,
                        originX: 'left',
                        originY: 'top',
                        width: pointer.x - origX,
                        height: pointer.y - origY,
                        angle: 0,
                        fill: 'rgba(0,0,0,0)',
                        transparentCorners: false,
                        selectable: false
                    });
                    canvas.add(rect);
                    break;
                case Tool_TEXT:
                    canvas.selection = true;
                    canvas.isDrawingMode = false;
                    var t = newITextFromText(cursor);
                    canvas.add(t).setActiveObject(t);
                    t.enterEditing(); 
                    break;
                default:
                    break;

            }
        }
        canvas.renderAll();
        console.log("mousedown :>> ", selectedTool);
    });


    canvas.on("mouse:move", (event) => {
        let pointer = canvas.getPointer(event.e);
        currentX = pointer.x;
        currentY = pointer.y;
        canvas.selection = false;
        // canvas.isDrawingMode = false;
        drawCanvas(currentX, currentY);
        //connection.invoke('draw', origX, origY, currentX, currentY);       
    });

    canvas.on("mouse:up", (event) => {
        mousePressed = false;
        //canvas.renderAll();
        //console.log(event);
    });

    document.querySelectorAll("[data-tool]").forEach((item, i) => {
        item.addEventListener("click", (event) => {
            document.querySelector("[data-tool].selectedTool").classList.toggle("selectedTool");
            item.classList.toggle("selectedTool");
            selectedTool = item.getAttribute("data-tool");
            console.log("activatedTool :>> ", selectedTool);
            toggleTool(selectedTool);
        });
    });


    const undoDrawings = () => {
        if (canvas._objects.length > 0) {
            drawings.push(canvas._objects.pop());
            canvas.renderAll();
        }
    }

    canvas.on('object:added', function () {
        if (!isRedoing) {
            drawings = [];
        }
        isRedoing = false;
    });

    const redoDrawings = () => {
        if (drawings.length > 0) {
            isRedoing = true;
            canvas.add(drawings.pop());
        }
    }

    document.querySelectorAll("[data-command]").forEach((item, i) => {
        item.addEventListener("click", (event) => {
            let command = item.getAttribute("data-command");
            if (command === "undo") {
                undoDrawings();
            } else if (command === "redo") {
                redoDrawings();
            }
        });
    });


    function openFullscreen(e) {
        const ele = document.querySelector(".canvas-container");
        if (!document.fullscreenElement) {
            ele.requestFullscreen().catch((err) => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    document.querySelector("#maxBtn").addEventListener("click", openFullscreen);

    $("#maxBtn").click(function () {
        $(this).find("i").toggleClass("fa-compress-alt fa-expand-alt");
    });

 
    window.getSketchpadValue = () => {
        let JsonString = JSON.stringify(canvas);
        return JsonString;
    }

    var connection = new signalR.HubConnectionBuilder()
        .withUrl('/draw')
        .build();


    function drawCanvas(currentX,currentY) {
        switch (selectedTool) {
            case Tool_SCREEENGRAB:
                canvas.setCursor("grab");
                if (mousePressed) {
                    canvas.isDrawingMode = false;
                    canvas.selection = false;
                    canvas.setCursor("grabbing");
                    canvas.renderAll();
                    const mouseEvent = event.e;
                    const delta = new Fabric.Point(mouseEvent.movementX, mouseEvent.movementY);
                    canvas.relativePan(delta);
                }
                break;
            case Tool_ERASER:
                canvas.setCursor("default");
                if (mousePressed) {
                    canvas.selection = false;
                    canvas.setCursor("default");
                    canvas.isDrawingMode = true;
                }
                break;
            case Tool_LINE:
                canvas.setCursor("crosshair");
                if (mousePressed) {
                    canvas.isDrawingMode = false;
                    line.set({ x2: currentX, y2: currentY });
                }
                break;
            case Tool_CIRCLE:
                canvas.setCursor("crosshair");
                if (mousePressed) {
                    canvas.isDrawingMode = false;
                    circle.set({ radius: Math.abs(origX - currentX) });
                }
                break;
            case Tool_RECTANGLE:
                canvas.setCursor("crosshair");
                if (mousePressed) {
                    if (origX > currentX) {
                        rect.set({ left: Math.abs(currentX) });
                    }
                    if (origY > currentY) {
                        rect.set({ top: Math.abs(currentY) });
                    }
                    rect.set({ width: Math.abs(origX - currentX) });
                    rect.set({ height: Math.abs(origY - currentY) });
                }
                
                break;
            case Tool_TEXT:
                cursor.set({
                    left: event.e.layerX,
                    top: event.e.layerY,
                });
                break;
            default:
                break;
                console.log("mouseMove :>> ", selectedTool);
        }
        canvas.renderAll();
    }

    connection.on('draw', function (prev_x, prev_y, x, y) {
        console.log("X: " + x + " Y: " + y);
        drawCanvas(prev_x, prev_y, x, y);
    });
    connection.start();

}



	//let drawingShadowColorEl = document.getElementById("drawing-shadow-color");
	//let drawingShadowWidth = document.getElementById("drawing-shadow-width");
	//let drawingShadowOffset = document.getElementById("drawing-shadow-offset");


	//drawingShadowColorEl.onchange = function () {
	//	canvas.freeDrawingBrush.shadow.color = this.value;
	//};

	//drawingShadowWidth.onchange = function () {
	//	canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
	//	this.previousSibling.innerHTML = this.value;
	//};
	//drawingShadowOffset.onchange = function () {
	//	canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
	//	canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
	//	this.previousSibling.innerHTML = this.value;
	//};

