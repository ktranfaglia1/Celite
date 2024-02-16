//import { generateLattice } from './generateLattice.js'
//import { ruleNumToRule } from '.generateLattice.js'

var latticeArray = new Array ( new Array);
var currentLattice = new Array()
var nextLattice = new Array()
var Rule = new Array()

var canvas = document.getElementById("latticeRegion");
var ctx = canvas.getContext("2d"); // gets the lattice display region

var numOfIterations = 1;
var currentIteration = 1;
/*
These variables effect the creation of the starting lattice. Inf determines whether the lattice should
autofit such that given the number of iterations, the simulation never needs to trigger a boundary condition.
LatSize determines the number of adjustable cells in the timestep 0 lattice (These will be random until we
can figure out how to toggle them). numOfIterations determines the number of timesteps including the starting
timestep.
*/
var Inf = false;
var LatSize = 10;
var numOfIterations = 15;

if (Inf)
{
	for (i = 0; i < (numOfIterations - 1); i++)
	{
		currentLattice.push(0)
	}
}
for (i = 0; i < LatSize; i++)
{
	currentLattice.push(Math.floor(Math.random() * 2))
}
if (Inf)
{
	for (i = 0; i < (numOfIterations - 1); i++)
	{
		currentLattice.push(0)
	}
}

/*
These variables determine the generation of new lattices. The rulenum determines the ruleset for when cells
become/stay dead or alive. The boundary condition determines what happens when the rule accessed a value
that is out of bounds of the lattice. When the condition is null (0), all out of bounds cells are presumed
to be 0. When the condition is periodic (1), the simulation will wrap around and check the other end of the
latice.
*/
var RuleNum = 142;
var BoundaryCon = 1;

if (RuleNum > 255)
{
	RuleNum = 255
}
if (RuleNum < 0)
{
	RuleNum = 0
}

latticeArray[0] = currentLattice;


console.log("lattice:", latticeArray);

Rule = ruleNumToRule(RuleNum);
updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, Rule, BoundaryCon);

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

function updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, Rule, BoundaryCon){

  for(; currentIteration < numOfIterations; currentIteration++)
  {
    nextLattice = generateLattice(currentLattice, Rule, BoundaryCon);
    latticeArray[currentIteration] = nextLattice;
    currentLattice = nextLattice;
  }
	drawLattice(latticeArray);
}
