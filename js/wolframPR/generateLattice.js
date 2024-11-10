/**
 * generatesLattice.js
 *
 * Summary:
 *   This script contains functions that handle the generation of lattice arrays based on cellular automaton rules
 *   and boundary conditions. It includes functionality for periodic and non-periodic boundary conditions and updates
 *   lattice cell states according to the specified rule.
 *
 * Features:
 *   - Generates the next lattice based on the current lattice, rule, and boundary condition.
 *   - Supports periodic and null boundary conditions for the simulation.
 *   - Modifies lattice cell colors and properties based on user-defined settings.
 *
 * Functions:
 *   - generateLattice(currentLattice, rule, boundaryCon, rowIndex, size):
 *     Generates the next lattice based on the current lattice state and applies the rule to determine the color of each cell.
 *   - updateLattice():
 *     Updates the lattice for the next timestep based on the current settings and rule.
 *
 * Dependencies:
 *   - rule, canvas, latSize from './displayLattice.js': Provide the lattice size, canvas, and rule array for generating the lattice.
 *   - cell from './cellClass.js': Defines the cell class for creating and manipulating individual cells.
 *   - alterRule from './displayLattice.js': Modifies the current rule array for cell state transitions.
 *   - deadColorSel, aliveColorSel, deadBorderSel, aliveBorderSel from './displayLattice.js': Provide color and border settings for cells.
 *
 * Authors:
 *   - Timmy McKirgan
 *   - Dustin O'Brien
 */

import { rule, canvas, latSize } from "./displayLattice.js";
import { cell } from "./cellClass.js";
import { alterRule } from "./displayLattice.js";
import { deadColorSel, aliveColorSel, deadBorderSel, aliveBorderSel } from "./displayLattice.js";

/**
 * alterInf
 *
 * Summary:
 *   Mutator function for modifying the `inf` array and handling related logic
 *   for buffer settings and lattice size. This function updates the `inf` array
 *   based on the provided values for `neoInf`, `bufferToggle`, and `bufferSize`.
 *   It also modifies `latSize` based on certain conditions tied to the state of `inf`.
 *
 * Features:
 *   - Modifies the `inf` array based on new values for `neoInf`, `bufferToggle`, and `bufferSize`.
 *   - Adjusts the buffer state and lattice size (`latSize`) according to the state of `inf[0]`.
 *   - Ensures that the buffer size is applied only when the buffer is enabled.
 *
 * @param {boolean} neoInf - The new value for `inf[0]`. If `inf[0]` changes state,
 *   it may trigger additional logic related to the buffer and lattice size.
 * @param {boolean} bufferToggle - The state for enabling or disabling the buffer.
 * @param {number} bufferSize - The new buffer size to be applied if the buffer is enabled.
 *
 * @returns {void} - This function modifies the `inf` array and `latSize` in place;
 *   it does not return any value.
 */
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

/**
 * generateLattice
 *
 *   Generates the next lattice based on the current lattice, the provided rule,
 *   boundary conditions, and other relevant parameters. This function constructs
 *   a new lattice where each cell's state is determined by its neighboring cells,
 *   considering the boundary condition (periodic or null).
 *
 *
 * @param {Array} currentLattice - The lattice from the current timestep. It contains cells that store their state.
 * @param {Array} rule - The set of rules for calculating the new color based on neighboring cells' states.
 * @param {number} boundaryCon - The type of boundary condition:
 *   - `1` for periodic boundary conditions.
 *   - `0` or other values for null boundary conditions.
 * @param {number} rowIndex - The index of the row that this lattice belongs to, used for vertical positioning.
 * @param {number} size - The size of each individual cell in the lattice.
 *
 * @returns {Array} newLattice - A new lattice with updated cells based on the rule and boundary condition.
 */
export function generateLattice(currentLattice, rule, boundaryCon, rowIndex, size) {
  let newLattice = new Array();
  let startDif = (latSize[0] * size) / 2;
  let center = canvas.width / 2;
  let startX = center - startDif;
  //If boundary condition is periodic:
  if (boundaryCon == 1) {
    //Iterate over length of new lattice
    for (let i = 0; i < currentLattice.length; i++) {
      newLattice.push(new cell(size, size, startX + i * size, rowIndex * size, 0));
      //If this is the first cell, access the last cell from previous timestep
      //If this is the last cell, access the first cell from previous timestep
      //Otherwise, access the above three cells normally.
      if (i == 0) {
        newLattice[i].setColor(rule[currentLattice[currentLattice.length - 1].color * 4 + currentLattice[i].color * 2 + currentLattice[i + 1].color]);
      } else if (i == currentLattice.length - 1) {
        newLattice[i].setColor(rule[currentLattice[i - 1].color * 4 + currentLattice[i].color * 2 + currentLattice[0].color]);
      } else {
        newLattice[i].setColor(rule[currentLattice[i - 1].color * 4 + currentLattice[i].color * 2 + currentLattice[i + 1].color]);
      }
    }
  }
  //If boundary condition is null:
  else {
    //Iterate over length of new lattice
    for (let i = 0; i < currentLattice.length; i++) {
      newLattice.push(new cell(size, size, startX + i * size, rowIndex * size, 0));
      //If this is the first cell, value of cell to the left is considered 0
      //If this is the last cell, value of cell to the right is considered 0
      //Otherwise, access the above three cells normally.
      if (i == 0) {
        newLattice[i].setColor(rule[currentLattice[i].color * 2 + currentLattice[i + 1].color]);
      } else if (i == currentLattice.length - 1) {
        newLattice[i].setColor(rule[currentLattice[i - 1].color * 4 + currentLattice[i].color * 2]);
      } else {
        newLattice[i].setColor(rule[currentLattice[i - 1].color * 4 + currentLattice[i].color * 2 + currentLattice[i + 1].color]);
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
