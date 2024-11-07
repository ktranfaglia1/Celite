/*
* UIFunctionality.js
* Authors: Kyle Tranfaglia, Timmy McKirgan, Dustin O'Brien
* This file handles all user interface Functionality. It is the bulk of the program and handles all button clicks,
  information inputs, mouse actions, lattice changes, cell changes, iterations, and updates/calculates information
  for simulation modifications and communicates it with utility files
* Last Updated: 03/11/24
*/
import {latticeArray, rule, canvas, ctx, outputIteration, alterRuleNum, tctx, tickCanvas, logCanvas, drawLattice} from './displayLattice.js';
import {numOfIterations, currentIteration, size, latSize, ruleNum, inf} from './displayLattice.js';
import {alterLatSize, alterSize, alterLatticeArray, alterCurrentLattice, alterNextLattice, alterBorder} from './displayLattice.js';
import {alterRule, alterNumOfIterations, alterCurrentIteration, alterBoundaryCon, alterInf, getBorder} from './displayLattice.js';
import {updateLattice} from './displayLattice.js';
import {deadColorSel, aliveColorSel, deadBorderSel, aliveBorderSel} from './displayLattice.js';
import {ruleNumToRule} from './generateLattice.js';
import {cell} from './cellClass.js';
import {logMessage} from './logClass.js';

/*
Hotkeys for zoom in/out
change cell label when only one row
Reset Perspective Button
*/

/* Global constants connecting HTML buttons to JS by ID to impliment functionality */   

//Input Box Constants
const iterationInputBox = document.getElementById("iterationInputBox");
const ruleInputBox = document.getElementById("ruleInputBox");
const latticeSizeBox = document.getElementById("latticeSizeBox");

//Submit Button Constants
const iterationSubmit = document.getElementById("iterationSubmit");
const ruleSubmit = document.getElementById("ruleSubmit");
const latticeSizeSubmit = document.getElementById("latticeSizeSubmit");

//Main Buttons Constants
const startStopButton = document.getElementById("startStopButton");
const iterateButton = document.getElementById("iterateButton");
const clearResetButton = document.getElementById("clearResetButton");
const downloadPDFButton = document.getElementById("downloadPDFButton");
const downloadPNGButton = document.getElementById("downloadPNGButton");
const aboutButton = document.getElementById("aboutButton");
const optionsButton = document.getElementById("optionsButton");
const latticeFillButton = document.getElementById("latticeFillButton");
const randomFillButton = document.getElementById("randomFillButton");

//Perodic and Null Checkbox Constants
const periodicCheckBox = document.getElementById("periodicCheckBox");
const nullCheckBox = document.getElementById("nullCheckBox");

//Toggle Switches Constants
const boundToggleButton = document.getElementById("boundToggle");
const iterationToggleButton = document.getElementById("iterationToggle");
const borderToggleButton = document.getElementById("borderToggle");

//Side Windows Constants
const aboutWindow = document.getElementById("aboutContainer");
const optionsWindow = document.getElementById("optionsContainer");

//iteration Slider Constants
const iterationSpeedSlider = document.getElementById("iterationSpeedSlider");
const iterationSpeedValue = document.getElementById("iterationSpeedValue");

/* Global constants connecting HTML/CSS features to JS by class name to impliment functionality */
const checkboxes = document.querySelectorAll(".checkbox_select");
const boundToggle = document.querySelector("#boundToggle .toggle_button");
const iterationToggle = document.querySelector("#iterationToggle .toggle_button");
const borderToggle = document.querySelector("#borderToggle .toggle_button");
const closeAbout = document.querySelector("#aboutContent .close");
const closeOptions = document.querySelector("#optionsContent .close");


/* Global variables for iteration */
let addIterations = 0; // Defaults iterations
let run = 0; // Defaults to not keep running
let iterationTime = 750; //Time to wait before iterating again
let tickerToggle = 0; //Ticker toggle decides if row ticker will be on defaults to on

//Stores current scrolling values to keep track of scrolling in or out and preventing user from scrolling too far out
let scale = 1;
let totalDelta = 0;

//Sets default colors


let messageQueue = []

//Redraws the entire lattice array on the canvas
function redrawLattice() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = deadColorSel.value;
	ctx.fillRect(latticeArray[0][0].getXLoc(), latticeArray[0][0].getYLoc(), latticeArray[0].length * latticeArray[0][0].getHeight() ,latticeArray.length * latticeArray[0][0].getWidth());
	for (let i = 0; i < latticeArray.length; i++) {
		for (let f = 0; f < latticeArray[i].length; f++) {
			latticeArray[i][f].drawCell(ctx)
		}
	}
}

//Determins if the mouse cursor is currently within the lattice. Returns true if cursor is in lattice, false otherwise.
function inLattice(mouseX, oneRow = true, mouseY = 0,) {
	let inLat = false;
	//If the X position of the mouse is greater then the starting X of the first cell, continue.
	if (mouseX >= latticeArray[0][0].getXLoc()) {
		//If the X position of the mouse is less then the starting X of the last cell plus cell size.
		if (mouseX <= (latticeArray[0][latticeArray[0].length - 1].getXLoc() + latticeArray[0][latticeArray[0].length - 1].getWidth())) {
			//If there is only one row, return true for inLattice. Otherwise continue to checking Y position of mouse.
			if (oneRow) {
				inLat = true;
			}
			else{
				//If the Y position of the mouse is greater than 0 in the canvas, continue.
				if (mouseY >= 0) {
					//If the Y position of the mouse is less then the Y position of the last timestep plus cell size, set inLat to true and return.
					if (mouseY <= (latticeArray[latticeArray.length - 1][0].getYLoc() + latticeArray[latticeArray.length - 1][0].getHeight())) {
						inLat = true;
					}
				}
			}
		}
	}
	return inLat;
}

//Returns the cell data to it's unscrolled form.
function revertCells() {
	let startX = (canvas.width / 2) - (latSize[0] * size / 2);
	for (let i = 0; i < latticeArray.length; i++) {
		for (let f = 0; f < latticeArray[i].length; f++) {
			latticeArray[i][f].setHeight(size);
			latticeArray[i][f].setWidth(size);
			latticeArray[i][f].setXLoc(startX + f * size);
			latticeArray[i][f].setYLoc(i * size);
		}
	}
}

function alterCell(mouseX, cell, scale, mouseY = 0) {
	//Get the X and Y position of corner 0 of the cell, the X position of the corner 1 (to the right of corner 0)
	//and the Y position of corner 2 (below corner 0)
	let corner0X = cell.getXLoc();
	let corner0Y = cell.getYLoc();
	let corner1X = cell.getXLoc() + cell.getWidth();
	let corner2Y = cell.getYLoc() + cell.getHeight();

	//Find the corresponding X or Y distance between the current mouse location and the corners.
	let deltaCorner0X = corner0X - mouseX;
	let deltaCorner0Y = corner0Y - mouseY;
	let deltaCorner1X = corner1X - mouseX;
	let deltaCorner2Y = corner2Y - mouseY;

	//Alter the positions by multiplying the ditance between the cursor and the corners by the scale factor
	let newCell0X = mouseX + (deltaCorner0X * scale);
	let newCell0Y = mouseY + (deltaCorner0Y * scale);
	let newCell1X = mouseX + (deltaCorner1X * scale);
	let newCell2Y = mouseY + (deltaCorner2Y * scale);

	//Create the new cell width and height
	let newCellWidth = newCell1X - newCell0X;
	let newCellHeight = newCell2Y - newCell0Y;

	//Set new values to the cell.
	cell.setHeight(newCellHeight);
	cell.setWidth(newCellWidth);
	cell.setXLoc(newCell0X);
	cell.setYLoc(newCell0Y);
}

/* THIS SECTION IS USED FOR COLOR PICKING */

//Selects color for dead color
deadColorSel.addEventListener('input', function(){
	for (let i = 0; i < latticeArray.length; i++)
	{
		for (let j = 0; j < latticeArray[0].length; j++)
		{
			(latticeArray[i][j]).setDeadColor(deadColorSel.value);
		}
	}
	drawLattice(latticeArray);
})

//Selects color for alive
aliveColorSel.addEventListener('input', function(){
	for (let i = 0; i < latticeArray.length; i++)
	{
		for (let j = 0; j < latticeArray[0].length; j++)
		{
			(latticeArray[i][j]).setAliveColor(aliveColorSel.value);
		}
	}
	drawLattice(latticeArray);
})

//Selects color for dead cells border
deadBorderSel.addEventListener('input', function(){
	for (let i = 0; i < latticeArray.length; i++)
	{
		for (let j = 0; j < latticeArray[0].length; j++)
		{
			(latticeArray[i][j]).setDeadBorder(deadBorderSel.value);
		}
	}
	drawLattice(latticeArray);
})

//select cells for alive cells border
aliveBorderSel.addEventListener('input', function(){
	for (let i = 0; i < latticeArray.length; i++)
	{
		for (let j = 0; j < latticeArray[0].length; j++)
		{
			(latticeArray[i][j]).setAliveBorder(aliveBorderSel.value);
		}
	}
	drawLattice(latticeArray);
})


tickCanvas.addEventListener('wheel', function(event) {
	let mouseX, mouseY;
	[mouseX, mouseY] = getMouseLocation(event); // Calculates Proper location of zoom center
	//If there is only one row in the lattice and the mouse X position is within the bounds of the lattice (ignoring Y position), continue.
	if (latticeArray.length == 1 && inLattice(mouseX)) {
		let delta = event.deltaY; //Get delta from mouse scroll.
		//If delta and totalDelta are greater than 0, set scale to 0.9 to zoom out
		if (delta > 0 && totalDelta > 0) {
			scale = 0.9
		}
		//If delta is less than 0, set scale to 1.1 to zoom in.
		else if (delta < 0) {
			scale = 1.1
		}
		totalDelta -= delta; //Subtract delta from totalDelta. This allows us to keep track of how far out the user is zoomed.
		//If totalDelta is less than 0, revert cells to original unzoomed position and set totalDelta to 0.
		if (totalDelta < 0) {
			revertCells();
			totalDelta = 0;
		}
		//Otherwise, alter all of the cells to prepare to draw the zoomed cells.
		else {
			for (let i = 0; i < latticeArray.length; i++) {
				for (let f = 0; f < latticeArray[i].length; f++) {
					alterCell(mouseX, latticeArray[i][f], scale);
				}
			}
		}
		redrawLattice();
	}
	else if (latticeArray.length > 1 && inLattice(mouseX, false, mouseY)){
		let delta = event.deltaY; //Get delta from mouse scroll.
		//If delta and totalDelta are greater than 0, set scale to 0.75 to zoom out. (Zooms more per scroll for effeciency)
		if (delta > 0 && totalDelta > 0) {
			scale = 0.75
		}
		//If delta is less than 0, set scale to 1.25 to zoom in. (Zooms more per scroll for effeciency)
		else if (delta < 0) {
			scale = 1.25
		}
		totalDelta -= delta; //Subtract delta from totalDelta. This allows us to keep track of how far out the user is zoomed.
		//If totalDelta is less than 0, revert cells to original unzoomed position and set totalDelta to 0.
		if (totalDelta < 0) {
			revertCells();
			totalDelta = 0;
		}
		//Otherwise, alter all of the cells to prepare to draw the zoomed cells.
		else {
			for (let i = 0; i < latticeArray.length; i++) {
				for (let f = 0; f < latticeArray[i].length; f++) {
					alterCell(mouseX, latticeArray[i][f], scale, mouseY);
				}
			}
		}
		redrawLattice();
	}
	event.preventDefault();
}, false)

//Changes rule set
ruleSubmit.addEventListener("click", function() {
	stopIterating();  // Stops the iteration before changing the rule number
	clearResetToggle();
	setRule(rule);
})

// Sets all starting lattices to alive
latticeFillButton.addEventListener("click", function() {
	stopIterating();  // Stops the iteration before completely filling the lattice
	clearResetToggle();
	setLatticeSize();
	clear(latticeArray);
	for (let i = 0; i  < latticeArray[0].length; i++) {
		latticeArray[0][i].setColor(1);
	}
	drawLattice(latticeArray);
	makeLog("Filled Lattice", logCanvas, messageQueue);
});

// Sets random states to all cells in starting lattice 
randomFillButton.addEventListener("click", debounce(function() {
	stopIterating();  // Stops the iteration before randomly filling the lattice
	clearResetToggle();
	setLatticeSize();
	clear(latticeArray);
	for (let i = 0; i  < latticeArray[0].length; i++) {
		latticeArray[0][i].setColor(Math.floor(Math.random() * 2));
	}
	drawLattice(latticeArray);
	makeLog("Randomized Lattice", logCanvas, messageQueue);
}));

// Iterates the iterations inputted
iterateButton.addEventListener("click", debounce(function() {
	stopIterating();  // Stops the iteration before doing a complete iteration
	//Keep infinite the same and add the buffers
	alterInf(inf[0], true)
	console.log(addIterations)
		if(addIterations == 0)
		{
			makeError("Iteration not set", logCanvas, messageQueue)
			return
		}
		makeLog("Iterated to " + addIterations + " Rule: " + ruleNum, logCanvas, messageQueue);
	if (latticeArray.length == 1) {
		let bufferArr = new Array()
		let latPlusBufferArr = new Array()
		//Store current cell states
		for (let i = 0; i < latSize[0]; i++) {
			latPlusBufferArr.push(latticeArray[0][i].getColor())
		}
		//Add buffer cells on either one for the mock array.
		for (let i = 0; i < latSize[1]; i++) {
			bufferArr.push(0)
		}
		latPlusBufferArr = bufferArr.concat(latPlusBufferArr.concat(bufferArr));
		//Change the lattice size to include the buffers.
		let newCellNum = (latSize[0] + (2 * latSize[1]))
		if (!isNaN(newCellNum) && newCellNum >= 1) {
			alterLatSize(newCellNum);
		}
		//Change size to accomodate new lattice size.
		let size = canvas.width / latSize[0];
		//Cells should have a maximum size of 45 :: This Caps cell size to 45
		if (size > 45) {
			size = 45; 
		}
		alterSize(size);
		//Clear lattice array to generate new lattice of appropriate size.
		clear(latticeArray);
		let neoLatticeArray = latticeArray;
		//Iterate through lattice array and use mock array to change colors appropriately.
		for (let i = 0 ; i < latticeArray[0].length; i++) {
			if (latPlusBufferArr[i] == 1) {
				neoLatticeArray[0][i].flipColor();
			}
			(neoLatticeArray[0][i]).drawCell(ctx);
			alterLatticeArray(neoLatticeArray);
		}
		clearResetButton.innerHTML = "Reset";
	}
	iterate(currentIteration, addIterations);
}));

clearResetButton.addEventListener("click", debounce(function() {
	stopIterating();  // Stops the iteration before changing clearing the canvas
	clearResetToggle();

	// Removes buffers if they existed.
	let newCellNum = (latSize[0] - (2 * latSize[1]));
	if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
		alterLatSize(newCellNum);
	}
	else {
		makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
	}
	// Alters size of cells to accomodate for removed cells.
	let size = canvas.width / latSize[0];
	// Cells should have a maximum size of 45 :: This Caps cell size to 45
	if (size > 45) {
		size = 45; 
	}
	alterSize(size);
	if (latticeArray.length == 1) {
		clear(latticeArray);
	}
	else {
		clear(latticeArray, true);
	}
	alterInf(inf[0], false);
}));

/* Connect UI Functionality to a prebuilt function */

//Toggles 
boundToggleButton.addEventListener("click", debounce(function() {
	stopIterating();  // Stops the iteration before changing the boundary condition
	toggleCheckbox();
}));

iterationToggleButton.addEventListener("click", debounce(function() {
	tickerToggle = !(tickerToggle);
	tctx.clearRect(0,0, tickCanvas.width, tickCanvas.height);
	iterationToggleOption();
}));

borderToggleButton.addEventListener("click", debounce(function() {
	alterBorder(!getBorder());
	drawLattice(latticeArray);
	borderToggleOption();
}));

iterationSubmit.addEventListener("click", function() {
	stopIterating();  // Stops the iteration before changing the iteration amount
	setLatticeSize();
});
//Sets the number of cells in a lattice
latticeSizeSubmit.addEventListener("click", function() {
	stopIterating();  // Stops the iteration before changing the lattice size
	clearResetToggle();
	updateLatticeSize(canvas);
});

startStopButton.addEventListener("click", debounce(function() {
	
	if(addIterations == 0)
		{
			makeError("Iteration not set", logCanvas, messageQueue)
			return
		}
	if (run != 1) {
		run = 1;
		startStopToggle();
		if (latticeArray.length == 1) {
			let bufferArr = new Array()
			let latPlusBufferArr = new Array()
			//Store current cell states
			for (let i = 0; i < latSize[0]; i++) {
				latPlusBufferArr.push(latticeArray[0][i].getColor())
			}
			//Add buffer cells on either one for the mock array.
			for (let i = 0; i < latSize[1]; i++) {
				bufferArr.push(0)
			}
			latPlusBufferArr = bufferArr.concat(latPlusBufferArr.concat(bufferArr));
			//Change the lattice size to include the buffers.
			let newCellNum = (latSize[0] + (2 * latSize[1]))
			if (!isNaN(newCellNum) && newCellNum >= 1) {
				alterLatSize(newCellNum);
			}
			//Change size to accomodate new lattice size.
			let size = canvas.width / latSize[0];
			//Cells should have a maximum size of 45 :: This Caps cell size to 45
			if (size > 45) {
				size = 45; 
			}
			alterSize(size);
			//Clear lattice array to generate new lattice of appropriate size.
			clear(latticeArray);
			let neoLatticeArray = latticeArray;
			//Iterate through lattice array and use mock array to change colors appropriately.
			for (let i = 0 ; i < latticeArray[0].length; i++) {
				if (latPlusBufferArr[i] == 1) {
					neoLatticeArray[0][i].flipColor();
				}
				(neoLatticeArray[0][i]).drawCell(ctx);
				alterLatticeArray(neoLatticeArray);
			}
			if (addIterations) {
    			clearResetButton.innerHTML = "Reset";
			}
		}
		continouslyIterate(iterationTime);
	}
	else {
		run = 0;
		startStopToggle();
	}
}));

//Continously Checks where the mouse is on the Canvas too allow tick box to next to it
tickCanvas.addEventListener("mousemove", function(event) {makeTickBox(event, tctx)});

let mouseDown = false;
// Runs program to flips squares if Clicked
tickCanvas.addEventListener('mousedown', debounce(function(event) {
	document.body.style.userSelect = 'none';  // Disable text selection globally
	let mouseX, mouseY;
	[mouseX, mouseY] = getMouseLocation(event);  // Calculates Proper location of mouse click for usage in setCells
	setCells(latticeArray, mouseX, mouseY);	 // Flips the cell if it was clicked on
	mouseDown = true;
}));

tickCanvas.addEventListener("mouseup", function(event){mouseDown = false;});

tickCanvas.addEventListener("mousemove", shortDebounce(function(event){
	let mouseX, mouseY;
	if(mouseDown)
		[mouseX, mouseY] = getMouseLocation(event);
		setCells(latticeArray, mouseX, mouseY, true);
}));

// Recognize a keydown event, as in keyboard key press, then check and hnadle key presses. Used for keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Check if ALT key is pressed, then check if another key is pressed and complete corresponding action
    if (event.altKey) {
		switch (true) {
			case (event.key == 'Enter'):
				startStopButton.click();
				break;
			case (event.key == 'i'):
				iterateButton.click();
				break;
			case (event.key == 'c'):
				clearResetButton.click();
				break;
			case (event.key == 'o'):
				optionsButton.click();
				break;
			case (event.key == 'a'):
				aboutButton.click();
				break;
			case (event.key == 'n'):
				downloadPDFButton.click();
				break;
			case (event.key == 'p'):
				downloadPNGButton.click();
				break;
			case (event.key == 'g'):
				latticeFillButton.click();
				break;
			case (event.key == 'm'):
				randomFillButton.click();
				break;
			case (event.key == 'u'):
				boundToggleButton.click();
				break;
			case (event.key == 'w'):
				iterationToggleButton.click();
				break;
			case (event.key == 'x'):
				borderToggleButton.click();
				break;
			case (event.key == 'j'):
				iterationInputBox.focus();
				break;
			case (event.key == 'k'):
				ruleInputBox.focus();
				break;
			case (event.key == 'l'):
				latticeSizeBox.focus();
				break;
			case (event.key == 'y'):
				iterationSpeedSlider.focus();
				break;
			case (event.key == '='):
				let dustin = document.querySelector(".Dustin");
				if (dustin.style.display == "block") {
					dustin.style.display = "none"
				}
				else {
					dustin.style.display = "block"
				}
				break;
			default:
				break;
		}
	// Enter key clicked, check if an inputbox is active and click submit for that box
	} else if (event.key == 'Enter') {
		if (document.activeElement == iterationInputBox) {
			iterationSubmit.click();
		} else if (document.activeElement == ruleInputBox) {
			ruleSubmit.click();
		} else if (document.activeElement == latticeSizeBox) {
			latticeSizeSubmit.click();
		}
		else {
			iterationSubmit.click();
			ruleSubmit.click();
			latticeSizeSubmit.click();
		}
	}
});

// function updateLatticeSize() {
// 	alterLatSize(setCellNum(latSize)); //updates latSize to no latSize
	
// 	//Sets cells to maximize usage of the canvas
// 	alterSize(canvas.width / latSize);
// 	//Cells should have a maximum size of 45
// 	if (size > 45){
// 		alterSize(45);
// 	}
	
// 	clear(latticeArray, canvas);
// }

// Updates the number of cells in a lattice and resizes cells to coorespond with new size
function updateLatticeSize(canvas) {
	let newCellNum = parseInt(latticeSizeBox.value);
	
	if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
		alterLatSize(newCellNum);
		makeLog("Lattice Size Set to " + newCellNum, logCanvas, messageQueue)
	}
	else {
		makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
	}
	
	let size = canvas.width / latSize[0];

	//Cells should have a maximum size of 45 :: This Caps cell size to 45
	if (size > 45) {
		size = 45; 
	}
	
	alterSize(size);
	alterInf(inf[0], false)
	
	clear(latticeArray); //emptys out canvas and redraws
}

//generates the tick box in its proper location
function makeTickBox(event) {
	if (tickerToggle == 1) {
		let [mouseX, mouseY] = getMouseLocation(event); //Gets the mouse Location
		
		let firstCell = latticeArray[0][0];

		tctx.clearRect(0,0, tickCanvas.width, tickCanvas.height);

		let lineNumber = Math.floor(mouseY / firstCell.getHeight()); //calculates what line your on
		let colNumber = Math.floor((mouseX - firstCell.getXLoc()) / firstCell.getWidth());

		let insideBox = true;
		
		if(colNumber < 0)
		{insideBox = false;}

		if(colNumber > latticeArray[0].length - 1)
		{insideBox = false}

		if(lineNumber > latticeArray.length - 1)
		{insideBox = false;}

		if(lineNumber < 0)
		{insideBox = false;}

		//drawLattice(latticeArray);
		if(insideBox)
		{
			let tickNum = (lineNumber.toString() + " : " + colNumber.toString())

			let textSize = tctx.measureText(tickNum).width;

			if(textSize < 30)
			{
				textSize = 30
			}

			tctx.fillStyle = "grey";
			tctx.fillRect(mouseX + 3, mouseY - 12, textSize + 3, 15); //Draws the Tick Box square

			//Sets text specifications
			tctx.font = "13px Arial";
			tctx.fillStyle = "black";

			tctx.fillText(tickNum, mouseX + 4, mouseY) //Puts the text in place
		}
	}
}

// Set the delay until generating next lattice when running
function setDelay(newDelay) {
	iterationTime = newDelay;
}

//repeatly iterates while run is true
function continouslyIterate(iterationTime) {
	//Checks if Run is activate
	if (run) {
		setTimeout(function(){ // puts a wait before iterating again
			if (run) {
				iterate(currentIteration, 1); //iterates the number of lattices
			}
			continouslyIterate(iterationTime); // allows it to coninously run by calling it again
		}, iterationTime);
	}
	else {
		startStopToggle(currentIteration);
	}
}

function setRule() {
	let newRule = parseInt(ruleInputBox.value); //Turns input in rule input box into a number
	run = 0; //Tells continous to not run
	//Checks if integer was a real integer and if its in the required range of the function
	if (!isNaN(newRule) && newRule >= 0 && newRule <= 255) {
		alterRuleNum(newRule);
		alterRule(ruleNumToRule(newRule));
		makeLog("Rule Set to " + newRule, logCanvas, messageQueue);

		//Removing buffers if they existed
		let newCellNum = (latSize[0] - (2 * latSize[1]));
		if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
			alterLatSize(newCellNum);
		}
		else {
			makeError("Invalid Rule Number: " + latticeSizeBox.value, logCanvas, messageQueue)
		}
		//Changing size of cells fo accomodate for removed buffers.
		let size = canvas.width / latSize[0];
		//Cells should have a maximum size of 45 :: This Caps cell size to 45
		if (size > 45) {
			size = 45; 
		}
		alterSize(size);
		//Alter the infinite array to keep the Infinite setting as is but remove buffers.
		alterInf(inf[0], false);
		clear(latticeArray, true);
	}
	else {
		makeError("Invalid Rule Number: " + ruleInputBox.value, logCanvas, messageQueue);
	}
}

//Sets new number of cells in a lattice
/*function setCellNum(latSize) {
	let newCellNum = parseInt(latticeSizeBox.value); //Turns Input box input into a number
	if(!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) //Tests if input was truly an integer and then makes sure it was in the range of 1 and 1000 to make sure not too big
	{
		latSize = newCellNum;
	} //updates the new cell number
	else
	{
	} //outputs the error to console currently

	return latSize; //returns the new lattice Size
}*/

//sets Number of Lattice arrays to have
function setLatticeSize() {
	let newValue = parseInt(iterationInputBox.value); //Turns the iteration input to an integerpopTime
	if (!isNaN(newValue) && newValue >= 0 && newValue <= 10000) {

		//Remove buffers if they existed.
		let newCellNum = (latSize[0] - (2 * latSize[1]));
		if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
			alterLatSize(newCellNum);
		}
		else {
			makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
		}
		//Alter cell size to accomodate for removed buffers
		let size = canvas.width / latSize[0];
		//Cells should have a maximum size of 45 :: This Caps cell size to 45
		if (size > 45) {
			size = 45; 
		}
		alterSize(size);
		
		//Get rid of existing buffers but also change buffer size for when they are re-added.
		alterInf(inf[0], false, newValue);
		clear(latticeArray, true);
		addIterations = newValue;//updates the number of iterations
		makeLog("Iterations Set to " + newValue, logCanvas, messageQueue);
	}
	else {
		makeError("Invalid Iteration Size: " + iterationInputBox.value, logCanvas, messageQueue);
	}
	return addIterations;
}

// Gets rid of all arays except the first and sets all cells to dead (white) unless specified to keep initial lattice
function clear(latticeArray, keepInit = false) {
	totalDelta = 0;
	canvas.height = 400;
	alterNumOfIterations(1);
	alterCurrentIteration(1);
	let clearedLattice = new Array (new Array);
	alterNextLattice(new Array);
	let StartX = (canvas.width / 2) - (latSize[0] * size / 2)
	let neoLatticeArray = latticeArray;
	while (neoLatticeArray.length > 1) {
		neoLatticeArray.pop();
	}
	for (let i = 0; i < latSize[0]; i++) {
		clearedLattice[0][i] = (new cell (size, size, StartX + i * size, 0, 0));
		clearedLattice[0][i].setAliveColor(aliveColorSel.value)
		clearedLattice[0][i].setDeadColor(deadColorSel.value)
		clearedLattice[0][i].setAliveBorder(aliveBorderSel.value)
		clearedLattice[0][i].setDeadBorder(deadBorderSel.value)
	}

	let latPlusBufferArr = new Array()
	//If the clear is keeping the initial timesteps' cell states, push the color onto a mock array to save cell states.
	if (keepInit) {
		clearResetButton.innerHTML = "Clear";
		let bufferNum = (neoLatticeArray[0].length - clearedLattice[0].slice(0).length) / 2;
		for (let i = bufferNum; i < (latSize[0] + bufferNum); i++) {
			latPlusBufferArr.push(latticeArray[0][i].getColor())
		}
	}

	neoLatticeArray[0] = clearedLattice[0].slice(0);
	//If the clear is keeping the initial timesteps, flip the cell states according to the colors in the mock array.
	if (keepInit) {
		for (let i = 0 ; i < latticeArray[0].length; i++) {
			if (latPlusBufferArr[i] == 1) {
				neoLatticeArray[0][i].flipColor();
			}
			(neoLatticeArray[0][i]).drawCell(ctx);
		}
	}
	alterLatticeArray(neoLatticeArray);
	alterCurrentLattice(latticeArray[0]);
	updateLattice();
}

//Takes Coordinates of mouseClick and calculates properly where it is in relation to the canvas
function setCells(latticeArray, mouseX, mouseY) {
	let neoLatticeArray = latticeArray;
	if (latticeArray.length == 1) {
		for (let i = 0 ; i < latticeArray[0].length; i++) {
			if (latticeArray[0][i].insideCell(mouseX, mouseY)) {
				if(!mouseDown)
					{
						neoLatticeArray[0][i].flipColor();
					}
					else
					{
						neoLatticeArray[0][i].setColor(1);
					}
			}
			(neoLatticeArray[0][i]).drawCell(ctx);
			alterLatticeArray(neoLatticeArray);
		}
	}
}

function getMouseLocation(event) {
	//Gets the posistion of the edges of canvas
	let bounds = canvas.getBoundingClientRect();

	// Calculates Height and Width cooresponding to CSS setting of Canvas
	let cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue('width'));
	let cssHeight = parseFloat(getComputedStyle(canvas).getPropertyValue('height'));
	
	//Calculates the width of the thin border that wraps around the canvas allowing for pixel perfect clicking
	let borderWidth = parseInt(getComputedStyle(canvas).borderLeftWidth);
	
	//Gets the amount of padding which isnt generally considered in the mouse click
	let paddingLeft = parseFloat(getComputedStyle(canvas).paddingLeft);
	let paddingTop = parseFloat(getComputedStyle(canvas).paddingTop);
	
	//calculates mouse X and mouse Y of the Mouse during click and then distorts and move the location to where it needs cooresponding
	let mouseX = (event.clientX - bounds.left - paddingLeft - borderWidth) * canvas.width / cssWidth;
	let mouseY = (event.clientY - bounds.top - paddingTop - borderWidth) * canvas.height / cssHeight;

	return [mouseX, mouseY];
}

function iterate(currentIteration, newIterations) {
	
	setTimeout(function(){

		if (numOfIterations + newIterations > addIterations) {
			alterNumOfIterations(addIterations + 1);
			run = 0;
		}
		else {
			alterNumOfIterations(numOfIterations + newIterations);
		}
		let neoLatticeArray = latticeArray;
		while(neoLatticeArray.length > numOfIterations) {
			neoLatticeArray.pop();
		}

		alterLatticeArray(neoLatticeArray);
		updateLattice();
		return currentIteration;
	}, 5)
}

function stopIterating() {
	if (run) {
		run = 0;
	}
}

// Handle when bound toggle buton is activated: Animate toggle button, display checkboxes, select first checkbox
export function toggleCheckbox() {
	// Set the first checkbox (not second checkbox) to be checked upon toggle button activation
  checkboxes[0].checked = true;
	checkboxes[1].checked = false;
	// If checkboxes are currently hidden (toggle bar was not active) display the checkboxes and animate toggle button
	if (periodicCheckBox.style.display == 'none'|| periodicCheckBox.style.display == '') {
		//Remove buffers if they exist.
		let newCellNum = (latSize[0] - (2 * latSize[1]));
		if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
			alterLatSize(newCellNum);
		}
		else {
			makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
		}
		//Alter cell size to accomodate removed buffers
		let size = canvas.width / latSize[0];
		//Cells should have a maximum size of 45 :: This Caps cell size to 45
		if (size > 45) {
			size = 45; 
		}
		alterSize(size);
		alterInf(false)
		makeLog("Finite Condition Set", logCanvas, messageQueue);
		clear(latticeArray, true);
		periodicCheckBox.style.display = 'block';
		nullCheckBox.style.display = 'block';
		boundToggle.style.transform = 'translateX(25px)'; // Move the toggle button to the right
	// If checkboxes are currently not hidden (toggle bar was active) hide the checkboxes and animate toggle button back
    } else {
			//Remove buffers if they exist.
			let newCellNum = (latSize[0] - (2 * latSize[1]));
			if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
				alterLatSize(newCellNum);
			}
			else {
				makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
			}
			//Alter cell size to accomodate removed buffers
			let size = canvas.width / latSize[0];
			//Cells should have a maximum size of 45 :: This Caps cell size to 45
			if (size > 45) {
				size = 45; 
			}
			alterSize(size);
			//Settings changed to Infinite.
			alterInf(true)
			makeLog("Infinite Condition Set", logCanvas, messageQueue);
			clear(latticeArray, true);
			periodicCheckBox.style.display = 'none';
			nullCheckBox.style.display = 'none';
			boundToggle.style.transform = 'translateX(0)'; // Move the toggle button back to the left
    }
}

/* Initialize toggle buttons to x position 0px to enable x translation in functions */
iterationToggle.style.transform = "translateX(0px)";
borderToggle.style.transform = "translateX(0px)";

// Handle when iteration toggle button is activated
function iterationToggleOption() {
	// Toggle the position of the button
	if (iterationToggle.style.transform == "translateX(0px)") {
		iterationToggle.style.transform = "translateX(25px)";
		makeLog("Iteration Box: On", logCanvas, messageQueue);
	} 
	else {
		iterationToggle.style.transform = "translateX(0px)";
		makeLog("Iteration Box: Off", logCanvas, messageQueue);
	}
}

// Handle when border toggle button is activated
function borderToggleOption() {
	// Toggle the position of the button
	if (borderToggle.style.transform === "translateX(0px)") {
		borderToggle.style.transform = "translateX(25px)";
		makeLog("Cell Border: On", logCanvas, messageQueue);
	} 
	else {
		borderToggle.style.transform = "translateX(0px)";
		makeLog("Cell Border: Off", logCanvas, messageQueue);
	}
}

// function outputError(text) {
// 	errorContext.font = "12px Arial";
// 	errorContext.fillStyle = "red";

// 	errorContext.fillText(text, 5, 25)
// 		setTimeout(function(){

// 	}, 750);
// }

// Handle switching GUI for Start/Stop Button upon click
function startStopToggle() {
	// If the button is in start state, change it to stop state and vice versa
	if (startStopButton.classList.contains("start_button") && run) {
    	startStopButton.innerHTML = "Stop";
    	startStopButton.classList.remove("start_button");
    	startStopButton.classList.add("stop_button");
		makeLog("Starting Iterations", logCanvas, messageQueue);
		//Add buffers.
		alterInf(inf[0], true)
  	} 
  	else if (startStopButton.classList.contains("stop_button") && !run) {
    	startStopButton.innerHTML = "Start";
    	startStopButton.classList.remove("stop_button");
    	startStopButton.classList.add("start_button");
		makeLog("Stopping Iterations", logCanvas, messageQueue);
  	}
}
// Handle switching GUI for Start/Stop Button upon click
function clearResetToggle() {
  	if (clearResetButton.innerHTML.includes("Reset")) {
    	clearResetButton.innerHTML = "Clear";
		makeLog("Resetting Canvas", logCanvas, messageQueue);
  	}
	else {
		makeLog("Canvas Cleared", logCanvas, messageQueue);
	}
}

// Set boundary condition and ensure one and only one checkbox can be checked at a time upon checkbox click
checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
		stopIterating();  // Stops the iteration before changing the finite boundary condition
		// Box is set to be checked upon change
        if (this.checked) {
            checkboxes.forEach(function(otherCheckbox) {
				// If one checkbox is already checked, uncheck the other checkbox
				if (otherCheckbox != checkbox) {
                    otherCheckbox.checked = false;
                }
            });
			//If the first checkbox is selected, set the boundaryCon variable to 1 representing Periodic
			//boundary condition. Otherwise set boundaryCon to 0 representing Null.
			if (checkboxes[0].checked) {
				alterBoundaryCon(1);
				makeLog("Periodic Boundary Set", logCanvas, messageQueue);
				//Remove buffers if they exist.
				let newCellNum = (latSize[0] - (2 * latSize[1]));
				if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
					alterLatSize(newCellNum);
				}
				else {
					makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
				}
				//Alter size to accomodate removed buffers.
				let size = canvas.width / latSize[0];
				//Cells should have a maximum size of 45 :: This Caps cell size to 45
				if (size > 45) {
					size = 45; 
				}
				alterSize(size);

				clear(latticeArray, true);
			}
			else {
				alterBoundaryCon(0);
				makeLog("Null Boundary Set", logCanvas, messageQueue);
				//Remove buffers if they exist.
				let newCellNum = (latSize[0] - (2 * latSize[1]));
				if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
					alterLatSize(newCellNum);
				}
				else {
					makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
				}
				//Alter size to accomodate removed buffers.
				let size = canvas.width / latSize[0];
				//Cells should have a maximum size of 45 :: This Caps cell size to 45
				if (size > 45) {
					size = 45; 
				}
				alterSize(size);

				clear(latticeArray, true);
			}
        }
		// Box is set to be unchecked: Don't allow ... one box must be checked at all times
		else {
			this.checked = true;
		}
    });
});

// Adds an error to message log
function makeError(errorMessage, logCanvas, messageQueue) {
	let tempLog = new logMessage(errorMessage, 'red', logCanvas);
	messageQueue.unshift(tempLog);
	displayLog(messageQueue, logCanvas);
	//setPopLogTimer(messageQueue, logCanvas)
}

// Adds an log to message log
function makeLog(errorMessage, logCanvas, messageQueue) {
	let tempLog = new logMessage(errorMessage, 'black', logCanvas);
	messageQueue.unshift(tempLog);
	displayLog(messageQueue, logCanvas);
	//setPopLogTimer(messageQueue, logCanvas)
}

//outputs correct elements of the message log
function displayLog(messageQueue, logCanvas) {
	let dummyMessage = new logMessage("God Bless Ronald Reagan", 'red', logCanvas); //Message used to just clear canvas
	dummyMessage.clearCanvas();
	for (let i = 0; i < messageQueue.length; i++) {
		messageQueue[i].displayMessage(i);
	}
}

/*function setPopLogTimer(messageQueue, logCanvas) {
	// puts a wait before iterating again
	setTimeout(function() { 
		messageQueue.pop();
		displayLog(messageQueue, logCanvas);
	}, popTime);
}*/

// Capture canvas as a PDF upon clickling the 'Download PDF" button
downloadPDFButton.addEventListener('click', function() {
	let imgData = canvas.toDataURL("image/png");  // Get the image data from the canvas
	let pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);  // Create a new PDF document with the canvas dimensions as page size

	// Calculate the aspect ratio of the canvas content
	let canvasAspectRatio = canvas.width / canvas.height;

	// Calculate the aspect ratio of the PDF page
	let pdfWidth = pdf.internal.pageSize.getWidth();
	let pdfHeight = pdf.internal.pageSize.getHeight();
	let pdfAspectRatio = pdfWidth / pdfHeight;

	// Default image dimensions with assumption that the canvas is taller than PDF page
	let imgWidth = pdfHeight * canvasAspectRatio;
	let imgHeight = pdfHeight;

	// Change size of the image in the PDF using the aspect ratios if canvas is wider than PDF page
	if (canvasAspectRatio > pdfAspectRatio) {
		imgWidth = pdfWidth;
		imgHeight = pdfWidth / canvasAspectRatio;
	} 
 
	// Add the image to the PDF document and center it on the page
	let offsetX = (pdfWidth - imgWidth) / 2;
	let offsetY = (pdfHeight - imgHeight) / 2;
	pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight);

	pdf.save("ParallelWNN" + "I" + numOfIterations + "R" + ruleNum + "L" + latSize[0] + ".pdf");  // Save the PDF
	makeLog("Downloaded Canvas", logCanvas, messageQueue);
});

// Capture canvas as a PNG upon clickling the 'Download PNG" button
downloadPNGButton.addEventListener('click', function() {
    let image = canvas.toDataURL();  // Get the image data from the canvas. Default is png
    let link = document.createElement('a');  // Create a new anchor element to create a downloadable link
    link.href = image;  // Set the href attribute of the anchor element to the data URL of the image
    link.download = "ParallelWNN" + "I" + numOfIterations + "R" + ruleNum + "L" + latSize[0] + ".png";  // Set the filename
	link.click();  // Trigger a click on the anchor element to prompt the browser to download the image
	makeLog("Downloaded Canvas", logCanvas, messageQueue);
});

/* Handle open and closing of about window */
// About button is clicked, display about window
aboutButton.addEventListener("click", function() {
	aboutWindow.style.display = "block";
});

// Close if x (close) button in top right of the window is clicked
closeAbout.addEventListener("click", function() {
	aboutWindow.style.display = "none";
});

// Close if any space outside of the about window is clicked
window.addEventListener("click", function(event) {
	// Check if about window is mouse target (outside text frame was clicked) and, if so, hide about window
	if (event.target == aboutWindow) {
		aboutWindow.style.display = "none";
	}
});

/* Handle open and closing of options window */
// Options button is clicked, display options window
optionsButton.addEventListener("click", function() {
	// If options window is displayed, hide it; if hidden, display it
	if (optionsWindow.style.display == "block") {
		optionsWindow.style.display = "none";
	}
	else {
		optionsWindow.style.display = "block";
	}
});

// Close if x (close) button in top right of the window is clicked
closeOptions.addEventListener("click", function() {
	optionsWindow.style.display = "none";
});

iterationSpeedValue.innerHTML = 750;  // Sets displayed default iteration speed value

// Update the current iteration speed slider value upon drag
iterationSpeedSlider.oninput = function() {
	iterationSpeedValue.innerHTML = this.value;
	setDelay(this.value);
};

outputIteration.innerHTML = "Iteration Count: 0"; // Display (initial) iteration count to HTML page


function debounce(callback) {
    let timeoutId;

    return function(event) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(event); // Directly pass the event object to the callback function
        }, 25);
    };
}


//This is a debounce designed for slide since temp array needs to update before next cell can be clicked
function shortDebounce(callback) {
    let timeoutId;

    return function(event) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(event); // Directly pass the event object to the callback function
        }, 5);
    };
}
