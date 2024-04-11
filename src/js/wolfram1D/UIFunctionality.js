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
import {ruleNumToRule} from './generateLattice.js';
import {cell} from './cellClass.js';
import {logMessage} from './logClass.js';

/*
Hotkeys for zoom in/out
change cell label when only one row
Reset Perspective Button
*/


/* Global constants connecting HTML buttons to JS by ID to impliment functionality */   
const iterationInputBox = document.getElementById("iterationInputBox");
const ruleInputBox = document.getElementById("ruleInputBox");
const latticeSizeBox = document.getElementById("latticeSizeBox");

const iterationSubmit = document.getElementById("iterationSubmit");
const ruleSubmit = document.getElementById("ruleSubmit");
const latticeSizeSubmit = document.getElementById("latticeSizeSubmit");

const startStopButton = document.getElementById("startStopButton");
const iterateButton = document.getElementById("iterateButton");
const clearButton = document.getElementById("clearButton");
const downloadPDFButton = document.getElementById("downloadPDFButton");
const downloadPNGButton = document.getElementById("downloadPNGButton");
const aboutButton = document.getElementById("aboutButton");
const optionsButton = document.getElementById("optionsButton");
const latticeFillButton = document.getElementById("latticeFillButton");
const randomFillButton = document.getElementById("randomFillButton");
const cellColorButton = document.getElementById("cellColorButton");

const periodicCheckBox = document.getElementById("periodicCheckBox");
const nullCheckBox = document.getElementById("nullCheckBox");

const boundToggleButton = document.getElementById("boundToggle");
const iterationToggleButton = document.getElementById("iterationToggle");
const borderToggleButton = document.getElementById("borderToggle");

const aboutWindow = document.getElementById("aboutContainer");
const optionsWindow = document.getElementById("optionsContainer");

const iterationSpeedSlider = document.getElementById("iterationSpeedSlider");
const iterationSpeedValue = document.getElementById("iterationSpeedValue");

/* Global constants connecting HTML/CSS features to JS by class name to impliment functionality */
const checkboxes = document.querySelectorAll(".checkbox_select");
const boundToggle = document.querySelector("#boundToggle .toggle_button");
const iterationToggle = document.querySelector("#iterationToggle .toggle_button");
const borderToggle = document.querySelector("#borderToggle .toggle_button");
const closeAbout = document.querySelector("#aboutContent .close");
const closeOptions = document.querySelector("#optionsContent .close");

//This is the various document stuff for selecting color
const deadColorSel = document.getElementById("deadCell");
const aliveColorSel = document.getElementById("aliveCell");
const deadBorderSel = document.getElementById("deadBorder");
const aliveBorderSel = document.getElementById("aliveBorder");

/* Global variables for iteration */
//const popTime = 750; //Time Log messages stay on the screen
let addIterations = 0; // Defaults iterations
let Run = 0; // Defaults to not keep running
let iterationTime = 750; //Time to wait before iterating again
let tickerToggle = 0; //Ticker toggle decides if row ticker will be on defaults to on

let scale = 1;
let totalDelta = 0;
const maxScale = 5; // Maximum scale
const minScale = 0.5; // Minimum scale

let messageQueue = []

function alterCell(mouseX, cell, scale, mouseY = 0) {
	let corner0X = cell.getXLoc();
	let corner0Y = cell.getYLoc();
	let corner1X = cell.getXLoc() + cell.getWidth();
	let corner2Y = cell.getYLoc() + cell.getHeight();

	let deltaCorner0X = corner0X - mouseX;
	let deltaCorner0Y = corner0Y - mouseY;
	let deltaCorner1X = corner1X - mouseX;
	let deltaCorner2Y = corner2Y - mouseY;

	let newCell0X = mouseX + (deltaCorner0X * scale);
	let newCell0Y = mouseY + (deltaCorner0Y * scale);
	let newCell1X = mouseX + (deltaCorner1X * scale);
	let newCell2Y = mouseY + (deltaCorner2Y * scale);

	let newCellWidth = newCell1X - newCell0X;
	let newCellHeight = newCell2Y - newCell0Y;

	cell.setHeight(newCellHeight);
	cell.setWidth(newCellWidth);
	cell.setXLoc(newCell0X);
	cell.setYLoc(newCell0Y);
}

deadColorSel.addEventListener('input', function(){
	console.log(latticeArray[0][0])
	for (let i = 0; i < latticeArray.length; i++)
	{
		for (let j = 0; j < latticeArray[0].length; j++)
		{
			(latticeArray[i][j]).setDeadColor(deadColorSel.value);
		}
	}
	drawLattice(latticeArray);
})

aliveColorSel.addEventListener('input', function(){
	console.log(latticeArray[0][0])
	for (let i = 0; i < latticeArray.length; i++)
	{
		for (let j = 0; j < latticeArray[0].length; j++)
		{
			(latticeArray[i][j]).setAliveColor(aliveColorSel.value);
		}
	}
	drawLattice(latticeArray);
})

deadBorderSel.addEventListener('input', function(){
	console.log(latticeArray[0][0])
	for (let i = 0; i < latticeArray.length; i++)
	{
		for (let j = 0; j < latticeArray[0].length; j++)
		{
			(latticeArray[i][j]).setDeadBorder(deadColorSel.value);
		}
	}
	drawLattice(latticeArray);
})


aliveBorderSel.addEventListener('input', function(){
	console.log(latticeArray[0][0])
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
	if (latticeArray.length == 1) {
		let mouseX, mouseY;
		[mouseX, mouseY] = getMouseLocation(event); // Calculates Proper location of zoom center
		let delta = event.deltaY;
		if (delta > 0 && totalDelta > 0) {
			scale = 0.9
		}
		else if (delta < 0) {
			scale = 1.1
		}
		totalDelta -= delta;
		if (totalDelta <= 0) {
			totalDelta = 0;
			clear(latticeArray, true);
		}
		else {
			scale = Math.min(maxScale, Math.max(scale, minScale));
			for (let i = 0; i < latticeArray.length; i++) {
				for (let f = 0; f < latticeArray[i].length; f++) {
					alterCell(mouseX, latticeArray[i][f], scale);
				}
			}
			drawLattice(latticeArray);
		}
		event.preventDefault();
	}
}, false)

ruleSubmit.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}
	setRule(rule);
})
/*
toggleBar.addEventListener("click", function() {
	toggleCheckbox();
});
*/

latticeFillButton.addEventListener("click", function(){
	for (let i = 0; i  < latticeArray[0].length; i++) {
		latticeArray[0][i].setColor(1);
	}
	drawLattice(latticeArray);
})

randomFillButton.addEventListener("click", function(){
	for (let i = 0; i  < latticeArray[0].length; i++) {
		latticeArray[0][i].setColor(Math.floor(Math.random() * 2));
	}
	drawLattice(latticeArray);
	console.log("WHATS UP");
})

iterateButton.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}
	alterInf(inf[0], true)
	makeLog("Iterated to " + addIterations, logCanvas, messageQueue);
	if (latticeArray.length == 1) {
		let bufferArr = new Array()
		let latPlusBufferArr = new Array()
		for (let i = 0; i < latSize[0]; i++) {
			latPlusBufferArr.push(latticeArray[0][i].getColor())
		}
		for (let i = 0; i < latSize[1]; i++) {
			bufferArr.push(0)
		}
		latPlusBufferArr = bufferArr.concat(latPlusBufferArr.concat(bufferArr));
		let newCellNum = (latSize[0] + (2 * latSize[1]))
		if (!isNaN(newCellNum) && newCellNum >= 1) {
			alterLatSize(newCellNum);
		}
		let size = canvas.width / latSize[0];
		//Cells should have a maximum size of 45 :: This Caps cell size to 45
		if (size > 45) {
			size = 45; 
		}
		alterSize(size);
		clear(latticeArray);
		let neoLatticeArray = latticeArray;
		for (let i = 0 ; i < latticeArray[0].length; i++) {
			if (latPlusBufferArr[i] == 1) {
				neoLatticeArray[0][i].flipColor();
			}
			(neoLatticeArray[0][i]).drawCell(ctx);
			alterLatticeArray(neoLatticeArray);
		}
	}
	iterate(currentIteration, addIterations);
});

clearButton.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}

	let newCellNum = (latSize[0] - (2 * latSize[1]));
	if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
		alterLatSize(newCellNum);
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
	clear(latticeArray);
	makeLog("Cleared Lattice ", logCanvas, messageQueue);
	alterInf(inf[0], false);}
);
/* Connect UI Functionality to a prebuilt function */
boundToggleButton.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}
	toggleCheckbox();
});

iterationToggleButton.addEventListener("click", function() {
	tickerToggle = !(tickerToggle);
	tctx.clearRect(0,0, tickCanvas.width, tickCanvas.height);
	iterationToggleOption();
});

borderToggleButton.addEventListener("click", function() {
	alterBorder(!getBorder());
	borderToggleOption();
});

iterationSubmit.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}
	setLatticeSize();
});
//Sets the number of cells in a lattice
latticeSizeSubmit.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}
	updateLatticeSize(canvas);
});

startStopButton.addEventListener("click", function() {
	startStopToggle();
	if (Run != 1) {
		Run = 1;
		makeLog("Starting Iterations", logCanvas, messageQueue);
		
		if (latticeArray.length == 1) {
			let bufferArr = new Array()
			let latPlusBufferArr = new Array()
			for (let i = 0; i < latSize[0]; i++) {
				latPlusBufferArr.push(latticeArray[0][i].getColor())
			}
			for (let i = 0; i < latSize[1]; i++) {
				bufferArr.push(0)
			}
			latPlusBufferArr = bufferArr.concat(latPlusBufferArr.concat(bufferArr));
			let newCellNum = (latSize[0] + (2 * latSize[1]))
			if (!isNaN(newCellNum) && newCellNum >= 1) {
				alterLatSize(newCellNum);
			}
			let size = canvas.width / latSize[0];
			//Cells should have a maximum size of 45 :: This Caps cell size to 45
			if (size > 45) {
				size = 45; 
			}
			alterSize(size);
			clear(latticeArray);
			let neoLatticeArray = latticeArray;
			for (let i = 0 ; i < latticeArray[0].length; i++) {
				if (latPlusBufferArr[i] == 1) {
					neoLatticeArray[0][i].flipColor();
				}
				(neoLatticeArray[0][i]).drawCell(ctx);
				alterLatticeArray(neoLatticeArray);
			}
		}
		
		continouslyIterate(iterationTime);
	}
	else {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
		startStopToggle();
	}
});

//Continously Checks where the mouse is on the Canvas too allow tick box to next to it
tickCanvas.addEventListener("mousemove", function(event) {makeTickBox(event, tctx)});

// Runs program to flips squares if Clicked
tickCanvas.addEventListener('click', function(event) {
	let mouseX, mouseY;
	[mouseX, mouseY] = getMouseLocation(event); // Calculates Proper location of mouse click for usage in setCells
	setCells(latticeArray, mouseX, mouseY);	// Flips the cell if it was clicked on
});

// Recognize a keydown event, as in keyboard key press, then check and hnadle key presses. Used for keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Check if ALT key is pressed, then check if another key is pressed and complete corresponding action
    if (event.altKey) {
		switch (true) {
			case (event.key == 'Enter'):
				iterationSubmit.click();
				ruleSubmit.click();
				latticeSizeSubmit.click();
				break;
			case (event.key == 's'):
				startStopButton.click();
				break;
			case (event.key == 'i'):
				iterateButton.click();
				break;
			case (event.key == 'c'):
				clearButton.click();
				break;
			case (event.key == 'o'):
				optionsButton.click();
				break;
			case (event.key == 'a'):
				aboutButton.click();
				break;
			case (event.key == 'd'):
				downloadPDFButton.click();
				break;
			case (event.key == 'p'):
				downloadPNGButton.click();
				break;
			case (event.key == 'f'):
				latticeFillButton.click();
				break;
			case (event.key == 'r'):
				randomFillButton.click();
				break;
			case (event.key == 'q'):
				cellColorButton.click();
				break;
			case (event.key == 'b'):
				boundToggleButton.click();
				break;
			case (event.key == 'v'):
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
		makeLog("Lattice Size Set to: " + newCellNum, logCanvas, messageQueue)
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

		//console.log(colNumber);
		//drawLattice(latticeArray);
		if(insideBox)
		{
			let tickNum = (lineNumber.toString() + " : " + colNumber.toString())

			let textSize = tctx.measureText(tickNum).width;

			if(textSize < 30)
			{
				textSize = 30
			}

			console.log(textSize);

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
	if (Run) {
		setTimeout(function(){ // puts a wait before iterating again
			if (Run) {
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
	Run = 0; //Tells continous to not run
	//Checks if integer was a real integer and if its in the required range of the function
	if (!isNaN(newRule) && newRule >= 0 && newRule <= 255) {
		alterRuleNum(newRule);
		alterRule(ruleNumToRule(newRule));
		makeLog("Rule Set to: " + newRule, logCanvas, messageQueue);

		let newCellNum = (latSize[0] - (2 * latSize[1]));
		if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
			alterLatSize(newCellNum);
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

		alterInf(inf[0], false);
		clear(latticeArray, true);
	}
	else {
		makeError("Invalid Lattice Size: " + ruleInputBox.value, logCanvas, messageQueue);
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
	if (!isNaN(newValue) && newValue >= 0 && newValue <= 1000) {

		let newCellNum = (latSize[0] - (2 * latSize[1]));
		if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
			alterLatSize(newCellNum);
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
		
		alterInf(inf[0], false, newValue);
		clear(latticeArray, true);
		addIterations = newValue;//updates the number of iterations
		makeLog("Set Iterations to: " + newValue, logCanvas, messageQueue);
	}
	else
	{
		makeError("Invalid Lattice Size: " + iterationInputBox.value, logCanvas, messageQueue);
	}
	return addIterations;
}

//gets rid of all arays except the first and sets all cells to dead (white)
function clear(latticeArray, keepInit = false) {
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
	}

	let latPlusBufferArr = new Array()
	if (keepInit) {
		let bufferNum = (neoLatticeArray[0].length - clearedLattice[0].slice(0).length) / 2;
		for (let i = bufferNum; i < (latSize[0] + bufferNum); i++) {
			latPlusBufferArr.push(latticeArray[0][i].getColor())
		}
	}

	neoLatticeArray[0] = clearedLattice[0].slice(0);
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
				neoLatticeArray[0][i].flipColor();
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
	if (numOfIterations + newIterations > addIterations) {
		alterNumOfIterations(addIterations + 1);
		Run = 0;
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
}

// Handle when bound toggle buton is activated: Animate toggle button, display checkboxes, select first checkbox
export function toggleCheckbox() {
	// Set the first checkbox (not second checkbox) to be checked upon toggle button activation
  checkboxes[0].checked = true;
	checkboxes[1].checked = false;
	// If checkboxes are currently hidden (toggle bar was not active) display the checkboxes and animate toggle button
	if (periodicCheckBox.style.display == 'none'|| periodicCheckBox.style.display == '') {

		let newCellNum = (latSize[0] - (2 * latSize[1]));
		if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
			alterLatSize(newCellNum);
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

		alterInf(false)
		makeLog("Setting to Finite", logCanvas, messageQueue);
		clear(latticeArray, true);
		periodicCheckBox.style.display = 'block';
		nullCheckBox.style.display = 'block';
		boundToggle.style.transform = 'translateX(25px)'; // Move the toggle button to the right
	// If checkboxes are currently not hidden (toggle bar was active) hide the checkboxes and animate toggle button back
    } else {

			let newCellNum = (latSize[0] - (2 * latSize[1]));
			if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
				alterLatSize(newCellNum);
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

			alterInf(true)
			makeLog("Setting to Infinite", logCanvas, messageQueue);
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
	} 
	else {
		iterationToggle.style.transform = "translateX(0px)";
	}
}

// Handle when border toggle button is activated
function borderToggleOption() {
	// Toggle the position of the button
	if (borderToggle.style.transform === "translateX(0px)") {
		borderToggle.style.transform = "translateX(25px)";
	} 
	else {
		borderToggle.style.transform = "translateX(0px)";
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
	if (startStopButton.classList.contains("start_button") && !Run) {
    	startStopButton.innerHTML = "Stop";
    	startStopButton.classList.remove("start_button");
    	startStopButton.classList.add("stop_button");
			alterInf(inf[0], true)
  	} 
  	else {
    	startStopButton.innerHTML = "Start";
    	startStopButton.classList.remove("stop_button");
    	startStopButton.classList.add("start_button");
  	}
}

// Ensure one and only one checkbox can be checked at a time upon checkbox click
checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
			if (Run == 1) {
				Run = 0;
				makeLog("Stopping Iterations", logCanvas, messageQueue);
			}
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
				makeLog("Setting to Periodic", logCanvas, messageQueue);

				let newCellNum = (latSize[0] - (2 * latSize[1]));
				if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
					alterLatSize(newCellNum);
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

				clear(latticeArray, true);
			}
			else {
				alterBoundaryCon(0);
				makeLog("Setting to Null", logCanvas, messageQueue);

				let newCellNum = (latSize[0] - (2 * latSize[1]));
				if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
					alterLatSize(newCellNum);
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
	let dummyMessage = new logMessage("God Bless Karl Marx", 'red', logCanvas); //Message used to just clear canvas
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

	pdf.save("Wolfram1DCanvas" + "I" + numOfIterations + "R" + ruleNum + "L" + latSize[0] + ".pdf");  // Save the PDF
	makeLog("Downloaded Lattice Array", logCanvas, messageQueue);
});

// Capture canvas as a PNG upon clickling the 'Download PNG" button
downloadPNGButton.addEventListener('click', function() {
    let image = canvas.toDataURL();  // Get the image data from the canvas. Default is png
    let link = document.createElement('a');  // Create a new anchor element to create a downloadable link
    link.href = image;  // Set the href attribute of the anchor element to the data URL of the image
    link.download = "Wolfram1DCanvas" + "I" + numOfIterations + "R" + ruleNum + "L" + latSize[0] + ".png";  // Set the filename
	link.click();  // Trigger a click on the anchor element to prompt the browser to download the image
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
	optionsWindow.style.display = "block";
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