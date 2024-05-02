/*
* UIFunctionality.js
* Authors: Kyle Tranfaglia, Timmy McKirgan, Dustin O'Brien
* This file handles all user interface Functionality. It is the bulk of the program and handles all button clicks,
  information inputs, mouse actions, lattice changes, cell changes, iterations, and updates/calculates information
  for simulation modifications and communicates it with utility files
* Last Updated: 04/18/24
*/
/* Import utility and variables from other JS files */
import {canvas, ctx, displayLattice} from "./displayLattice.js";
import {visLatticeArray, visBounds, latticeArray, iterate, createVis, createVisInit, bounds} from "./generateLattice.js";
import { borderContact, expandBorder } from "./generateLattice.js";

/* Global constants connecting HTML buttons to JS by ID to impliment functionality */   

/* Connect main buttons */
const startStopButton = document.getElementById("startStopButton");
const iterateButton = document.getElementById("iterateButton");
const clearResetButton = document.getElementById("clearResetButton");
const libraryButton = document.getElementById("libraryButton");
const aboutButton = document.getElementById("aboutButton");

/* Connect sliders */
const iterationSpeedSlider = document.getElementById("iterationSpeedSlider");
const iterationSpeedValue = document.getElementById("iterationSpeedValue");
const zoomSlider = document.getElementById("zoomSlider");
const zoomValue = document.getElementById("zoomValue");

const aboutWindow = document.getElementById("aboutContainer");  // Connect window for about
const closeAbout = document.querySelector("#aboutContent .close");  // Connect HTML/CSS close feature to JS for the about window
const libraryWindow = document.getElementById("libraryContainer");  // Connect window for library
const closeLibrary = document.querySelector("#libraryContent .close");  // Connect HTML/CSS close feature to JS for the library window

/* Global variables for iteration */
let run = 0; // Defaults to not keep running
let currentDelay = 750; // Time to wait before iterating again
let iterationCount = 0; // Tracks number of iterations
let scribble = false; //Keeps track of whether the mouse is being held down for scribbling on canvas
let mouseXScribble = new Array();
let mouseYScribble = new Array();

/* Handle button clicks for all primary toolbar buttons */

startStopButton.addEventListener("click", function() {
	clearResetToggle(true);
	startStopToggle();
	run = !run;
	if (run) {
		continouslyIterate();
	}
});

iterateButton.addEventListener("click", function() {
	clearResetToggle(true);
	iterate();
	iterationCount++;
	let currentBoundaryPush = borderContact();
	for (let i = 0; i < currentBoundaryPush.length; i++) {
		expandBorder(currentBoundaryPush[i], (bounds[0] / 2));
	}
	createVis();
	ctx.clearRect(0,0, canvas.width, canvas.height);
	displayLattice(visLatticeArray);
});

clearResetButton.addEventListener("click", function() {
	clear();
    clearResetToggle(false);
});

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
				clearButton.click();
				break;
			case (event.key == 'l'):
				libraryButton.click();
				break;
			case (event.key == 'a'):
				aboutButton.click();
				break;
			case (event.key == 'y'):
				iterationSpeedSlider.focus();
				break;
			case (event.key == 'z'):
				zoomSlider.focus();
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
		iterationSubmit.click();
	}
});

canvas.addEventListener("click", function(event) {
	let mouseX, mouseY;
	[mouseX, mouseY] = getMouseLocation(event);
	
	for (let i = 0; i < visLatticeArray.length; i++) {
		for (let j = 0; j < visLatticeArray[i].length; j++) {
			if (visLatticeArray[i][j].insideCell(mouseX, mouseY)) {
				visLatticeArray[i][j].flipColor();
				visLatticeArray[i][j].drawCell(ctx);
				latticeArray[i + visBounds[1]][j + visBounds[0]] = !latticeArray[i + visBounds[1]][j + visBounds[0]];
			}
		}
	}
});

canvas.addEventListener("mousemove", function(event) {
	if (scribble) {
		let mouseX, mouseY;
		[mouseX, mouseY] = getMouseLocation(event);
		for (let i = 0; i < visLatticeArray.length; i++) {
			for (let j = 0; j < visLatticeArray[i].length; j++) {
				if ((visLatticeArray[i][j].insideCell(mouseX, mouseY)) && (visLatticeArray[i][j].getColor() == 0)) {
					visLatticeArray[i][j].flipColor();
					visLatticeArray[i][j].drawCell(ctx);
					latticeArray[i + visBounds[1]][j + visBounds[0]] = !latticeArray[i + visBounds[1]][j + visBounds[0]];
				}
			}
		}
	}
});

canvas.addEventListener("mousedown", function() {
	setTimeout(function() {
		if (!scribble) {
			scribble = true;
		}
		console.log(scribble);
	}, 10);
});

canvas.addEventListener("mouseup", function() {
	setTimeout(function() {
		if (scribble) {
			scribble = false;
		}
		console.log(scribble);
	}, 10);
});
/*
canvas.addEventListener("mouseleave", function() {
	setTimeout(function() {
		if (scribble) {
			scribble = false;
		}
		console.log(scribble);
	}, 100);
});
*/

canvas.addEventListener('wheel', function(event) {
	let mouseX, mouseY;
	[mouseX, mouseY] = getMouseLocation(event); // Calculates Proper location of zoom center
	let delta = event.deltaY; //Get delta from mouse scroll.
	let change = false;
	//If delta and totalDelta are greater than 0, set scale to 0.9 to zoom out
	let currentScale = 100 / zoomSlider.value;
	if (delta > 0 && zoomSlider.value < 100) {
		zoomSlider.value++;
		zoomValue.innerHTML++;
		change = true;
	}
	//If delta is less than 0, set scale to 1.1 to zoom in.
	else if (delta < 0 && zoomSlider.value > 1) {
		zoomSlider.value--;
		zoomValue.innerHTML--;
		change = true;
	}
	if (change) {
		let newScale = 100 / zoomSlider.value;
		let scale = newScale / currentScale;
		if (scale != 1) {
			alterLattice(scale, mouseY, mouseX);
		}
		redrawLattice();
	}
	else if (zoomSlider.value == 100) {
		createVisInit();
		redrawLattice();
	}
	event.preventDefault();
}, false)

// Handle switching GUI for Start/Stop Button upon click
function startStopToggle() {
	// If the button is in start state, change it to stop state and vice versa
	if (startStopButton.classList.contains("start_button") && !run) {
    	startStopButton.innerHTML = "Stop";
    	startStopButton.classList.remove("start_button");
    	startStopButton.classList.add("stop_button");
  	} 
  	else {
    	startStopButton.innerHTML = "Start";
    	startStopButton.classList.remove("stop_button");
    	startStopButton.classList.add("start_button");
  	}
}

// Handle switching GUI for Clear/Reset Button upon click
function clearResetToggle(reset) {
	// If the button is in clear state, change it to reset state and vice versa
	if (reset) {
    	clearResetButton.innerHTML = "Reset";
  	} 
  	else if (!reset) {
    	clearResetButton.innerHTML = "Clear";
  	}
}

/* Handle open and closing of about and library window */
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

// About button is clicked, display about window
libraryButton.addEventListener("click", function() {
	libraryWindow.style.display = "block";
});

// Close if x (close) button in top right of the window is clicked
closeLibrary.addEventListener("click", function() {
	libraryWindow.style.display = "none";
});

// Close if any space outside of the about window is clicked
window.addEventListener("click", function(event) {
	// Check if about window is mouse target (outside text frame was clicked) and, if so, hide about window
	if (event.target == libraryWindow) {
		libraryWindow.style.display = "none";
	}
});

iterationSpeedValue.innerHTML = 250;  // Sets displayed default iteration speed value
zoomValue.innerHTML = 100;  // Sets displayed default zoom value

// Update the current iteration speed slider value upon drag
iterationSpeedSlider.oninput = function() {
	iterationSpeedValue.innerHTML = this.value;
	setDelay(this.value);
};

//Redraws the entire lattice array on the canvas
export function redrawLattice() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	for (let i = 0; i < visLatticeArray.length; i++) {
		for (let f = 0; f < visLatticeArray[i].length; f++) {
			visLatticeArray[i][f].drawCell(ctx)
		}
	}
}

function alterLattice(scale, mouseY = canvas.height / 2, mouseX = canvas.width / 2) {
	for (let i = 0; i < visLatticeArray.length; i++) {
		for (let j = 0; j < visLatticeArray[i].length; j++) {
			alterCell(visLatticeArray[i][j], scale, mouseY, mouseX);
		}
	}
}

function alterCell(cell, scale, mouseY, mouseX) {
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

// Update the current zoom slider value upon drag
zoomSlider.oninput = function() {
	zoomValue.innerHTML = this.value;
	let scale = 100 / this.value;
	createVisInit();
	if (scale != 1) {
		alterLattice(scale);
	}
	redrawLattice();
};

function setDelay(newDelay) {
	currentDelay = newDelay;
}

// Mouse location calculator for functions such as clicking cells
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

function clear() {
	iterationCount = 0;
	for (let i = 0; i < visLatticeArray.length; i++) {
		for (let j = 0; j < visLatticeArray[0].length; j++) {
			latticeArray[i][j] = 0;
		}
	}
	createVis(canvas);
	ctx.clearRect(0,0, canvas.width, canvas.height);
	displayLattice(visLatticeArray);
}

function continouslyIterate() {
	console.log(run);
	if (run) {
		setTimeout(function() { // puts a wait before iterating again
			if (run) {
				iterate(); //iterates the number of lattices
				iterationCount++;
				ctx.clearRect(0,0, canvas.width, canvas.height);
				displayLattice(visLatticeArray)
			}
			continouslyIterate(); // allows it to coninously run by calling it again
		}, currentDelay);
	}
}

// outputIteration.innerHTML = "Iteration Count: 0"; // Display (initial) iteration count to HTML page