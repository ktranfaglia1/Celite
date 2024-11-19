/**
 * UIFunctionality.js
 *
 * Summary:
 *   This script handles all user interface functionality for the simulation. It processes button clicks, user inputs,
 *   mouse actions, and updates to the lattice and cell states. It also manages iterations, simulation modifications,
 *   and communicates with utility files.
 *
 * Features:
 *   - Manages user interactions with the simulation, such as button clicks and mouse actions.
 *   - Updates the lattice and cell configurations based on UI changes.
 *   - Controls iteration flow and updates the display accordingly.
 *   - Interacts with other modules to modify simulation parameters.
 *
 * Functions:
 *   - borderToggleOption(): Toggles the visibility of the border in the simulation.
 *   - startStopToggle(): Toggles the simulation between running and stopped.
 *   - clearResetToggle(): Clears the canvas or resets the simulation state.
 *   - handleCheckboxChange(): Updates the boundary conditions based on checkbox selections.
 *   - makeError(errorMessage, logCanvas, messageQueue): Logs an error message to the message queue.
 *   - makeLog(errorMessage, logCanvas, messageQueue): Logs a standard message to the message queue.
 *   - displayLog(messageQueue, logCanvas): Displays messages from the log queue onto the canvas.
 *   - downloadPDFButton.addEventListener(): Captures the canvas as a PDF and triggers a download.
 *   - downloadPNGButton.addEventListener(): Captures the canvas as a PNG and triggers a download.
 *   - aboutButton.addEventListener(): Displays the about window.
 *   - closeAbout.addEventListener(): Closes the about window.
 *   - optionsButton.addEventListener(): Displays the options window or toggles its visibility.
 *   - closeOptions.addEventListener(): Closes the options window.
 *   - iterationSpeedSlider.oninput: Updates the iteration speed based on slider input.
 *   - debounce(callback): Limits the frequency of function calls, typically used for handling UI input events.
 *   - shortDebounce(callback): A faster debounce function for handling slider inputs.
 *
 * Dependencies:
 *   - latticeArray, rule, canvas, ctx, outputIteration, alterRuleNum, tctx, tickCanvas, logCanvas, drawLattice from './displayLattice.js'
 *   - numOfIterations, currentIteration, size, latSize, ruleNum, inf from './displayLattice.js'
 *   - alterLatSize, alterSize, alterLatticeArray, alterCurrentLattice, alterNextLattice, alterBorder from './displayLattice.js'
 *   - alterRule, alterNumOfIterations, alterCurrentIteration, alterBoundaryCon, alterInf, getBorder from './displayLattice.js'
 *   - updateLattice from './displayLattice.js'
 *   - deadColorSel, aliveColorSel, deadBorderSel, aliveBorderSel from './displayLattice.js'
 *   - ruleNumToRule from './generateLattice.js'
 *   - cell from './cellClass.js'
 *   - logMessage from './logClass.js'
 *
 * Authors:
 *   - Kyle Tranfaglia
 *   - Timmy McKirgan
 *   - Dustin O'Brien
 */

import { latticeArray, rule, canvas, ctx, outputIteration, alterRuleNum, tctx, tickCanvas, logCanvas, drawLattice } from "./displayLattice.js";
import { numOfIterations, currentIteration, size, latSize, ruleNum, inf } from "./displayLattice.js";
import { alterLatSize, alterSize, alterLatticeArray, alterCurrentLattice, alterNextLattice, alterBorder } from "./displayLattice.js";
import { alterRule, alterNumOfIterations, alterCurrentIteration, alterBoundaryCon, alterInf, getBorder } from "./displayLattice.js";
import { updateLattice } from "./displayLattice.js";
import { deadColorSel, aliveColorSel, deadBorderSel, aliveBorderSel } from "./displayLattice.js";
import { ruleNumToRule } from "./generateLattice.js";
import { cell } from "./cellClass.js";
import { logMessage } from "./logClass.js";

/*
Hotkeys for zoom in/out
change cell label when only one row
Reset Perspective Button
*/

/**
 * Variable that detects if mouse is currently down
 * @type {boolean}
 */
let mouseDown = false;

/* Global constants connecting HTML buttons to JS by ID to impliment functionality */

/**
 * Input box for iterations.
 * @type {HTMLInputElement}
 */
const iterationInputBox = document.getElementById("iterationInputBox");

/**
 * Input box for rule input.
 * @type {HTMLInputElement}
 */
const ruleInputBox = document.getElementById("ruleInputBox");

/**
 * Input box for lattice size.
 * @type {HTMLInputElement}
 */
const latticeSizeBox = document.getElementById("latticeSizeBox");

/**
 * Submit button for iterations.
 * @type {HTMLButtonElement}
 */
const iterationSubmit = document.getElementById("iterationSubmit");

/**
 * Submit button for rule input.
 * @type {HTMLButtonElement}
 */
const ruleSubmit = document.getElementById("ruleSubmit");

/**
 * Submit button for lattice size.
 * @type {HTMLButtonElement}
 */
const latticeSizeSubmit = document.getElementById("latticeSizeSubmit");

/**
 * Start/stop button for the simulation.
 * @type {HTMLButtonElement}
 */
const startStopButton = document.getElementById("startStopButton");

/**
 * Iterate button for progressing the simulation.
 * @type {HTMLButtonElement}
 */
const iterateButton = document.getElementById("iterateButton");

/**
 * Clear/reset button for resetting the simulation.
 * @type {HTMLButtonElement}
 */
const clearResetButton = document.getElementById("clearResetButton");

/**
 * Download button for generating PDF.
 * @type {HTMLButtonElement}
 */
const downloadPDFButton = document.getElementById("downloadPDFButton");

/**
 * Download button for generating PNG.
 * @type {HTMLButtonElement}
 */
const downloadPNGButton = document.getElementById("downloadPNGButton");

/**
 * About button for accessing information.
 * @type {HTMLButtonElement}
 */
const aboutButton = document.getElementById("aboutButton");

/**
 * Options button for opening settings.
 * @type {HTMLButtonElement}
 */
const optionsButton = document.getElementById("optionsButton");

/**
 * Button for filling the lattice.
 * @type {HTMLButtonElement}
 */
const latticeFillButton = document.getElementById("latticeFillButton");

/**
 * Button for filling the lattice with random values.
 * @type {HTMLButtonElement}
 */
const randomFillButton = document.getElementById("randomFillButton");

/**
 * Checkbox for periodic boundary conditions.
 * @type {HTMLInputElement}
 */
const periodicCheckBox = document.getElementById("periodicCheckBox");

/**
 * Checkbox for null condition.
 * @type {HTMLInputElement}
 */
const nullCheckBox = document.getElementById("nullCheckBox");

/**
 * Toggle button for boundary conditions.
 * @type {HTMLButtonElement}
 */
const boundToggleButton = document.getElementById("boundToggle");

/**
 * Toggle button for iteration settings.
 * @type {HTMLButtonElement}
 */
const iterationToggleButton = document.getElementById("iterationToggle");

/**
 * Toggle button for border settings.
 * @type {HTMLButtonElement}
 */
const borderToggleButton = document.getElementById("borderToggle");

/**
 * Container window for the About section.
 * @type {HTMLDivElement}
 */
const aboutWindow = document.getElementById("aboutContainer");

/**
 * Container window for the Options section.
 * @type {HTMLDivElement}
 */
const optionsWindow = document.getElementById("optionsContainer");

/**
 * Slider for controlling iteration speed.
 * @type {HTMLInputElement}
 */
const iterationSpeedSlider = document.getElementById("iterationSpeedSlider");

/**
 * Display element showing current iteration speed value.
 * @type {HTMLSpanElement}
 */
const iterationSpeedValue = document.getElementById("iterationSpeedValue");

/**
 * Collection of checkboxes for selecting options.
 * @type {NodeListOf<HTMLInputElement>}
 */
const checkboxes = document.querySelectorAll(".checkbox_select");

/**
 * Button for toggling boundary condition on or off.
 * @type {HTMLButtonElement}
 */
const boundToggle = document.querySelector("#boundToggle .toggle_button");

/**
 * Button for toggling iteration settings on or off.
 * @type {HTMLButtonElement}
 */
const iterationToggle = document.querySelector("#iterationToggle .toggle_button");

/**
 * Button for toggling border settings on or off.
 * @type {HTMLButtonElement}
 */
const borderToggle = document.querySelector("#borderToggle .toggle_button");

/**
 * Close button for the About window.
 * @type {HTMLButtonElement}
 */
const closeAbout = document.querySelector("#aboutContent .close");

/**
 * Close button for the Options window.
 * @type {HTMLButtonElement}
 */
const closeOptions = document.querySelector("#optionsContent .close");

/**
 * Number of iterations to be added.
 * Defaults to 0.
 * @type {number}
 */
let addIterations = 10;
alterInf(inf[0], false, 10);

/**
 * Flag to control if the iteration process is running.
 * Defaults to 0 (not running).
 * @type {number}
 */
let run = 0;

/**
 * Time in milliseconds to wait before iterating again.
 * Defaults to 750ms.
 * @type {number}
 */
let iterationTime = 750;

/**
 * Flag to toggle the row ticker.
 * Defaults to 0 (ticker on).
 * @type {number}
 */
let tickerToggle = 0;

/**
 * Scale factor for controlling zoom or scroll level.
 * Defaults to 1.
 * @type {number}
 */
let scale = 1;

/**
 * Total change in scroll position to prevent excessive zooming out.
 * @type {number}
 */
let totalDelta = 0;

/**
 * Queue to store messages for later processing.
 * @type {Array<log>}
 */
let messageQueue = [];

/**
 * redrawLattice
 *
 * Summary:
 *   Redraws the entire lattice array on the canvas by first clearing the canvas
 *   and then filling the grid with the appropriate colors based on the state of each cell.
 *
 * Features:
 *   - Clears the canvas to prepare for redrawing.
 *   - Sets the color for dead cells using the selected color from `deadColorSel`.
 *   - Iterates through each cell in the `latticeArray` and draws it on the canvas.
 *
 * @returns {void} - This function modifies the canvas directly and does not return any value.
 */
function redrawLattice() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = deadColorSel.value;
  ctx.fillRect(latticeArray[0][0].getXLoc(), latticeArray[0][0].getYLoc(), latticeArray[0].length * latticeArray[0][0].getHeight(), latticeArray.length * latticeArray[0][0].getWidth());
  for (let i = 0; i < latticeArray.length; i++) {
    for (let f = 0; f < latticeArray[i].length; f++) {
      latticeArray[i][f].drawCell(ctx);
    }
  }
}

/**
 * inLattice
 *
 * Summary:
 *   Determines if the mouse cursor is currently within the lattice.
 *   Returns `true` if the cursor is inside the lattice bounds, otherwise returns `false`.
 *
 * Features:
 *   - Checks the X position of the mouse relative to the lattice's first and last cells.
 *   - If only one row exists, it directly returns `true` if the mouse's X position is within the lattice.
 *   - If multiple rows exist, it checks both X and Y positions to determine if the mouse is within the lattice.
 *
 * @param {number} mouseX - The X coordinate of the mouse cursor.
 * @param {boolean} [oneRow=true] - Flag indicating if there is only one row in the lattice. Defaults to `true`.
 * @param {number} [mouseY=0] - The Y coordinate of the mouse cursor. Defaults to `0`.
 *
 * @returns {boolean} - `true` if the mouse cursor is within the lattice bounds, `false` otherwise.
 */
function inLattice(mouseX, oneRow = true, mouseY = 0) {
  let inLat = false;
    if (mouseX >= latticeArray[0][0].getXLoc()) {
        if (mouseX <= latticeArray[0][latticeArray[0].length - 1].getXLoc() + latticeArray[0][latticeArray[0].length - 1].getWidth()) {
            if (oneRow) {
        inLat = true;
      } else {
                if (mouseY >= 0) {
                    if (mouseY <= latticeArray[latticeArray.length - 1][0].getYLoc() + latticeArray[latticeArray.length - 1][0].getHeight()) {
            inLat = true;
          }
        }
      }
    }
  }
  return inLat;
}

/**
 * revertCells
 *
 * Summary:
 *   Resets the lattice cells to their original, unscrolled form by adjusting
 *   their positions and sizes based on the provided `latSize` and `size`.
 *   The cells are recalculated to fit the original grid layout.
 *
 * Features:
 *   - Adjusts the size and position of each cell in the `latticeArray`.
 *   - Resets each cell’s height, width, and location to reflect the unscrolled state.
 *   - Recalculates the starting position (`startX`) to ensure the lattice is centered.
 *
 * @returns {void} - This function modifies the `latticeArray` directly and does not return any value.
 */
function revertCells() {
  let startX = canvas.width / 2 - (latSize[0] * size) / 2;
  for (let i = 0; i < latticeArray.length; i++) {
    for (let f = 0; f < latticeArray[i].length; f++) {
      latticeArray[i][f].setHeight(size);
      latticeArray[i][f].setWidth(size);
      latticeArray[i][f].setXLoc(startX + f * size);
      latticeArray[i][f].setYLoc(i * size);
    }
  }
}

/**
 * alterCell
 *
 * Summary:
 *   Modifies the position and size of a given cell based on the mouse's location and the scale factor.
 *   The function adjusts the cell's width, height, and position by scaling the distance between the
 *   mouse cursor and the corners of the cell.
 *
 * Features:
 *   - Calculates the new position of the cell based on the mouse cursor's location.
 *   - Adjusts the width and height of the cell according to the scale factor.
 *   - Ensures the cell's new location and dimensions reflect the changes made by the mouse's position.
 *
 * @param {number} mouseX - The X coordinate of the mouse cursor.
 * @param {Object} cell - The cell to be altered. Expected to have methods for getting and setting position, width, and height.
 * @param {number} scale - The scale factor to adjust the cell size and position.
 * @param {number} [mouseY=0] - The Y coordinate of the mouse cursor. Defaults to `0`.
 *
 * @returns {void} - This function modifies the given cell's properties and does not return any value.
 */
function alterCell(mouseX, cell, scale, mouseY = 0) {
      let corner0X = cell.getXLoc();
  let corner0Y = cell.getYLoc();
  let corner1X = cell.getXLoc() + cell.getWidth();
  let corner2Y = cell.getYLoc() + cell.getHeight();

    let deltaCorner0X = corner0X - mouseX;
  let deltaCorner0Y = corner0Y - mouseY;
  let deltaCorner1X = corner1X - mouseX;
  let deltaCorner2Y = corner2Y - mouseY;

    let newCell0X = mouseX + deltaCorner0X * scale;
  let newCell0Y = mouseY + deltaCorner0Y * scale;
  let newCell1X = mouseX + deltaCorner1X * scale;
  let newCell2Y = mouseY + deltaCorner2Y * scale;

    let newCellWidth = newCell1X - newCell0X;
  let newCellHeight = newCell2Y - newCell0Y;

    cell.setHeight(newCellHeight);
  cell.setWidth(newCellWidth);
  cell.setXLoc(newCell0X);
  cell.setYLoc(newCell0Y);
}

/* THIS SECTION IS USED FOR COLOR PICKING */

/**
 * Event listener for selecting the color for dead cells.
 *
 * Summary:
 *   This function listens for an input event on the `deadColorSel` element (color picker).
 *   When the color is changed, it updates the color of all cells in the lattice by
 *   setting their "dead color" to the selected value. After updating the colors, it redraws
 *   the entire lattice to reflect the change.
 *
 * Features:
 *   - Changes the dead color of all cells in the lattice when a new color is selected.
 *   - Redraws the lattice to apply the updated dead color to all cells.
 *
 * @listens input
 * @param {Event} event - The input event triggered by changing the color in the color picker.
 *
 * @returns {void} - This function does not return any value, it modifies the lattice and redraws it.
 */
deadColorSel.addEventListener("input", function () {
  for (let i = 0; i < latticeArray.length; i++) {
    for (let j = 0; j < latticeArray[0].length; j++) {
      latticeArray[i][j].setDeadColor(deadColorSel.value);
    }
  }
  drawLattice(latticeArray);
});

/**
 * Event listener for selecting the color for alive cells.
 *
 * Summary:
 *   This function listens for an input event on the `aliveColorSel` element (color picker).
 *   When the color is changed, it updates the color of all cells in the lattice by
 *   setting their "alive color" to the selected value. After updating the colors, it redraws
 *   the entire lattice to reflect the change.
 *
 * Features:
 *   - Changes the alive color of all cells in the lattice when a new color is selected.
 *   - Redraws the lattice to apply the updated alive color to all cells.
 *
 * @listens input
 * @param {Event} event - The input event triggered by changing the color in the color picker.
 *
 * @returns {void} - This function does not return any value, it modifies the lattice and redraws it.
 */
aliveColorSel.addEventListener("input", function () {
  for (let i = 0; i < latticeArray.length; i++) {
    for (let j = 0; j < latticeArray[0].length; j++) {
      latticeArray[i][j].setAliveColor(aliveColorSel.value);
    }
  }
  drawLattice(latticeArray);
});

/**
 * Event listener for selecting the border color for dead cells.
 *
 * Summary:
 *   This function listens for an input event on the `deadBorderSel` element (color picker).
 *   When the color is changed, it updates the border color of all cells in the lattice by
 *   setting their "dead border" color to the selected value. After updating the colors, it redraws
 *   the entire lattice to reflect the change.
 *
 * Features:
 *   - Changes the border color of dead cells in the lattice when a new color is selected.
 *   - Redraws the lattice to apply the updated border color to all dead cells.
 *
 * @listens input
 * @param {Event} event - The input event triggered by changing the border color in the color picker.
 *
 * @returns {void} - This function does not return any value, it modifies the lattice and redraws it.
 */
deadBorderSel.addEventListener("input", function () {
  for (let i = 0; i < latticeArray.length; i++) {
    for (let j = 0; j < latticeArray[0].length; j++) {
      latticeArray[i][j].setDeadBorder(deadBorderSel.value);
    }
  }
  drawLattice(latticeArray);
});

/**
 * Event listener for selecting the border color for alive cells.
 *
 * Summary:
 *   This function listens for an input event on the `aliveBorderSel` element (color picker).
 *   When the color is changed, it updates the border color of all cells in the lattice by
 *   setting their "alive border" color to the selected value. After updating the colors, it redraws
 *   the entire lattice to reflect the change.
 *
 * Features:
 *   - Changes the border color of alive cells in the lattice when a new color is selected.
 *   - Redraws the lattice to apply the updated border color to all alive cells.
 *
 * @listens input
 * @param {Event} event - The input event triggered by changing the border color in the color picker.
 *
 * @returns {void} - This function does not return any value, it modifies the lattice and redraws it.
 */
aliveBorderSel.addEventListener("input", function () {
  for (let i = 0; i < latticeArray.length; i++) {
    for (let j = 0; j < latticeArray[0].length; j++) {
      latticeArray[i][j].setAliveBorder(aliveBorderSel.value);
    }
  }
  drawLattice(latticeArray);
});

/**
 * Event listener for zooming in and out on the lattice with mouse wheel scrolling.
 *
 * Summary:
 *   This function listens for a `wheel` event on the `tickCanvas` element. It calculates the
 *   zoom center based on the mouse position, determines whether the lattice has one or more rows,
 *   and adjusts the zoom scale accordingly. It also keeps track of the zoom level using the `totalDelta`
 *   variable and modifies the size and position of cells in the lattice to achieve the zoom effect.
 *   The zoom is either focused on the X-axis for a single row or both X and Y for multiple rows.
 *
 * Features:
 *   - Zooms in and out of the lattice when the mouse wheel is used.
 *   - Calculates the zoom center based on the mouse position to ensure zooming happens around the cursor.
 *   - Adjusts the size and position of cells in the lattice based on the zoom level.
 *   - Limits zooming out by reverting the cell sizes back to their original unzoomed form if needed.
 *
 * @listens wheel
 * @param {WheelEvent} event - The wheel event triggered when the user scrolls with the mouse wheel.
 *
 * @returns {void} - This function does not return any value; it modifies the lattice by adjusting the
 *   scale of the cells and redraws the lattice based on the new scale.
 */
tickCanvas.addEventListener(
  "wheel",
  function (event) {
    let mouseX, mouseY;
    [mouseX, mouseY] = getMouseLocation(event);         if (latticeArray.length == 1 && inLattice(mouseX)) {
      let delta = event.deltaY;             if (delta > 0 && totalDelta > 0) {
        scale = 0.9;
      }
            else if (delta < 0) {
        scale = 1.1;
      }
      totalDelta -= delta;             if (totalDelta < 0) {
        revertCells();
        totalDelta = 0;
      }
            else {
        for (let i = 0; i < latticeArray.length; i++) {
          for (let f = 0; f < latticeArray[i].length; f++) {
            alterCell(mouseX, latticeArray[i][f], scale);
          }
        }
      }
      redrawLattice();
    } else if (latticeArray.length > 1 && inLattice(mouseX, false, mouseY)) {
      let delta = event.deltaY;             if (delta > 0 && totalDelta > 0) {
        scale = 0.75;
      }
            else if (delta < 0) {
        scale = 1.25;
      }
      totalDelta -= delta;             if (totalDelta < 0) {
        revertCells();
        totalDelta = 0;
      }
            else {
        for (let i = 0; i < latticeArray.length; i++) {
          for (let f = 0; f < latticeArray[i].length; f++) {
            alterCell(mouseX, latticeArray[i][f], scale, mouseY);
          }
        }
      }
      redrawLattice();
    }
    event.preventDefault();
  },
  false
);

/**
 * Event listener to change the rule set when the submit button is clicked.
 *
 * Summary:
 *   This function listens for a `click` event on the `ruleSubmit` button. When clicked, it stops any ongoing iteration,
 *   clears the reset toggle, and sets the new rule using the current `rule` value.
 *
 * Features:
 *   - Stops the iteration process before applying a new rule to avoid conflicts.
 *   - Clears the reset toggle to ensure that no unintended state persists.
 *   - Sets the new rule to be applied in the lattice simulation.
 *
 * @listens click
 * @param {MouseEvent} event - The click event triggered by the user when they submit the new rule.
 *
 * @returns {void} - This function does not return any value; it modifies the lattice simulation by stopping
 *   iteration, clearing the reset toggle, and setting the new rule.
 */
ruleSubmit.addEventListener("click", function () {
  stopIterating();   
  clearResetToggle();
  setRule(rule);
});

/**
 * Event listener to fill the lattice with all alive cells when the button is clicked.
 *
 * Summary:
 *   This function listens for a `click` event on the `latticeFillButton`. When clicked, it stops any ongoing iteration,
 *   resets the lattice, and sets all cells in the first row of the lattice to the alive state. It also logs the action.
 *
 * Features:
 *   - Stops the iteration process to ensure changes are applied without interference.
 *   - Resets the lattice size and clears any previous states.
 *   - Sets all cells in the first row of the lattice to alive.
 *   - Draws the updated lattice on the canvas.
 *   - Logs the action in the message queue for later reference.
 *
 * @listens click
 * @param {MouseEvent} event - The click event triggered by the user to fill the lattice.
 *
 * @returns {void} - This function does not return any value; it modifies the lattice by filling it with alive cells
 *   and logging the action.
 */
latticeFillButton.addEventListener("click", function () {
  stopIterating();   
  clearResetToggle();
  clear(latticeArray);
  alterInf(inf[0], false);

  for (let i = 0; i < latticeArray[0].length; i++) {
    latticeArray[0][i].setColor(1);
  }
  drawLattice(latticeArray);
  makeLog("Filled Lattice", logCanvas, messageQueue);
});

/**
 * Event listener to randomly set the state of all cells in the starting lattice when the button is clicked.
 *
 * Summary:
 *   This function listens for a `click` event on the `randomFillButton`. When clicked, it stops any ongoing iteration,
 *   resets the lattice, and randomly assigns a state (either alive or dead) to each cell in the first row of the lattice.
 *   The action is logged for future reference.
 *
 * Features:
 *   - Stops the iteration process to ensure the random filling occurs without interference.
 *   - Resets the lattice size and clears any previous states.
 *   - Randomly assigns the state (alive or dead) to each cell in the first row of the lattice.
 *   - Draws the updated lattice on the canvas.
 *   - Logs the action in the message queue for later reference.
 *
 * @listens click
 * @param {MouseEvent} event - The click event triggered by the user to randomly fill the lattice.
 *
 * @returns {void} - This function does not return any value; it modifies the lattice by randomly setting cell states
 *   and logs the action.
 */
randomFillButton.addEventListener(
  "click",
  debounce(function () {
    stopIterating();     
    clearResetToggle();
    clear(latticeArray);
    alterInf(inf[0], false);

    for (let i = 0; i < latticeArray[0].length; i++) {
      latticeArray[0][i].setColor(Math.floor(Math.random() * 2));
    }
    drawLattice(latticeArray);
    makeLog("Randomized Lattice", logCanvas, messageQueue);
  })
);

/**
 * Event listener to handle iteration of lattice cells when the iterate button is clicked.
 *
 * Summary:
 *   This function listens for a `click` event on the `iterateButton`. When clicked, it stops any ongoing iteration,
 *   alters the lattice to account for buffer cells, adjusts the lattice size, and iterates the lattice based on the
 *   inputted number of iterations. The action and any errors are logged.
 *
 * Features:
 *   - Stops the iteration process before starting a new iteration.
 *   - Adds buffer cells on both ends of the lattice for a "mock" array to simulate new iterations.
 *   - Adjusts the lattice size and cell size to fit the new lattice, capped at a maximum size of 45.
 *   - Iterates through the lattice array, applying the rule and altering cell colors accordingly.
 *   - Logs the iteration action or error messages (if the iteration number is not set).
 *
 * @listens click
 * @param {MouseEvent} event - The click event triggered by the user to iterate the lattice.
 *
 * @returns {void} - This function does not return any value. It performs actions on the lattice based on the
 *   iteration number and the input values, and logs the corresponding messages.
 */
iterateButton.addEventListener(
  "click",
  debounce(function () {
    stopIterating();         
    alterInf(inf[0], true);
    console.log(addIterations);
    if (addIterations == 0) {
      makeError("Iteration not set", logCanvas, messageQueue);
      return;
    }
    makeLog("Iterated to " + addIterations + " Rule: " + ruleNum, logCanvas, messageQueue);
    if (latticeArray.length == 1) {
      let bufferArr = new Array();
      let latPlusBufferArr = new Array();
            for (let i = 0; i < latSize[0]; i++) {
        latPlusBufferArr.push(latticeArray[0][i].getColor());
      }
            for (let i = 0; i < latSize[1]; i++) {
        bufferArr.push(0);
      }
      latPlusBufferArr = bufferArr.concat(latPlusBufferArr.concat(bufferArr));
            let newCellNum = latSize[0] + 2 * latSize[1];
      if (!isNaN(newCellNum) && newCellNum >= 1) {
        alterLatSize(newCellNum);
      }
            let size = canvas.width / latSize[0];
            if (size > 45) {
        size = 45;
      }
      alterSize(size);
            clear(latticeArray);
      let neoLatticeArray = latticeArray;
            for (let i = 0; i < latticeArray[0].length; i++) {
        if (latPlusBufferArr[i] == 1) {
          neoLatticeArray[0][i].flipColor();
        }
        neoLatticeArray[0][i].drawCell(ctx);
        alterLatticeArray(neoLatticeArray);
      }
      clearResetButton.innerHTML = "Reset";
    }
    iterate(currentIteration, addIterations);
  })
);

/**
 * Event listener to handle clearing the lattice and resetting the canvas when the clear/reset button is clicked.
 *
 * Summary:
 *   This function listens for a `click` event on the `clearResetButton`. When clicked, it stops any ongoing iteration,
 *   removes buffer cells if they exist, adjusts the lattice size and cell size accordingly, and clears the lattice.
 *   The action is logged, and errors are reported if the lattice size is invalid.
 *
 * Features:
 *   - Stops the iteration process before starting the clearing/resetting process.
 *   - Removes any buffer cells from the lattice and adjusts its size to reflect this change.
 *   - Resizes the cells to fit the new lattice dimensions, with a maximum size cap of 45.
 *   - Clears the lattice array, either with or without buffer cells, depending on the lattice's structure.
 *   - Logs the action and displays an error message if the new lattice size is invalid.
 *
 * @listens click
 * @param {MouseEvent} event - The click event triggered by the user to clear or reset the lattice.
 *
 * @returns {void} - This function performs actions to clear or reset the lattice, adjusts the size of the lattice and cells,
 *   and logs corresponding messages.
 */
clearResetButton.addEventListener(
  "click",
  debounce(function () {
    stopIterating();     clearResetToggle();

        let newCellNum = latSize[0] - 2 * latSize[1];
    if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
      alterLatSize(newCellNum);
    } else {
      makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue);
    }
        let size = canvas.width / latSize[0];
        if (size > 45) {
      size = 45;
    }
    alterSize(size);
    if (latticeArray.length == 1) {
      clear(latticeArray);
    } else {
      clear(latticeArray, true);
    }
    alterInf(inf[0], false);
  })
);

/* Connect UI Functionality to a prebuilt function */

/**
 * Event listener to handle toggling the boundary condition when the boundary toggle button is clicked.
 *
 * Summary:
 *   This function listens for a `click` event on the `boundToggleButton`. When clicked, it stops any ongoing iteration,
 *   and toggles the boundary condition by calling the `toggleCheckbox()` function.
 *
 * Features:
 *   - Stops the iteration process before toggling the boundary condition to prevent interference.
 *   - Toggles the state of the boundary condition via a checkbox.
 *
 * @listens click
 * @param {MouseEvent} event - The click event triggered by the user to toggle the boundary condition.
 *
 * @returns {void} - This function stops the iteration and triggers the boundary condition toggle.
 */
boundToggleButton.addEventListener("click", debounce(function () {
    stopIterating();     
    toggleCheckbox();
  })
);

/**
 * Event listener to handle toggling the iteration state when the iteration toggle button is clicked.
 *
 * Summary:
 *   This function listens for a `click` event on the `iterationToggleButton`. When clicked, it toggles the state of
 *   `tickerToggle`, clears the `tickCanvas`, and updates the iteration toggle option by calling `iterationToggleOption()`.
 *
 * Features:
 *   - Toggles the state of `tickerToggle`, which likely controls the running of iterations.
 *   - Clears the `tickCanvas` to reset the displayed canvas before performing further operations.
 *   - Calls `iterationToggleOption()` to adjust the system's state based on the new `tickerToggle` value.
 *
 * @listens click
 * @param {MouseEvent} event - The click event triggered by the user to toggle iteration state.
 *
 * @returns {void} - This function toggles the iteration state and clears the canvas to reset the display.
 */
iterationToggleButton.addEventListener(
  "click",
  debounce(function () {
    tickerToggle = !tickerToggle;
    tctx.clearRect(0, 0, tickCanvas.width, tickCanvas.height);
    iterationToggleOption();
  })
);

/**
 * Event listener to handle toggling the border visibility when the border toggle button is clicked.
 *
 * Summary:
 *   This function listens for a `click` event on the `borderToggleButton`. When clicked, it toggles the border visibility
 *   by calling `alterBorder()` with the opposite of the current border state, redraws the lattice, and updates the
 *   border toggle option by calling `borderToggleOption()`.
 *
 * Features:
 *   - Toggles the border visibility using `alterBorder()` by passing the inverse of the current border state.
 *   - Redraws the lattice using `drawLattice()` to reflect the updated border state.
 *   - Calls `borderToggleOption()` to adjust the system's state based on the new border visibility.
 *
 * @listens click
 * @param {MouseEvent} event - The click event triggered by the user to toggle the border visibility.
 *
 * @returns {void} - This function toggles the border state, redraws the lattice, and updates the border toggle option.
 */
borderToggleButton.addEventListener("click", debounce(function () {
    alterBorder(!getBorder());
    drawLattice(latticeArray);
    borderToggleOption();
  })
);

/**
 * Event listener to handle submitting the iteration count when the iteration submit button is clicked.
 *
 * Summary:
 *   This function listens for a `click` event on the `iterationSubmit` button. When clicked, it stops the current iteration
 *   process using `stopIterating()`, and then calls `setLatticeSize()` to potentially adjust or reset the lattice size.
 *
 * Features:
 *   - Stops the current iteration process by calling `stopIterating()`.
 *   - Adjusts or resets the lattice size based on the new input by calling `setLatticeSize()`.
 *
 * @listens click
 * @param {MouseEvent} event - The click event triggered by the user to submit the iteration count.
 *
 * @returns {void} - This function stops the iteration process and potentially resets the lattice size.
 */
iterationSubmit.addEventListener("click", function () {
  stopIterating();   
  setLatticeSize();
});

/**
 * Event listener to handle submitting the lattice size when the lattice size submit button is clicked.
 *
 * Summary:
 *   This function listens for a `click` event on the `latticeSizeSubmit` button. When clicked, it stops the current iteration
 *   process using `stopIterating()`, clears any reset toggle states, and then updates the lattice size on the canvas
 *   by calling `updateLatticeSize(canvas)`.
 *
 * Features:
 *   - Stops the current iteration process by calling `stopIterating()`.
 *   - Clears any active reset toggle state.
 *   - Updates the lattice size by calling `updateLatticeSize(canvas)` to adjust the grid.
 *
 * @listens click
 * @param {MouseEvent} event - The click event triggered by the user to submit the new lattice size.
 *
 * @returns {void} - This function stops the iteration, clears reset toggle state, and updates the lattice size.
 */
latticeSizeSubmit.addEventListener("click", function () {
  stopIterating();   clearResetToggle();
  updateLatticeSize(canvas);
});

/**
 * Event listener to toggle the start/stop of the iteration process when the start/stop button is clicked.
 *
 * Summary:
 *   This function listens for a `click` event on the `startStopButton`. When clicked, it toggles between starting
 *   and stopping the iteration process. If the iteration has not been set, it displays an error. If the iteration
 *   is stopped, it starts the iteration, updating the lattice size and handling buffer cells. If the iteration is already
 *   running, it stops the iteration and toggles the button state.
 *
 * Features:
 *   - Checks if the number of iterations has been set, and displays an error message if not.
 *   - Toggles between starting and stopping the iteration process.
 *   - Adds buffer cells to the lattice for proper iteration when the lattice size is 1.
 *   - Adjusts the lattice size to accommodate the buffers and ensures cells do not exceed a maximum size.
 *   - Calls `continouslyIterate(iterationTime)` to start the iteration process.
 *
 * @listens click
 * @param {MouseEvent} event - The click event triggered by the user to start or stop the iteration.
 *
 * @returns {void} - This function toggles the iteration process and updates the lattice state accordingly.
 */
startStopButton.addEventListener(
  "click",
  debounce(function () {
    if (addIterations == 0) {
      makeError("Iteration not set", logCanvas, messageQueue);
      return;
    }
    if (run != 1) {
      run = 1;
      startStopToggle();
      if (latticeArray.length == 1) {
        let bufferArr = new Array();
        let latPlusBufferArr = new Array();
                for (let i = 0; i < latSize[0]; i++) {
          latPlusBufferArr.push(latticeArray[0][i].getColor());
        }
                for (let i = 0; i < latSize[1]; i++) {
          bufferArr.push(0);
        }
        latPlusBufferArr = bufferArr.concat(latPlusBufferArr.concat(bufferArr));
                let newCellNum = latSize[0] + 2 * latSize[1];
        if (!isNaN(newCellNum) && newCellNum >= 1) {
          alterLatSize(newCellNum);
        }
                let size = canvas.width / latSize[0];
                if (size > 45) {
          size = 45;
        }
        alterSize(size);
                clear(latticeArray);
        let neoLatticeArray = latticeArray;
                for (let i = 0; i < latticeArray[0].length; i++) {
          if (latPlusBufferArr[i] == 1) {
            neoLatticeArray[0][i].flipColor();
          }
          neoLatticeArray[0][i].drawCell(ctx);
          alterLatticeArray(neoLatticeArray);
        }
        if (addIterations) {
          clearResetButton.innerHTML = "Reset";
        }
      }
      continouslyIterate(iterationTime);
    } else {
      run = 0;
      startStopToggle();
    }
  })
);

/**
 * Event listener to continuously track the mouse position on the canvas and update the tick box position.
 *
 * Summary:
 *   This function listens for a `mousemove` event on the `tickCanvas`. It tracks the mouse position within the canvas
 *   and updates the position of a tick box next to it, allowing users to interact with the tick box dynamically.
 *
 * Features:
 *   - Tracks the mouse position on the canvas.
 *   - Calls `makeTickBox(event, tctx)` to render the tick box at the current mouse position.
 *
 * @listens mousemove
 * @param {MouseEvent} event - The mousemove event triggered by the user to track the mouse position.
 *
 * @returns {void} - This function updates the tick box position based on the mouse location.
 */
tickCanvas.addEventListener("mousemove", function (event) {
  makeTickBox(event, tctx);
});

/**
 * Event listener to flip cells when the user clicks on the canvas.
 *
 * Summary:
 *   This function listens for a `mousedown` event on the `tickCanvas`. When the user clicks on the canvas, it calculates
 *   the mouse position and flips the state of the cell that was clicked. It also disables text selection globally during the
 *   mouse interaction to improve user experience.
 *
 * Features:
 *   - Disables text selection to prevent accidental text highlighting during interaction.
 *   - Tracks the mouse position using `getMouseLocation(event)`.
 *   - Calls `setCells(latticeArray, mouseX, mouseY)` to flip the cell that the mouse clicked on.
 *
 * @listens mousedown
 * @param {MouseEvent} event - The mousedown event triggered by the user when clicking on the canvas.
 *
 * @returns {void} - This function flips the state of the cell that was clicked and prevents text selection.
 */

tickCanvas.addEventListener(
  "mousedown",
  debounce(function (event) {
    document.body.style.userSelect = "none";     let mouseX, mouseY;
    [mouseX, mouseY] = getMouseLocation(event);     setCells(latticeArray, mouseX, mouseY);     mouseDown = true;
  })
);

tickCanvas.addEventListener("mouseup", function (event) {
  mouseDown = false;
});

tickCanvas.addEventListener(
  "mousemove",
  shortDebounce(function (event) {
    let mouseX, mouseY;
    if (mouseDown) [mouseX, mouseY] = getMouseLocation(event);
    setCells(latticeArray, mouseX, mouseY, true);
  })
);

/**
 * Event listener that handles keyboard shortcuts when a key is pressed.
 *
 * Summary:
 *   This function listens for a `keydown` event and checks for specific key combinations or individual key presses.
 *   It allows the user to trigger various actions (such as clicking buttons or focusing input fields) via keyboard shortcuts.
 *   If the ALT key is pressed, it executes predefined actions associated with other keys. If the Enter key is pressed,
 *   it submits the active input field.
 *
 * Features:
 *   - Supports ALT key combinations for quick actions (e.g., starting/stopping iterations, clearing/resetting buttons).
 *   - Focuses specific input fields when the corresponding keys (e.g., "j", "k", "l", "y") are pressed.
 *   - Toggles visibility for a specific element with the "Dustin" class when the "=" key is pressed.
 *   - Submits forms based on the currently focused input field when the Enter key is pressed.
 *
 * @listens keydown
 * @param {KeyboardEvent} event - The keydown event triggered by the user when pressing a key on the keyboard.
 *
 * @returns {void} - This function performs actions like button clicks, element visibility toggling, and form submissions.
 */
document.addEventListener("keydown", function (event) {
    if (event.altKey) {
    switch (true) {
      case event.key == "Enter":
        startStopButton.click();
        break;
      case event.key == "i":
        iterateButton.click();
        break;
      case event.key == "c":
        clearResetButton.click();
        break;
      case event.key == "o":
        optionsButton.click();
        break;
      case event.key == "a":
        aboutButton.click();
        break;
      case event.key == "n":
        downloadPDFButton.click();
        break;
      case event.key == "p":
        downloadPNGButton.click();
        break;
      case event.key == "g":
        latticeFillButton.click();
        break;
      case event.key == "m":
        randomFillButton.click();
        break;
      case event.key == "u":
        boundToggleButton.click();
        break;
      case event.key == "w":
        iterationToggleButton.click();
        break;
      case event.key == "x":
        borderToggleButton.click();
        break;
      case event.key == "j":
        iterationInputBox.focus();
        break;
      case event.key == "k":
        ruleInputBox.focus();
        break;
      case event.key == "l":
        latticeSizeBox.focus();
        break;
      case event.key == "y":
        iterationSpeedSlider.focus();
        break;
      case event.key == "=":
        let dustin = document.querySelector(".Dustin");
        if (dustin.style.display == "block") {
          dustin.style.display = "none";
        } else {
          dustin.style.display = "block";
        }
        break;
      default:
        break;
    }
      } else if (event.key == "Enter") {
    if (document.activeElement == iterationInputBox) {
      iterationSubmit.click();
    } else if (document.activeElement == ruleInputBox) {
      ruleSubmit.click();
    } else if (document.activeElement == latticeSizeBox) {
      latticeSizeSubmit.click();
    } else {
      iterationSubmit.click();
      ruleSubmit.click();
      latticeSizeSubmit.click();
    }
  }
});




/**
 * Updates the number of cells in a lattice and resizes the cells accordingly.
 *
 * Summary:
 *   This function adjusts the lattice size based on user input, ensuring that the number of cells
 *   is within a valid range (1 to 1000). It then resizes the individual cells on the canvas, capping
 *   the cell size to a maximum of 45 pixels. After updating the size, it clears the lattice array
 *   and redraws the lattice on the canvas.
 *
 * Features:
 *   - Accepts user input for the number of cells and ensures it's valid.
 *   - Resizes the individual cells on the canvas based on the new lattice size.
 *   - Limits cell size to a maximum of 45 pixels.
 *   - Clears the current lattice array and redraws the lattice with updated dimensions.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element used to draw the lattice.
 * @returns {void} - This function does not return any value. It performs size updates and canvas redrawing.
 */
function updateLatticeSize(canvas) {
  let newCellNum = parseInt(latticeSizeBox.value);

  if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
    alterLatSize(newCellNum);
    makeLog("Lattice Size Set to " + newCellNum, logCanvas, messageQueue);
  } else {
    makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue);
  }

  let size = canvas.width / latSize[0];

    if (size > 45) {
    size = 45;
  }

  alterSize(size);
  alterInf(inf[0], false);

  clear(latticeArray); }

/**
 * Generates and displays a tick box at the mouse location on the canvas.
 *
 * Summary:
 *   This function calculates the position of the mouse on the lattice, determines if the mouse
 *   is inside a valid cell, and if so, generates a tick box showing the row and column of the cell
 *   under the mouse. The tick box is drawn on a separate canvas (`tickCanvas`), and its position
 *   is adjusted based on the mouse's location. The function ensures that the text and box are drawn
 *   only if the mouse is within valid boundaries of the lattice.
 *
 * Features:
 *   - Tracks mouse position and checks if it's inside the lattice bounds.
 *   - Displays a tick box with the row and column number at the mouse's location.
 *   - Adjusts text size and background for visibility.
 *   - Ensures that the tick box is only drawn if the mouse is inside a valid lattice cell.
 *
 * @param {MouseEvent} event - The mouse event triggered by the mousemove on the canvas, used to calculate mouse location.
 * @returns {void} - This function does not return any value. It updates the tick box displayed on the canvas.
 */
function makeTickBox(event) {
  if (tickerToggle == 1) {
    let [mouseX, mouseY] = getMouseLocation(event); 
    let firstCell = latticeArray[0][0];

    tctx.clearRect(0, 0, tickCanvas.width, tickCanvas.height);

    let lineNumber = Math.floor(mouseY / firstCell.getHeight());     let colNumber = Math.floor((mouseX - firstCell.getXLoc()) / firstCell.getWidth());

    let insideBox = true;

    if (colNumber < 0) {
      insideBox = false;
    }

    if (colNumber > latticeArray[0].length - 1) {
      insideBox = false;
    }

    if (lineNumber > latticeArray.length - 1) {
      insideBox = false;
    }

    if (lineNumber < 0) {
      insideBox = false;
    }

        if (insideBox) {
      let tickNum = lineNumber.toString() + " : " + colNumber.toString();

      let textSize = tctx.measureText(tickNum).width;

      if (textSize < 30) {
        textSize = 30;
      }

      tctx.fillStyle = "grey";
      tctx.fillRect(mouseX + 3, mouseY - 12, textSize + 3, 15); 
            tctx.font = "13px Arial";
      tctx.fillStyle = "black";

      tctx.fillText(tickNum, mouseX + 4, mouseY);     }
  }
}

/**
 * Sets the delay time between iterations when running the lattice.
 *
 * Summary:
 *   This function adjusts the delay time between each iteration of the lattice. It updates
 *   the `iterationTime` variable, which controls how frequently the lattice is updated. This is
 *   useful for controlling the speed at which the lattice iterates.
 *
 * @param {number} newDelay - The new delay time in milliseconds to set for the iterations.
 * @returns {void} - This function does not return any value. It modifies the global `iterationTime` variable.
 */
function setDelay(newDelay) {
  iterationTime = newDelay;
}

/**
 * Repeatedly iterates through the lattice while the `run` flag is true.
 *
 * Summary:
 *   This function continuously performs iterations on the lattice at a set interval, defined
 *   by the `iterationTime` parameter. It checks if the `run` flag is true, and if so, it calls
 *   the `iterate` function to perform an iteration. This process repeats indefinitely until `run`
 *   is set to false, at which point it stops the iterations and toggles the start/stop state.
 *
 * @param {number} iterationTime - The time delay between iterations in milliseconds.
 * @returns {void} - This function does not return any value. It modifies the flow of execution
 *                   through recursive calls and controls the iteration cycle.
 */
function continouslyIterate(iterationTime) {
    if (run) {
    setTimeout(function () {
            if (run) {
        iterate(currentIteration, 1);       }
      continouslyIterate(iterationTime);     }, iterationTime);
  } else {
    startStopToggle(currentIteration);
  }
}

/**
 * Sets the rule for the lattice based on user input and updates the lattice configuration.
 *
 * Summary:
 *   This function takes the value from the rule input box, converts it to an integer, and
 *   checks if it's within the valid range (0-255). If the input is valid, it updates the rule,
 *   adjusts the lattice size by removing buffers if necessary, and re-renders the lattice with
 *   the new configuration. If the input is invalid, an error message is displayed.
 *
 * @returns {void} - This function does not return a value. It modifies the lattice size, rule,
 *                   and other related properties based on the user input.
 */
function setRule() {
  let newRule = parseInt(ruleInputBox.value);   run = 0;     if (!isNaN(newRule) && newRule >= 0 && newRule <= 255) {
    alterRuleNum(newRule);
    alterRule(ruleNumToRule(newRule));
    makeLog("Rule Set to " + newRule, logCanvas, messageQueue);

        let newCellNum = latSize[0] - 2 * latSize[1];
    if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
      alterLatSize(newCellNum);
    } else {
      makeError("Invalid Rule Number: " + latticeSizeBox.value, logCanvas, messageQueue);
    }
        let size = canvas.width / latSize[0];
        if (size > 45) {
      size = 45;
    }
    alterSize(size);
        alterInf(inf[0], false);
    clear(latticeArray, true);
  } else {
    makeError("Invalid Rule Number: " + ruleInputBox.value, logCanvas, messageQueue);
  }
}

/*function setCellNum(latSize) {
	let newCellNum = parseInt(latticeSizeBox.value); 	if(!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) 	{
		latSize = newCellNum;
	} 	else
	{
	} 
	return latSize; }*/

/**
 * Sets the number of iterations for the lattice and adjusts the lattice size accordingly.
 *
 * Summary:
 *   This function takes the number of iterations from the input box, checks if it's a valid integer
 *   within the range of 0 to 10,000, and updates the lattice size and other properties based on the new
 *   iteration count. It also removes any existing buffers and modifies the cell size to fit the new lattice
 *   configuration. If the input is invalid, an error message is displayed.
 *
 * @returns {number} - Returns the updated number of iterations (addIterations).
 */
function setLatticeSize() {
  let newValue = parseInt(iterationInputBox.value);   
  if (!isNaN(newValue) && newValue >= 0 && newValue <= 10000) {
    let newCellNum = latSize[0] - 2 * latSize[1];
    if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
      alterLatSize(newCellNum);
    } else {
      makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue);
    }
        let size = canvas.width / latSize[0];
        if (size > 45) {
      size = 45;
    }
    alterSize(size);

        alterInf(inf[0], false, newValue);
    clear(latticeArray, true);
    addIterations = newValue;     makeLog("Iterations Set to " + newValue, logCanvas, messageQueue);
  } else {
    makeError("Invalid Iteration Size: " + iterationInputBox.value, logCanvas, messageQueue);
  }
  return addIterations;
}

/**
 * Clears all lattice arrays except the first and sets all cells to the "dead" state (white),
 * unless specified to retain the initial lattice configuration.
 *
 * Summary:
 *   This function clears the lattice, resetting it to the "dead" state (white) unless the `keepInit`
 *   flag is set to `true`, in which case the initial lattice state is preserved. It also clears all
 *   additional lattice arrays beyond the first, sets up the new lattice size, and updates the colors and
 *   borders of the cells. The function optionally restores the cell states from the initial lattice if
 *   `keepInit` is true. The canvas height is reset, and iteration counts are adjusted.
 *
 * @param {Array} latticeArray - The lattice array to be cleared.
 * @param {boolean} [keepInit=false] - Whether to keep the initial lattice configuration.
 */

function clear(latticeArray, keepInit = false) {
  totalDelta = 0;
  canvas.height = 400;
  alterNumOfIterations(1);
  alterCurrentIteration(1);
  let clearedLattice = new Array(new Array());
  alterNextLattice(new Array());
  let StartX = canvas.width / 2 - (latSize[0] * size) / 2;
  let neoLatticeArray = latticeArray;
  while (neoLatticeArray.length > 1) {
    neoLatticeArray.pop();
  }
  for (let i = 0; i < latSize[0]; i++) {
    clearedLattice[0][i] = new cell(size, size, StartX + i * size, 0, 0);
    clearedLattice[0][i].setAliveColor(aliveColorSel.value);
    clearedLattice[0][i].setDeadColor(deadColorSel.value);
    clearedLattice[0][i].setAliveBorder(aliveBorderSel.value);
    clearedLattice[0][i].setDeadBorder(deadBorderSel.value);
  }

  let latPlusBufferArr = new Array();
    if (keepInit) {
    clearResetButton.innerHTML = "Clear";
    let bufferNum = (neoLatticeArray[0].length - clearedLattice[0].slice(0).length) / 2;
    for (let i = bufferNum; i < latSize[0] + bufferNum; i++) {
      latPlusBufferArr.push(latticeArray[0][i].getColor());
    }
  }

  neoLatticeArray[0] = clearedLattice[0].slice(0);
    if (keepInit) {
    for (let i = 0; i < latticeArray[0].length; i++) {
      if (latPlusBufferArr[i] == 1) {
        neoLatticeArray[0][i].flipColor();
      }
      neoLatticeArray[0][i].drawCell(ctx);
    }
  }
  alterLatticeArray(neoLatticeArray);
  alterCurrentLattice(latticeArray[0]);
  updateLattice();
}

/**
 * Takes the coordinates of a mouse click and calculates the corresponding cell in the lattice,
 * flipping or setting the color of the cell based on the click state.
 *
 * Summary:
 *   This function checks if a mouse click occurred within a cell's boundaries and then either flips
 *   the color of the cell or sets it to "alive" based on whether the mouse is being held down or not.
 *   It updates the lattice array to reflect the new state of the clicked cell(s) and redraws them on the canvas.
 *
 * @param {Array} latticeArray - The lattice array containing the cells.
 * @param {number} mouseX - The X-coordinate of the mouse click.
 * @param {number} mouseY - The Y-coordinate of the mouse click.
 */
function setCells(latticeArray, mouseX, mouseY) {
  let neoLatticeArray = latticeArray;
  if (latticeArray.length == 1) {
    for (let i = 0; i < latticeArray[0].length; i++) {
      if (latticeArray[0][i].insideCell(mouseX, mouseY)) {
        if (!mouseDown) {
          neoLatticeArray[0][i].flipColor();
        } else {
          neoLatticeArray[0][i].setColor(1);
        }
      }
      neoLatticeArray[0][i].drawCell(ctx);
      alterLatticeArray(neoLatticeArray);
    }
  }
}

/**
 * Calculates the mouse position relative to the canvas element, accounting for various CSS styles.
 *
 * This function retrieves the position of the mouse click inside the canvas, adjusting for the canvas's
 * borders, padding, and scaling. It then returns the correct mouse coordinates within the canvas element
 * based on the current viewport and CSS styles.
 *
 * @param {MouseEvent} event - The mouse event triggered by the user's click.
 * @returns {number[]} An array containing the X and Y coordinates of the mouse click relative to the canvas.
 *                     The first element is the X-coordinate and the second is the Y-coordinate.
 */
function getMouseLocation(event) {
    let bounds = canvas.getBoundingClientRect();

    let cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue("width"));
  let cssHeight = parseFloat(getComputedStyle(canvas).getPropertyValue("height"));

    let borderWidth = parseInt(getComputedStyle(canvas).borderLeftWidth);

    let paddingLeft = parseFloat(getComputedStyle(canvas).paddingLeft);
  let paddingTop = parseFloat(getComputedStyle(canvas).paddingTop);

    let mouseX = ((event.clientX - bounds.left - paddingLeft - borderWidth) * canvas.width) / cssWidth;
  let mouseY = ((event.clientY - bounds.top - paddingTop - borderWidth) * canvas.height) / cssHeight;

  return [mouseX, mouseY];
}

/**
 * Performs an iteration to update the lattice and number of iterations.
 *
 * This function adds new iterations to the lattice array and updates the displayed number of iterations.
 * It ensures the total iterations do not exceed a specified limit and updates the lattice visual representation.
 * The function operates with a short delay (5 milliseconds) to smooth the iteration process.
 *
 * @param {number} currentIteration - The current iteration count before this function is called.
 * @param {number} newIterations - The number of iterations to add in this call.
 * @returns {number} The value of `currentIteration`, indicating the iteration count before the update.
 */
function iterate(currentIteration, newIterations) {
  setTimeout(function () {
    if (numOfIterations + newIterations > addIterations) {
      alterNumOfIterations(addIterations + 1);
      run = 0;
    } else {
      alterNumOfIterations(numOfIterations + newIterations);
    }
    let neoLatticeArray = latticeArray;
    while (neoLatticeArray.length > numOfIterations) {
      neoLatticeArray.pop();
    }

    alterLatticeArray(neoLatticeArray);
    updateLattice();
    return currentIteration;
  }, 5);
}

/**
 * Stops the iteration process.
 *
 * If the `run` variable is set to 1 (indicating that iterations are running), this function will set it to 0,
 * effectively stopping any ongoing iterations.
 */
function stopIterating() {
  if (run) {
    run = 0;
  }
}

/**
 * Handles the toggling of the checkbox display and animation of the toggle button.
 *
 * When the toggle button is activated:
 * - The first checkbox is checked, and the second is unchecked.
 * - If the checkboxes are hidden, they are displayed, and the toggle button is animated to the right.
 * - If the checkboxes are already displayed, they are hidden, and the toggle button is animated back to the left.
 *
 * It also adjusts the lattice size and cell size according to the current settings, and clears the lattice.
 *
 * Updates the lattice to reflect either finite or infinite conditions based on the toggle state.
 *
 * @returns {void}
 */
export function toggleCheckbox() {
    checkboxes[0].checked = true;
  checkboxes[1].checked = false;
    if (periodicCheckBox.style.display == "none" || periodicCheckBox.style.display == "") {
        let newCellNum = latSize[0] - 2 * latSize[1];
    if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
      alterLatSize(newCellNum);
    } else {
      makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue);
    }
        let size = canvas.width / latSize[0];
        if (size > 45) {
      size = 45;
    }
    alterSize(size);
    alterInf(false);
    makeLog("Finite Condition Set", logCanvas, messageQueue);
    clear(latticeArray, true);
    periodicCheckBox.style.display = "block";
    nullCheckBox.style.display = "block";
    boundToggle.style.transform = "translateX(25px)";       } else {
        let newCellNum = latSize[0] - 2 * latSize[1];
    if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
      alterLatSize(newCellNum);
    } else {
      makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue);
    }
        let size = canvas.width / latSize[0];
        if (size > 45) {
      size = 45;
    }
    alterSize(size);
        alterInf(true);
    makeLog("Infinite Condition Set", logCanvas, messageQueue);
    clear(latticeArray, true);
    periodicCheckBox.style.display = "none";
    nullCheckBox.style.display = "none";
    boundToggle.style.transform = "translateX(0)";   }
}

/**
 * Handles the toggle functionality for the iteration option button.
 *
 * Toggles the button position between two states:
 * - When toggled on, moves the button to the right and logs "Iteration Box: On."
 * - When toggled off, returns the button to the left and logs "Iteration Box: Off."
 *
 * This function visually updates the toggle button's position and logs the current state.
 *
 * @returns {void}
 */

function iterationToggleOption() {
    if (iterationToggle.style.transform == "translateX(0px)") {
    iterationToggle.style.transform = "translateX(25px)";
    makeLog("Iteration Box: On", logCanvas, messageQueue);
  } else {
    iterationToggle.style.transform = "translateX(0px)";
    makeLog("Iteration Box: Off", logCanvas, messageQueue);
  }
}

/**
 * Toggles the cell border option on or off.
 *
 * Changes the toggle button’s position and logs the current state:
 * - When toggled on, moves the button to the right and logs "Cell Border: On."
 * - When toggled off, returns the button to the left and logs "Cell Border: Off."
 *
 * This function visually updates the toggle button's position and logs the border setting.
 *
 * @returns {void}
 */
function borderToggleOption() {
    if (borderToggle.style.transform === "translateX(0px)") {
    borderToggle.style.transform = "translateX(25px)";
    makeLog("Cell Border: On", logCanvas, messageQueue);
  } else {
    borderToggle.style.transform = "translateX(0px)";
    makeLog("Cell Border: Off", logCanvas, messageQueue);
  }
}

/**
 * Toggles the Start/Stop button state and updates the GUI.
 *
 * - If the button is in the "Start" state and `run` is active, switches to "Stop" state:
 *   - Changes button text to "Stop."
 *   - Updates button appearance by swapping CSS classes.
 *   - Logs "Starting Iterations."
 *   - Adds buffers to the lattice.
 *
 * - If the button is in the "Stop" state and `run` is inactive, switches to "Start" state:
 *   - Changes button text to "Start."
 *   - Updates button appearance by swapping CSS classes.
 *   - Logs "Stopping Iterations."
 *
 * @returns {void}
 */

function startStopToggle() {
    if (startStopButton.classList.contains("start_button") && run) {
    startStopButton.innerHTML = "Stop";
    startStopButton.classList.remove("start_button");
    startStopButton.classList.add("stop_button");
    makeLog("Starting Iterations", logCanvas, messageQueue);
        alterInf(inf[0], true);
  } else if (startStopButton.classList.contains("stop_button") && !run) {
    startStopButton.innerHTML = "Start";
    startStopButton.classList.remove("stop_button");
    startStopButton.classList.add("start_button");
    makeLog("Stopping Iterations", logCanvas, messageQueue);
  }
}

/**
 * Toggles the Clear/Reset button state and logs the appropriate message.
 *
 * - If the button text includes "Reset," changes the text to "Clear" and logs "Resetting Canvas."
 * - Otherwise, logs "Canvas Cleared."
 *
 * @returns {void}
 */
function clearResetToggle() {
  if (clearResetButton.innerHTML.includes("Reset")) {
    clearResetButton.innerHTML = "Clear";
    makeLog("Resetting Canvas", logCanvas, messageQueue);
  } else {
    makeLog("Canvas Cleared", logCanvas, messageQueue);
  }
}

/**
 * Sets the boundary condition based on the selected checkbox and ensures only one checkbox is checked at a time.
 *
 * - Stops ongoing iterations before changing boundary conditions.
 * - Enforces that only one checkbox can be checked:
 *     - If the first checkbox is selected, sets `boundaryCon` to 1 for a Periodic boundary condition, removes buffers if needed,
 *       adjusts lattice size, and logs the update.
 *     - If the second checkbox is selected, sets `boundaryCon` to 0 for a Null boundary condition, removes buffers if needed,
 *       adjusts lattice size, and logs the update.
 * - If neither checkbox is checked (attempted uncheck), rechecks the current checkbox to enforce one selection at all times.
 *
 * @returns {void}
 */
checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", function () {
    stopIterating();         if (this.checked) {
      checkboxes.forEach(function (otherCheckbox) {
                if (otherCheckbox != checkbox) {
          otherCheckbox.checked = false;
        }
      });
                  if (checkboxes[0].checked) {
        alterBoundaryCon(1);
        makeLog("Periodic Boundary Set", logCanvas, messageQueue);
                let newCellNum = latSize[0] - 2 * latSize[1];
        if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
          alterLatSize(newCellNum);
        } else {
          makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue);
        }
                let size = canvas.width / latSize[0];
                if (size > 45) {
          size = 45;
        }
        alterSize(size);

        clear(latticeArray, true);
      } else {
        alterBoundaryCon(0);
        makeLog("Null Boundary Set", logCanvas, messageQueue);
                let newCellNum = latSize[0] - 2 * latSize[1];
        if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
          alterLatSize(newCellNum);
        } else {
          makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue);
        }
                let size = canvas.width / latSize[0];
                if (size > 45) {
          size = 45;
        }
        alterSize(size);

        clear(latticeArray, true);
      }
    }
        else {
      this.checked = true;
    }
  });
});

/**
 * Adds an error message to the log with red color to indicate an error.
 *
 * - Creates a new error log message with the specified `errorMessage`.
 * - Prepends this error message to the `messageQueue`.
 * - Displays the updated log.
 * - Optionally, a timer can be set to auto-remove old log entries (currently commented out).
 *
 * @param {string} errorMessage - The error message to display in the log.
 * @param {HTMLCanvasElement} logCanvas - The canvas element where the log messages are displayed.
 * @param {Array} messageQueue - An array of log messages to be displayed, where new messages are added to the start.
 * @returns {void}
 */
function makeError(errorMessage, logCanvas, messageQueue) {
  let tempLog = new logMessage(errorMessage, "red", logCanvas);
  messageQueue.unshift(tempLog);
  displayLog(messageQueue, logCanvas);
  }

/**
 * Adds a general log message to the log with black color.
 *
 * - Creates a new log message with the specified `errorMessage`.
 * - Prepends this message to the `messageQueue`.
 * - Displays the updated log on the `logCanvas`.
 * - Optionally, a timer can be set to auto-remove old log entries (currently commented out).
 *
 * @param {string} errorMessage - The message to display in the log.
 * @param {HTMLCanvasElement} logCanvas - The canvas element where the log messages are displayed.
 * @param {Array} messageQueue - An array of log messages to be displayed, where new messages are added to the start.
 * @returns {void}
 */
function makeLog(errorMessage, logCanvas, messageQueue) {
  let tempLog = new logMessage(errorMessage, "black", logCanvas);
  messageQueue.unshift(tempLog);
  displayLog(messageQueue, logCanvas);
  }

/**
 * Displays all log messages in the `messageQueue` on the specified `logCanvas`.
 *
 * - Clears the canvas by displaying a dummy message (e.g., "God Bless Ronald Reagan") in red.
 * - Iterates over `messageQueue`, rendering each message at its respective position.
 *
 * @param {Array} messageQueue - Array of log message objects to display, with each message shown in sequence.
 * @param {HTMLCanvasElement} logCanvas - The canvas element where log messages are rendered.
 * @returns {void}
 */
function displayLog(messageQueue, logCanvas) {
  let dummyMessage = new logMessage("God Bless Ronald Reagan", "red", logCanvas);   dummyMessage.clearCanvas();
  for (let i = 0; i < messageQueue.length; i++) {
    messageQueue[i].displayMessage(i);
  }
}

/**
 * Captures the current canvas content and generates a PDF document upon clicking the "Download PDF" button.
 * - Retrieves image data from the canvas in PNG format.
 * - Creates a new PDF document sized to match the canvas dimensions.
 * - Adjusts the image's dimensions to maintain the canvas's aspect ratio, fitting it within the PDF page.
 * - Centers the image on the PDF page and saves the document with a name based on current iteration, rule number, and lattice size.
 * - Logs a message indicating the canvas was downloaded.
 *
 * @event click - Event listener for the "Download PDF" button.
 * @returns {void}
 */
downloadPDFButton.addEventListener("click", function () {
  let imgData = canvas.toDataURL("image/png");   let pdf = new jsPDF("p", "pt", [canvas.width, canvas.height]); 
    let canvasAspectRatio = canvas.width / canvas.height;

    let pdfWidth = pdf.internal.pageSize.getWidth();
  let pdfHeight = pdf.internal.pageSize.getHeight();
  let pdfAspectRatio = pdfWidth / pdfHeight;

    let imgWidth = pdfHeight * canvasAspectRatio;
  let imgHeight = pdfHeight;

    if (canvasAspectRatio > pdfAspectRatio) {
    imgWidth = pdfWidth;
    imgHeight = pdfWidth / canvasAspectRatio;
  }

    let offsetX = (pdfWidth - imgWidth) / 2;
  let offsetY = (pdfHeight - imgHeight) / 2;
  pdf.addImage(imgData, "PNG", offsetX, offsetY, imgWidth, imgHeight);

  pdf.save("ParallelWNN" + "I" + numOfIterations + "R" + ruleNum + "L" + latSize[0] + ".pdf");   makeLog("Downloaded Canvas", logCanvas, messageQueue);
});

/**
 * Captures the current canvas content and generates a downloadable PNG image upon clicking the "Download PNG" button.
 * - Retrieves image data from the canvas in PNG format.
 * - Creates a downloadable link using an anchor element and sets the file name based on current iteration, rule number, and lattice size.
 * - Triggers the download of the image and logs a message indicating the canvas was downloaded.
 *
 * @event click - Event listener for the "Download PNG" button.
 * @returns {void}
 */
downloadPNGButton.addEventListener("click", function () {
  let image = canvas.toDataURL();   let link = document.createElement("a");   link.href = image;   link.download = "ParallelWNN" + "I" + numOfIterations + "R" + ruleNum + "L" + latSize[0] + ".png";   link.click();   makeLog("Downloaded Canvas", logCanvas, messageQueue);
});

/* Handle open and closing of about window */
/**
 * Handles the opening of the "About" window when the About button is clicked.
 * - Sets the display style of the about window to "block", making it visible.
 *
 * @event click - Event listener for the "About" button.
 * @returns {void}
 */
aboutButton.addEventListener("click", function () {
  aboutWindow.style.display = "block";
});

/**
 * Handles the closing of the "About" window when the close button (x) is clicked.
 * - Sets the display style of the about window to "none", hiding it.
 *
 * @event click - Event listener for the close button in the "About" window.
 * @returns {void}
 */
closeAbout.addEventListener("click", function () {
  aboutWindow.style.display = "none";
});

/**
 * Closes the "About" window if any area outside of it is clicked.
 * - If the click event target is the about window itself (excluding the content area),
 *   the window is hidden by setting its display style to "none".
 *
 * @event click - Event listener for clicks anywhere on the window.
 * @param {Event} event - The click event object.
 * @returns {void}
 */
window.addEventListener("click", function (event) {
    if (event.target == aboutWindow) {
    aboutWindow.style.display = "none";
  }
});

/* Handle open and closing of options window */

/**
 * Toggles the visibility of the options window when the options button is clicked.
 * - If the options window is currently visible, it will be hidden.
 * - If the options window is currently hidden, it will be displayed.
 *
 * @event click - Event listener for the click event on the options button.
 * @returns {void}
 */
optionsButton.addEventListener("click", function () {
    if (optionsWindow.style.display == "block") {
    optionsWindow.style.display = "none";
  } else {
    optionsWindow.style.display = "block";
  }
});

/**
 * Closes the options window when the close (X) button in the top right of the window is clicked.
 *
 * @event click - Event listener for the click event on the close button of the options window.
 * @returns {void}
 */
closeOptions.addEventListener("click", function () {
  optionsWindow.style.display = "none";
});

/**
 * Updates the displayed iteration speed value and adjusts the iteration delay when the slider value changes.
 *
 * @event input - Event listener for the input event on the iteration speed slider.
 * @this {HTMLInputElement} - The slider element, from which the current value is retrieved.
 * @returns {void}
 */
iterationSpeedSlider.oninput = function () {
  iterationSpeedValue.innerHTML = this.value;
  setDelay(this.value);
};

/**
 * Creates a debounced version of a function, ensuring it is called only after a delay
 * once the event handler stops being triggered.
 *
 * @param {Function} callback - The function to be executed after the debounce delay.
 * @returns {Function} A debounced version of the provided callback function.
 *
 * @example
 * const debouncedFunction = debounce(function() {
 *   console.log('Executed after delay');
 * });
 * window.addEventListener('resize', debouncedFunction);
 */
function debounce(callback) {
  let timeoutId;

  return function (event) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(event);     }, 25);
  };
}

/**
 * Creates a debounced version of a function optimized for quick actions (e.g., slider input),
 * ensuring it is called only after a brief delay once the event handler stops being triggered.
 * This is particularly useful when updating a temporary array before the next cell can be clicked.
 *
 * @param {Function} callback - The function to be executed after the debounce delay.
 * @returns {Function} A debounced version of the provided callback function.
 *
 * @example
 * const debouncedSlider = shortDebounce(function(event) {
 *   console.log('Slider value changed:', event.target.value);
 * });
 * slider.addEventListener('input', debouncedSlider);
 */
function shortDebounce(callback) {
  let timeoutId;

  return function (event) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(event);     }, 5);
  };
}

// Initialize toggle buttons to x position 0px to enable x translation in functions
iterationToggle.style.transform = "translateX(0px)";
borderToggle.style.transform = "translateX(0px)";

// Display initial iteration count to HTML page
outputIteration.innerHTML = "Iteration Count: 0";

// Set the default iteration speed value and display it
iterationSpeedValue.innerHTML = 750;
