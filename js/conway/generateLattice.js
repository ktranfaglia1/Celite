/**
 * generateLattice.js
 *
 * Summary:
 *   This script handles the creation, initialization, and updating of a lattice grid for a cellular automaton.
 *   It includes functions for managing cell neighbor counts, simulating state changes, and updating the visual
 *   representation of the lattice over time.
 *
 * Features:
 *   - Dynamically counts and updates neighbors for each cell.
 *   - Supports lattice grid initialization and setup.
 *   - Handles boundary conditions for cells at the edges of the grid.
 *   - Updates the visual grid based on changes in cell states.
 *
 * Functions:
 *   - alterNeighborCount: Updates the living neighbor count for a specific cell.
 *   - changeNeighbor: Adjusts the neighbor count for surrounding cells when a cell's state changes.
 *   - recountNeighbors: Recalculates the number of neighbors for all cells in the lattice.
 *   - createInit: Initializes the lattice and buffer arrays.
 *   - createVisInit: Sets up the visible lattice grid for rendering.
 *   - createVis: Updates the visual representation of the lattice, including cell colors.
 *   - iterate: Performs one step of the cellular automaton simulation by updating cell states.
 *   - boundaryCollide: Ensures cells at the lattice boundaries are correctly handled during the simulation.
 *
 * Dependencies:
 *  - saveReset: A function from UIFunctionality.js for saving and resetting state.
 *  - iterationCount: A variable from UIFunctionality.js that tracks the iteration count.
 *  - cell: A class from cellClass.js used for managing individual cell states.
 *  - intialCanvas: A function from displayLattice.js for initializing the canvas for lattice rendering.
 *
 * Authors:
 *   - Timothy McKirgan
 *   - Dustin O'Brien
 */

//IMPORTS
import { saveReset } from "./UIFunctionality.js";
import { cell } from "./cellClass.js";
import { intialCanvas } from "./displayLattice.js";
import { iterationCount } from "./UIFunctionality.js";

/**
 * The canvas element used for rendering the lattice.
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("latticeRegion");

/**
 * The buffer size (in cells) used to expand the lattice for display.
 * @type {number}
 */
const buffer = 160;

//Generates Intial Canvas Information
intialCanvas();

/**
 * Canvas height: The height of the canvas element.
 * @type {number}
 */
let canvasHeight = canvas.height;

/**
 * Canvas width: The width of the canvas element.
 * @type {number}
 */
let canvasWidth = canvas.width;

/**
 * Width of the visible section of the canvas in terms of cells.
 * @type {number}
 */
let visLatticeWidth = 800;

/**
 * Height of the visible section of the canvas in terms of cells.
 * @type {number}
 */
let visLatticeHeight = ((visLatticeWidth + 1) * canvasHeight) / canvasWidth;

/**
 * True display size of a cell.
 * @type {number}
 */
let cellSize = canvasHeight / visLatticeHeight;

/**
 * Defines the visible lattice boundaries with [xStart, yStart, xEnd, yEnd].
 * @type {number[]}
 */
let visBounds = new Array(buffer, buffer, buffer + visLatticeWidth, buffer + visLatticeHeight);

/**
 * Holds values of cells reachable by the user.
 * @type {Array<Array<cell>>}
 */
let visLatticeArray = new Array(new Array());

/**
 * Holds values of cells including the buffer.
 * @type {Array<Array<number>>}
 */
let latticeArray = new Array(new Array());

/**
 * Holds values of the lattice boundaries (including buffer).
 * @type {number[]}
 */
let bufferArray = new Array(new Array());

/**
 * Holds length of the lattice boundaries (including buffer).
 * @type {number[]}
 */
let bounds = new Array(visLatticeWidth + 2 * buffer, visLatticeHeight + 2 * buffer);

createInit();

/**
 * This function alters the count of living neighbors for a specific cell in the lattice.
 * It modifies the `bufferArray`, which tracks the number of living neighbors for each cell.
 *
 * The function checks if the provided coordinates are within the boundaries of the lattice
 * and, if they are, updates the corresponding cell's neighbor count by the specified amount.
 *
 * @param {number} x - The x-coordinate (column) of the cell to update.
 * @param {number} y - The y-coordinate (row) of the cell to update.
 * @param {number} num - The number to add to the current neighbor count (can be positive or negative).
 *
 * @returns {void} This function does not return anything; it modifies the global bufferArray.
 */
function alterNeighborCount(x, y, num) {
  // Checks if coordinates are within cell boundaries
  if (x >= 0 && x < bounds[1] && y >= 0 && y < bounds[0]) {
    bufferArray[y][x] += num; // Alters the neighbor count for the specified cell
  }
}

/**
 * This function alters the neighbor count of all neighboring cells when a cell changes its state.
 * It modifies the `bufferArray` by updating the neighbor counts for adjacent cells based on the change.
 *
 * When a cell's state switches (e.g., from alive to dead or vice versa), this function adjusts
 * the number of living neighbors for the surrounding cells that might be affected by the change.
 *
 * The function checks if the provided coordinates are within the lattice boundaries, and if so,
 * updates the neighbor counts for the eight neighboring cells (diagonal and cardinal directions).
 *
 * @param {number} x - The x-coordinate (column) of the cell whose neighbors will be updated.
 * @param {number} y - The y-coordinate (row) of the cell whose neighbors will be updated.
 * @param {number} num - The number to add to the neighbor count for each neighboring cell (can be positive or negative).
 *
 * @returns {void} This function does not return anything; it modifies the global bufferArray.
 */
export function changeNeighbor(x, y, num) {
  //Checks if coordinates are within cell boundaries
  if (x >= 0 && x < bounds[1] && y >= 0 && y < bounds[0]) {
    alterNeighborCount(x + 1, y + 1, num);
    alterNeighborCount(x + 1, y - 1, num);
    alterNeighborCount(x - 1, y + 1, num);
    alterNeighborCount(x - 1, y - 1, num);
    alterNeighborCount(x + 1, y, num);
    alterNeighborCount(x - 1, y, num);
    alterNeighborCount(x, y + 1, num);
    alterNeighborCount(x, y - 1, num);
  }
}

/**
 * This function resets the neighbor counts in the `bufferArray` and then recounts the neighbors for all live cells.
 * It iterates through the `latticeArray` and updates the `bufferArray` to reflect the number of living neighbors
 * for each cell based on the current state of the lattice.
 *
 * If the `clear` parameter is `true`, the neighbor counts are reset but no neighbor recount is performed.
 * If the `clear` parameter is `false` (or not provided), the function will recount the neighbors for each live cell.
 *
 * This function is typically called when updating the neighbor counts to ensure that the lattice array is up-to-date
 * for the next simulation step.
 *
 * @param {boolean} [clear=false] - Whether to only clear the neighbor counts without recounting (default is `false`).
 *
 * @returns {void} This function does not return anything; it modifies the global `bufferArray`.
 */
export function recountNeighbors(clear = false) {
  for (let i = 0; i < bufferArray.length; i++) {
    for (let f = 0; f < bufferArray[i].length; f++) {
      bufferArray[i][f] = 0;
    }
  }
  if (!clear) {
    for (let i = 0; i < latticeArray.length; i++) {
      for (let f = 0; f < latticeArray[i].length; f++) {
        if (latticeArray[i][f] == 1) {
          changeNeighbor(f, i, 1);
        }
      }
    }
  }
}

/**
 * This function creates the initial lattice and buffer arrays, which are used to store the state of the lattice
 * and the count of living neighbors for each cell in the lattice. These arrays are not made up of cell objects,
 * but are instead parallel structures used for storage purposes.
 *
 * The lattice array holds the current state of the cells (alive or dead), while the buffer array stores the number
 * of living neighbors for each cell. The function initializes these arrays with zeros, representing a grid where
 * no cells are alive initially.
 *
 * After the arrays are initialized, the first row is removed from both arrays to ensure they align with the
 * visible portion of the lattice that will be displayed later.
 *
 * @returns {void} This function does not return anything; it modifies the global latticeArray and bufferArray.
 */
export function createInit() {
  latticeArray = new Array(new Array());
  bufferArray = new Array(new Array());
  //Iterate over number of rows in the calculated array
  for (let i = 0; i < bounds[1]; i++) {
    let dummyArr = new Array();
    let dummyArr2 = new Array();
    //Iterate over number of columns in the calculated array
    for (let f = 0; f < bounds[0]; f++) {
      dummyArr.push(0);
      dummyArr2.push(0);
    }
    latticeArray.push(dummyArr);
    bufferArray.push(dummyArr2);
  }
  bufferArray.shift();
  latticeArray.shift();
}

/**
 * This function initializes the visible lattice array using the initial lattice array and the visible boundary.
 * It calculates the necessary offsets to center the canvas and creates the initial grid of cells for display.
 *
 * The function creates an array of cells corresponding to the visible portion of the lattice, ensuring that the
 * cells are correctly positioned and sized. The initial lattice array is used to determine the state of each cell
 * in the grid.
 *
 * The lattice array is then updated with the new grid of cells, which is ready for visualization.
 */
export function createVisInit() {
  let newLat = new Array(new Array());
  let xOffset = (window.innerWidth * 0.9 - (visBounds[2] - visBounds[0]) * cellSize) / 2; //Calculates offset need to center canvas although size is hard coded
  //Iterate over number of rows in the visible array
  for (let i = visBounds[1]; i < visBounds[3]; i++) {
    let posY = i - visBounds[1];
    let dummyArr = new Array();
    //Iterate over number of columns in visible array
    //Create cells for visible lattice
    for (let f = visBounds[0]; f < visBounds[2]; f++) {
      let posX = f - visBounds[0];
      dummyArr.push(new cell(cellSize, cellSize, posX * cellSize + xOffset, posY * cellSize, latticeArray[i][f], true));
    }
    newLat.push(dummyArr);
  }
  newLat.shift();
  visLatticeArray = newLat;
}

/**
 * This function updates the visible lattice array based on the current lattice array and the visible boundary.
 * It adjusts the positions of the cells by applying the given offsets and updates their colors accordingly.
 *
 * The lattice cells' colors are updated based on the current state in the lattice array, and the cells are
 * displayed on the canvas with the given offset positions.
 *
 * @param {number} [xOffset=0] The horizontal offset to apply to the cell positions. Defaults to 0.
 * @param {number} [yOffset=0] The vertical offset to apply to the cell positions. Defaults to 0.
 */
export function createVis(xOffset = 0, yOffset = 0) {
  //Iterate over number of rows in the visible array
  for (let i = 0; i < visBounds[3] - visBounds[1]; i++) {
    //Iterate over number of columns in visible array
    //Only changes X and Y positions to take offset into account if necassary and change cell color if need be
    for (let f = 0; f < visBounds[2] - visBounds[0]; f++) {
      visLatticeArray[i][f].setXLoc(visLatticeArray[i][f].getXLoc() + xOffset);
      visLatticeArray[i][f].setYLoc(visLatticeArray[i][f].getYLoc() + yOffset);
      visLatticeArray[i][f].setColor(latticeArray[i + visBounds[1]][f + visBounds[0]]);
    }
  }
}

/**
 * This function updates the lattice array for each timestep, applying the rules of the simulation.
 *
 * @TODO: Remove Push based to assignment to reduce overhead caused by garbage colletion \n
 * @TODO: Only Run Code on Cells Changing Colors
 *
 * Rules:
 *   - If a dead cell has exactly three living neighbors, it becomes alive.
 *   - If a live cell has two or three living neighbors, it stays alive.
 *   - In all other cases, the cell dies or stays dead.
 *
 * It iterates over the lattice and updates each cell's state according to the number of living neighbors.
 * The lattice is then updated and visualized.
 *
 * @returns {Array} Updated lattice array after applying the rules to each cell.
 */
export function iterate() {
  let neighborInstructions = new Array();

  // If no iterations have happened yet, save the initial lattice for resetting purposes
  if (iterationCount == 0) {
    saveReset();
  }

  // Iterate over all cells in the lattice and apply the rules based on the neighbor count
  for (let i = 0; i < bounds[1]; i++) {
    for (let f = 0; f < bounds[0]; f++) {
      // If the cell is dead and has exactly 3 live neighbors, it becomes alive
      if (latticeArray[i][f] == 0 && bufferArray[i][f] == 3) {
        latticeArray[i][f] = 1;
        neighborInstructions.push(new Array(f, i, 1));
      }
      // If the cell is alive and has less than 2 or more than 3 live neighbors, it dies
      else if (latticeArray[i][f] == 1 && (bufferArray[i][f] < 2 || bufferArray[i][f] > 3)) {
        latticeArray[i][f] = 0;
        neighborInstructions.push(new Array(f, i, -1));
      }
    }
  }

  // Apply changes to each neighbor based on the instructions collected during iteration
  for (let i = 0; i < neighborInstructions.length; i++) {
    changeNeighbor(neighborInstructions[i][0], neighborInstructions[i][1], neighborInstructions[i][2]);
  }

  // Update the visual representation of the lattice
  createVis();

  // Return the updated lattice array
  return latticeArray;
}

/**
 * Checks if there are any living cells (value of 1) on the edges of the lattice array.
 * @returns {boolean} `true` if there is a living cell on any boundary, `false` otherwise.
 */
export function boundaryCollide() {
  let collide = false;
  //Iterate over left and right edge to check for living cells. If there is a living cell, set collide to true
  for (let i = 0; i < bounds[0]; i++) {
    if (latticeArray[0][i] == 1 || latticeArray[latticeArray.length - 1][i] == 1) {
      collide = true;
    }
  }
  //Iterate over top and bottom edge to check for living cells. If there is a living cell, set collide to true
  for (let i = 0; i < bounds[1]; i++) {
    if (latticeArray[i][0] == 1 || latticeArray[i][latticeArray[i].length - 1] == 1) {
      collide = true;
    }
  }
  return collide;
}

//EXPORTS
export { visLatticeArray, visBounds, latticeArray, bounds };
