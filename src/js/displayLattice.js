//import { generateLattice } from './generateLattice.js'


var latticeArray = new Array ( new Array);
var currentLattice = new Array(1, 0, 1, 1, 0, 1, 0, 1);
var nextLattice = new Array()


var canvas = document.getElementById("latticeRegion");
var ctx = canvas.getContext("2d"); // gets the lattice display region

var numOfIterations = 1;
var currentIteration = 1;

latticeArray[0] = currentLattice;

console.log("lattice:", latticeArray);


updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration);


function drawLattice(latticeArray){
ctx.clearRect(0,0, canvas.width, canvas.height);
  for (let j = 0; j < latticeArray.length; j++)
  {
    for (let i = 0; i < latticeArray[j].length; i++)
    {
      var size = 30;
      var XIndent = 40;
      var YIndent = 10;
      var YGap = 12;
      var XGap = 1;
 
      ctx.fillStyle = "black";

      ctx.fillRect(XIndent + size * i + i * (XGap + 2) - 1, YIndent + j * (size + YGap) - 1, size + 2, size + 2); //creates an outline on the boxes

      if(latticeArray[j][i] == 0)
      {
        ctx.fillStyle = "white";
      }
      
      ctx.fillRect(XIndent + size * i + i * (XGap + 2), YIndent + j * (size + YGap), size, size);
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
	drawLattice(latticeArray);
}

