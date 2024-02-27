//import { generateLattice } from './generateLattice.js'
//import { ruleNumToRule } from '.generateLattice.js'

var latticeArray = new Array ( new Array);
var currentLattice = new Array()
var nextLattice = new Array()
var Rule = new Array()

var canvas = document.getElementById("latticeRegion");
var ctx = canvas.getContext("2d"); // gets the lattice display region
//this.canvas.width = this.canvas.offsetWidth;
//this.canvas.height = this.canvas.offsetHeight;
canvas.width = 1800;
canvas.height = 1400;
canvas.style.width = 1800;
canvas.style.height = 1400;

var numOfIterations = 1;
var currentIteration = 1;

var size = 45;
var XIndent = 1;
var YIndent = 10;
var YGap = 12;
var XGap = 1;


/*
These variables effect the creation of the starting lattice. Inf determines whether the lattice should
autofit such that given the number of iterations, the simulation never needs to trigger a boundary condition.
LatSize determines the number of adjustable cells in the timestep 0 lattice (These will be random until we
can figure out how to toggle them). numOfIterations determines the number of timesteps including the starting
timestep.
*/
var Inf = false;
var LatSize = 10;

function LatticeDisplay() {
	var StartDif = (LatSize * size) / 2;
	var center = canvas.width / 2;
	var StartX = center - StartDif;
	
	for (i = 0; i < LatSize; i++)
	{
		currentLattice.push(new cell (size, size, StartX + i * size, 0, 0))
	}
}

LatticeDisplay()

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

//console.log(currentLattice);
latticeArray[0] = currentLattice;


//console.log("lattice:", latticeArray);

Rule = ruleNumToRule(RuleNum);
updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, Rule, BoundaryCon);

function drawLattice(latticeArray){
ctx.clearRect(0,0, canvas.width, canvas.height);
for (let j = 0; j < latticeArray.length; j++)
  {
    for (let i = 0; i < latticeArray[j].length; i++)
    {
	(latticeArray[j][i]).drawCell(ctx);
    }
  }
}

function updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, Rule, BoundaryCon){

  for(; currentIteration < numOfIterations; currentIteration++)
  {
    nextLattice = generateLattice(currentLattice, Rule, BoundaryCon, currentIteration, size, XIndent, YIndent);
    latticeArray[currentIteration] = nextLattice;
    currentLattice = nextLattice;
  }
	drawLattice(latticeArray);
	outputIteration.innerHTML = "Iteration Count: " + (currentIteration - 1).toString();
}