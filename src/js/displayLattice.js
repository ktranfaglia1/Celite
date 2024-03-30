/*
UIFunctionality.js
Authors: Timmy McKirgan, Dustin O'Brien
Functions:

alter functions for:

latSize :: Number of Cells in a lattice
size : Cell Size
latticeArray : 2D Cell Aray that is Displayed
currentLattice : Lattice Array at the Bottom of the canvas
nextLattice : Lattice the Next Index will be set too
rule : This is the Rule number for generating how it will work
numOfIterations : Holds number of Iterations to Create
currentIteration : array that holds the bottom of the array
inf : 

*/

//Mutator for latSize
export function alterLatSize(neoLatSize = latSize[0]) {
  latSize[0] = neoLatSize;
}

//Mutator for size
export function alterSize(neoSize = size) {
  size = neoSize;
}

//Mutator for latticeArray
export function alterLatticeArray(neoLatticeArray) {
  latticeArray = neoLatticeArray;
}

//Mutator for currentLattice
export function alterCurrentLattice(neoCurrentLattice) {
  currentLattice = neoCurrentLattice;
}

//Mutator for nextLattice
export function alterNextLattice(neoNextLattice) {
  nextLattice = neoNextLattice;
}

//Mutator for rule
export function alterRule(neoRule) {
  rule = neoRule;
}

//Mutator for numOfIterations
export function alterNumOfIterations(neoNumOfIterations) {
  numOfIterations = neoNumOfIterations;
}

//Mutator for currentIteration
export function alterCurrentIteration(neoCurrentIteration) {
  currentIteration = neoCurrentIteration;
}

//Mutator for ruleNum
export function alterRuleNum(neoRuleNum) {
  ruleNum = neoRuleNum;
}

//Mutator for boundaryCon
export function alterBoundaryCon(neoBoundaryCon) {
  boundaryCon = neoBoundaryCon;
}

//Mutator for inf
export function alterInf(neoInf = inf[0], bufferToggle = inf[1], bufferSize = inf[2]) {
  if (inf[2] != bufferSize) {
    inf[2] = bufferSize;
    console.log("Buffer size changed to " + inf[2])
  }

  if (!inf[0] && neoInf) {
    inf[0] = neoInf;
    console.log("Toggle on Infinite")
    console.log(inf)
  }
  else if (inf[0] && !neoInf) {
    inf[0] = neoInf;
    console.log("Toggling on Finite")
    if (inf[1]) {
      inf[1] = false;
      latSize[1] = 0;
      console.log("Removing buffers of size " + latSize[1] + " on both sides");
    }
    console.log(inf)
  }

  if (inf[0]) {
    if (!inf[1] && bufferToggle) {
      inf[1] = bufferToggle;
      latSize[1] = inf[2]
      console.log("Adding Buffers of size " + latSize[1]);
      console.log(inf)
    }
    else if (inf[1] && !bufferToggle) {
      inf[1] = bufferToggle;
      latSize[1] = 0;
      console.log("Removing buffers of size " + latSize[1] + " on both sides");
      console.log(inf)
    }
  }
}

/*
This function pushes the initial timestep lattice of cells such that the user can select what cells they want
on or off
*/
function LatticeDisplay(latticeArray) {
	let startDif = (latSize[0] * size) / 2;
	let center = canvas.width / 2;
	let startX = center - startDif;
	
  //Iterates over lattice size adding a new cell in top row.
	for (let i = 0; i < latSize[0]; i++) {
		currentLattice.push(new cell (size, size, startX + i * size, 0, 0))
	}
  latticeArray.push(currentLattice);
  drawLattice(latticeArray);
}

//Draws lattices to the canvas
export function drawLattice(latticeArray) {
  //Increases canvas size such that lattice can fit.
  if ((latticeArray.length * size) > canvas.height) {
    canvas.height = (latticeArray.length * size);
    tickCanvas.height = canvas.height;
    //canvas.style.height = (latticeArray.length * size) + 'px';
  }

  //console.log(latticeArray);

  ctx.clearRect(0,0, canvas.width, canvas.height);
  //Iterates over each cell in each lattice in each timestep drawing them to the canvas.
  for (let j = 0; j < latticeArray.length; j++) {
    for (let i = 0; i < latticeArray[j].length; i++) {
      (latticeArray[j][i]).drawCell(ctx);
    }
  }
}

//Creates next timestep lattice then sets the new timestep as the current one.
export function updateLattice(){

  //Iterates over each new iteration that needs to be added to the lattice array.
  for(; currentIteration < numOfIterations; currentIteration++)
  {
    //Generate the next timestep using the current one, the existing rule, the boundary condition
    //the current iteration so that the cells are created in the right spot, and the size of each
    //individual cell to be created in the next timestep.
    nextLattice = generateLattice(currentLattice, rule, boundaryCon, currentIteration, size);
    latticeArray[currentIteration] = nextLattice;
    currentLattice = nextLattice;
  }
  //Update lattice in canvas
	drawLattice(latticeArray);
	outputIteration.innerHTML = "Iteration Count: " + (currentIteration - 1).toString();  // Display iteration count to HTML page upon update
}

import {cell} from "./cellClass.js"
import {ruleNumToRule, generateLattice} from "./generateLattice.js";

//This Variable is used to store the full set of all the lattices
let latticeArray = new Array ( new Array);
//this holds the lattice on the bottom of the array
let currentLattice = new Array()
// Temporary storage holds the next lattice
let nextLattice = new Array()
//This creates a rule array to set as the desired rule when ruleNumToRule is called.
let rule = new Array()

// Gets data on the canvas for displaying purposes
let canvas = document.getElementById("latticeRegion");
let ctx = canvas.getContext("2d"); // gets the lattice display region
//Shows user what iteration we are currently on
let outputIteration = document.getElementById("iterationOutput")

canvas.width = 1800;
canvas.height = 400;

// pulls in Canvas used to display the ticker
const tickCanvas = document.getElementById("tickmarkRegion");
const tctx = tickCanvas.getContext("2d"); // gets the lattice display region
//let errorBox = document.getElementById("errorRegion");
let errorBox = document.getElementById("logRegion")
let errorContext = errorBox.getContext("2d"); // gets the lattice display region

tickCanvas.height = canvas.height;
tickCanvas.width = canvas.width;

let logCanvas = document.getElementById("logRegion"); //Box for Displaying Errors
let lctx = logCanvas.getContext("2d"); // gets the lattice display region

logCanvas.width = 160;
logCanvas.height = 45;
//console.log(errorContext);

//Sets default Lattice Size
let size = 45;

/*
These variables effect the creation of the starting lattice. Inf determines whether the lattice should
autofit such that given the number of iterations, the simulation never needs to trigger a boundary condition.
LatSize determines the number of adjustable cells in the timestep 0 lattice (These will be random until we
can figure out how to toggle them). numOfIterations determines the number of timesteps including the starting
timestep.
*/

let latSize = new Array(10, 0);
let numOfIterations = 1;
let currentIteration = 0;
let inf = new Array(true, false, 0);

/*
These variables determine the generation of new lattices. The rulenum determines the ruleset for when cells
become/stay dead or alive. The boundary condition determines what happens when the rule accessed a value
that is out of bounds of the lattice. When the condition is null (0), all out of bounds cells are presumed
to be 0. When the condition is periodic (1), the simulation will wrap around and check the other end of the
latice.
*/
let ruleNum = 90;
let boundaryCon = 1;

//Sends Variables to needed location
export {ruleNum, boundaryCon, latSize, inf, size, currentIteration};
export {outputIteration, ctx, canvas, tctx, tickCanvas, rule, nextLattice, logCanvas, lctx};
export {latticeArray, numOfIterations, currentLattice};

//Sets starting lattice to all dead
latticeArray[0] = currentLattice;

LatticeDisplay(latticeArray);
rule = ruleNumToRule(ruleNum);
updateLattice();
