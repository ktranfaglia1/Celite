/*
cellClass.js
Authors: Timothy McKirgan and Dustin O'Brien
Class: cell
Functions: ruleNumToRule which takes in the ruleNum to generate a rule array to determine how new
timesteps are generated.
generateLattice which uses the rule array to determine the next timestep. This function takes as parameters
the current timestep, the current rule array, the boundary condition, 1 for periodic and 0 for null, the
current timestep number (rowIndex), and the size individual cells.
*/

import { rule, canvas, latSize, orderArray, getSetup, alterSetup, latticeArray } from "./displayLattice.js";
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
