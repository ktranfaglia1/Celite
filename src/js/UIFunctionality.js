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

iterateButton.addEventListener("click", function()
{iterate(currentIteration, addIterations);});

clearButton.addEventListener("click", function()
{clear(latticeArray);});










function clear(latticeArray)
{
	numOfIterations = 1;
	currentIteration = 1;
	while(latticeArray.length > 1)
	{
		latticeArray.pop();
	}
	currentLattice = latticeArray[0];
	updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration);
}

function iterate(currentIteration ,addIterations)
{
	numOfIterations += addIterations;
	updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration);
	return currentIteration;
}


