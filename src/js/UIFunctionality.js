import {latticeArray, currentLattice, nextLattice, rule, canvas, ctx, outputIteration, alterRuleNum} from './displayLattice.js';
import {numOfIterations, currentIteration, size, latSize, ruleNum, boundaryCon, drawLattice} from './displayLattice.js';
import {alterLatSize, alterSize, alterLatticeArray, alterCurrentLattice, alterNextLattice} from './displayLattice.js';
import {alterRule, alterNumOfIterations, alterCurrentIteration, alterBoundaryCon} from './displayLattice.js';
import {updateLattice} from './displayLattice.js';
import {ruleNumToRule} from './generateLattice.js';
import {cell} from './cellClass.js';

const iterationInputBox = document.getElementById("inputBox1");
const ruleInputBox = document.getElementById("inputBox2");
const latticeSizeBox = document.getElementById("inputBox3");

const iterationSubmit = document.getElementById("submitButton1");
const ruleSubmit = document.getElementById("submitButton2");
const latticeSizeSubmit = document.getElementById("submitButton3");

const startStopButton = document.getElementById("bigButton1");
const iterateButton = document.getElementById("bigButton2");
const clearButton = document.getElementById("bigButton3");
const downloadButton = document.getElementById("bigButton4");
const aboutButton = document.getElementById("bigButton5");

const infiniteCheckBox = document.getElementById('checkbox1');
const finiteCheckBox = document.getElementById('checkbox2');

const toggleBar = document.getElementById('toggle_bar1')

const toggleButton = document.querySelector('.toggle_button');

let addIterations = 1; // Defaults iterations to add to 1
let Run = 0; // Defaults to not keep running

toggleBar.addEventListener("click", function()
{
	toggleCheckbox();
});

iterateButton.addEventListener("click", function()
{
	iterate(currentIteration, addIterations);
});

clearButton.addEventListener("click", function()
{clear(latticeArray);});

iterationSubmit.addEventListener("click", function()
	{setLatticeSize();});

// stopButton.addEventListener("click", function()
// 	{Run = 0;});

startStopButton.addEventListener("click", function()
{
	if (Run != 1)
	{
	Run = 1;
	continouslyIterate();
	}
	else {
		Run = 0;
	}
})

canvas.addEventListener('click', function(event)
{
	let bounds = canvas.getBoundingClientRect();
	let cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue('width'));
	let cssHeight = parseFloat(getComputedStyle(canvas).getPropertyValue('height'));
	let borderWidth = parseInt(getComputedStyle(canvas).borderLeftWidth);
	let paddingLeft = parseFloat(getComputedStyle(canvas).paddingLeft);
	let paddingTop = parseFloat(getComputedStyle(canvas).paddingTop);
	
	let mouseX = (event.clientX - bounds.left - paddingLeft - borderWidth) * canvas.width / cssWidth;
	let mouseY = (event.clientY - bounds.top - paddingTop - borderWidth) * canvas.height / cssHeight;
	
	setCells(latticeArray, mouseX, mouseY);	
});

ruleSubmit.addEventListener("click", function()
	{
	setRule(rule);
	})

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

canvas.addEventListener("mousemove", function(event) {makeTickBox(event, ctx)});

/*
function makeTickBox(event, ctx)
{
	let bounds = canvas.getBoundingClientRect();
	let cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue('width'));
	let cssHeight = parseFloat(getComputedStyle(canvas).getPropertyValue('height'));
	let borderWidth = parseInt(getComputedStyle(canvas).borderLeftWidth);
	let paddingLeft = parseFloat(getComputedStyle(canvas).paddingLeft);
	let paddingTop = parseFloat(getComputedStyle(canvas).paddingTop);

	
	let mouseX = (event.clientX - bounds.left - paddingLeft - borderWidth) * canvas.width / cssWidth;
	let mouseY = (event.clientY - bounds.top - paddingTop - borderWidth) * canvas.height / cssHeight;
	
	setCells(latticeArray, mouseX, mouseY);	
};
*/

canvas.addEventListener("mousemove", function(event) {makeTickBox(event, ctx)});

function makeTickBox(event, ctx)
{
	let bounds = canvas.getBoundingClientRect();
	let cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue('width'));
	let cssHeight = parseFloat(getComputedStyle(canvas).getPropertyValue('height'));
	let borderWidth = parseInt(getComputedStyle(canvas).borderLeftWidth);
	let paddingLeft = parseFloat(getComputedStyle(canvas).paddingLeft);
	let paddingTop = parseFloat(getComputedStyle(canvas).paddingTop);

	let mouseX = (event.clientX - bounds.left - paddingLeft - borderWidth) * canvas.width / cssWidth;
	let mouseY = (event.clientY - bounds.top - paddingTop - borderWidth) * canvas.height / cssHeight;
	
	drawLattice(latticeArray);
      	ctx.fillStyle = "grey";
	ctx.fillRect(mouseX + 3, mouseY - 12, 33, 15);

	ctx.font = "13px Arial";
	ctx.fillStyle = "black";

	ctx.fillText(Math.floor(mouseY / size), mouseX + 4, mouseY)
}

function continouslyIterate()
{
	if(Run)
	{
		setTimeout(function(){
		iterate(currentIteration, 1);
		continouslyIterate();
		}, 750);
	}
}


function setRule()
{
	let newRule = parseInt(ruleInputBox.value);
	Run = 0;
	if(!isNaN(newRule) && newRule >= 0 && newRule <= 255)
	{
		alterRuleNum(newRule);
		alterRule(ruleNumToRule(newRule));
	}
	else
	{
		console.log("Not a number");
	}
}

function setLatticeSize()
{
	let newValue = parseInt(iterationInputBox.value);
	Run = 0;
	if(!isNaN(newValue) && newValue > 0 && newValue <= 10000)
	{
		addIterations = newValue;		
	}
	else
	{
		console.log("Not a number");
	}
}

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
	updateLattice();
}

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
	updateLattice();
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
			let checkboxes = document.querySelectorAll('.checkbox_select');
			//If the first checkbox is selected, set the boundaryCon variable to 1 representing Periodic
			//boundary condition. Otherwise set boundaryCon to 0 representing Null.
			if (checkboxes[0].checked) {
				alterBoundaryCon(1)
			}
			else {
				alterBoundaryCon(0)
			}
			//console.log(boundaryCon);
			iterate(currentIteration, addIterations);
        }
		// Box is set to be unchecked: Don't allow ... one box must be checked at all times
		else {
			this.checked = true;
		}
    });
});

// Capture canvas as a PDF upon clickling the 'Download" button
downloadButton.addEventListener('click', function () {
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

// Handle switching GUI for Start/Stop Button upon click
startStopButton.addEventListener("click", function() {
	// If the button is in start state, change it to stop state and vice versa
	if (startStopButton.classList.contains("start_button")) {
    	startStopButton.innerHTML = "Stop";
    	startStopButton.classList.remove("start_button");
    	startStopButton.classList.add("stop_button");
  	} 
  	else {
    	startStopButton.innerHTML = "Start";
    	startStopButton.classList.remove("stop_button");
    	startStopButton.classList.add("start_button");
  	}
});

// Handle open and closing of About window
// Open About button is clicked
aboutButton.addEventListener("click", function() {
	document.getElementById("aboutContainer").style.display = "block";
});

// Close if x button in top right of the window is cliked
document.querySelector(".close").addEventListener("click", function() {
	document.getElementById("aboutContainer").style.display = "none";
});

// Close if any space outside of the About window is clicked
window.addEventListener("click", function(event) {
	if (event.target == document.getElementById("aboutContainer")) {
		document.getElementById("aboutContainer").style.display = "none";
	}
});

outputIteration.innerHTML = "Iteration Count: 0"; // Display (initial) iteration count to HTML page