/*
* UIFunctionality.js
* Authors: Kyle Tranfaglia, Timmy McKirgan, Dustin O'Brien
* This file handles all user interface Functionality. It is the bulk of the program and handles all button clicks,
  information inputs, mouse actions, lattice changes, cell changes, iterations, and updates/calculates information
  for simulation modifications and communicates it with utility files
* Last Updated: 04/18/24
*/
/* Import utility and variables from other JS files */
import {canvas, ctx, displayLattice, initialize} from "./displayLattice.js";
import {visLatticeArray, visBounds, latticeArray, iterate, createVis, createVisInit, bounds, boundaryCollide} from "./generateLattice.js";
import { cell } from "./cellClass.js";
import { build101, build295, build119, build1234, buildGlider, setLattice, yCenter, xCenter, buildGtoG, build60P, buildAK94, buildTrigger, buildSnail, buildTub } from "./presets.js";

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

/* Connect Windows */
const aboutWindow = document.getElementById("aboutContainer");  // Connect window for about
const closeAbout = document.querySelector("#aboutContent .close");  // Connect HTML/CSS close feature to JS for the about window
const libraryWindow = document.getElementById("libraryContainer");  // Connect window for library
const closeLibrary = document.querySelector("#libraryContent .close");  // Connect HTML/CSS close feature to JS for the library window

/* Connect Library Buttons */
const library101 = document.getElementById('library101');
const library119P4H1V0 = document.getElementById('library119P4H1V0');
const library1234 = document.getElementById('library1234');
const library295P5H1V1 = document.getElementById('library295P5H1V1');
const library4gto5gReaction = document.getElementById('library4gto5gReaction');
const library60P312 = document.getElementById('library60P312');
const libraryAK94Gun = document.getElementById('libraryAK94Gun');
const libraryTrigger = document.getElementById('libraryTrigger');
const librarySnail = document.getElementById('librarySnail');
const libraryTubstretcher = document.getElementById('libraryTubstretcher');

let outputIteration = document.getElementById("iterationOutput")  // Connect iteration display region

/* Global variables for iteration */
let run = 0; // Defaults to not keep running
let currentDelay = 750; // Time to wait before iterating again
let iterationCount = 0; // Tracks number of iterations
let scribble = false; //Keeps track of whether the mouse is being held down for scribbling on canvas
let shift = false; //Keeps track of whether the Shift key is being held down for shifting the canvas
let mouseXPos = 0; //Stores starting X position of cursor for dragging
let mouseYPos = 0; //Stores starting Y position of cursor for dragging
let shiftX = 0; //Stores ending X position of cursor for dragging
let shiftY = 0; //Stores ending Y position of cursor for dragging
let reverse =  new Array();
for (let i = 100; i > 0; i--) {
	reverse.push(i);
}

let currentReset = 1;

let resetLattice = new Array()

export {iterationCount}

//Waits for canvas to be drawn in displayLattice before applying the initial zoom.
//while(!initialize) {}

//Stops all functionality from working until canvas is opened
document.addEventListener("DOMContentLoaded", function() {
	alterLattice(2);
	redrawLattice();
	buildGlider();

	/* Handle button clicks for all primary toolbar buttons */

	startStopButton.addEventListener("click", debounce(function() {
		if (!boundaryCollide() || run) {
			clearResetToggle(true);
			startStopToggle();
			run = !run;
			if (run) {
				continouslyIterate();
			}
		}
	}));

	iterateButton.addEventListener("click", debounce(function() {
		if(!run && !boundaryCollide()) {
			clearResetToggle(true);
			iterate();
			updateOutput(true);
			/* THIS CODE IS BUGGED RN. WILL WORK ON FIX NEXT WEEK
			let currentBoundaryPush = borderContact();
			for (let i = 0; i < currentBoundaryPush.length; i++) {
				expandBorder(currentBoundaryPush[i], (bounds[0] / 2));
			}
			*/
			ctx.clearRect(0,0, canvas.width, canvas.height);
			displayLattice(visLatticeArray);
		}
	}));

	clearResetButton.addEventListener("click", debounce(function() {
		if(currentReset == 1)
		{clear();}
		else {
			if (run) {
				startStopToggle();
				run = false;
			}
			else {
				clearResetToggle(false);
			}
			reset();
		}
	}));

	document.addEventListener('keyup', function(event) {
		if (event.key == 'Shift') {
			setTimeout(function() {
				if (shift) {
					shift = false;
					shiftX = 0;
					shiftY = 0;
				}
			}, 10);
		}
	});

	canvas.addEventListener('mouseleave', function() {
		setTimeout(function() {
			if (scribble) {
				scribble = false;
				console.log(scribble)
				shiftX = 0;
				shiftY = 0;
			}
		}, 10);
	});


// Recognize a keydown event, as in keyboard key press, then check and hnadle key presses. Used for keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Check if ALT key is pressed, then check if another key is pressed and complete corresponding action
	if (event.shiftKey) {
		setTimeout(function() {
			if (!shift) {
				shift = true;
				if (scribble && shift) {
					[mouseXPos, mouseYPos] = getMouseLocation(event);
				}
			}
		}, 10);
	}
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

canvas.addEventListener("mousedown", function(event) {
	let mouseX, mouseY;
	[mouseX, mouseY] = getMouseLocation(event);
	if (!shift) {
		for (let i = 0; i < visLatticeArray.length; i++) {
			for (let j = 0; j < visLatticeArray[i].length; j++) {
				if (visLatticeArray[i][j].insideCell(mouseX, mouseY)) {
					visLatticeArray[i][j].flipColor();
					visLatticeArray[i][j].drawCell(ctx);
					latticeArray[i + visBounds[1]][j + visBounds[0]] = !latticeArray[i + visBounds[1]][j + visBounds[0]];
				}
			}
		}
	}
});

	canvas.addEventListener("mousemove", function(event) {
		let mouseX, mouseY;
		[mouseX, mouseY] = getMouseLocation(event);
		if (scribble && shift) {
			let offSetX = mouseX - mouseXPos;
			let offsetY = mouseY - mouseYPos;
			redrawLattice(offSetX, offsetY);
		}
		else if (scribble) {
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

	canvas.addEventListener("mousedown", function(event) {
		document.body.style.userSelect = 'none';  // Disable text selection globally
		setTimeout(function() {
			if (!scribble) {
				scribble = true;
				if (scribble && shift) {
					[mouseXPos, mouseYPos] = getMouseLocation(event);
				}
			}
		}, 10);
	});

	

	canvas.addEventListener("mouseup", function() {
		document.body.style.userSelect = 'auto';  // Enable text selection globally
		setTimeout(function() {
			if (scribble) {
				scribble = false;
				shiftX = 0;
				shiftY = 0;
			}
		}, 10);
	});

	canvas.addEventListener('wheel', function(event) {
		let mouseX, mouseY;
		[mouseX, mouseY] = getMouseLocation(event); // Calculates Proper location of zoom center
		let testLoc = inLattice(mouseX, mouseY);
		if (testLoc) {
			let delta = event.deltaY; //Get delta from mouse scroll.
			let change = false;
			console.log(reverse.length);
			console.log(zoomSlider.value);
			let currentScale = 100 / reverse[zoomSlider.value - 1];
			if (delta < 0 && zoomSlider.value < 100) {
				zoomSlider.value++;
				zoomValue.innerHTML++;
				change = true;
			}
			else if (delta > 0 && zoomSlider.value > 1) {
				zoomSlider.value--;
				zoomValue.innerHTML--;
				change = true;
			}
			if (change) {
				let newScale = 100 / reverse[zoomSlider.value - 1];
				let scale = newScale / currentScale;
				if (scale != 1) {
					alterLattice(scale, mouseY, mouseX);
				}
				redrawLattice();
			}
			else if (zoomSlider.value == 1) {
				createVisInit();
				redrawLattice();
			}
			event.preventDefault();
		}
	}, false);

	library101.addEventListener("click", function() {
		build101();
		closeLibrary.click();
	});

	library119P4H1V0.addEventListener("click", function() {
		build119();
		closeLibrary.click();
	});

	library1234.addEventListener("click", function() {
		build1234();
		closeLibrary.click();
	});

	library295P5H1V1.addEventListener("click", function() {
		build295();
		closeLibrary.click();
	});

	library4gto5gReaction.addEventListener("click", function() {
		buildGtoG();
		closeLibrary.click();
	});

	library60P312.addEventListener("click", function() {
		build60P();
		closeLibrary.click();
	});

	libraryAK94Gun.addEventListener("click", function() {
		buildAK94();
		closeLibrary.click();
	});

	librarySnail.addEventListener("click", function() {
		buildSnail();
		closeLibrary.click();
	});

	libraryTrigger.addEventListener("click", function() {
		buildTrigger();
		closeLibrary.click();
	});

	libraryTubstretcher.addEventListener("click", function() {
		buildTub();
		closeLibrary.click();
	});
});

function inLattice(xLoc, yLoc) {
	let xMin = visLatticeArray[0][0].getXLoc();
	let xMax = visLatticeArray[0][visLatticeArray[0].length - 1].getXLoc() + visLatticeArray[0][visLatticeArray[0].length - 1].getWidth();
	let yMin = visLatticeArray[0][0].getYLoc();
	let yMax = visLatticeArray[visLatticeArray.length - 1][0].getYLoc() + visLatticeArray[visLatticeArray.length - 1][0].getHeight();
	if (xLoc >= xMin && xLoc <= xMax && yLoc >= yMin && yLoc <= yMax) {
		return true;
	}
	else {
		return false;
	}
}

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
		currentReset = 0;
		clearResetButton.innerHTML = "Reset";
	} 
	else if (!reset) {
		currentReset = 1;
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
zoomValue.innerHTML = 50;  // Sets displayed default zoom value

// Update the current iteration speed slider value upon drag
iterationSpeedSlider.oninput = function() {
	iterationSpeedValue.innerHTML = this.value;
	setDelay(this.value);
};


//Redraws the entire lattice array on the canvas
function redrawLattice(xOffset = 0, yOffset = 0) {
	let trueOffsetX = xOffset - shiftX;
	let trueOffsetY = yOffset - shiftY;
	if (trueOffsetX != 0 || trueOffsetY != 0) {
		let maxOffsetX =  canvas.width - (visLatticeArray[0][visLatticeArray[0].length - 1].getXLoc() + visLatticeArray[0][visLatticeArray[0].length - 1].getWidth()) - 5 * visLatticeArray[0][0].getWidth();
		let minOffsetX =  -1 * (visLatticeArray[0][0].getXLoc() - 5 * visLatticeArray[0][0].getWidth());
		let maxOffsetY =  canvas.height - (visLatticeArray[visLatticeArray.length - 1][0].getYLoc() + visLatticeArray[visLatticeArray.length - 1][0].getHeight()) - 5 * visLatticeArray[0][0].getHeight();
		let minOffsetY =  -1 * (visLatticeArray[0][0].getYLoc() - 5 * visLatticeArray[0][0].getHeight());
		
		if (trueOffsetX > 0) {
			if (trueOffsetX > minOffsetX) {
				trueOffsetX = minOffsetX;
			}
		}
		else {
			if (trueOffsetX < maxOffsetX) {
				trueOffsetX = maxOffsetX;
			}
		}
		if (trueOffsetY > 0) {
			if (trueOffsetY > minOffsetY) {
				trueOffsetY = minOffsetY;
			}
		}
		else {
			if (trueOffsetY < maxOffsetY) {
				trueOffsetY = maxOffsetY;
			}
		}
	}
	ctx.clearRect(0,0, canvas.width, canvas.height);
	let offSetLat = visLatticeArray;
	for (let i = 0; i < visLatticeArray.length; i++) {
		for (let f = 0; f < visLatticeArray[i].length; f++) {
			if (trueOffsetX != 0 || trueOffsetY != 0) {
				let curCell = visLatticeArray[i][f];
				offSetLat[i][f] = new cell(curCell.getHeight(), curCell.getWidth(), curCell.getXLoc() + trueOffsetX, curCell.getYLoc() + trueOffsetY, curCell.getColor(), curCell.getBorder());
			}
			offSetLat[i][f].drawCell(ctx)
		}
	}
	shiftX = xOffset;
	shiftY = yOffset;
}

export function alterLattice(scale, mouseY = canvas.height / 2, mouseX = canvas.width / 2) {
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
	let scale = 100 / reverse[this.value - 1];
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

export function clear() {
	updateOutput();
	for (let i = 0; i < latticeArray.length; i++) {
		for (let j = 0; j < latticeArray[0].length; j++) {
			latticeArray[i][j] = 0;
		}
	}
	createVisInit();
	alterLattice(2);
	redrawLattice();
	zoomSlider.value = 50;
	zoomValue.innerHTML = 50;
	ctx.clearRect(0,0, canvas.width, canvas.height);
	displayLattice(visLatticeArray);
}

function continouslyIterate() {
	if (run) {
		setTimeout(function() { // puts a wait before iterating again
			if (run && !(shift && scribble) && !boundaryCollide()) {
				iterate();
				updateOutput(true);
				ctx.clearRect(0,0, canvas.width, canvas.height);
				//displayLattice(visLatticeArray)
				redrawLattice()
			}
			if (!boundaryCollide()) {
				continouslyIterate(); // allows it to coninously run by calling it again
			}
			else {
				startStopToggle();
				run = false;
			}
		}, currentDelay);
	}
}

// outputIteration.innerHTML = "Iteration Count: 0"; // Display (initial) iteration count to HTML page

function debounce(callback) {
    let timeoutId;

    return function(event) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(event); // Directly pass the event object to the callback function
        }, 100);
    };
}

updateOutput(); // Display initial count of 0


function reset()
{
	setLattice(resetLattice);
	updateOutput();
}

export function saveReset()
{
	resetLattice.length = 0; //Javascript is insane man
	for(let i = 0; i < latticeArray.length; i++)
	{
		let tempRow = new Array();
		for(let j = 0; j < latticeArray[0].length; j++)
		{
			tempRow.push(latticeArray[i][j]);
		}
		resetLattice.push(tempRow);
	}
	//console.log(resetLattice[0].length)
}

// Displays the current iteration count to Game of Life HTML page
function updateOutput(increment = false) {
	if (increment) {
		iterationCount++;
	}
	else {
		iterationCount = 0;
	}
	outputIteration.innerHTML = "Iteration Count: " + iterationCount.toString();  // Display iteration count to HTML page
}