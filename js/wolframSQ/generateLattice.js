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

import { rule, canvas, latSize, orderArray, getSetup } from "./displayLattice.js";
import { cell } from "./cellClass.js";
import { alterRule } from "./displayLattice.js";
import { deadColorSel, aliveColorSel, deadBorderSel, aliveBorderSel, border, currentIteration } from "./displayLattice.js";

//Generates rule array based on input rule number.
export function ruleNumToRule(ruleNum) {
  //Converts rule number to binary represented as an array of 0s and 1s.
  let neoRule = new Array();
  let ruleNumCopy = ruleNum;
  for (let i = 0; i < 8; i++) {
    neoRule[i] = ruleNumCopy % 2;
    ruleNumCopy = Math.floor(ruleNumCopy / 2);
  }
  alterRule(neoRule);
  return rule;
}

//Generates the next lattice based on the current one, the rule, and the boundary condition.
export function generateLattice(currentLattice, rule, boundaryCon, rowIndex, size) {
  let newLattice = new Array();
  let startDif = (latSize * size) / 2;
  let center = canvas.width / 2;
  let startX = center - startDif;
  let altered = new Array();
  for (let i = 0; i < currentLattice.length; i++) {
    newLattice.push(new cell(size, size, startX + i * size, rowIndex * size, 0, border, getSetup()));
  }

  //if(currentLattice.length == 0)
  {
    //If boundary condition is periodic:
    if (boundaryCon == 1) {
      //Iterate over length of new lattice
      for (let i = 0; i < currentLattice.length; i++) {
        let k = orderArray[i];
        altered.push(k);
        //If this is the first cell, access the last cell from previous timestep
        //If this is the last cell, access the first cell from previous timestep
        //Otherwise, access the cell and it's two neighbors normally.
        let leftCell = -1;
        let rightCell = -1;
        let middleCell = currentLattice[k].color;
        if (k == 0) {
          //If the cell being checked has already been altered for newest timestep,
          //use the altered cell rather than the original.
          if (altered.includes(currentLattice.length - 1)) {
            leftCell = newLattice[currentLattice.length - 1].color;
          } else {
            leftCell = currentLattice[currentLattice.length - 1].color;
          }
          //If the cell being checked has already been altered for newest timestep,
          //use the altered cell rather than the original.
          if (altered.includes(k + 1)) {
            rightCell = newLattice[k + 1].color;
          } else {
            rightCell = currentLattice[k + 1].color;
          }
        } else if (k == currentLattice.length - 1) {
          //If the cell being checked has already been altered for newest timestep,
          //use the altered cell rather than the original.
          if (altered.includes(k - 1)) {
            leftCell = newLattice[k - 1].color;
          } else {
            leftCell = currentLattice[k - 1].color;
          }
          //If the cell being checked has already been altered for newest timestep,
          //use the altered cell rather than the original.
          if (altered.includes(0)) {
            rightCell = newLattice[0].color;
          } else {
            rightCell = currentLattice[0].color;
          }
        } else {
          //If the cell being checked has already been altered for newest timestep,
          //use the altered cell rather than the original.
          if (altered.includes(k - 1)) {
            leftCell = newLattice[k - 1].color;
          } else {
            leftCell = currentLattice[k - 1].color;
          }
          //If the cell being checked has already been altered for newest timestep,
          //use the altered cell rather than the original.
          if (altered.includes(k + 1)) {
            rightCell = newLattice[k + 1].color;
          } else {
            rightCell = currentLattice[k + 1].color;
          }
        }
        newLattice[k].setColor(rule[leftCell * 4 + middleCell * 2 + rightCell]);
      }
    }
    //If boundary condition is null:
    else {
      //Iterate over length of new lattice
      for (let i = 0; i < currentLattice.length; i++) {
        let k = orderArray[i];
        altered.push(k);
        //If this is the first cell, value of cell to the left is considered 0
        //If this is the last cell, value of cell to the right is considered 0
        //Otherwise, access the cell and it's two neighbors normally.
        let leftCell = -1;
        let rightCell = -1;
        let middleCell = currentLattice[k].color;
        if (k == 0) {
          leftCell = 0;
          //If the cell being checked has already been altered for newest timestep,
          //use the altered cell rather than the original.
          if (altered.includes(k + 1)) {
            rightCell = newLattice[k + 1].color;
          } else {
            rightCell = currentLattice[k + 1].color;
          }
        } else if (k == currentLattice.length - 1) {
          //If the cell being checked has already been altered for newest timestep,
          //use the altered cell rather than the original.
          if (altered.includes(k - 1)) {
            leftCell = newLattice[k - 1].color;
          } else {
            leftCell = currentLattice[k - 1].color;
          }
          rightCell = 0;
        } else {
          //If the cell being checked has already been altered for newest timestep,
          //use the altered cell rather than the original.
          if (altered.includes(k - 1)) {
            leftCell = newLattice[k - 1].color;
          } else {
            leftCell = currentLattice[k - 1].color;
          }
          //If the cell being checked has already been altered for newest timestep,
          //use the altered cell rather than the original.
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
