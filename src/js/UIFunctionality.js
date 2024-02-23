iterationInputBox = document.getElementById("inputBox1");
ruleInputBox = document.getElementById("inputBox2");

iterationSubmit = document.getElementById("submitButton1");
ruleSubmit = document.getElementById("submitButton2");

startButton = document.getElementById("primaryButton1");
stopButton = document.getElementById("primaryButton2");
iterateButton = document.getElementById("primaryButton3");
clearButton = document.getElementById("primaryButton4");
downloadButton = document.getElementById("primaryButton5");
aboutButton = document.getElementById("primaryButton6");

var infiniteCheckBox = document.getElementById('checkbox1');
var finiteCheckBox = document.getElementById('checkbox2');

var toggleButton = document.querySelector('.toggle_button');

var addIterations = 1; //Defaults iterations to add to 1
var Run = 0; //Defaults to not keep running

iterateButton.addEventListener("click", function()
{
	iterate(currentIteration, addIterations);
});

clearButton.addEventListener("click", function()
{clear(latticeArray);});

iterationSubmit.addEventListener("click", function()
	{setIterations();});

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
	var bounds = canvas.getBoundingClientRect();
	var cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue('width'));
	var cssHeight = parseFloat(getComputedStyle(canvas).getPropertyValue('height'));
	var borderWidth = parseInt(getComputedStyle(canvas).borderLeftWidth);
	var paddingLeft = parseFloat(getComputedStyle(canvas).paddingLeft);
	var paddingTop = parseFloat(getComputedStyle(canvas).paddingTop);

	
	var mouseX = (event.clientX - bounds.left - paddingLeft - borderWidth) * canvas.width / cssWidth;
	var mouseY = (event.clientY - bounds.top - paddingTop - borderWidth) * canvas.height / cssHeight;
	
	setCells(latticeArray, mouseX, mouseY);	
});

ruleSubmit.addEventListener("click", function()
	{
	setRule(Rule);
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
	var newRule = parseInt(ruleInputBox.value);
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

function setIterations()
{
	var newValue = parseInt(iterationInputBox.value);
	Run = 0;
	if(!isNaN(newValue) && newValue >= 0 && newValue <= 1000)
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
	while(latticeArray.length > 1)
	{
		latticeArray.pop();
	}
	for (var i = 0; i < latticeArray[0].length; i++)
	{
		latticeArray[0][i] = (new cell (size, size, i * size + i + XIndent, 0, 0))
	}
	currentLattice = latticeArray[0];
	updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration);
}

function setCells(latticeArray, mouseX, mouseY)
{

	for (var i = 0 ; i < latticeArray[0].length; i++)
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
	}
	else
	{
	{numOfIterations += newIterations}
	//numOfIterations = newIterations;
	}
	while(latticeArray.length > numOfIterations)
	{
		latticeArray.pop();
	}

	updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, Rule, BoundaryCon);
	return currentIteration;
}

function toggleCheckbox() {

	var checkboxes = document.querySelectorAll('.checkbox_select');
    checkboxes[0].checked = true;

	if (infiniteCheckBox.style.display == 'none'|| infiniteCheckBox.style.display == '') {
		infiniteCheckBox.style.display = 'block';
		finiteCheckBox.style.display = 'block';
		toggleButton.style.transform = 'translateX(25px)'; // Move the toggle button to the right
    } else {
		infiniteCheckBox.style.display = 'none';
		finiteCheckBox.style.display = 'none';
		toggleButton.style.transform = 'translateX(0)'; // Move the toggle button back to the left
    }
}

// Ensure only one checkbox can be checked at a time
document.querySelectorAll('.checkbox_select').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            document.querySelectorAll('.checkbox_select').forEach(function(otherCheckbox) {
				if (otherCheckbox != checkbox) {
                    otherCheckbox.checked = false;
                }
            });
        }
    });
});

document.querySelector('.toggle_bar').addEventListener('click', function() {
    // Set the first checkbox to be checked when the toggle bar is activated
    checkboxes[0].checked = true;
});
