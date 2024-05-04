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
import {visLatticeArray, visBounds, latticeArray, iterate, createVis} from "./generateLattice.js";
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

//Doesn't allow canvas to be clickable until Document is loaded
document.addEventListener("DOMContentLoaded", function() {
	//Detects and sets lattice color based on where user clicks
	canvas.addEventListener("click", function(event) {
		let mouseX, mouseY;
		[mouseX, mouseY] = getMouseLocation(event);

		let XIndex = Math.floor(mouseX / visLatticeArray[0][0].getWidth());
		let YIndex = Math.floor(mouseY / visLatticeArray[0][0].getHeight());

		visLatticeArray[YIndex][XIndex].flipColor();
		visLatticeArray[YIndex][XIndex].drawCell(ctx);
	
		latticeArray[YIndex + visBounds[1]][XIndex + visBounds[0]] = !latticeArray[YIndex + visBounds[1]][XIndex + visBounds[0]];
	});
});

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
zoomValue.innerHTML = 50;  // Sets displayed default zoom value

// Update the current iteration speed slider value upon drag
iterationSpeedSlider.oninput = function() {
	iterationSpeedValue.innerHTML = this.value;
	setDelay(this.value);
};

// Update the current zoom slider value upon drag
zoomSlider.oninput = function() {
	zoomValue.innerHTML = this.value;
};

function setDelay(newDelay) {
	currentDelay = newDelay;
}

// Mouse location calculator for dunctions such as clicking cells
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
	iterationCount = 0;
	for (let i = 0; i < visLatticeArray.length; i++) {
		for (let j = 0; j < visLatticeArray[0].length; j++) {
			latticeArray[i][j] = 0;
		}
	}
	createVis(canvas);
	displayLattice(visLatticeArray);
}

function continouslyIterate() {
	console.log(run);
	if (run) {
		setTimeout(function() { // puts a wait before iterating again
			if (run) {
				iterate(); //iterates the number of lattices
				iterationCount++;
				displayLattice(visLatticeArray)
			}
			continouslyIterate(); // allows it to coninously run by calling it again
		}, currentDelay);
	}
}

// outputIteration.innerHTML = "Iteration Count: 0"; // Display (initial) iteration count to HTML page