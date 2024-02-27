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

let toggleButton = document.querySelector('.toggle_button');

var outputIteration = document.getElementById("iterationOutput")

let addIterations = 1; // Defaults iterations to add to 1
let Run = 0; // Defaults to not keep running

iterateButton.addEventListener("click", function()
{
	iterate(currentIteration, addIterations);
});

clearButton.addEventListener("click", function()
{clear(latticeArray);});

iterationSubmit.addEventListener("click", function()
	{setLatticeSize();});

stopButton.addEventListener("click", function()
	{Run = 0;});

startButton.addEventListener("click", function()
{
	if (Run != 1)
	{
	Run = 1;
	continouslyIterate();
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
	setRule(Rule);
	})

latticeSizeSubmit.addEventListener("click", function()
	{
	LatSize = setCellNum(LatSize);
	size = canvas.width / LatSize;
	if (size > 45){
		size = 45;
	}
	clear(latticeArray);
	})

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


function setRule(Rule)
{
	let newRule = parseInt(ruleInputBox.value);
	Run = 0;
	if(!isNaN(newRule) && newRule >= 0 && newRule <= 255)
	{
		Rule = ruleNumToRule(newRule);
	}
	else
	{
		console.log("Not a number");
	}
}

function setCellNum(LatSize)
{
	let newCellNum = parseInt(latticeSizeBox.value);
	if(!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000)
	{
		LatSize = newCellNum;
	}
	else
	{
		console.log("Not a number")
	}
	return LatSize;
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
	numOfIterations = 1;
	currentIteration = 1;
	let clearedLattice = new Array ( new Array);
	nextLattice = new Array;
	StartX = (canvas.width / 2) - (LatSize * size / 2)
	while (latticeArray.length > 1){
		latticeArray.pop();
	}
	for (let i = 0; i < LatSize; i++)
	{
		clearedLattice[0][i] = (new cell (size, size, StartX + i *size, 0, 0));
	}
	latticeArray[0] = clearedLattice[0].slice(0);
	currentLattice = latticeArray[0];
	updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration);
}

function setCells(latticeArray, mouseX, mouseY)
{

	for (let i = 0 ; i < latticeArray[0].length; i++)
	{
		if(latticeArray[0][i].insideCell(mouseX, mouseY))
		{
			latticeArray[0][i].flipColor();
		}
	(latticeArray[0][i]).drawCell(ctx);
	}

}


function iterate(currentIteration, newIterations)
{
	if(numOfIterations + newIterations > addIterations)
	{
		numOfIterations = addIterations;
		Run = 0;
	}
	else
	{
	{numOfIterations += newIterations}
	}
	while(latticeArray.length > numOfIterations)
	{
		latticeArray.pop();
	}

	updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, Rule, BoundaryCon);
	return currentIteration;
}

// Handle when toggle buton is activated: Animate toggle button, display checkboxes, select first checkbox
function toggleCheckbox() {
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

	pdf.save("Wolfram1DCanvas" + randNum + ".pdf");  // Save the PDF
});

outputIteration.innerHTML = "Iteration Count: " + (currentIteration - 1).toString(); // Display (initial) iteration count to HTML page