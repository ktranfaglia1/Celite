var latticeArray = new Array ( new Array);
var currentLattice = new Array()
var nextLattice = new Array()
var rule = new Array()

var canvas = document.getElementById("latticeRegion");
var ctx = canvas.getContext("2d"); // gets the lattice display region
var outputIteration = document.getElementById("iterationOutput")

var errorBox = document.getElementById("errorRegion");
var errorContext = errorBox.getContext("2d"); // gets the lattice display region

var numOfIterations = 1;
var currentIteration = 1;

var size = 45;

canvas.width = 1400;
canvas.height = 350;

/*
These variables effect the creation of the starting lattice. Inf determines whether the lattice should
autofit such that given the number of iterations, the simulation never needs to trigger a boundary condition.
LatSize determines the number of adjustable cells in the timestep 0 lattice (These will be random until we
can figure out how to toggle them). numOfIterations determines the number of timesteps including the starting
timestep.
*/
var inf = false;
var latSize = 10;

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

/*
These variables determine the generation of new lattices. The rulenum determines the ruleset for when cells
become/stay dead or alive. The boundary condition determines what happens when the rule accessed a value
that is out of bounds of the lattice. When the condition is null (0), all out of bounds cells are presumed
to be 0. When the condition is periodic (1), the simulation will wrap around and check the other end of the
latice.
*/
var ruleNum = 142;
var boundaryCon = 1;

latticeArray[0] = currentLattice;

LatticeDisplay()
rule = ruleNumToRule(ruleNum);
updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, rule, boundaryCon);

//Draws lattices to the canvas
function drawLattice(latticeArray) {
  //Increases canvas size such that lattice can fit.
  if ((latticeArray.length * size) > canvas.height) {
    canvas.height = (latticeArray.length * size);
    //canvas.style.height = (latticeArray.length * size) + 'px';
  }

  console.log(latticeArray);

  ctx.clearRect(0,0, canvas.width, canvas.height);
  //Iterates over each cell in each lattice in each timestep drawing them to the canvas.
  for (let j = 0; j < latticeArray.length; j++) {
    for (let i = 0; i < latticeArray[j].length; i++) {
      (latticeArray[j][i]).drawCell(ctx);
    }
  }
}

//Creates next timestep lattice then sets the new timestep as the current one.
function updateLattice(latticeArray, currentLattice, nextLattice, numOfIterations, currentIteration, rule, boundaryCon){

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