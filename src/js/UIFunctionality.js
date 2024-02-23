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
	Run = 1;
	continouslyIterate();
})

canvas.addEventListener('click', function(event)
{
	var bounds = canvas.getBoundingClientRect();
	var paddingLeft = parseFloat(getComputedStyle(canvas).paddingLeft);
//    	var paddingRight = parseFloat(getComputedStyle(canvas).paddingRight);
	var paddingTop = parseFloat(getComputedStyle(canvas).paddingTop);

	
	var mouseX = (event.clientX - bounds.left - paddingLeft);
	var mouseY = (event.clientY - bounds.top - paddingTop);
	
	console.log("Mouse X:", mouseX, "Mouse Y", mouseY);
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


function iterate(currentIteration ,newIterations)
{
	numOfIterations += newIterations;
	while(latticeArray.length > numOfIterations)
	{
		latticeArray.pop();
	}
	updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, Rule, BoundaryCon);
	return currentIteration;
}


