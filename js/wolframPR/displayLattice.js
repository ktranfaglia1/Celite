/**
 * displayLattice.js
 *
 * Summary:
 *   This script provides various functions to modify and interact with the lattice in the Game of Life simulation.
 *   It includes mutator functions for lattice size, cell size, lattice arrays, iteration handling, and rule application.
 *   The script enables the adjustment of simulation parameters and manages the flow of iterations.
 *
 * Features:
 *   - Adjusts the number of cells in the lattice and the size of each cell.
 *   - Updates and manages the 2D lattice array displayed on the canvas.
 *   - Handles the current and next lattice arrays for the simulation.
 *   - Allows the modification of simulation rules and iterations.
 *   - Manages iteration count and updates the simulation state accordingly.
 *
 * Functions:
 *   - alterLatSize(neoLatSize): Modifies the number of cells in the lattice.
 *   - alterSize(neoSize): Changes the size of each individual cell.
 *   - alterLatticeArray(neoLatticeArray): Updates the current lattice array to a new one.
 *   - alterCurrentLattice(neoCurrentLattice): Sets the current lattice array for the bottom of the canvas.
 *   - alterNextLattice(neoNextLattice): Updates the next lattice array for the next iteration.
 *   - alterRule(neoRule): Alters the rule number used for cell state transitions.
 *   - alterNumOfIterations(neoNumOfIterations): Adjusts the number of iterations for the simulation.
 *   - alterCurrentIteration(neoCurrentIteration): Changes the current iteration count.
 *   - alterRuleNum(neoRuleNum): Modifies the rule number used for cell transitions.
 *   - alterBoundaryCon(neoBoundaryCon): Updates the boundary condition setting for the simulation.
 *   - alterBorder(neoBorder): Toggles the border visibility for the cells.
 *   - alterInf(neoInf, bufferToggle, bufferSize): Modifies the internal buffer settings and inf conditions.
 *   - updateLattice(): Updates the lattice for the next timestep based on the current settings.
 *   - drawLattice(latticeArray): Draws the updated lattice on the canvas.
 *   - LatticeDisplay(latticeArray): Displays the initial lattice setup on the canvas.
 *   - inLattice(xLoc, yLoc): Checks if the given coordinates are within the lattice bounds.
 *   - setDelay(newDelay): Adjusts the delay between iterations.
 *
 * Dependencies:
 *   - cell from './cellClass.js': Defines the cell class for creating and manipulating individual cells.
 *   - ruleNumToRule, generateLattice from './generateLattice.js': Provides functions for converting rule numbers to rules and generating the lattice for each timestep.
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
 * Array holding all the lattice configurations over time.
 * @type {Array<Array<Cell>>}
 */
let latticeArray = new Array(new Array());

/**
 * Holds the lattice for the current timestep (bottom of the lattice array).
 * @type {Array<Cell>}
 */
let currentLattice = new Array();

/**
 * Temporary storage for the next lattice configuration to be generated.
 * @type {Array<Cell>}
 */
let nextLattice = new Array();

/**
 * Array representing the rule for the Game of Life simulation.
 * @type {Array<number>}
 */
let rule = new Array();

/**
 * The HTML canvas element used to display the lattice.
 * @type {HTMLCanvasElement}
 */
let canvas = document.getElementById("latticeRegion");

/**
 * The 2D rendering context for the lattice canvas.
 * @type {CanvasRenderingContext2D}
 */
let ctx = canvas.getContext("2d");

/**
 * The HTML element that displays the current iteration count.
 * @type {HTMLElement}
 */
let outputIteration = document.getElementById("iterationOutput");

canvas.width = 1800;
canvas.height = 400;

/**
 * The HTML canvas element used for displaying the ticker.
 * @type {HTMLCanvasElement}
 */
const tickCanvas = document.getElementById("tickmarkRegion");

/**
 * The 2D rendering context for the tick canvas.
 * @type {CanvasRenderingContext2D}
 */
const tctx = tickCanvas.getContext("2d");

tickCanvas.height = canvas.height;
tickCanvas.width = canvas.width;

/**
 * The HTML canvas element used to display errors or logs.
 * @type {HTMLCanvasElement}
 */
let logCanvas = document.getElementById("logRegion");

/**
 * The 2D rendering context for the log canvas.
 * @type {CanvasRenderingContext2D}
 */
let lctx = logCanvas.getContext("2d");

logCanvas.width = 160;
logCanvas.height = 45;

/**
 * The default size of each lattice cell.
 * @type {number}
 */
let size = 45;

/**
 * Array that determines the size of the lattice (latSize[0]) and the number of adjustable cells (latSize[1]) in the initial timestep.
 * @type {Array<number>}
 */
let latSize = new Array(10, 0);

/**
 * The total number of iterations (timesteps) for the simulation, including the starting timestep.
 * @type {number}
 */
let numOfIterations = 1;

/**
 * The current iteration number, starting at 0 for the initial timestep.
 * @type {number}
 */
let currentIteration = 0;

/**
 * Array holding flags and values for the "inf" (infinite) condition:
 * - inf[0]: Whether the lattice should autofit to prevent triggering a boundary condition.
 * - inf[1]: Buffer toggle for the infinite boundary condition.
 * - inf[2]: The buffer size when using the infinite boundary condition.
 * @type {Array<boolean|number>}
 */
let inf = new Array(true, false, 0);

/**
 * Flag determining whether the border around the lattice is enabled or disabled.
 * @type {boolean}
 */
let border = false;
/**
 * The rule number used for determining cell behavior (dead or alive) in the simulation.
 * @type {number}
 */
let ruleNum = 90;

/**
 * The boundary condition applied when the rule accesses a value outside the lattice:
 * - 0: Null condition, where out-of-bounds cells are treated as 0 (dead).
 * - 1: Periodic condition, where out-of-bounds cells wrap around to the other end of the lattice.
 * @type {number}
 */
let boundaryCon = 1;

// Clears the latticeArray to ensure the lattice is reset before creating a new one
latticeArray = [];

// Initializes and displays the starting lattice on the canvas
LatticeDisplay(latticeArray);

// Converts the rule number into an array of rules for cell state transitions
rule = ruleNumToRule(ruleNum);

// Generates and updates the lattice for the next timestep and draws it onto the canvas
updateLattice();

/**
 * Mutator function for updating the lattice size.
 *
 * @param {number} [neoLatSize=latSize[0]] - The new lattice size to set. Defaults to the current size if not provided.
 *
 * @returns {void}
 */
export function alterLatSize(neoLatSize = latSize[0]) {
  latSize[0] = neoLatSize;
}
/**
 * Mutator function for updating the size.
 *
 * @param {number} [neoSize=size] - The new size to set. Defaults to the current size if not provided.
 *
 * @returns {void}
 */
export function alterSize(neoSize = size) {
  size = neoSize;
}

/**
 * Mutator function for updating the latticeArray.
 *
 * @param {Array} neoLatticeArray - The new lattice array to set.
 *
 * @returns {void}
 */
export function alterLatticeArray(neoLatticeArray) {
  latticeArray = neoLatticeArray;
}

/**
 * Mutator function for updating the currentLattice.
 *
 * @param {Object} neoCurrentLattice - The new lattice object to set as currentLattice.
 *
 * @returns {void}
 */
export function alterCurrentLattice(neoCurrentLattice) {
  currentLattice = neoCurrentLattice;
}

/**
 * Mutator function for updating the nextLattice.
 *
 * @param {Object} neoNextLattice - The new lattice object to set as nextLattice.
 *
 * @returns {void}
 */
export function alterNextLattice(neoNextLattice) {
  nextLattice = neoNextLattice;
}

/**
 * Mutator function for updating the rule.
 *
 * @param {number} neoRule - The new rule number to set.
 *
 * @returns {void}
 */
export function alterRule(neoRule) {
  rule = neoRule;
}

/**
 * Mutator function for updating the number of iterations.
 *
 * @param {number} neoNumOfIterations - The new number of iterations to set.
 *
 * @returns {void}
 */
export function alterNumOfIterations(neoNumOfIterations) {
  numOfIterations = neoNumOfIterations;
}

/**
 * Mutator function for updating the current iteration.
 *
 * @param {number} neoCurrentIteration - The new current iteration to set.
 *
 * @returns {void}
 */
export function alterCurrentIteration(neoCurrentIteration) {
  currentIteration = neoCurrentIteration;
}

/**
 * Mutator function for updating the rule number.
 *
 * @param {number} neoRuleNum - The new rule number to set.
 *
 * @returns {void}
 */
export function alterRuleNum(neoRuleNum) {
  ruleNum = neoRuleNum;
}

/**
 * Mutator function for updating the boundary condition.
 *
 * @param {boolean} neoBoundaryCon - The new boundary condition to set.
 *
 * @returns {void}
 */
export function alterBoundaryCon(neoBoundaryCon) {
  boundaryCon = neoBoundaryCon;
}

/**
 * Mutator function for updating the border.
 *
 * @param {string} neoBorder - The new border value to set.
 *
 * @returns {void}
 */
export function alterBorder(neoBorder) {
  border = neoBorder;
}

/**
 * Getter function for retrieving the current border value.
 *
 * @returns {string} The current border value.
 */
export function getBorder() {
  return border;
}

/**
 * Mutator function for modifying the `inf` array and handling related logic
 * for buffer settings and lattice size.
 *
 * This function updates the `inf` array based on the provided values for
 * `neoInf`, `bufferToggle`, and `bufferSize`. It also modifies `latSize` based
 * on certain conditions tied to the state of `inf`.
 *
 * @param {boolean} neoInf - The new value for `inf[0]`. If `inf[0]` changes state,
 * it may trigger additional logic related to the buffer and lattice size.
 * @param {boolean} bufferToggle - The state for enabling or disabling the buffer.
 * @param {number} bufferSize - The new buffer size to be applied if the buffer is enabled.
 */
export function alterInf(
  neoInf = inf[0],
  bufferToggle = inf[1],
  bufferSize = inf[2]
) {
  if (inf[2] != bufferSize) {
    inf[2] = bufferSize;
  }

  if (!inf[0] && neoInf) {
    inf[0] = neoInf;
  } else if (inf[0] && !neoInf) {
    inf[0] = neoInf;
    if (inf[1]) {
      inf[1] = false;
      latSize[1] = 0;
    }
  }

  if (inf[0]) {
    if (!inf[1] && bufferToggle) {
      inf[1] = bufferToggle;
      latSize[1] = inf[2];
    } else if (inf[1] && !bufferToggle) {
      inf[1] = bufferToggle;
      latSize[1] = 0;
    }
  }
}

/**
 * Initializes the lattice for the first timestep, allowing the user to select
 * cells to be turned on or off. This function sets up the top row of the lattice
 * and pushes the current state of the lattice into the `latticeArray`.
 *
 * It calculates the starting position of the first cell and iterates over the
 * lattice size to create and position cells in the top row of the lattice.
 *
 * @param {Array} latticeArray - The array that stores the lattice states.
 * It is modified by pushing the current timestep lattice (top row of cells) to it.
 */
function LatticeDisplay(latticeArray) {
  let startDif = (latSize[0] * size) / 2;
  let center = canvas.width / 2;
  let startX = center - startDif;

  for (let i = 0; i < latSize[0]; i++) {
    currentLattice.push(new cell(size, size, startX + i * size, 0, 0));
  }
  latticeArray.push(currentLattice);
  drawLattice(latticeArray);
}

/**
 * Draws the lattice grid onto the canvas, ensuring it fits within the canvas dimensions.
 * This function iterates through each cell in the lattice array and updates the canvas,
 * drawing each cell with the appropriate borders and colors based on its state.
 *
 * It also ensures that the top row of the lattice always has borders enabled for easy
 * clicking, and the canvas size is adjusted dynamically to fit the lattice grid.
 *
 * @param {Array<Array<Object>>} latticeArray - The 2D array representing the lattice,
 * where each element is a cell object that holds the properties and methods for drawing.
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

  ctx.fillStyle = deadColorSel.value;
  ctx.fillRect(
    latticeArray[0][0].getXLoc(),
    latticeArray[0][0].getYLoc(),
    latticeArray[0].length * latticeArray[0][0].getHeight(),
    latticeArray.length * latticeArray[0][0].getWidth()
  );
  for (let j = 0; j < latticeArray.length; j++) {
    for (let i = 0; i < latticeArray[j].length; i++) {
      latticeArray[j][i].drawCell(ctx);
    }
  }
}

/**
 * Creates the next timestep lattice based on the current lattice and updates it as the new current timestep.
 *
 * This function iterates through each timestep, generating the next lattice using the current lattice, the
 * specified rule, boundary condition, and the size of individual cells. It then updates the lattice array
 * with the new timestep and sets the current lattice to the newly generated lattice.
 *
 * After updating the lattice, the function redraws the lattice on the canvas and updates the iteration count
 * displayed on the HTML page.
 *
 * @returns {void}
 */
export function updateLattice() {
  for (; currentIteration < numOfIterations; currentIteration++) {
    nextLattice = generateLattice(
      currentLattice,
      rule,
      boundaryCon,
      currentIteration,
      size
    );
    latticeArray[currentIteration] = nextLattice;
    currentLattice = nextLattice;
  }
  drawLattice(latticeArray);
  outputIteration.innerHTML =
    "Iteration Count: " + (currentIteration - 1).toString();
}

//Sends Variables to needed location
export { ruleNum, boundaryCon, latSize, inf, size, currentIteration };
export {
  outputIteration,
  ctx,
  canvas,
  tctx,
  tickCanvas,
  rule,
  nextLattice,
  logCanvas,
  lctx,
};
export { latticeArray, numOfIterations, currentLattice };
export { deadColorSel, aliveColorSel, deadBorderSel, aliveBorderSel };
