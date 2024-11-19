/**
 * presets.js
 *
 * Summary:
 *   This script provides a set of functions for manipulating and updating the lattice grid for the Game of Life (GOL) simulation.
 *   It includes functions to create initial configurations, update the lattice, and build specific GOL patterns, such as gliders and oscillators.
 *
 * Features:
 *   - Supports the creation of various Game of Life patterns, such as gliders, 101, and others.
 *   - Provides functions for lattice grid manipulation, including setting cell values and recalculating neighbors.
 *   - Allows updating the visual grid based on changes in the lattice configuration.
 *
 * Functions:
 *   - createNewConfig: Creates and returns a new lattice configuration for the Game of Life.
 *   - setLattice: Updates the visual lattice with a new lattice configuration.
 *   - xCenter: Calculates and returns the center X coordinate of the visible lattice bounds.
 *   - yCenter: Calculates and returns the center Y coordinate of the visible lattice bounds.
 *   - buildGlider: Creates a simple glider pattern in the lattice configuration.
 *   - build101: Builds a "101" pattern in the lattice configuration.
 *   - build119: Builds a "119" pattern in the lattice configuration.
 *   - build1234: Builds a "1234" pattern in the lattice configuration.
 *   - build295: Builds a "295" pattern in the lattice configuration.
 *   - buildGtoG: Builds a "GtoG" pattern in the lattice configuration.
 *   - build60P: Builds a "60P" pattern in the lattice configuration.
 *   - buildAK94: Builds an "AK94" pattern in the lattice configuration.
 *   - buildTrigger: Builds a "Trigger" pattern in the lattice configuration.
 *   - buildSnail: Builds a "Snail" pattern in the lattice configuration.
 *   - buildTub: Builds a "Tub" pattern in the lattice configuration.
 *
 * Dependencies:
 *   - latticeArray, recountNeighbors, visBounds from './generateLattice.js'
 *   - createVis, visLatticeArray from './generateLattice.js'
 *   - displayLattice from './displayLattice.js'
 *   - clear from './UIFunctionality.js'
 *
 * Authors:
 *   - Dustin O'Brien
 */

//IMPORTS
import { latticeArray, recountNeighbors, visBounds } from "./generateLattice.js";
import { createVis, visLatticeArray } from "./generateLattice.js";
import { displayLattice } from "./displayLattice.js";
import { clear } from "./UIFunctionality.js";

/**
 * Creates an initial configuration array (lattice) based on visible bounds,
 * used for setting up the grid with a default state.
 *
 * @function createNewConfig
 * @returns {Array<Array<number>>} - Returns a 2D array (lattice) initialized to 0s,
 * representing the initial configuration of cells.
 */
export function createNewConfig() {
  let newLattice = new Array(new Array());
    for (let i = 0; i < visBounds[3] - visBounds[1]; i++) {
    let dummyArr = new Array();
    for (let f = 0; f < visBounds[2] - visBounds[0]; f++) {
      dummyArr.push(0);
    }
    newLattice.push(dummyArr);
  }
  newLattice.shift();
  return newLattice;
}

/**
 * Sets the visual lattice to a new lattice configuration and updates the display.
 * Clears the current lattice, updates cell states to match `newLattice`, and refreshes the view.
 *
 * @function setLattice
 * @param {Array<Array<number>>} newLattice - The new lattice configuration, a 2D array with each cell's state.
 * @returns {void}
 */
export function setLattice(newLattice) {
  clear();
    if (latticeArray.length == newLattice.length && latticeArray[0].length == newLattice[0].length) {
    for (let i = 0; i < newLattice.length; i++) {
      for (let j = 0; j < newLattice[0].length; j++) {
        latticeArray[i][j] = newLattice[i][j];
      }
    }
  } else {
    for (let i = 0; i < newLattice.length; i++) {
      for (let j = 0; j < newLattice[0].length; j++) {
        latticeArray[i + visBounds[0]][j + visBounds[1]] = newLattice[i][j];
      }
    }
  }

  recountNeighbors();
  createVis();
  displayLattice(visLatticeArray);
}

/**
 * Returns the horizontal center of the visible lattice bounds.
 * Calculates the center based on the difference between the right and left bounds.
 *
 * @function xCenter
 * @returns {number} The horizontal center of the visible lattice area.
 */
export function xCenter() {
  return Math.floor((visBounds[2] - visBounds[0]) / 2);
}

/**
 * Returns the vertical center of the visible lattice bounds.
 * Calculates the center based on the difference between the bottom and top bounds.
 *
 * @function yCenter
 * @returns {number} The vertical center of the visible lattice area.
 */
export function yCenter() {
  return Math.floor((visBounds[3] - visBounds[1]) / 2);
}


/**
 * Creates a simple Glider pattern in the Game of Life.
 * Initializes a blank lattice and then sets the appropriate cells to form the Glider pattern.
 *
 * A Glider is a small, moving pattern in Conway's Game of Life that "glides" across the grid.
 * The specific pattern is a 3x3 set of cells arranged to form a diagonal movement.
 *
 * @function buildGlider
 * @returns {void}
 */
export function buildGlider() {
    let newLattice = createNewConfig();

    newLattice[yCenter() + 1][xCenter()] = 1;
  newLattice[yCenter()][xCenter() + 1] = 1;
  newLattice[yCenter() + 1][xCenter() + 1] = 1;
  newLattice[yCenter() + 1][xCenter() - 1] = 1;
  newLattice[yCenter() - 1][xCenter()] = 1;
    setLattice(newLattice);
}

/**
 * Creates a "101" pattern in the Game of Life based on an existing configuration.
 * This pattern typically consists of a specific arrangement of cells that forms a recognizable
 * shape in Conway's Game of Life. It is often used as a starting point or an intermediary
 * structure in simulations.
 *
 * @function build101
 * @returns {void}
 */
export function build101() {
    let newLattice = createNewConfig();

      newLattice[yCenter() + 1][xCenter()] = 1;
  newLattice[yCenter()][xCenter() + 1] = 1;
  newLattice[yCenter() + 1][xCenter + 1] = 1;
  newLattice[yCenter() + 1][xCenter() - 1] = 1;
  newLattice[yCenter() - 1][xCenter() + 1] = 1;
  newLattice[yCenter() - 2][xCenter()] = 1;
  newLattice[yCenter() - 2][xCenter() - 1] = 1;
  newLattice[yCenter() - 1][xCenter() - 2] = 1;
  newLattice[yCenter()][xCenter() - 2] = 1;

    newLattice[yCenter() - 1][xCenter() - 4] = 1;
  newLattice[yCenter() - 2][xCenter() - 4] = 1;
  newLattice[yCenter()][xCenter() - 4] = 1;
  newLattice[yCenter() + 1][xCenter() - 4] = 1;

    newLattice[yCenter() - 1][xCenter() + 3] = 1;
  newLattice[yCenter() - 2][xCenter() + 3] = 1;
  newLattice[yCenter()][xCenter() + 3] = 1;
  newLattice[yCenter() + 1][xCenter() + 3] = 1;

      newLattice[yCenter() - 5][xCenter() - 4] = 1;
  newLattice[yCenter() - 6][xCenter() - 4] = 1;
  newLattice[yCenter() - 6][xCenter() - 5] = 1;

    newLattice[yCenter() - 5][xCenter() - 6] = 1;
  newLattice[yCenter() - 4][xCenter() - 6] = 1;
  newLattice[yCenter() - 3][xCenter() - 6] = 1;
  newLattice[yCenter() - 2][xCenter() - 6] = 1;
  newLattice[yCenter() - 1][xCenter() - 6] = 1;
  newLattice[yCenter() - 0][xCenter() - 6] = 1;
  newLattice[yCenter() + 1][xCenter() - 6] = 1;
  newLattice[yCenter() + 2][xCenter() - 6] = 1;
  newLattice[yCenter() + 3][xCenter() - 6] = 1;
  newLattice[yCenter() + 4][xCenter() - 6] = 1;

    newLattice[yCenter() + 4][xCenter() - 4] = 1;
  newLattice[yCenter() + 5][xCenter() - 4] = 1;
  newLattice[yCenter() + 5][xCenter() - 5] = 1;

    newLattice[yCenter() - 3][xCenter() - 8] = 1;
  newLattice[yCenter() - 2][xCenter() - 8] = 1;
  newLattice[yCenter() - 3][xCenter() - 9] = 1;
  newLattice[yCenter() - 2][xCenter() - 9] = 1;

    newLattice[yCenter() + 1][xCenter() - 8] = 1;
  newLattice[yCenter() + 2][xCenter() - 8] = 1;
  newLattice[yCenter() + 1][xCenter() - 9] = 1;
  newLattice[yCenter() + 2][xCenter() - 9] = 1;

      newLattice[yCenter() - 5][xCenter() + 3] = 1;
  newLattice[yCenter() - 6][xCenter() + 3] = 1;
  newLattice[yCenter() - 6][xCenter() + 4] = 1;

    newLattice[yCenter() - 5][xCenter() + 5] = 1;
  newLattice[yCenter() - 4][xCenter() + 5] = 1;
  newLattice[yCenter() - 2][xCenter() + 5] = 1;
  newLattice[yCenter() - 3][xCenter() + 5] = 1;
  newLattice[yCenter() - 1][xCenter() + 5] = 1;
  newLattice[yCenter() - 0][xCenter() + 5] = 1;
  newLattice[yCenter() + 1][xCenter() + 5] = 1;
  newLattice[yCenter() + 2][xCenter() + 5] = 1;
  newLattice[yCenter() + 3][xCenter() + 5] = 1;
  newLattice[yCenter() + 4][xCenter() + 5] = 1;

    newLattice[yCenter() + 4][xCenter() + 3] = 1;
  newLattice[yCenter() + 5][xCenter() + 3] = 1;
  newLattice[yCenter() + 5][xCenter() + 4] = 1;

    newLattice[yCenter() - 3][xCenter() + 7] = 1;
  newLattice[yCenter() - 2][xCenter() + 7] = 1;
  newLattice[yCenter() - 3][xCenter() + 8] = 1;
  newLattice[yCenter() - 2][xCenter() + 8] = 1;

    newLattice[yCenter() + 1][xCenter() + 7] = 1;
  newLattice[yCenter() + 2][xCenter() + 7] = 1;
  newLattice[yCenter() + 1][xCenter() + 8] = 1;
  newLattice[yCenter() + 2][xCenter() + 8] = 1;
  setLattice(newLattice);
}

/**
 * Creates a "119" pattern in the Game of Life.
 * The "119" pattern is a specific configuration of cells that evolves according to the rules of Conway's Game of Life.
 * This function sets up the initial state of the "119" pattern, which can be used in simulations or experiments.
 *
 * @function build119
 * @returns {void}
 */
export function build119() {
  let newLattice = createNewConfig();

    newLattice[yCenter()][xCenter() - 28] = 1;
  newLattice[yCenter() + 1][xCenter() - 27] = 1;
  newLattice[yCenter() - 1][xCenter() - 27] = 1;
  newLattice[yCenter() + 2][xCenter() - 27] = 1;
  newLattice[yCenter() - 2][xCenter() - 27] = 1;

      newLattice[yCenter() - 2][xCenter() - 24] = 1;
  newLattice[yCenter() - 3][xCenter() - 24] = 1;
  newLattice[yCenter() - 1][xCenter() - 24] = 1;
  newLattice[yCenter() - 3][xCenter() - 23] = 1;
  newLattice[yCenter() - 2][xCenter() - 23] = 1;

    newLattice[yCenter() + 3][xCenter() - 24] = 1;
  newLattice[yCenter() + 2][xCenter() - 24] = 1;
  newLattice[yCenter() + 1][xCenter() - 24] = 1;
  newLattice[yCenter() + 3][xCenter() - 23] = 1;
  newLattice[yCenter() + 2][xCenter() - 23] = 1;

      newLattice[yCenter() + 5][xCenter() - 22] = 1;
  newLattice[yCenter() + 6][xCenter() - 22] = 1;
  newLattice[yCenter() + 7][xCenter() - 22] = 1;

    newLattice[yCenter() - 5][xCenter() - 22] = 1;
  newLattice[yCenter() - 6][xCenter() - 22] = 1;
  newLattice[yCenter() - 7][xCenter() - 22] = 1;

    newLattice[yCenter() - 7][xCenter() - 20] = 1;
  newLattice[yCenter() + 7][xCenter() - 20] = 1;

      newLattice[yCenter() - 5][xCenter() - 20] = 1;
  newLattice[yCenter() - 5][xCenter() - 19] = 1;
  newLattice[yCenter() - 4][xCenter() - 19] = 1;
  newLattice[yCenter() - 5][xCenter() - 18] = 1;
  newLattice[yCenter() - 5][xCenter() - 17] = 1;
  newLattice[yCenter() - 5][xCenter() - 16] = 1;
  newLattice[yCenter() - 5][xCenter() - 15] = 1;
  newLattice[yCenter() - 6][xCenter() - 17] = 1;
  newLattice[yCenter() - 5][xCenter() - 14] = 1;
  newLattice[yCenter() - 5][xCenter() - 13] = 1;
  newLattice[yCenter() - 4][xCenter() - 13] = 1;

    newLattice[yCenter() + 5][xCenter() - 20] = 1;
  newLattice[yCenter() + 5][xCenter() - 19] = 1;
  newLattice[yCenter() + 4][xCenter() - 19] = 1;
  newLattice[yCenter() + 5][xCenter() - 18] = 1;
  newLattice[yCenter() + 5][xCenter() - 17] = 1;
  newLattice[yCenter() + 5][xCenter() - 16] = 1;
  newLattice[yCenter() + 5][xCenter() - 15] = 1;
  newLattice[yCenter() + 6][xCenter() - 17] = 1;
  newLattice[yCenter() + 5][xCenter() - 14] = 1;
  newLattice[yCenter() + 5][xCenter() - 13] = 1;
  newLattice[yCenter() + 4][xCenter() - 13] = 1;

    newLattice[yCenter() - 2][xCenter() - 15] = 1;
  newLattice[yCenter() - 2][xCenter() - 14] = 1;
  newLattice[yCenter() + 2][xCenter() - 14] = 1;
  newLattice[yCenter() + 2][xCenter() - 15] = 1;

    newLattice[yCenter() - 6][xCenter() - 12] = 1;
  newLattice[yCenter() - 7][xCenter() - 13] = 1;
  newLattice[yCenter() - 8][xCenter() - 12] = 1;

  newLattice[yCenter() + 6][xCenter() - 12] = 1;
  newLattice[yCenter() + 7][xCenter() - 13] = 1;
  newLattice[yCenter() + 8][xCenter() - 12] = 1;

      newLattice[yCenter() - 6][xCenter() - 10] = 1;
  newLattice[yCenter() - 6][xCenter() - 9] = 1;
  newLattice[yCenter() - 6][xCenter() - 8] = 1;
  newLattice[yCenter() - 6][xCenter() - 7] = 1;
  newLattice[yCenter() - 7][xCenter() - 7] = 1;
  newLattice[yCenter() - 7][xCenter() - 6] = 1;
  newLattice[yCenter() - 6][xCenter() - 6] = 1;
  newLattice[yCenter() - 6][xCenter() - 5] = 1;

    newLattice[yCenter() + 6][xCenter() - 10] = 1;
  newLattice[yCenter() + 6][xCenter() - 9] = 1;
  newLattice[yCenter() + 6][xCenter() - 8] = 1;
  newLattice[yCenter() + 6][xCenter() - 7] = 1;
  newLattice[yCenter() + 7][xCenter() - 7] = 1;
  newLattice[yCenter() + 7][xCenter() - 6] = 1;
  newLattice[yCenter() + 6][xCenter() - 6] = 1;
  newLattice[yCenter() + 6][xCenter() - 5] = 1;

      newLattice[yCenter() - 4][xCenter() - 5] = 1;
  newLattice[yCenter() - 3][xCenter() - 5] = 1;
  newLattice[yCenter() - 2][xCenter() - 5] = 1;
  newLattice[yCenter() - 4][xCenter() - 4] = 1;
  newLattice[yCenter() - 3][xCenter() - 4] = 1;
  newLattice[yCenter() - 2][xCenter() - 4] = 1;
  newLattice[yCenter() - 4][xCenter() - 3] = 1;
  newLattice[yCenter() - 3][xCenter() - 3] = 1;
  newLattice[yCenter() - 4][xCenter() - 2] = 1;
  newLattice[yCenter() - 5][xCenter() - 2] = 1;
  newLattice[yCenter() - 3][xCenter() - 1] = 1;

    newLattice[yCenter() + 4][xCenter() - 5] = 1;
  newLattice[yCenter() + 3][xCenter() - 5] = 1;
  newLattice[yCenter() + 2][xCenter() - 5] = 1;
  newLattice[yCenter() + 4][xCenter() - 4] = 1;
  newLattice[yCenter() + 3][xCenter() - 4] = 1;
  newLattice[yCenter() + 2][xCenter() - 4] = 1;
  newLattice[yCenter() + 4][xCenter() - 3] = 1;
  newLattice[yCenter() + 3][xCenter() - 3] = 1;
  newLattice[yCenter() + 4][xCenter() - 2] = 1;
  newLattice[yCenter() + 5][xCenter() - 2] = 1;
  newLattice[yCenter() + 3][xCenter() - 1] = 1;

      newLattice[yCenter() - 6][xCenter()] = 1;
  newLattice[yCenter() - 6][xCenter() + 1] = 1;
  newLattice[yCenter() - 5][xCenter() + 1] = 1;

  newLattice[yCenter() + 6][xCenter()] = 1;
  newLattice[yCenter() + 6][xCenter() + 1] = 1;
  newLattice[yCenter() + 5][xCenter() + 1] = 1;

    newLattice[yCenter() - 5][xCenter() + 3] = 1;
  newLattice[yCenter() - 4][xCenter() + 3] = 1;
  newLattice[yCenter() - 5][xCenter() + 4] = 1;
  newLattice[yCenter() - 4][xCenter() + 4] = 1;
  newLattice[yCenter() - 5][xCenter() + 5] = 1;
  newLattice[yCenter() - 4][xCenter() + 5] = 1;

    newLattice[yCenter() + 5][xCenter() + 3] = 1;
  newLattice[yCenter() + 4][xCenter() + 3] = 1;
  newLattice[yCenter() + 5][xCenter() + 4] = 1;
  newLattice[yCenter() + 4][xCenter() + 4] = 1;
  newLattice[yCenter() + 5][xCenter() + 5] = 1;
  newLattice[yCenter() + 4][xCenter() + 5] = 1;

    newLattice[yCenter() - 7][xCenter() + 3] = 1;
  newLattice[yCenter() - 8][xCenter() + 4] = 1;
  newLattice[yCenter() - 9][xCenter() + 5] = 1;
  newLattice[yCenter() - 8][xCenter() + 6] = 1;

  newLattice[yCenter() + 7][xCenter() + 3] = 1;
  newLattice[yCenter() + 8][xCenter() + 4] = 1;
  newLattice[yCenter() + 9][xCenter() + 5] = 1;
  newLattice[yCenter() + 8][xCenter() + 6] = 1;
  setLattice(newLattice);
}

/**
 * Creates a "1234" pattern in the Game of Life.
 * The "1234" pattern is a specific configuration of cells that evolves according to the rules of Conway's Game of Life.
 * This function sets up the initial state of the "1234" pattern, which can be used in simulations or experiments.
 *
 * @function build1234
 * @returns {void}
 */
export function build1234() {
  let newLattice = createNewConfig();

    newLattice[yCenter()][xCenter()] = 1;
  newLattice[yCenter() - 2][xCenter()] = 1;

    newLattice[yCenter() - 3][xCenter() - 1] = 1;
  newLattice[yCenter() - 3][xCenter() - 1] = 1;
  newLattice[yCenter() - 4][xCenter()] = 1;
  newLattice[yCenter() - 3][xCenter() + 1] = 1;

      newLattice[yCenter() - 2][xCenter() - 2] = 1;
  newLattice[yCenter() - 1][xCenter() - 2] = 1;
  newLattice[yCenter() - 0][xCenter() - 2] = 1;

    newLattice[yCenter() - 0][xCenter() + 2] = 1;
  newLattice[yCenter() - 2][xCenter() + 2] = 1;
  newLattice[yCenter() - 1][xCenter() + 2] = 1;

      newLattice[yCenter() + 1][xCenter() - 3] = 1;
  newLattice[yCenter()][xCenter() - 4] = 1;
  newLattice[yCenter()][xCenter() - 5] = 1;
  newLattice[yCenter() + 1][xCenter() - 5] = 1;

    newLattice[yCenter() + 1][xCenter() + 3] = 1;
  newLattice[yCenter() + 0][xCenter() + 4] = 1;
  newLattice[yCenter() + 0][xCenter() + 5] = 1;
  newLattice[yCenter() + 1][xCenter() + 5] = 1;

    newLattice[yCenter() + 2][xCenter() + 2] = 1;
  newLattice[yCenter() + 2][xCenter() + 1] = 1;
  newLattice[yCenter() + 2][xCenter() + 0] = 1;
  newLattice[yCenter() + 2][xCenter() - 1] = 1;
  newLattice[yCenter() + 2][xCenter() - 2] = 1;

    newLattice[yCenter() + 4][xCenter()] = 1;
  newLattice[yCenter() + 6][xCenter()] = 1;
  newLattice[yCenter() + 5][xCenter() - 1] = 1;
  newLattice[yCenter() + 5][xCenter() + 1] = 1;
  setLattice(newLattice);
}

/**
 * Creates a "295" pattern in the Game of Life.
 * The "295" pattern is a specific configuration of cells that follows the rules of Conway's Game of Life.
 * This function initializes the "295" pattern, which can be used for simulations or experiments.
 *
 * @function build295
 * @returns {void}
 */
export function build295() {
  let newLattice = createNewConfig();

    newLattice[yCenter() - 20][xCenter() - 20] = 1;
  newLattice[yCenter() - 19][xCenter() - 20] = 1;
  newLattice[yCenter() - 20][xCenter() - 19] = 1;

  newLattice[yCenter() - 21][xCenter() - 19] = 1;
  newLattice[yCenter() - 21][xCenter() - 18] = 1;
  newLattice[yCenter() - 21][xCenter() - 17] = 1;
  newLattice[yCenter() - 22][xCenter() - 17] = 1;
  newLattice[yCenter() - 22][xCenter() - 18] = 1;

  newLattice[yCenter() - 19][xCenter() - 21] = 1;
  newLattice[yCenter() - 18][xCenter() - 21] = 1;
  newLattice[yCenter() - 17][xCenter() - 21] = 1;
  newLattice[yCenter() - 18][xCenter() - 22] = 1;
  newLattice[yCenter() - 17][xCenter() - 22] = 1;

      newLattice[yCenter() - 17][xCenter() - 19] = 1;
  newLattice[yCenter() - 16][xCenter() - 19] = 1;
  newLattice[yCenter() - 15][xCenter() - 18] = 1;
  newLattice[yCenter() - 15][xCenter() - 17] = 1;
  newLattice[yCenter() - 15][xCenter() - 16] = 1;
  newLattice[yCenter() - 14][xCenter() - 16] = 1;
  newLattice[yCenter() - 14][xCenter() - 17] = 1;
  newLattice[yCenter() - 13][xCenter() - 17] = 1;
  newLattice[yCenter() - 12][xCenter() - 17] = 1;

    newLattice[yCenter() - 16][xCenter() - 15] = 1;
  newLattice[yCenter() - 16][xCenter() - 14] = 1;
  newLattice[yCenter() - 17][xCenter() - 15] = 1;
  newLattice[yCenter() - 17][xCenter() - 14] = 1;
  newLattice[yCenter() - 18][xCenter() - 15] = 1;
  newLattice[yCenter() - 17][xCenter() - 13] = 1;
  newLattice[yCenter() - 17][xCenter() - 12] = 1;
  newLattice[yCenter() - 19][xCenter() - 16] = 1;
  newLattice[yCenter() - 19][xCenter() - 17] = 1;

    newLattice[yCenter() - 11][xCenter() - 16] = 1;
  newLattice[yCenter() - 11][xCenter() - 15] = 1;
  newLattice[yCenter() - 11][xCenter() - 14] = 1;
  newLattice[yCenter() - 11][xCenter() - 13] = 1;
  newLattice[yCenter() - 11][xCenter() - 12] = 1;
  newLattice[yCenter() - 12][xCenter() - 14] = 1;

    newLattice[yCenter() - 12][xCenter() - 11] = 1;
  newLattice[yCenter() - 13][xCenter() - 11] = 1;
  newLattice[yCenter() - 14][xCenter() - 11] = 1;
  newLattice[yCenter() - 15][xCenter() - 11] = 1;
  newLattice[yCenter() - 16][xCenter() - 11] = 1;
  newLattice[yCenter() - 14][xCenter() - 12] = 1;

    newLattice[yCenter() - 10][xCenter() - 16] = 1;
  newLattice[yCenter() - 9][xCenter() - 15] = 1;
  newLattice[yCenter() - 8][xCenter() - 14] = 1;
  newLattice[yCenter() - 8][xCenter() - 16] = 1;

    newLattice[yCenter() - 16][xCenter() - 10] = 1;
  newLattice[yCenter() - 15][xCenter() - 9] = 1;
  newLattice[yCenter() - 14][xCenter() - 8] = 1;
  newLattice[yCenter() - 16][xCenter() - 8] = 1;

      newLattice[yCenter() - 12][xCenter() - 19] = 1;
  newLattice[yCenter() - 12][xCenter() - 20] = 1;
  newLattice[yCenter() - 12][xCenter() - 21] = 1;
  newLattice[yCenter() - 12][xCenter() - 22] = 1;

  newLattice[yCenter() - 11][xCenter() - 20] = 1;
  newLattice[yCenter() - 11][xCenter() - 21] = 1;
  newLattice[yCenter() - 11][xCenter() - 22] = 1;

  newLattice[yCenter() - 9][xCenter() - 21] = 1;
  newLattice[yCenter() - 10][xCenter() - 21] = 1;
  newLattice[yCenter() - 10][xCenter() - 23] = 1;
  newLattice[yCenter() - 9][xCenter() - 22] = 1;
  newLattice[yCenter() - 9][xCenter() - 23] = 1;

    newLattice[yCenter() - 9][xCenter() - 19] = 1;
  newLattice[yCenter() - 7][xCenter() - 22] = 1;

    newLattice[yCenter() + -22][xCenter() + -11] = 1;
  newLattice[yCenter() + -21][xCenter() + -11] = 1;
  newLattice[yCenter() + -20][xCenter() + -11] = 1;
  newLattice[yCenter() + -23][xCenter() + -10] = 1;
  newLattice[yCenter() + -23][xCenter() + -9] = 1;
  newLattice[yCenter() + -22][xCenter() + -9] = 1;
  newLattice[yCenter() + -21][xCenter() + -9] = 1;
  newLattice[yCenter() + -21][xCenter() + -10] = 1;
  newLattice[yCenter() + -22][xCenter() + -7] = 1;
  newLattice[yCenter() + -19][xCenter() + -9] = 1;

  newLattice[yCenter() + -19][xCenter() + -12] = 1;
  newLattice[yCenter() + -20][xCenter() + -12] = 1;
  newLattice[yCenter() + -21][xCenter() + -12] = 1;
  newLattice[yCenter() + -22][xCenter() + -12] = 1;
  newLattice[yCenter() + -7][xCenter() + -18] = 1;
  newLattice[yCenter() + -6][xCenter() + -19] = 1;
  newLattice[yCenter() + -5][xCenter() + -20] = 1;
  newLattice[yCenter() + -4][xCenter() + -18] = 1;
  newLattice[yCenter() + -3][xCenter() + -18] = 1;
  newLattice[yCenter() + -18][xCenter() + -7] = 1;
  newLattice[yCenter() + -19][xCenter() + -6] = 1;
  newLattice[yCenter() + -20][xCenter() + -5] = 1;
  newLattice[yCenter() + -18][xCenter() + -4] = 1;
  newLattice[yCenter() + -18][xCenter() + -3] = 1;

  newLattice[yCenter() + -9][xCenter() + -11] = 1;
  newLattice[yCenter() + -8][xCenter() + -11] = 1;
  newLattice[yCenter() + -7][xCenter() + -11] = 1;
  newLattice[yCenter() + -6][xCenter() + -11] = 1;
  newLattice[yCenter() + -5][xCenter() + -11] = 1;
  newLattice[yCenter() + -4][xCenter() + -11] = 1;
  newLattice[yCenter() + -3][xCenter() + -11] = 1;
  newLattice[yCenter() + -7][xCenter() + -12] = 1;
  newLattice[yCenter() + -2][xCenter() + -10] = 1;
  newLattice[yCenter() + -1][xCenter() + -10] = 1;
  newLattice[yCenter() + -1][xCenter() + -11] = 1;
  newLattice[yCenter() + -5][xCenter() + -10] = 1;
  newLattice[yCenter() + -5][xCenter() + -9] = 1;
  newLattice[yCenter() + -4][xCenter() + -9] = 1;
  newLattice[yCenter() + -3][xCenter() + -9] = 1;
  newLattice[yCenter() + -3][xCenter() + -8] = 1;
  newLattice[yCenter() + -2][xCenter() + -8] = 1;
  newLattice[yCenter() + -2][xCenter() + -7] = 1;
  newLattice[yCenter() + -2][xCenter() + -6] = 1;
  newLattice[yCenter() + -2][xCenter() + -5] = 1;
  newLattice[yCenter() + -1][xCenter() + -7] = 1;
  newLattice[yCenter() + -1][xCenter() + -6] = 1;
  newLattice[yCenter() + 0][xCenter() + -6] = 1;
  newLattice[yCenter() + -1][xCenter() + -4] = 1;
  newLattice[yCenter() + -3][xCenter() + -4] = 1;
  newLattice[yCenter() + -4][xCenter() + -3] = 1;
  newLattice[yCenter() + -5][xCenter() + -2] = 1;
  newLattice[yCenter() + -6][xCenter() + -2] = 1;
  newLattice[yCenter() + -7][xCenter() + -2] = 1;
  newLattice[yCenter() + -8][xCenter() + -2] = 1;
  newLattice[yCenter() + -7][xCenter() + -1] = 1;
  newLattice[yCenter() + -6][xCenter() + -1] = 1;
  newLattice[yCenter() + -6][xCenter() + 0] = 1;
  newLattice[yCenter() + -4][xCenter() + -1] = 1;
  newLattice[yCenter() + -8][xCenter() + -3] = 1;
  newLattice[yCenter() + -9][xCenter() + -3] = 1;
  newLattice[yCenter() + -9][xCenter() + -4] = 1;
  newLattice[yCenter() + -9][xCenter() + -5] = 1;
  newLattice[yCenter() + -10][xCenter() + -5] = 1;
  newLattice[yCenter() + -11][xCenter() + -3] = 1;
  newLattice[yCenter() + -11][xCenter() + -4] = 1;
  newLattice[yCenter() + -11][xCenter() + -5] = 1;
  newLattice[yCenter() + -11][xCenter() + -6] = 1;
  newLattice[yCenter() + -11][xCenter() + -7] = 1;
  newLattice[yCenter() + -11][xCenter() + -8] = 1;
  newLattice[yCenter() + -11][xCenter() + -9] = 1;
  newLattice[yCenter() + -12][xCenter() + -7] = 1;
  newLattice[yCenter() + -10][xCenter() + -2] = 1;
  newLattice[yCenter() + -10][xCenter() + -1] = 1;
  newLattice[yCenter() + -11][xCenter() + -1] = 1;
  newLattice[yCenter() + -2][xCenter() + -1] = 1;
  newLattice[yCenter() + 1][xCenter() + -3] = 1;
  newLattice[yCenter() + -3][xCenter() + 1] = 1;
  newLattice[yCenter() + 2][xCenter() + -6] = 1;
  newLattice[yCenter() + 2][xCenter() + -7] = 1;
  newLattice[yCenter() + 3][xCenter() + -5] = 1;
  newLattice[yCenter() + 4][xCenter() + -7] = 1;
  newLattice[yCenter() + 4][xCenter() + -6] = 1;
  newLattice[yCenter() + 5][xCenter() + -6] = 1;
  newLattice[yCenter() + 6][xCenter() + -6] = 1;
  newLattice[yCenter() + -5][xCenter() + 3] = 1;
  newLattice[yCenter() + -6][xCenter() + 2] = 1;
  newLattice[yCenter() + -7][xCenter() + 2] = 1;
  newLattice[yCenter() + -7][xCenter() + 4] = 1;
  newLattice[yCenter() + -6][xCenter() + 4] = 1;
  newLattice[yCenter() + -6][xCenter() + 5] = 1;
  newLattice[yCenter() + -6][xCenter() + 6] = 1;
  newLattice[yCenter() + 2][xCenter() + -1] = 1;
  newLattice[yCenter() + 1][xCenter() + 0] = 1;
  newLattice[yCenter() + 0][xCenter() + 1] = 1;
  newLattice[yCenter() + -1][xCenter() + 2] = 1;
  newLattice[yCenter() + 2][xCenter() + 2] = 1;
  newLattice[yCenter() + -1][xCenter() + -2] = 1;
  newLattice[yCenter() + 4][xCenter() + -1] = 1;
  newLattice[yCenter() + 5][xCenter() + -1] = 1;
  newLattice[yCenter() + 6][xCenter() + -1] = 1;
  newLattice[yCenter() + 6][xCenter() + 0] = 1;
  newLattice[yCenter() + 5][xCenter() + 0] = 1;
  newLattice[yCenter() + 4][xCenter() + 0] = 1;
  newLattice[yCenter() + 5][xCenter() + -2] = 1;
  newLattice[yCenter() + 8][xCenter() + -2] = 1;
  newLattice[yCenter() + 7][xCenter() + 1] = 1;
  newLattice[yCenter() + 8][xCenter() + 1] = 1;
  newLattice[yCenter() + 0][xCenter() + 4] = 1;
  newLattice[yCenter() + -1][xCenter() + 4] = 1;
  newLattice[yCenter() + -1][xCenter() + 5] = 1;
  newLattice[yCenter() + -1][xCenter() + 6] = 1;
  newLattice[yCenter() + 0][xCenter() + 6] = 1;
  newLattice[yCenter() + 0][xCenter() + 5] = 1;
  newLattice[yCenter() + -2][xCenter() + 5] = 1;
  newLattice[yCenter() + 1][xCenter() + 7] = 1;
  newLattice[yCenter() + 1][xCenter() + 8] = 1;
  newLattice[yCenter() + -2][xCenter() + 8] = 1;
  newLattice[yCenter() + 0][xCenter() + 10] = 1;
  newLattice[yCenter() + 0][xCenter() + 11] = 1;
  newLattice[yCenter() + 0][xCenter() + 12] = 1;
  newLattice[yCenter() + 3][xCenter() + 9] = 1;
  newLattice[yCenter() + 4][xCenter() + 9] = 1;
  newLattice[yCenter() + 5][xCenter() + 9] = 1;
  newLattice[yCenter() + 6][xCenter() + 9] = 1;
  newLattice[yCenter() + 7][xCenter() + 10] = 1;
  newLattice[yCenter() + 8][xCenter() + 10] = 1;
  newLattice[yCenter() + 9][xCenter() + 3] = 1;
  newLattice[yCenter() + 9][xCenter() + 4] = 1;
  newLattice[yCenter() + 9][xCenter() + 5] = 1;
  newLattice[yCenter() + 9][xCenter() + 6] = 1;
  newLattice[yCenter() + 10][xCenter() + 7] = 1;
  newLattice[yCenter() + 10][xCenter() + 8] = 1;
  newLattice[yCenter() + 10][xCenter() + 0] = 1;
  newLattice[yCenter() + 11][xCenter() + 0] = 1;
  newLattice[yCenter() + 12][xCenter() + 0] = 1;
  newLattice[yCenter() + 14][xCenter() + 2] = 1;
  newLattice[yCenter() + 13][xCenter() + 2] = 1;
  newLattice[yCenter() + 13][xCenter() + 3] = 1;
  newLattice[yCenter() + 13][xCenter() + 5] = 1;
  newLattice[yCenter() + 11][xCenter() + 5] = 1;
  newLattice[yCenter() + 5][xCenter() + 11] = 1;
  newLattice[yCenter() + 5][xCenter() + 13] = 1;
  newLattice[yCenter() + 3][xCenter() + 13] = 1;
  newLattice[yCenter() + 2][xCenter() + 13] = 1;
  newLattice[yCenter() + 2][xCenter() + 14] = 1;
  newLattice[yCenter() + 15][xCenter() + 5] = 1;
  newLattice[yCenter() + 15][xCenter() + 6] = 1;
  newLattice[yCenter() + 15][xCenter() + 7] = 1;
  newLattice[yCenter() + 14][xCenter() + 7] = 1;
  newLattice[yCenter() + 13][xCenter() + 7] = 1;
  newLattice[yCenter() + 16][xCenter() + 6] = 1;
  newLattice[yCenter() + 15][xCenter() + 9] = 1;
  newLattice[yCenter() + 16][xCenter() + 9] = 1;
  newLattice[yCenter() + 16][xCenter() + 10] = 1;
  newLattice[yCenter() + 15][xCenter() + 10] = 1;
  newLattice[yCenter() + 16][xCenter() + 12] = 1;
  newLattice[yCenter() + 15][xCenter() + 13] = 1;
  newLattice[yCenter() + 13][xCenter() + 15] = 1;
  newLattice[yCenter() + 12][xCenter() + 16] = 1;
  newLattice[yCenter() + 10][xCenter() + 16] = 1;
  newLattice[yCenter() + 10][xCenter() + 15] = 1;
  newLattice[yCenter() + 9][xCenter() + 15] = 1;
  newLattice[yCenter() + 9][xCenter() + 16] = 1;
  newLattice[yCenter() + 7][xCenter() + 13] = 1;
  newLattice[yCenter() + 7][xCenter() + 14] = 1;
  newLattice[yCenter() + 7][xCenter() + 15] = 1;
  newLattice[yCenter() + 6][xCenter() + 15] = 1;
  newLattice[yCenter() + 5][xCenter() + 15] = 1;
  newLattice[yCenter() + 6][xCenter() + 16] = 1;
  newLattice[yCenter() + 18][xCenter() + 11] = 1;
  newLattice[yCenter() + 20][xCenter() + 10] = 1;
  newLattice[yCenter() + 20][xCenter() + 9] = 1;
  newLattice[yCenter() + 19][xCenter() + 8] = 1;
  newLattice[yCenter() + 11][xCenter() + 18] = 1;
  newLattice[yCenter() + 10][xCenter() + 20] = 1;
  newLattice[yCenter() + 9][xCenter() + 20] = 1;
  newLattice[yCenter() + 8][xCenter() + 19] = 1;
  newLattice[yCenter() + 18][xCenter() + 13] = 1;
  newLattice[yCenter() + 18][xCenter() + 14] = 1;
  newLattice[yCenter() + 19][xCenter() + 14] = 1;
  newLattice[yCenter() + 17][xCenter() + 14] = 1;
  newLattice[yCenter() + 17][xCenter() + 15] = 1;
  newLattice[yCenter() + 18][xCenter() + 16] = 1;
  newLattice[yCenter() + 18][xCenter() + 17] = 1;
  newLattice[yCenter() + 17][xCenter() + 18] = 1;
  newLattice[yCenter() + 16][xCenter() + 18] = 1;
  newLattice[yCenter() + 18][xCenter() + 19] = 1;
  newLattice[yCenter() + 19][xCenter() + 18] = 1;
  newLattice[yCenter() + 15][xCenter() + 17] = 1;
  newLattice[yCenter() + 14][xCenter() + 17] = 1;
  newLattice[yCenter() + 14][xCenter() + 18] = 1;
  newLattice[yCenter() + 14][xCenter() + 19] = 1;
  newLattice[yCenter() + 13][xCenter() + 18] = 1;
  newLattice[yCenter() + 15][xCenter() + 21] = 1;
  newLattice[yCenter() + 16][xCenter() + 22] = 1;
  newLattice[yCenter() + 17][xCenter() + 22] = 1;
  newLattice[yCenter() + 18][xCenter() + 22] = 1;
  newLattice[yCenter() + 18][xCenter() + 23] = 1;
  newLattice[yCenter() + 15][xCenter() + 23] = 1;
  newLattice[yCenter() + 15][xCenter() + 24] = 1;
  newLattice[yCenter() + 16][xCenter() + 25] = 1;
  newLattice[yCenter() + 20][xCenter() + 23] = 1;
  newLattice[yCenter() + 20][xCenter() + 24] = 1;
  newLattice[yCenter() + 21][xCenter() + 24] = 1;
  newLattice[yCenter() + 21][xCenter() + 23] = 1;
  newLattice[yCenter() + 22][xCenter() + 23] = 1;
  newLattice[yCenter() + 22][xCenter() + 22] = 1;
  newLattice[yCenter() + 23][xCenter() + 22] = 1;
  newLattice[yCenter() + 23][xCenter() + 21] = 1;
  newLattice[yCenter() + 23][xCenter() + 20] = 1;
  newLattice[yCenter() + 24][xCenter() + 21] = 1;
  newLattice[yCenter() + 24][xCenter() + 20] = 1;
  newLattice[yCenter() + 23][xCenter() + 18] = 1;
  newLattice[yCenter() + 22][xCenter() + 18] = 1;
  newLattice[yCenter() + 22][xCenter() + 17] = 1;
  newLattice[yCenter() + 22][xCenter() + 16] = 1;
  newLattice[yCenter() + 23][xCenter() + 15] = 1;
  newLattice[yCenter() + 24][xCenter() + 15] = 1;
  newLattice[yCenter() + 25][xCenter() + 16] = 1;
  newLattice[yCenter() + 21][xCenter() + 15] = 1;
  newLattice[yCenter() + 26][xCenter() + 19] = 1;
  newLattice[yCenter() + 27][xCenter() + 18] = 1;
  newLattice[yCenter() + 28][xCenter() + 19] = 1;
  newLattice[yCenter() + 28][xCenter() + 20] = 1;
  newLattice[yCenter() + 26][xCenter() + 22] = 1;
  newLattice[yCenter() + 22][xCenter() + 26] = 1;
  newLattice[yCenter() + 19][xCenter() + 26] = 1;
  newLattice[yCenter() + 18][xCenter() + 27] = 1;
  newLattice[yCenter() + 19][xCenter() + 28] = 1;
  newLattice[yCenter() + 20][xCenter() + 28] = 1;
  setLattice(newLattice);
}

/**
 * Creates a "GtoG" pattern in the Game of Life.
 * The "GtoG" pattern is a specific configuration of cells in Conway's Game of Life.
 * This function initializes the "GtoG" pattern, which can be used for simulations or experiments.
 *
 * @function buildGtoG
 * @returns {void}
 */
export function buildGtoG() {
  let newLattice = createNewConfig();

  newLattice[yCenter() + 19][xCenter() + 24] = 1;
  newLattice[yCenter() + 17][xCenter() + 23] = 1;
  newLattice[yCenter() + 18][xCenter() + 23] = 1;
  newLattice[yCenter() + 18][xCenter() + 22] = 1;
  newLattice[yCenter() + 19][xCenter() + 22] = 1;
  newLattice[yCenter() + 18][xCenter() + 1] = 1;
  newLattice[yCenter() + 17][xCenter() + 2] = 1;
  newLattice[yCenter() + 18][xCenter() + 0] = 1;
  newLattice[yCenter() + 17][xCenter() + 0] = 1;
  newLattice[yCenter() + 16][xCenter() + 0] = 1;
  newLattice[yCenter() + 17][xCenter() + -3] = 1;
  newLattice[yCenter() + 16][xCenter() + -3] = 1;
  newLattice[yCenter() + 15][xCenter() + -3] = 1;
  newLattice[yCenter() + 17][xCenter() + -4] = 1;
  newLattice[yCenter() + 16][xCenter() + -5] = 1;
  newLattice[yCenter() + -8][xCenter() + -18] = 1;
  newLattice[yCenter() + -9][xCenter() + -18] = 1;
  newLattice[yCenter() + -8][xCenter() + -19] = 1;
  newLattice[yCenter() + -7][xCenter() + -19] = 1;
  newLattice[yCenter() + -9][xCenter() + -20] = 1;
  setLattice(newLattice);
}

/**
 * Creates a "60P" pattern in the Game of Life.
 * The "60P" pattern is a specific configuration of cells in Conway's Game of Life.
 * This function initializes the "60P" pattern, which can be used for simulations or experiments.
 *
 * @function build60P
 * @returns {void}
 */
export function build60P() {
  let newLattice = createNewConfig();

  newLattice[yCenter() + -3][xCenter() + -26] = 1;
  newLattice[yCenter() + -2][xCenter() + -25] = 1;
  newLattice[yCenter() + -3][xCenter() + -25] = 1;
  newLattice[yCenter() + -2][xCenter() + -26] = 1;
  newLattice[yCenter() + 0][xCenter() + -20] = 1;
  newLattice[yCenter() + -1][xCenter() + -20] = 1;
  newLattice[yCenter() + -1][xCenter() + -19] = 1;
  newLattice[yCenter() + -1][xCenter() + -18] = 1;
  newLattice[yCenter() + 0][xCenter() + -17] = 1;
  newLattice[yCenter() + -12][xCenter() + -20] = 1;
  newLattice[yCenter() + -13][xCenter() + -21] = 1;
  newLattice[yCenter() + -14][xCenter() + -21] = 1;
  newLattice[yCenter() + -15][xCenter() + -20] = 1;
  newLattice[yCenter() + -14][xCenter() + -19] = 1;
  newLattice[yCenter() + -13][xCenter() + -19] = 1;
  newLattice[yCenter() + -14][xCenter() + -3] = 1;
  newLattice[yCenter() + -15][xCenter() + -4] = 1;
  newLattice[yCenter() + -16][xCenter() + -4] = 1;
  newLattice[yCenter() + -17][xCenter() + -4] = 1;
  newLattice[yCenter() + -17][xCenter() + -3] = 1;
  newLattice[yCenter() + -22][xCenter() + -5] = 1;
  newLattice[yCenter() + -23][xCenter() + -5] = 1;
  newLattice[yCenter() + -23][xCenter() + -6] = 1;
  newLattice[yCenter() + -22][xCenter() + -6] = 1;
  newLattice[yCenter() + -17][xCenter() + 4] = 1;
  newLattice[yCenter() + -18][xCenter() + 5] = 1;
  newLattice[yCenter() + -18][xCenter() + 6] = 1;
  newLattice[yCenter() + -17][xCenter() + 7] = 1;
  newLattice[yCenter() + -16][xCenter() + 6] = 1;
  newLattice[yCenter() + -16][xCenter() + 5] = 1;
  newLattice[yCenter() + -5][xCenter() + 6] = 1;
  newLattice[yCenter() + -4][xCenter() + 7] = 1;
  newLattice[yCenter() + -4][xCenter() + 8] = 1;
  newLattice[yCenter() + -4][xCenter() + 9] = 1;
  newLattice[yCenter() + -5][xCenter() + 9] = 1;
  newLattice[yCenter() + -3][xCenter() + 14] = 1;
  newLattice[yCenter() + -2][xCenter() + 15] = 1;
  newLattice[yCenter() + -3][xCenter() + 15] = 1;
  newLattice[yCenter() + -2][xCenter() + 14] = 1;
  newLattice[yCenter() + 7][xCenter() + 9] = 1;
  newLattice[yCenter() + 8][xCenter() + 8] = 1;
  newLattice[yCenter() + 9][xCenter() + 8] = 1;
  newLattice[yCenter() + 10][xCenter() + 9] = 1;
  newLattice[yCenter() + 9][xCenter() + 10] = 1;
  newLattice[yCenter() + 8][xCenter() + 10] = 1;

  newLattice[yCenter() + 11][xCenter() + -17] = 1;
  newLattice[yCenter() + 11][xCenter() + -16] = 1;
  newLattice[yCenter() + 12][xCenter() + -18] = 1;
  newLattice[yCenter() + 13][xCenter() + -17] = 1;
  newLattice[yCenter() + 13][xCenter() + -16] = 1;
  newLattice[yCenter() + 12][xCenter() + -15] = 1;
  newLattice[yCenter() + 12][xCenter() + -8] = 1;
  newLattice[yCenter() + 12][xCenter() + -7] = 1;
  newLattice[yCenter() + 11][xCenter() + -7] = 1;
  newLattice[yCenter() + 10][xCenter() + -7] = 1;
  newLattice[yCenter() + 9][xCenter() + -8] = 1;
  newLattice[yCenter() + 17][xCenter() + -6] = 1;
  newLattice[yCenter() + 18][xCenter() + -6] = 1;
  newLattice[yCenter() + 18][xCenter() + -5] = 1;
  newLattice[yCenter() + 17][xCenter() + -5] = 1;
  setLattice(newLattice);
}

/**
 * Creates an "AK94" pattern in the Game of Life.
 * The "AK94" pattern is a specific configuration of cells in Conway's Game of Life.
 * This function initializes the "AK94" pattern, which can be used for simulations or experiments.
 *
 * @function buildAK94
 * @returns {void}
 */
export function buildAK94() {
  let newLattice = createNewConfig();

  newLattice[yCenter() + 14][xCenter() + 1] = 1;
  newLattice[yCenter() + 13][xCenter() + 0] = 1;
  newLattice[yCenter() + 13][xCenter() + 2] = 1;
  newLattice[yCenter() + 12][xCenter() + -1] = 1;
  newLattice[yCenter() + 11][xCenter() + -1] = 1;
  newLattice[yCenter() + 10][xCenter() + -1] = 1;
  newLattice[yCenter() + 9][xCenter() + 0] = 1;
  newLattice[yCenter() + 8][xCenter() + 1] = 1;
  newLattice[yCenter() + 9][xCenter() + 2] = 1;
  newLattice[yCenter() + 10][xCenter() + 3] = 1;
  newLattice[yCenter() + 11][xCenter() + 3] = 1;
  newLattice[yCenter() + 12][xCenter() + 3] = 1;
  newLattice[yCenter() + 17][xCenter() + 3] = 1;
  newLattice[yCenter() + 16][xCenter() + 3] = 1;
  newLattice[yCenter() + 16][xCenter() + 4] = 1;
  newLattice[yCenter() + 18][xCenter() + 4] = 1;
  newLattice[yCenter() + 18][xCenter() + 5] = 1;
  newLattice[yCenter() + 18][xCenter() + 6] = 1;
  newLattice[yCenter() + 19][xCenter() + 6] = 1;
  newLattice[yCenter() + 18][xCenter() - 3] = 1;
  newLattice[yCenter() + 18][xCenter() - 2] = 1;
  newLattice[yCenter() + 19][xCenter() - 2] = 1;
  newLattice[yCenter() + 19][xCenter() - 3] = 1;

  newLattice[yCenter() + 15][xCenter() + -9] = 1;
  newLattice[yCenter() + 14][xCenter() + -9] = 1;
  newLattice[yCenter() + 15][xCenter() + -10] = 1;
  newLattice[yCenter() + 14][xCenter() + -11] = 1;
  newLattice[yCenter() + 13][xCenter() + -12] = 1;
  newLattice[yCenter() + 13][xCenter() + -13] = 1;
  newLattice[yCenter() + 12][xCenter() + -13] = 1;
  newLattice[yCenter() + 11][xCenter() + -13] = 1;
  newLattice[yCenter() + 10][xCenter() + -13] = 1;
  newLattice[yCenter() + 9][xCenter() + -14] = 1;
  newLattice[yCenter() + 11][xCenter() + -15] = 1;
  newLattice[yCenter() + 11][xCenter() + -16] = 1;
  newLattice[yCenter() + 10][xCenter() + -16] = 1;
  newLattice[yCenter() + 14][xCenter() + -14] = 1;
  newLattice[yCenter() + 14][xCenter() + -15] = 1;
  newLattice[yCenter() + 15][xCenter() + -16] = 1;
  newLattice[yCenter() + 15][xCenter() + -13] = 1;
  newLattice[yCenter() + 16][xCenter() + -15] = 1;
  newLattice[yCenter() + 16][xCenter() + -14] = 1;
  newLattice[yCenter() + 9][xCenter() + -11] = 1;
  newLattice[yCenter() + 10][xCenter() + -11] = 1;
  newLattice[yCenter() + 10][xCenter() + -10] = 1;
  newLattice[yCenter() + 9][xCenter() + -10] = 1;
  newLattice[yCenter() + 9][xCenter() + -13] = 1;

  newLattice[yCenter() + 5][xCenter() + -8] = 1;
  newLattice[yCenter() + 5][xCenter() + -9] = 1;
  newLattice[yCenter() + 4][xCenter() + -8] = 1;
  newLattice[yCenter() + 3][xCenter() + -9] = 1;
  newLattice[yCenter() + 3][xCenter() + -10] = 1;
  newLattice[yCenter() + 3][xCenter() + -11] = 1;
  newLattice[yCenter() + 2][xCenter() + -11] = 1;

  newLattice[yCenter() + -2][xCenter() + -7] = 1;
  newLattice[yCenter() + -2][xCenter() + -6] = 1;
  newLattice[yCenter() + -3][xCenter() + -6] = 1;
  newLattice[yCenter() + -4][xCenter() + -7] = 1;
  newLattice[yCenter() + -4][xCenter() + -8] = 1;
  newLattice[yCenter() + -4][xCenter() + -9] = 1;
  newLattice[yCenter() + -5][xCenter() + -9] = 1;

  newLattice[yCenter() + -4][xCenter() + -1] = 1;
  newLattice[yCenter() + -5][xCenter() + -1] = 1;
  newLattice[yCenter() + -4][xCenter() + 0] = 1;
  newLattice[yCenter() + -4][xCenter() + 1] = 1;
  newLattice[yCenter() + -3][xCenter() + 2] = 1;
  newLattice[yCenter() + -2][xCenter() + 2] = 1;
  newLattice[yCenter() + -2][xCenter() + 1] = 1;

  newLattice[yCenter() + -4][xCenter() + 7] = 1;
  newLattice[yCenter() + -4][xCenter() + 8] = 1;
  newLattice[yCenter() + -5][xCenter() + 8] = 1;
  newLattice[yCenter() + -5][xCenter() + 7] = 1;

  newLattice[yCenter() + -1][xCenter() + 14] = 1;
  newLattice[yCenter() + 0][xCenter() + 14] = 1;
  newLattice[yCenter() + -1][xCenter() + 15] = 1;
  newLattice[yCenter() + 0][xCenter() + 16] = 1;
  newLattice[yCenter() + 1][xCenter() + 17] = 1;
  newLattice[yCenter() + 1][xCenter() + 18] = 1;
  newLattice[yCenter() + 2][xCenter() + 18] = 1;
  newLattice[yCenter() + 3][xCenter() + 18] = 1;
  newLattice[yCenter() + 4][xCenter() + 18] = 1;
  newLattice[yCenter() + 5][xCenter() + 18] = 1;
  newLattice[yCenter() + 5][xCenter() + 19] = 1;
  newLattice[yCenter() + 3][xCenter() + 20] = 1;
  newLattice[yCenter() + 3][xCenter() + 21] = 1;
  newLattice[yCenter() + 4][xCenter() + 21] = 1;
  newLattice[yCenter() + 4][xCenter() + 16] = 1;
  newLattice[yCenter() + 5][xCenter() + 16] = 1;
  newLattice[yCenter() + 5][xCenter() + 15] = 1;
  newLattice[yCenter() + 4][xCenter() + 15] = 1;
  newLattice[yCenter() + 0][xCenter() + 19] = 1;
  newLattice[yCenter() + 0][xCenter() + 20] = 1;
  newLattice[yCenter() + -1][xCenter() + 21] = 1;
  newLattice[yCenter() + -2][xCenter() + 20] = 1;
  newLattice[yCenter() + -2][xCenter() + 19] = 1;
  newLattice[yCenter() + -1][xCenter() + 18] = 1;

  newLattice[yCenter() + 9][xCenter() + 14] = 1;
  newLattice[yCenter() + 9][xCenter() + 13] = 1;
  newLattice[yCenter() + 10][xCenter() + 13] = 1;
  newLattice[yCenter() + 11][xCenter() + 14] = 1;
  newLattice[yCenter() + 11][xCenter() + 15] = 1;
  newLattice[yCenter() + 11][xCenter() + 16] = 1;
  newLattice[yCenter() + 12][xCenter() + 16] = 1;
  setLattice(newLattice);
}

/**
 * Creates a "Trigger" pattern in the Game of Life.
 * The "Trigger" pattern is a specific configuration of cells that can be used in Game of Life simulations.
 * This function sets up the Trigger pattern to be used in experiments or as part of a larger structure.
 *
 * @function buildTrigger
 * @returns {void}
 */
export function buildTrigger() {
  let newLattice = createNewConfig();

  newLattice[yCenter() + 19][xCenter() + -22] = 1;
  newLattice[yCenter() + 18][xCenter() + -21] = 1;
  newLattice[yCenter() + 17][xCenter() + -22] = 1;
  newLattice[yCenter() + 18][xCenter() + -23] = 1;
  newLattice[yCenter() + 17][xCenter() + -24] = 1;
  newLattice[yCenter() + 16][xCenter() + -24] = 1;
  newLattice[yCenter() + 16][xCenter() + -23] = 1;
  newLattice[yCenter() + 11][xCenter() + -17] = 1;
  newLattice[yCenter() + 11][xCenter() + -16] = 1;
  newLattice[yCenter() + 10][xCenter() + -16] = 1;
  newLattice[yCenter() + 9][xCenter() + -17] = 1;
  newLattice[yCenter() + 10][xCenter() + -18] = 1;

  newLattice[yCenter() + 10][xCenter() + -13] = 1;
  newLattice[yCenter() + 11][xCenter() + -12] = 1;
  newLattice[yCenter() + 11][xCenter() + -11] = 1;
  newLattice[yCenter() + 10][xCenter() + -11] = 1;
  newLattice[yCenter() + 9][xCenter() + -12] = 1;

  newLattice[yCenter() + 23][xCenter() + -11] = 1;
  newLattice[yCenter() + 24][xCenter() + -11] = 1;
  newLattice[yCenter() + 24][xCenter() + -12] = 1;
  newLattice[yCenter() + 25][xCenter() + -12] = 1;
  newLattice[yCenter() + 25][xCenter() + -10] = 1;

  newLattice[yCenter() + 4][xCenter() + 3] = 1;
  newLattice[yCenter() + 4][xCenter() + 4] = 1;
  newLattice[yCenter() + 3][xCenter() + 4] = 1;
  newLattice[yCenter() + 2][xCenter() + 3] = 1;
  newLattice[yCenter() + 3][xCenter() + 2] = 1;

  newLattice[yCenter() + -1][xCenter() + 3] = 1;
  newLattice[yCenter() + -1][xCenter() + 4] = 1;
  newLattice[yCenter() + -2][xCenter() + 4] = 1;
  newLattice[yCenter() + -3][xCenter() + 3] = 1;
  newLattice[yCenter() + -2][xCenter() + 2] = 1;

  newLattice[yCenter() + -19][xCenter() + 11] = 1;
  newLattice[yCenter() + -20][xCenter() + 11] = 1;
  newLattice[yCenter() + -19][xCenter() + 10] = 1;
  newLattice[yCenter() + -20][xCenter() + 9] = 1;
  newLattice[yCenter() + -21][xCenter() + 10] = 1;

  newLattice[yCenter() + -24][xCenter() + 11] = 1;
  newLattice[yCenter() + -25][xCenter() + 11] = 1;
  newLattice[yCenter() + -24][xCenter() + 10] = 1;
  newLattice[yCenter() + -25][xCenter() + 9] = 1;
  newLattice[yCenter() + -26][xCenter() + 10] = 1;

  newLattice[yCenter() + -28][xCenter() + 16] = 1;
  newLattice[yCenter() + -29][xCenter() + 17] = 1;
  newLattice[yCenter() + -29][xCenter() + 16] = 1;
  newLattice[yCenter() + -28][xCenter() + 17] = 1;

  newLattice[yCenter() + -24][xCenter() + 22] = 1;
  newLattice[yCenter() + -23][xCenter() + 23] = 1;
  newLattice[yCenter() + -24][xCenter() + 24] = 1;
  newLattice[yCenter() + -25][xCenter() + 24] = 1;
  newLattice[yCenter() + -25][xCenter() + 23] = 1;

  newLattice[yCenter() + -26][xCenter() + 27] = 1;
  newLattice[yCenter() + -27][xCenter() + 27] = 1;
  newLattice[yCenter() + -27][xCenter() + 28] = 1;
  newLattice[yCenter() + -25][xCenter() + 28] = 1;
  newLattice[yCenter() + -24][xCenter() + 29] = 1;

  newLattice[yCenter() + -26][xCenter() + 29] = 1;
  newLattice[yCenter() + -25][xCenter() + 30] = 1;

  newLattice[yCenter() + -21][xCenter() + 29] = 1;
  newLattice[yCenter() + -21][xCenter() + 30] = 1;
  newLattice[yCenter() + -21][xCenter() + 28] = 1;
  newLattice[yCenter() + -20][xCenter() + 28] = 1;
  newLattice[yCenter() + -19][xCenter() + 29] = 1;

  newLattice[yCenter() + -34][xCenter() + 28] = 1;
  newLattice[yCenter() + -35][xCenter() + 29] = 1;
  newLattice[yCenter() + -34][xCenter() + 29] = 1;
  newLattice[yCenter() + -35][xCenter() + 28] = 1;

  newLattice[yCenter() + -34][xCenter() + 25] = 1;
  newLattice[yCenter() + -34][xCenter() + 24] = 1;
  newLattice[yCenter() + -33][xCenter() + 25] = 1;
  newLattice[yCenter() + -33][xCenter() + 24] = 1;
  setLattice(newLattice);
}

/**
 * Creates a "Snail" pattern in the Game of Life.
 * The "Snail" is a specific configuration of cells that forms a repeating pattern in the Game of Life.
 * This function sets up the Snail pattern, which can be used for experiments or incorporated into larger simulations.
 *
 * @function buildSnail
 * @returns {void}
 */
export function buildSnail() {
  let newLattice = createNewConfig();

  newLattice[yCenter() + -10][xCenter() + -15] = 1;
  newLattice[yCenter() + -9][xCenter() + -15] = 1;
  newLattice[yCenter() + -8][xCenter() + -16] = 1;
  newLattice[yCenter() + -7][xCenter() + -15] = 1;
  newLattice[yCenter() + -7][xCenter() + -14] = 1;
  newLattice[yCenter() + -6][xCenter() + -14] = 1;
  newLattice[yCenter() + -6][xCenter() + -15] = 1;
  newLattice[yCenter() + -7][xCenter() + -13] = 1;
  newLattice[yCenter() + -6][xCenter() + -12] = 1;
  newLattice[yCenter() + -5][xCenter() + -14] = 1;
  newLattice[yCenter() + -3][xCenter() + -13] = 1;
  newLattice[yCenter() + -2][xCenter() + -13] = 1;
  newLattice[yCenter() + -2][xCenter() + -12] = 1;
  newLattice[yCenter() + -2][xCenter() + -10] = 1;
  newLattice[yCenter() + -3][xCenter() + -10] = 1;
  newLattice[yCenter() + -4][xCenter() + -10] = 1;
  newLattice[yCenter() + -3][xCenter() + -8] = 1;
  newLattice[yCenter() + -3][xCenter() + -7] = 1;
  newLattice[yCenter() + -3][xCenter() + -6] = 1;
  newLattice[yCenter() + -1][xCenter() + -7] = 1;
  newLattice[yCenter() + -1][xCenter() + -5] = 1;
  newLattice[yCenter() + -1][xCenter() + -4] = 1;
  newLattice[yCenter() + -1][xCenter() + -3] = 1;
  newLattice[yCenter() + -1][xCenter() + -2] = 1;
  newLattice[yCenter() + -1][xCenter() + -1] = 1;
  newLattice[yCenter() + -1][xCenter() + 0] = 1;
  newLattice[yCenter() + -1][xCenter() + 1] = 1;
  newLattice[yCenter() + -2][xCenter() + -4] = 1;
  newLattice[yCenter() + -2][xCenter() + 2] = 1;
  newLattice[yCenter() + -3][xCenter() + -2] = 1;
  newLattice[yCenter() + -3][xCenter() + -1] = 1;
  newLattice[yCenter() + -4][xCenter() + -3] = 1;
  newLattice[yCenter() + -5][xCenter() + -2] = 1;
  newLattice[yCenter() + -5][xCenter() + -1] = 1;
  newLattice[yCenter() + -6][xCenter() + -2] = 1;
  newLattice[yCenter() + -5][xCenter() + 1] = 1;
  newLattice[yCenter() + -4][xCenter() + 1] = 1;
  newLattice[yCenter() + -6][xCenter() + 2] = 1;
  newLattice[yCenter() + -4][xCenter() + 3] = 1;
  newLattice[yCenter() + -6][xCenter() + 4] = 1;
  newLattice[yCenter() + -7][xCenter() + 5] = 1;
  newLattice[yCenter() + -7][xCenter() + 6] = 1;
  newLattice[yCenter() + -7][xCenter() + 7] = 1;

  newLattice[yCenter() + -5][xCenter() + 9] = 1;
  newLattice[yCenter() + -4][xCenter() + 7] = 1;
  newLattice[yCenter() + -4][xCenter() + 8] = 1;
  newLattice[yCenter() + -3][xCenter() + 9] = 1;
  newLattice[yCenter() + -4][xCenter() + 10] = 1;
  newLattice[yCenter() + -6][xCenter() + 11] = 1;
  newLattice[yCenter() + -7][xCenter() + 11] = 1;
  newLattice[yCenter() + -7][xCenter() + 12] = 1;
  newLattice[yCenter() + -7][xCenter() + 13] = 1;
  newLattice[yCenter() + -6][xCenter() + 13] = 1;
  newLattice[yCenter() + -6][xCenter() + 12] = 1;
  newLattice[yCenter() + -5][xCenter() + 14] = 1;
  newLattice[yCenter() + -5][xCenter() + 15] = 1;
  newLattice[yCenter() + -5][xCenter() + 16] = 1;
  newLattice[yCenter() + -5][xCenter() + 17] = 1;
  newLattice[yCenter() + -4][xCenter() + 16] = 1;
  newLattice[yCenter() + -4][xCenter() + 17] = 1;
  newLattice[yCenter() + -3][xCenter() + 18] = 1;
  newLattice[yCenter() + -3][xCenter() + 19] = 1;
  newLattice[yCenter() + -2][xCenter() + 20] = 1;
  newLattice[yCenter() + -3][xCenter() + 21] = 2;
  /**/
  newLattice[yCenter() + 1][xCenter() + -7] = 1;
  newLattice[yCenter() + 1][xCenter() + -5] = 1;
  newLattice[yCenter() + 1][xCenter() + -4] = 1;
  newLattice[yCenter() + 1][xCenter() + -3] = 1;
  newLattice[yCenter() + 1][xCenter() + -2] = 1;
  newLattice[yCenter() + 1][xCenter() + -1] = 1;
  newLattice[yCenter() + 1][xCenter() + 0] = 1;
  newLattice[yCenter() + 1][xCenter() + 1] = 1;
  newLattice[yCenter() + 2][xCenter() + 2] = 1;
  newLattice[yCenter() + 2][xCenter() + -4] = 1;
  newLattice[yCenter() + 3][xCenter() + -8] = 1;
  newLattice[yCenter() + 3][xCenter() + -7] = 1;
  newLattice[yCenter() + 3][xCenter() + -6] = 1;
  newLattice[yCenter() + 3][xCenter() + -1] = 1;
  newLattice[yCenter() + 3][xCenter() + -2] = 1;
  newLattice[yCenter() + 4][xCenter() + -3] = 1;
  newLattice[yCenter() + 6][xCenter() + -2] = 1;
  newLattice[yCenter() + 5][xCenter() + -2] = 1;
  newLattice[yCenter() + 5][xCenter() + -1] = 1;
  newLattice[yCenter() + 2][xCenter() + -10] = 1;
  newLattice[yCenter() + 3][xCenter() + -10] = 1;
  newLattice[yCenter() + 4][xCenter() + -10] = 1;
  newLattice[yCenter() + 2][xCenter() + -12] = 1;
  newLattice[yCenter() + 2][xCenter() + -13] = 1;
  newLattice[yCenter() + 3][xCenter() + -13] = 1;
  newLattice[yCenter() + 5][xCenter() + -14] = 1;
  newLattice[yCenter() + 6][xCenter() + -14] = 1;
  newLattice[yCenter() + 7][xCenter() + -14] = 1;
  newLattice[yCenter() + 6][xCenter() + -15] = 1;
  newLattice[yCenter() + 7][xCenter() + -15] = 1;
  newLattice[yCenter() + 7][xCenter() + -13] = 1;
  newLattice[yCenter() + 6][xCenter() + -12] = 1;
  newLattice[yCenter() + 8][xCenter() + -16] = 1;
  newLattice[yCenter() + 9][xCenter() + -15] = 1;
  newLattice[yCenter() + 10][xCenter() + -15] = 1;

  newLattice[yCenter() + 4][xCenter() + 1] = 1;
  newLattice[yCenter() + 5][xCenter() + 1] = 1;
  newLattice[yCenter() + 6][xCenter() + 2] = 1;
  newLattice[yCenter() + 4][xCenter() + 3] = 1;
  newLattice[yCenter() + 6][xCenter() + 4] = 1;
  newLattice[yCenter() + 7][xCenter() + 5] = 1;
  newLattice[yCenter() + 7][xCenter() + 6] = 1;
  newLattice[yCenter() + 7][xCenter() + 7] = 1;
  newLattice[yCenter() + 5][xCenter() + 9] = 1;

  newLattice[yCenter() + 4][xCenter() + 8] = 1;
  newLattice[yCenter() + 4][xCenter() + 7] = 1;
  newLattice[yCenter() + 3][xCenter() + 9] = 1;
  newLattice[yCenter() + 4][xCenter() + 10] = 1;
  newLattice[yCenter() + 6][xCenter() + 11] = 1;
  newLattice[yCenter() + 7][xCenter() + 11] = 1;
  newLattice[yCenter() + 7][xCenter() + 12] = 1;
  newLattice[yCenter() + 7][xCenter() + 13] = 1;
  newLattice[yCenter() + 6][xCenter() + 13] = 1;
  newLattice[yCenter() + 6][xCenter() + 12] = 1;
  newLattice[yCenter() + 5][xCenter() + 14] = 1;
  newLattice[yCenter() + 5][xCenter() + 15] = 1;
  newLattice[yCenter() + 5][xCenter() + 16] = 1;
  newLattice[yCenter() + 5][xCenter() + 17] = 1;
  newLattice[yCenter() + 4][xCenter() + 16] = 1;
  newLattice[yCenter() + 4][xCenter() + 17] = 1;
  newLattice[yCenter() + 3][xCenter() + 18] = 1;
  newLattice[yCenter() + 3][xCenter() + 19] = 1;
  newLattice[yCenter() + 2][xCenter() + 20] = 1;

  newLattice[yCenter() + -3][xCenter() + 21] = 1;
  newLattice[yCenter() + 2][xCenter() + 20] = 1;
  newLattice[yCenter() + 3][xCenter() + 21] = 1;
  setLattice(newLattice);
}

/**
 * Creates a "Tub" pattern in the Game of Life.
 * The "Tub" is a still life pattern, meaning it remains unchanged over time when simulated.
 * This function initializes the Tub pattern within the grid, providing a stable configuration for experiments or use in larger simulations.
 *
 * @function buildTub
 * @returns {void}
 */
export function buildTub() {
  let newLattice = createNewConfig();
  newLattice[yCenter() + 4][xCenter() + 6] = 1;
  newLattice[yCenter() + 5][xCenter() + 5] = 1;
  newLattice[yCenter() + 6][xCenter() + 6] = 1;
  newLattice[yCenter() + 5][xCenter() + 7] = 1;
  newLattice[yCenter() + 2][xCenter() + 4] = 1;
  newLattice[yCenter() + 1][xCenter() + 4] = 1;
  newLattice[yCenter() + 1][xCenter() + 3] = 1;
  newLattice[yCenter() + 0][xCenter() + 1] = 1;
  newLattice[yCenter() + -1][xCenter() + 0] = 1;
  newLattice[yCenter() + -2][xCenter() + 0] = 1;
  newLattice[yCenter() + -2][xCenter() + 1] = 1;
  newLattice[yCenter() + -2][xCenter() + 2] = 1;
  newLattice[yCenter() + 5][xCenter() + 2] = 1;
  newLattice[yCenter() + 4][xCenter() + 2] = 1;
  newLattice[yCenter() + 4][xCenter() + 1] = 1;
  newLattice[yCenter() + 5][xCenter() + 1] = 1;
  newLattice[yCenter() + 6][xCenter() + 2] = 1;
  newLattice[yCenter() + 6][xCenter() + 0] = 1;
  newLattice[yCenter() + 7][xCenter() + 0] = 1;
  newLattice[yCenter() + 7][xCenter() + -1] = 1;
  newLattice[yCenter() + 8][xCenter() + 1] = 1;
  newLattice[yCenter() + 8][xCenter() + -1] = 1;
  newLattice[yCenter() + 8][xCenter() + -2] = 1;
  newLattice[yCenter() + 8][xCenter() + -3] = 1;
  newLattice[yCenter() + 8][xCenter() + -4] = 1;
  newLattice[yCenter() + 9][xCenter() + -3] = 1;
  newLattice[yCenter() + 9][xCenter() + -2] = 1;
  newLattice[yCenter() + 7][xCenter() + -6] = 1;
  newLattice[yCenter() + 6][xCenter() + -7] = 1;
  newLattice[yCenter() + 5][xCenter() + -7] = 1;
  newLattice[yCenter() + 5][xCenter() + -6] = 1;
  newLattice[yCenter() + 5][xCenter() + -5] = 1;
  setLattice(newLattice);
}
