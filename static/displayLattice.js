//import { generateLattice } from './generateLattice.js'


var latticeArray = new Array ( new Array);
var currentLattice = new Array(0, 0, 0, 0, 0, 0, 0, 0);
var nextLattice = new Array()









const button = document.createElement('button')

// Set the button text to 'Can you click me?'
//button.innerText = 'Can you click me?'

button.id = 'mainButton'

// Attach the "click" event to your button
button.addEventListener('click', () => {
        // When there is a "click"
        // it shows an alert in the browser
alert('Oh, you clicked me!')
})

document.body.appendChild(button)











var canvas = document.getElementById("latticeRegion");
var ctx = canvas.getContext("2d"); // gets the lattice display region

var numOfIterations = 300;
var currentIteration = 1;

latticeArray[0] = currentLattice;

console.log("lattice:", latticeArray);


updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration);
drawLattice(latticeArray);




function drawLattice(latticeArray){
	for (let j = 0; j < latticeArray.length; j++)
	{
		for (let i = 0; i < latticeArray[j].length; i++)
		{
			var size = 30;
			var XIndent = 40;
			var YIndent = 10;
	
			ctx.fillStyle = "black";
			
			ctx.fillRect(XIndent + size * i + i * 3 - 1, YIndent + j * 40 - 1, size + 2, size + 2); //creates an outline on the boxes

			if(latticeArray[j][i] == 0)
			{
				ctx.fillStyle = "white";
			}
	
			ctx.fillRect(XIndent + size * i + i * 3, YIndent + j * 40, size, size);
		}
	}
}


function updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration){

	for(; currentIteration < numOfIterations; currentIteration++)
	{
		nextLattice = generateLattice(currentLattice);
		latticeArray[currentIteration] = nextLattice;
		currentLattice = nextLattice;
	}


}

