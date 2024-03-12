//Mutator for latSize
export function alterLatSize(neoLatSize) {
  latSize = neoLatSize;
}

//Mutator for size
export function alterSize(neoSize) {
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

//Mutator for inf
export function alterInf(neoInf) {
  inf = neoInf;
}

//Mutator for ruleNum
export function alterRuleNum(neoRuleNum) {
  ruleNum = neoRuleNum;
}

//Mutator for boundaryCon
export function alterBoundaryCon(neoBoundaryCon) {
  boundaryCon = neoBoundaryCon;
}

/*
This function pushes the initial timestep lattice of cells such that the user can select what cells they want
on or off
*/
function LatticeDisplay() {
	let startDif = (latSize * size) / 2;
	let center = canvas.width / 2;
	let startX = center - startDif;
	
  //Iterates over lattice size adding a new cell in top row.
	for (let i = 0; i < latSize; i++) {
		currentLattice.push(new cell (size, size, startX + i * size, 0, 0))
	}
}

//Draws lattices to the canvas
export function drawLattice(latticeArray) {
  //Increases canvas size such that lattice can fit.
  if ((latticeArray.length * size) > canvas.height) {
    canvas.height = (latticeArray.length * size);
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
export function updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, rule, boundaryCon){

  console.log(boundaryCon);
  //Iterates over each new iteration that needs to be added to the lattice array.
  for(; currentIteration < numOfIterations; currentIteration++)
  {
    nextLattice = generateLattice(currentLattice, rule, boundaryCon, currentIteration, size);
    latticeArray[currentIteration] = nextLattice;
    currentLattice = nextLattice;
  }
	drawLattice(latticeArray);
	outputIteration.innerHTML = "Iteration Count: " + (currentIteration - 1).toString();  // Display iteration count to HTML page upon update
}

import {cell} from "./cellClass.js"
import {ruleNumToRule, generateLattice} from "./generateLattice.js";

let latticeArray = new Array ( new Array);
let currentLattice = new Array()
let nextLattice = new Array()
let rule = new Array()

let canvas = document.getElementById("latticeRegion");
let ctx = canvas.getContext("2d"); // gets the lattice display region
let outputIteration = document.getElementById("iterationOutput")

canvas.width = 1400;
canvas.height = 350;

//let errorBox = document.getElementById("errorRegion");
let errorBox = document.getElementById("logRegion")
let errorContext = errorBox.getContext("2d"); // gets the lattice display region

let numOfIterations = 1;
let currentIteration = 1;

let size = 45;

/*
These variables effect the creation of the starting lattice. Inf determines whether the lattice should
autofit such that given the number of iterations, the simulation never needs to trigger a boundary condition.
LatSize determines the number of adjustable cells in the timestep 0 lattice (These will be random until we
can figure out how to toggle them). numOfIterations determines the number of timesteps including the starting
timestep.
*/
let inf = false;
let latSize = 10;

/*
These variables determine the generation of new lattices. The rulenum determines the ruleset for when cells
become/stay dead or alive. The boundary condition determines what happens when the rule accessed a value
that is out of bounds of the lattice. When the condition is null (0), all out of bounds cells are presumed
to be 0. When the condition is periodic (1), the simulation will wrap around and check the other end of the
latice.
*/
let ruleNum = 90;
let boundaryCon = 1;

export {ruleNum, boundaryCon, latSize, inf, size, currentIteration};
export {errorContext, errorBox, outputIteration, ctx, canvas, rule, nextLattice};
export {latticeArray, numOfIterations, currentLattice};

latticeArray[0] = currentLattice;

LatticeDisplay()
rule = ruleNumToRule(ruleNum);
updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, rule, boundaryCon);