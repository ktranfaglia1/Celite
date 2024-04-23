/*
* UIFunctionality.js
* Authors: Kyle Tranfaglia, Timmy McKirgan, Dustin O'Brien
* This file handles all user interface Functionality. It is the bulk of the program and handles all button clicks,
  information inputs, mouse actions, lattice changes, cell changes, iterations, and updates/calculates information
  for simulation modifications and communicates it with utility files
* Last Updated: 04/18/24
*/

/* Global constants connecting HTML buttons to JS by ID to impliment functionality */   

/* Input Box Submit Button Constant for Iterations */
const iterationInputBox = document.getElementById("iterationInputBox");
const iterationSubmit = document.getElementById("iterationSubmit");

/* Connect main buttons */
const startStopButton = document.getElementById("startStopButton");
const iterateButton = document.getElementById("iterateButton");
const clearResetButton = document.getElementById("clearResetButton");
const libraryButton = document.getElementById("libraryButton");
const aboutButton = document.getElementById("aboutButton");

/* Connect iteration slider */
const iterationSpeedSlider = document.getElementById("iterationSpeedSlider");
const iterationSpeedValue = document.getElementById("iterationSpeedValue");

const aboutWindow = document.getElementById("aboutContainer");  // Connect window for about
const closeAbout = document.querySelector("#aboutContent .close");  // Connect HTML/CSS close feature to JS for the about window

import {canvas, ctx, displayLattice} from "./displayLattice.js";
import {visLatticeArray, visBounds, latticeArray, iterate, createVis} from "./generateLattice.js";
import { borderContact, expandBorder } from "./generateLattice.js";

/* Global variables for iteration */
let addIterations = 0; // Defaults iterations
let Run = 0; // Defaults to not keep running
let iterationTime = 250; // Time to wait before iterating again

/* Handle button clicks for all primary toolbar buttons */

iterationSubmit.addEventListener("click", function() {

});

startStopButton.addEventListener("click", function() {
	//continouslyIterate();
});

iterateButton.addEventListener("click", function() {
    iterate();
	let currentBoundaryPush = borderContact();
	for (let f = 0; f < currentBoundaryPush.length; f++) {
		expandBorder(currentBoundaryPush[f], (bounds[0] / 2));
	}
	createVis();
	displayLattice(visLatticeArray)
});

clearResetButton.addEventListener("click", function() {
    clear();
});

libraryButton.addEventListener("click", function() {
    
});

aboutButton.addEventListener("click", function() {
    
});

canvas.addEventListener("click", function(event){
	let mouseX, mouseY;
	[mouseX, mouseY] = getMouseLocation(event);

	let XIndex = Math.floor(mouseX / visLatticeArray[0][0].getWidth());
	let YIndex = Math.floor(mouseY / visLatticeArray[0][0].getHeight());

	visLatticeArray[YIndex][XIndex].flipColor();
	visLatticeArray[YIndex][XIndex].drawCell(ctx);
	
	latticeArray[YIndex + visBounds[1]][XIndex + visBounds[0]] = !latticeArray[YIndex + visBounds[1]][XIndex + visBounds[0]];

});

//Listener for click on canvas
/*canvas.addEventListener("click", function(event){
	let mouseX, mouseY;
	[mouseX, mouseY] = getMouseLocation(event); // Calculates Proper location of mouse click for usage in setCells
	setCells(latticeArray, mouseX, mouseY);	// Flips the cell if it was clicked on
});*/

// Recognize a keydown event, as in keyboard key press, then check and hnadle key presses. Used for keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Check if ALT key is pressed, then check if another key is pressed and complete corresponding action
    if (event.altKey) {
		switch (true) {
            case (event.key == 'j'):
				iterationInputBox.focus();
				break;
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

/* Handle open and closing of about window */
// About button is clicked, display about window
aboutButton.addEventListener("click", function() {
	aboutWindow.style.display = "block";
});

// Close if x (close) button in top right of the window is clicked
/* ERROR HERE
closeAbout.addEventListener("click", function() {
	aboutWindow.style.display = "none";
});
*/

// Close if any space outside of the about window is clicked
window.addEventListener("click", function(event) {
	// Check if about window is mouse target (outside text frame was clicked) and, if so, hide about window
	if (event.target == aboutWindow) {
		aboutWindow.style.display = "none";
	}
});

iterationSpeedValue.innerHTML = 750;  // Sets displayed default iteration speed value

// Update the current iteration speed slider value upon drag
iterationSpeedSlider.oninput = function() {
	iterationSpeedValue.innerHTML = this.value;
	// setDelay(this.value);
};

//Mouse location calculator for dunctions such as clicking cells
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
//outputIteration.innerHTML = "Iteration Count: 0"; // Display (initial) iteration count to HTML page (ERROR HERE)

function clear()
{
	//console.log("Test");
	for (let i = 0; i < visLatticeArray.length; i++)
	{
		for (let j = 0; j < visLatticeArray[0].length; j++)
		{
			latticeArray[i][j] = 0;
		}
	}
	createVis(canvas);
	displayLattice(visLatticeArray);
}