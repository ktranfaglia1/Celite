/*
UIFunctionality.js
Authors: Kyle Tranfaglia, Timmy McKirgan, Dustin O'Brien
Functions:

*/
import {latticeArray, currentLattice, nextLattice, rule, canvas, ctx, outputIteration, alterRuleNum} from './displayLattice.js';
import {numOfIterations, currentIteration, size, latSize, ruleNum, boundaryCon, drawLattice} from './displayLattice.js';
import {alterLatSize, alterSize, alterLatticeArray, alterCurrentLattice, alterNextLattice} from './displayLattice.js';
import {alterRule, alterNumOfIterations, alterCurrentIteration} from './displayLattice.js';
import {updateLattice} from './displayLattice.js';
import {ruleNumToRule} from './generateLattice.js';
import {cell} from './cellClass.js';

let iterationInputBox = document.getElementById("inputBox1");
let ruleInputBox = document.getElementById("inputBox2");
let latticeSizeBox = document.getElementById("inputBox3");

let iterationSubmit = document.getElementById("submitButton1");
let ruleSubmit = document.getElementById("submitButton2");
let latticeSizeSubmit = document.getElementById("submitButton3");

let startButton = document.getElementById("primaryButton1");
let stopButton = document.getElementById("primaryButton2");
let iterateButton = document.getElementById("primaryButton3");
let clearButton = document.getElementById("primaryButton4");
let downloadButton = document.getElementById("primaryButton5");
let aboutButton = document.getElementById("primaryButton6");

let infiniteCheckBox = document.getElementById('checkbox1');
let finiteCheckBox = document.getElementById('checkbox2');

let toggleBar = document.getElementById('toggle_bar1')

//var outputIteration = document.getElementById("iterationOutput");


let toggleButton = document.querySelector('.toggle_button');

let addIterations = 1; // Defaults iterations to add to 1
let Run = 0; // Defaults to not keep running















/*
 * These Lines of code are all connecting some UI Functionality to a prebuilt function
 * */

toggleBar.addEventListener("click", function()
{
	toggleCheckbox();
});

iterateButton.addEventListener("click", function()
{iterate(currentIteration, addIterations);});

clearButton.addEventListener("click", function()
{clear(latticeArray);});

iterationSubmit.addEventListener("click", function()
{setLatticeSize();});

stopButton.addEventListener("click", function()
{Run = 0;});

ruleSubmit.addEventListener("click", function()
{setRule(rule);})


//Continously Checks where the mouse is on the Canvas too allow tick box to next to it
canvas.addEventListener("mousemove", function(event) {makeTickBox(event, ctx)});


// Blocks Start from working if already been clicked then runs its respective function
startButton.addEventListener("click", function()
{
	if (Run != 1)
	{
	Run = 1;
	continouslyIterate();
	}
})


// Runs program to flips squares if Clicked
canvas.addEventListener('click', function(event)
{
	let mouseX, mouseY;
	[mouseX, mouseY] = getMouseLocation(event); //Calculates Proper location of mouse click for usage in setCells
	setCells(latticeArray, mouseX, mouseY);	//Flips the cell if it was clicked on
});


//Sets the number of cells in a lattice
latticeSizeSubmit.addEventListener("click", function() 
{updateLatticeSize();})


function updateLatticeSize()
{
	alterLatSize(setCellNum(latSize)); //updates latSize to no latSize
	
	//Sets cells to maximize usage of the canvas
	alterSize(canvas.width / latSize);

	//Cells should have a maximum size of 45 :: This Caps cell size to 45
	if (size > 45){
		size = 45; 
	}

	clear(latticeArray); //emptys out canvas and redraws
}

ruleSubmit.addEventListener("click", function()
	{setRule(rule);})

//Sets the number of cells in a lattice
latticeSizeSubmit.addEventListener("click", function() {
	//latSize = setCellNum(latSize);
	let newCellNum = parseInt(latticeSizeBox.value);
	if(!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000)
	{
		alterLatSize(newCellNum);
	}
	else
	{
		console.log("Not a number")
	}
	alterSize(canvas.width / latSize);
	//Cells should have a maximum size of 45
	if (size > 45){
		alterSize(45);
	}
	
	clear(latticeArray);
	})



//generates the tick box in its proper location
function makeTickBox(event, ctx)
{

	var [mouseX, mouseY] = getMouseLocation(event); //Gets the mouse Location
	
	drawLattice(latticeArray);
    ctx.fillStyle = "grey";
	ctx.fillRect(mouseX + 3, mouseY - 12, 33, 15); //Draws the Tick Box square

	//Sets text specifications
	ctx.font = "13px Arial";
	ctx.fillStyle = "black";

	let lineNumber = Math.floor(mouseY / size); //calculates what line your on

	ctx.fillText(lineNumber, mouseX + 4, mouseY) //Puts the text in place
}


//repeatly iterates while run is true
function continouslyIterate()
{
	if(Run) //Checks if Run is activate
	{
		setTimeout(function(){ // puts a wait before iterating again
		iterate(currentIteration, 1); //iterates the number of lattices
		continouslyIterate(); // allows it to coninously run by calling it again
		}, 750);
	}
}


function setRule()
{
	let newRule = parseInt(ruleInputBox.value); //Turns input in rule input box into a number
	Run = 0; //Tells continous to not run
	if(!isNaN(newRule) && newRule >= 0 && newRule <= 255) //Checks if integer was a real integer and if its in the required range of the function
	{
		alterRuleNum(newRule);
		alterRule(ruleNumToRule(newRule));
	}
	else
	{
		console.log("Not a number");
		outputError("Not a number")
	}
}

//Sets new number of cells in a lattice
function setCellNum(latSize)
{
	let newCellNum = parseInt(latticeSizeBox.value); //Turns Input box input into a number
	if(!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) //Tests if input was truly an integer and then makes sure it was in the range of 1 and 1000 to make sure not too big
	{latSize = newCellNum;} //updates the new cell number
	else
	{console.log("Not a number")} //outputs the error to console currently

	return latSize; //returns the new lattice Size
}

//sets Number of Lattice arrays to have
function setLatticeSize() 
{
	let newValue = parseInt(iterationInputBox.value); //Turns the iteration input to an integer
	Run = 0; //sets run to stop
	if(!isNaN(newValue) && newValue > 0 && newValue <= 10000) //Input Validates for iteration box
	{
		addIterations = newValue;//updates the number of iterations
	}
	else
	{
		console.log("Not a number")
		outputError("Not a number")
	}
	return addIterations;
}

//gets rid of all arays except the first and sets it to all to dead
function clear(latticeArray)
{
	alterNumOfIterations(1);
	alterCurrentIteration(1);
	let clearedLattice = new Array ( new Array);
	alterNextLattice(new Array);
	let StartX = (canvas.width / 2) - (latSize * size / 2)
	let neoLatticeArray = latticeArray;
	while (neoLatticeArray.length > 1){
		neoLatticeArray.pop();
	}
	for (let i = 0; i < latSize; i++)
	{
		clearedLattice[0][i] = (new cell (size, size, StartX + i *size, 0, 0));
	}
	neoLatticeArray[0] = clearedLattice[0].slice(0);
	alterLatticeArray(neoLatticeArray);
	alterCurrentLattice(latticeArray[0]);
	updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration);
}

//Takes Coordinates of mouseClick and calculates properly where it is in relation to the canvas
function setCells(latticeArray, mouseX, mouseY)
{
	let neoLatticeArray = latticeArray;
	for (let i = 0 ; i < latticeArray[0].length; i++)
	{
		if(latticeArray[0][i].insideCell(mouseX, mouseY))
		{
			neoLatticeArray[0][i].flipColor();
		}
	(neoLatticeArray[0][i]).drawCell(ctx);
	alterLatticeArray(neoLatticeArray);
	}

}


function getMouseLocation(event)
{
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


function iterate(currentIteration, newIterations)
{
	if(numOfIterations + newIterations > addIterations)
	{
		alterNumOfIterations(addIterations);
		Run = 0;
	}
	else
	{
		alterNumOfIterations(numOfIterations + newIterations);
	}
	let neoLatticeArray = latticeArray;
	while(neoLatticeArray.length > numOfIterations)
	{
		neoLatticeArray.pop();
	}

	alterLatticeArray(neoLatticeArray);
	updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, rule, boundaryCon);
	return currentIteration;
}

// Handle when toggle buton is activated: Animate toggle button, display checkboxes, select first checkbox
export function toggleCheckbox() {
	// Set the first checkbox (not second checkbox) to be checked upon toggle button activation
	let checkboxes = document.querySelectorAll('.checkbox_select');
    checkboxes[0].checked = true;
	checkboxes[1].checked = false;
	// If checkboxes are currently hidden (toggle bar was not active) display the checkboxes and animate toggle button
	if (infiniteCheckBox.style.display == 'none'|| infiniteCheckBox.style.display == '') {
		infiniteCheckBox.style.display = 'block';
		finiteCheckBox.style.display = 'block';
		toggleButton.style.transform = 'translateX(25px)'; // Move the toggle button to the right
	// If checkboxes are currently not hidden (toggle bar was active) hide the checkboxes and animate toggle button back
    } else {
		infiniteCheckBox.style.display = 'none';
		finiteCheckBox.style.display = 'none';
		toggleButton.style.transform = 'translateX(0)'; // Move the toggle button back to the left
    }
}

// Ensure one and only one checkbox can be checked at a time upon checkbox click
document.querySelectorAll('.checkbox_select').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
		// Box is set to be checked upon change
        if (this.checked) {
            document.querySelectorAll('.checkbox_select').forEach(function(otherCheckbox) {
				// If one checkbox is already checked, uncheck the other checkbox
				if (otherCheckbox != checkbox) {
                    otherCheckbox.checked = false;
                }
            });
        }
		// Box is set to be unchecked: Don't allow ... one box must be checked at all times
		else {
			this.checked = true;
		}
    });
});

function outputError(text)
{
	errorContext.font = "12px Arial";
	errorContext.fillStyle = "red";

	errorContext.fillText(text, 5, 25)
		setTimeout(function(){

	}, 750);
}






// Capture canvas as a PDF upon clickling the 'Download" button
downloadButton.addEventListener('click', function () {
	let randNum = Math.floor(Math.random() * 99) + 1;  // Get random number for "unique" pdf save names 
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

	pdf.save("Wolfram1DCanvas" + "I" + numOfIterations + "R" + ruleNum + "L" + latSize + ".pdf");  // Save the PDF
});

outputIteration.innerHTML = "Iteration Count: " + (currentIteration - 1).toString(); // Display (initial) iteration count to HTML page
