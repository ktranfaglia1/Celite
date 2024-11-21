/**
 * generateLattice.js
 *
 * Summary:
 *   Defines the `cell` class and utility functions to manage and simulate cellular automata. The class handles
 *   cell properties such as color, size, and position, while the utility functions provide methods for generating
 *   the rule array from a rule number and updating the lattice based on the current state and boundary conditions.
 *
 * Features:
 *   - Converts a rule number into a rule array to define cell behavior.
 *   - Generates the next timestep of the lattice based on the current state, rule array, and boundary conditions.
 *   - Supports two types of boundary conditions: periodic and null.
 *   - Allows customization of cell properties like colors and borders based on user input.
 *
 * Class:
 *   - `cell`: Represents a single cell with properties such as size, color, and location. Provides methods to
 *     update and retrieve cell properties.
 *
 * Functions:
 *   - `ruleNumToRule`: Converts a rule number into a binary rule array to guide cell state changes.
 *   - `generateLattice`: Generates the next timestep lattice based on the current lattice, rule array, boundary
 *     conditions, and other parameters such as cell size and current iteration.
 *
 * Dependencies:
 *   - `cell` (from `cellClass.js`): Represents individual cells in the lattice, providing methods to update cell properties.
 *   - `rule` (from `displayLattice.js`): The array representing the current rule for the lattice.
 *   - `orderArray` (from `displayLattice.js`): The sequence in which cells are updated.
 *   - `getSetup` (from `displayLattice.js`): Retrieves the current setup for initializing cell properties.
 *
 * Authors:
 *   - Timothy McKirgan
 *   - Dustin O'Brien
 */

import {
  rule,
  canvas,
  latSize,
  orderArray,
  getSetup,
  alterRule,
  deadColorSel,
  aliveColorSel,
  deadBorderSel,
  aliveBorderSel,
  border,
} from "./displayLattice.js";
import { cell } from "./cellClass.js";

/**
 * Generates a rule array based on the input rule number.
 *
 * This function takes a rule number, converts it to a binary representation, and stores the resulting binary digits (0s and 1s) into an array.
 * The array is then passed to the `alterRule` function to update the rule setting.
 *
 * Features:
 *   - Converts the input rule number into an 8-bit binary array.
 *   - Uses modulo and division operations to extract the individual bits.
 *   - Updates the rule using `alterRule` with the newly generated binary array.
 *
 * @param {number} ruleNum - The rule number to convert into a binary rule array.
 * @returns {Array} - The generated binary rule array.
 */
export function ruleNumToRule(ruleNum) {
  let neoRule = new Array();
  let ruleNumCopy = ruleNum;
  for (let i = 0; i < 8; i++) {
    neoRule[i] = ruleNumCopy % 2;
    ruleNumCopy = Math.floor(ruleNumCopy / 2);
  }
  alterRule(neoRule);
  return rule;
}

/**
 * Generates the next lattice based on the current one, the rule, and the boundary condition.
 *
 * This function computes the next state of the lattice by applying the given rule and considering the boundary condition.
 * It updates the lattice cells according to the rule and adjusts the boundaries based on the specified condition (periodic or null).
 * The new lattice is then returned with updated colors and borders for each cell.
 *
 * Features:
 *   - Iterates over the current lattice to generate the new lattice based on the provided rule.
 *   - Handles both periodic and null boundary conditions to determine the neighboring cells of each lattice cell.
 *   - Updates the color and border of each cell in the new lattice.
 *   - Uses an altered array to ensure that cells are updated based on their latest state, preventing conflicts during the iteration.
 *
 * @param {Array} currentLattice - The current lattice state (array of cell objects).
 * @param {Array} rule - The rule set used to determine the new state of each cell.
 * @param {number} boundaryCon - The boundary condition (1 for periodic, 0 for null).
 * @param {number} rowIndex - The index of the row in the lattice.
 * @param {number} size - The size of each cell in the lattice.
 * @returns {Array} - The newly generated lattice after applying the rule and boundary condition.
 */
export function generateLattice(
  currentLattice,
  rule,
  boundaryCon,
  rowIndex,
  size
) {
  let newLattice = new Array();
  let startDif = (latSize * size) / 2;
  let center = canvas.width / 2;
  let startX = center - startDif;
  let altered = new Array();
  for (let i = 0; i < currentLattice.length; i++) {
    newLattice.push(
      new cell(
        size,
        size,
        startX + i * size,
        rowIndex * size,
        0,
        border,
        getSetup()
      )
    );
  }

  {
    if (boundaryCon == 1) {
      for (let i = 0; i < currentLattice.length; i++) {
        let k = orderArray[i];
        altered.push(k);
        let leftCell = -1;
        let rightCell = -1;
        let middleCell = currentLattice[k].color;
        if (k == 0) {
          if (altered.includes(currentLattice.length - 1)) {
            leftCell = newLattice[currentLattice.length - 1].color;
          } else {
            leftCell = currentLattice[currentLattice.length - 1].color;
          }
          if (altered.includes(k + 1)) {
            rightCell = newLattice[k + 1].color;
          } else {
            rightCell = currentLattice[k + 1].color;
          }
        } else if (k == currentLattice.length - 1) {
          if (altered.includes(k - 1)) {
            leftCell = newLattice[k - 1].color;
          } else {
            leftCell = currentLattice[k - 1].color;
          }
          if (altered.includes(0)) {
            rightCell = newLattice[0].color;
          } else {
            rightCell = currentLattice[0].color;
          }
        } else {
          if (altered.includes(k - 1)) {
            leftCell = newLattice[k - 1].color;
          } else {
            leftCell = currentLattice[k - 1].color;
          }
          if (altered.includes(k + 1)) {
            rightCell = newLattice[k + 1].color;
          } else {
            rightCell = currentLattice[k + 1].color;
          }
        }
        newLattice[k].setColor(rule[leftCell * 4 + middleCell * 2 + rightCell]);
      }
    } else {
      for (let i = 0; i < currentLattice.length; i++) {
        let k = orderArray[i];
        altered.push(k);
        let leftCell = -1;
        let rightCell = -1;
        let middleCell = currentLattice[k].color;
        if (k == 0) {
          leftCell = 0;
          if (altered.includes(k + 1)) {
            rightCell = newLattice[k + 1].color;
          } else {
            rightCell = currentLattice[k + 1].color;
          }
        } else if (k == currentLattice.length - 1) {
          if (altered.includes(k - 1)) {
            leftCell = newLattice[k - 1].color;
          } else {
            leftCell = currentLattice[k - 1].color;
          }
          rightCell = 0;
        } else {
          if (altered.includes(k - 1)) {
            leftCell = newLattice[k - 1].color;
          } else {
            leftCell = currentLattice[k - 1].color;
          }
          if (altered.includes(k + 1)) {
            rightCell = newLattice[k + 1].color;
          } else {
            rightCell = currentLattice[k + 1].color;
          }
        }
        newLattice[k].setColor(rule[leftCell * 4 + middleCell * 2 + rightCell]);
      }
    }
  }
  for (let i = 0; i < newLattice.length; i++) {
    newLattice[i].setDeadColor(deadColorSel.value);
    newLattice[i].setAliveColor(aliveColorSel.value);
    newLattice[i].setDeadBorder(deadBorderSel.value);
    newLattice[i].setAliveBorder(aliveBorderSel.value);
  }
  return newLattice;
}
