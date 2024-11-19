/**
 * UIFunctionality.js
 *
 * Summary:
 *   Handles the user interface functionality for the Game of Life simulation. This script contains functions
 *   to manage user inputs, update the lattice and its cells, control iterations, and communicate with other
 *   utility files. It also manages the setup and configuration of various simulation parameters.
 *
 * Features:
 *   - Alters the size and configuration of the lattice and cells.
 *   - Manages the iteration process and updates the lattice over time.
 *   - Allows the user to modify rules and boundary conditions for the simulation.
 *   - Provides functions for setting up and altering cell orders.
 *   - Interfaces with the display system to render the lattice on the canvas.
 *
 * Functions:
 *   - alterLatSize: Alters the size of the lattice.
 *   - alterSize: Alters the size of the individual cells.
 *   - alterLatticeArray: Alters the 2D array of cells displayed on the lattice.
 *   - alterCurrentLattice: Alters the current lattice being displayed.
 *   - alterNextLattice: Alters the next lattice to be used.
 *   - alterRule: Alters the rule number used to determine cell states.
 *   - alterNumOfIterations: Alters the number of iterations to run in the simulation.
 *   - alterCurrentIteration: Alters the current iteration being processed.
 *   - alterOrder: Alters the order in which cells are updated.
 *   - alterTempOrder: Alters the temporary order values provided by the user.
 *   - alterSetup: Alters the setup configuration and applies it to the first row of the lattice.
 *   - getSetup: Retrieves the current setup configuration.
 *   - getBorder: Retrieves the current border settings.
 *   - alterBoundaryCon: Alters the boundary conditions used in the simulation.
 *
 *
 *  Dependencies:
 *   - cell (from cellClass.js): Represents individual cells in the lattice.
 *   - ruleNumToRule (from generateLattice.js): Converts rule number to actual rule function.
 *   - generateLattice (from generateLattice.js): Generates the next timestep of the lattice.
 *
 * Authors:
 *   - Timmy McKirgan
 *   - Dustin O'Brien
 */

import { cell } from "./cellClass.js";
import { ruleNumToRule, generateLattice } from "./generateLattice.js";

/**
 * Color selector for dead cells.
 * @type {HTMLInputElement}
 */
const deadColorSel = document.getElementById("deadCell");

/**
 * Color selector for alive cells.
 * @type {HTMLInputElement}
 */
const aliveColorSel = document.getElementById("aliveCell");

/**
 * Color selector for the border of dead cells.
 * @type {HTMLInputElement}
 */
const deadBorderSel = document.getElementById("deadBorder");

/**
 * Color selector for the border of alive cells.
 * @type {HTMLInputElement}
 */
const aliveBorderSel = document.getElementById("aliveBorder");

//Intialize each variables Default Values
deadColorSel.value = "#FFFFFF";
aliveColorSel.value = "#000000";
deadBorderSel.value = "#000000";
aliveBorderSel.value = "#808080";

/**
 * Alters the order of the `orderArray` to a new array.
 * This function updates the global `orderArray` to match the provided `neoOrderArray`.
 *
 * @param {Array} neoOrderArray - The new array to replace the existing `orderArray`.
 * @returns {void} This function does not return a value; it modifies the global `orderArray`.
 *
 * @example
 * alterOrder([1, 2, 3, 4]);  */
export function alterOrder(neoOrderArray) {
  orderArray = neoOrderArray;
}

/**
 * Alters the `latSize` to a new value.
 * This function updates the global `latSize` to the provided `neoLatSize`, which determines the dimensions of the lattice.
 *
 * @param {Array} neoLatSize - The new dimensions for the lattice, typically an array with width and height.
 *                            Defaults to the current `latSize` if no value is provided.
 * @returns {void} This function does not return a value; it modifies the global `latSize`.
 *
 * @example
 * alterLatSize([50, 50]);  */
export function alterLatSize(neoLatSize = latSize) {
  latSize = neoLatSize;
}

/**
 * Alters the `size` to a new value.
 * This function updates the global `size` variable, which represents the scale or size of individual cells within the lattice.
 *
 * @param {number} neoSize - The new size value for the cells in the lattice. Defaults to the current `size` if no value is provided.
 * @returns {void} This function does not return a value; it modifies the global `size`.
 *
 * @example
 * alterSize(20);  */
export function alterSize(neoSize = size) {
  size = neoSize;
}

/**
 * Alters the `latticeArray` to a new value.
 * This function updates the global `latticeArray`, which represents the state of the cells in the lattice.
 *
 * @param {Array} neoLatticeArray - The new lattice array, containing the updated state of all cells in the lattice.
 * @returns {void} This function does not return a value; it modifies the global `latticeArray`.
 *
 * @example
 * alterLatticeArray(newLatticeArray);  */
export function alterLatticeArray(neoLatticeArray) {
  latticeArray = neoLatticeArray;
}

/**
 * Alters the `currentLattice` to a new value.
 * This function updates the global `currentLattice`, which represents the current configuration of cells in the lattice.
 *
 * @param {Array} neoCurrentLattice - The new lattice, representing the current state of all cells in the lattice.
 * @returns {void} This function does not return a value; it modifies the global `currentLattice`.
 *
 * @example
 * alterCurrentLattice(newCurrentLattice);  */
export function alterCurrentLattice(neoCurrentLattice) {
  currentLattice = neoCurrentLattice;
}

/**
 * Alters the `nextLattice` to a new value.
 * This function updates the global `nextLattice`, which represents the next state of all cells in the lattice.
 *
 * @param {Array} neoNextLattice - The new lattice, representing the next state of all cells in the lattice.
 * @returns {void} This function does not return a value; it modifies the global `nextLattice`.
 *
 * @example
 * alterNextLattice(newNextLattice);  */

export function alterNextLattice(neoNextLattice) {
  nextLattice = neoNextLattice;
}

/**
 * Alters the `rule` to a new value.
 * This function updates the global `rule`, which determines the logic for cell transitions in the simulation.
 *
 * @param {Object} neoRule - The new rule, typically an object or array that defines the cell transition logic.
 * @returns {void} This function does not return a value; it modifies the global `rule`.
 *
 * @example
 * alterRule(newRule);  */
export function alterRule(neoRule) {
  rule = neoRule;
}

/**
 * Alters the `numOfIterations` to a new value.
 * This function updates the global `numOfIterations`, which controls how many iterations the simulation will run.
 *
 * @param {number} neoNumOfIterations - The new number of iterations for the simulation.
 * @returns {void} This function does not return a value; it modifies the global `numOfIterations`.
 *
 * @example
 * alterNumOfIterations(100);  */
export function alterNumOfIterations(neoNumOfIterations) {
  numOfIterations = neoNumOfIterations;
}

/**
 * Alters the `currentIteration` to a new value.
 * This function updates the global `currentIteration`, which tracks the current iteration of the simulation.
 *
 * @param {number} neoCurrentIteration - The new current iteration for the simulation.
 * @returns {void} This function does not return a value; it modifies the global `currentIteration`.
 *
 * @example
 * alterCurrentIteration(5);  */
export function alterCurrentIteration(neoCurrentIteration) {
  currentIteration = neoCurrentIteration;
}

/**
 * Alters the `ruleNum` to a new value.
 * This function updates the global `ruleNum`, which defines the rule number used in the simulation.
 *
 * @param {number} neoRuleNum - The new rule number to be set for the simulation.
 * @returns {void} This function does not return a value; it modifies the global `ruleNum`.
 *
 * @example
 * alterRuleNum(30);  */
export function alterRuleNum(neoRuleNum) {
  ruleNum = neoRuleNum;
}

/**
 * Alters the `boundaryCon` to a new value.
 * This function updates the global `boundaryCon`, which controls the boundary condition of the lattice.
 *
 * @param {boolean} neoBoundaryCon - The new boundary condition to be set for the lattice.
 * @returns {void} This function does not return a value; it modifies the global `boundaryCon`.
 *
 * @example
 * alterBoundaryCon(true);  */
export function alterBoundaryCon(neoBoundaryCon) {
  boundaryCon = neoBoundaryCon;
}

/**
 * Alters the `border` to a new value.
 * This function updates the global `border`, which controls the border settings of the lattice.
 *
 * @param {boolean} neoBorder - The new border style to be set for the lattice.
 * @returns {void} This function does not return a value; it modifies the global `border`.
 *
 */
export function alterBorder(neoBorder) {
  border = neoBorder;
}

/**
 * Returns the current value of the `border`.
 * This function retrieves the global `border` setting used for the lattice.
 *
 * @returns {boolean} The current border setting for the lattice.
 */

export function getBorder() {
  return border;
}

/**
 * Initializes and displays the lattice for the simulation at the start timestep.
 * The user can select which cells are on or off by interacting with the displayed lattice.
 *
 * @param {Array} latticeArray - The array containing the lattice cells.
 * This function creates the first row of cells based on the lattice size and size parameters,
 * positioning them so that they are centered on the canvas.
 */
function LatticeDisplay(latticeArray) {
  let startDif = (latSize * size) / 2;
  let center = canvas.width / 2;
  let startX = center - startDif;

    for (let i = 0; i < latSize; i++) {
    currentLattice.push(new cell(size, size, startX + i * size, 0, 0));
  }
  latticeArray.push(currentLattice);
  drawLattice(latticeArray);
}

/**
 * Draws the lattice grid onto the canvas, updating the visual representation of the simulation.
 * The function ensures the canvas size is adjusted to fit the lattice, applies borders to cells,
 * and draws each cell in the lattice at the correct position.
 *
 * @param {Array} latticeArray - The array of lattice cells to be drawn.
 * This function updates the canvas size to accommodate the lattice, applies borders to the cells,
 * and draws them in the appropriate positions based on their state.
 */
export function drawLattice(latticeArray) {
    if (latticeArray.length * size > canvas.height) {
    canvas.height = latticeArray.length * size;
    tickCanvas.height = canvas.height;
      }

  for (let i = 0; i < latticeArray.length; i++) {
    for (let j = 0; j < latticeArray[0].length; j++) {
      latticeArray[i][j].setBorder(border);
    }
  }

    if (latticeArray.length <= 1)
    for (let i = 0; i < latticeArray[0].length; i++) {
      latticeArray[0][i].setBorder(true);
    }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let j = 0; j < latticeArray.length; j++) {
    for (let i = 0; i < latticeArray[j].length; i++) {
      latticeArray[j][i].drawCell(ctx);
    }
  }
}

/**
 * Generates the next timestep of the lattice based on the current lattice, rule, boundary condition,
 * and iteration count, then updates the lattice array and the displayed iteration count.
 * The current lattice is updated to the newly generated lattice, and the lattice is redrawn on the canvas.
 *
 * @function updateLattice
 * Updates the simulation by generating the next timestep lattice for each iteration, applying the
 * current rule and boundary condition, and then redrawing the updated lattice on the canvas.
 */

export function updateLattice() {
    for (; currentIteration < numOfIterations; currentIteration++) {
                nextLattice = generateLattice(currentLattice, rule, boundaryCon, currentIteration, size);
    latticeArray[currentIteration] = nextLattice;
    currentLattice = nextLattice;
  }
    drawLattice(latticeArray);
  outputIteration.innerHTML = "Iteration Count: " + (currentIteration - 1).toString(); }

/**
 * Initializes the orderArray with a sequence of numbers from 0 to latSize-1.
 * This function resets the orderArray before filling it with values and prints it to the console for debugging purposes.
 *
 * @function createOrder
 * Initializes and populates the orderArray with values from 0 to latSize-1 for the purpose of controlling the order of operations.
 */
export function createOrder() {
  orderArray.length = 0;
  for (let i = 0; i < latSize; i++) {
    orderArray.push(i);
  }
}

/**
 * Alters the tempOrder array with the provided new value.
 * This function updates the tempOrder to a new array as specified by the input.
 *
 * @param {Array} neoTempOrder - The new array to replace the existing tempOrder.
 */
export function alterTempOrder(neoTempOrder) {
  tempOrder = neoTempOrder;
}

/**
 * Returns the current setup value.
 * This function retrieves the value of the setup and returns it.
 *
 * @returns {boolean} The current value of the setup.
 */

export function getSetup() {
  return setup;
}

/**
 * Updates the setup value and applies it to the first row of the lattice.
 * This function changes the setup to a new value and applies this setup to the first row of the lattice cells.
 *
 * @param {any} neoSetup - The new setup value to be applied.
 */
export function alterSetup(neoSetup) {
  setup = neoSetup;
  for (let i = 0; i < latticeArray[0].length; i++) {
    console.log(latticeArray[0][i]);
    latticeArray[0][i].setSetup(neoSetup);
  }
}

//This variable holds the order that cells will be altered in.
let orderArray = new Array();
// The array that stores Order while its being modified
let tempOrder = new Array();
//This Variable is used to store the full set of all the lattices
let latticeArray = new Array(new Array());
//this holds the lattice on the bottom of the array
let currentLattice = new Array();
// Temporary storage holds the next lattice
let nextLattice = new Array();
//This creates a rule array to set as the desired rule when ruleNumToRule is called.
let rule = new Array();

// Gets data on the canvas for displaying purposes
let canvas = document.getElementById("latticeRegion");
let ctx = canvas.getContext("2d"); //Shows user what iteration we are currently on
let outputIteration = document.getElementById("iterationOutput");

canvas.width = 1800;
canvas.height = 400;

// pulls in Canvas used to display the ticker
const tickCanvas = document.getElementById("tickmarkRegion");
const tctx = tickCanvas.getContext("2d"); 
tickCanvas.height = canvas.height;
tickCanvas.width = canvas.width;

let logCanvas = document.getElementById("logRegion"); //Box for Displaying Errors
let lctx = logCanvas.getContext("2d"); 
logCanvas.width = 160;
logCanvas.height = 45;

//Sets default Lattice Size
let size = 45;

/*
These variables effect the creation of the starting lattice. 
LatSize determines the number of adjustable cells in the timestep 0 lattice.
numOfIterations determines the number of timesteps including the starting timestep.
*/

let latSize = 10;
let numOfIterations = 10;
let currentIteration = 0;

for (let i = 0; i < latSize; i++) {
  tempOrder[i] = -1;
}

export let border = false; //Creates setup variable and defaults to false
let setup = false;
/*
These variables determine the generation of new lattices. The rulenum determines the ruleset for when cells
become/stay dead or alive. The boundary condition determines what happens when the rule accessed a value
that is out of bounds of the lattice. When the condition is null (0), all out of bounds cells are presumed
to be 0. When the condition is periodic (1), the simulation will wrap around and check the other end of the
latice.
*/
let ruleNum = 90;
let boundaryCon = 1;

//latticeArray[0] = currentLattice;
latticeArray = [];
LatticeDisplay(latticeArray);
rule = ruleNumToRule(ruleNum);
createOrder();
updateLattice();


//Sends Variables to needed location
export { ruleNum, boundaryCon, latSize, size, currentIteration };
export { outputIteration, ctx, canvas, tctx, tickCanvas, rule, nextLattice, logCanvas, lctx };
export { latticeArray, numOfIterations, currentLattice, orderArray, tempOrder };
export { deadColorSel, aliveColorSel, deadBorderSel, aliveBorderSel };
