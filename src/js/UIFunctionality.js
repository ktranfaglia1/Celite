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
{iterate(currentIteration, addIterations);});

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
		latticeArray[0][i] = 0;
	}
	currentLattice = latticeArray[0];
	updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration);
}




function iterate(currentIteration ,newIterations)
{
	console.log(newIterations);
	numOfIterations += newIterations;
	while(latticeArray.length > numOfIterations)
	{
		latticeArray.pop();
	}
	updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration);
	return currentIteration;
}


