/**
 * UIFunctionality.js
 *
 * Summary:
 *   This file handles all user interface functionality for the program. It is responsible for managing
 *   user interactions, including button clicks, information inputs, and mouse actions. The file also
 *   handles lattice and cell updates, manages iterations, and calculates modifications to the simulation.
 *   It communicates with utility files to ensure the correct handling of all interactions and updates.
 *
 * Features:
 *   - Manages button clicks and user inputs to modify the simulation.
 *   - Handles mouse actions to interact with the lattice and cells.
 *   - Manages the iteration process and adjusts simulation parameters.
 *   - Coordinates updates and calculations related to the simulation state.
 *   - Communicates with utility files to ensure smooth functionality.
 *
 * Dependencies:
 *   - displayLattice.js:
 *     - `latticeArray`: The array representing the current state of the lattice.
 *     - `rule`: The rule used to update the lattice.
 *     - `canvas`, `ctx`: The main canvas and its context used for rendering.
 *     - `outputIteration`: Function for updating the iteration output.
 *     - `alterRuleNum`, `alterLatSize`, `alterSize`, `alterLatticeArray`, `alterCurrentLattice`, `alterNextLattice`, `alterBorder`: Functions to modify simulation parameters and lattice data.
 *     - `updateLattice`: Function to update the lattice based on the current state.
 *     - `deadColorSel`, `aliveColorSel`, `deadBorderSel`, `aliveBorderSel`: Variables for selecting cell colors and borders.
 *   - generateLattice.js:
 *     - `ruleNumToRule`: Function for converting rule numbers to corresponding rules.
 *   - cellClass.js:
 *     - `cell`: Class representing an individual cell in the lattice.
 *   - logClass.js:
 *     - `logMessage`: Class for managing log messages and displaying them on the canvas.
 *
 * Authors:
 *   - Kyle Tranfaglia
 *   - Timmy McKirgan
 *   - Dustin O'Brien
 *
 */
import canvasSize from 'https://cdn.jsdelivr.net/npm/canvas-size@2/dist/canvas-size.esm.min.js';
import {
  latticeArray,
  rule,
  canvas,
  ctx,
  outputIteration,
  alterRuleNum,
  tctx,
  tickCanvas,
  logCanvas,
  drawLattice,
  createOrder,
  alterOrder,
  tempOrder,
  alterTempOrder,
  numOfIterations,
  currentIteration,
  size,
  latSize,
  ruleNum,
  orderArray,
  alterLatSize,
  alterSize,
  alterLatticeArray,
  alterCurrentLattice,
  alterNextLattice,
  alterBorder,
  alterRule,
  alterNumOfIterations,
  alterCurrentIteration,
  alterBoundaryCon,
  getBorder,
  alterSetup,
  getSetup,
  updateLattice,
  deadColorSel,
  aliveColorSel,
  deadBorderSel,
  aliveBorderSel,
} from "./displayLattice.js";
import { ruleNumToRule } from "./generateLattice.js";
import { cell } from "./cellClass.js";
import { logMessage } from "./logClass.js";

/*
Hotkeys for zoom in/out
change cell label when only one row
Reset Perspective Button
*/

//Global constant storing the maximum height that the canvas can be in the given browser
const results = await canvasSize.maxArea({});
//Variable dictating the theoretical current number of lattices that can stack on top of eachother on canvas given
//current cell size.
let theoHeight = 0;

/* Global constants connecting HTML buttons to JS by ID to impliment functionality */

/**
 * Input box for the number of iterations.
 * @type {HTMLInputElement}
 */
const iterationInputBox = document.getElementById("iterationInputBox");

/**
 * Input box for the rule to be applied.
 * @type {HTMLInputElement}
 */
const ruleInputBox = document.getElementById("ruleInputBox");

/**
 * Input box for the lattice size.
 * @type {HTMLInputElement}
 */
const latticeSizeBox = document.getElementById("latticeSizeBox");

/**
 * Input box for the value of n.
 * @type {HTMLInputElement}
 */
const nInputBox = document.getElementById("nInputBox");

/**
 * Submit button for the number of iterations.
 * @type {HTMLButtonElement}
 */
const iterationSubmit = document.getElementById("iterationSubmit");

/**
 * Submit button for the rule input.
 * @type {HTMLButtonElement}
 */
const ruleSubmit = document.getElementById("ruleSubmit");

/**
 * Submit button for the lattice size input.
 * @type {HTMLButtonElement}
 */
const latticeSizeSubmit = document.getElementById("latticeSizeSubmit");

/**
 * Submit button for the value of n input.
 * @type {HTMLButtonElement}
 */
const nSubmit = document.getElementById("nSubmit");

/**
 * Button to start or stop the simulation.
 * @type {HTMLButtonElement}
 */
const startStopButton = document.getElementById("startStopButton");

/**
 * Button to iterate through steps of the simulation.
 * @type {HTMLButtonElement}
 */
const iterateButton = document.getElementById("iterateButton");

/**
 * Button to clear or reset the simulation.
 * @type {HTMLButtonElement}
 */
const clearResetButton = document.getElementById("clearResetButton");

/**
 * Button to download the simulation as a PDF.
 * @type {HTMLButtonElement}
 */
const downloadPDFButton = document.getElementById("downloadPDFButton");

/**
 * Button to download the simulation as a PNG image.
 * @type {HTMLButtonElement}
 */
const downloadPNGButton = document.getElementById("downloadPNGButton");

/**
 * Button to open options for the simulation.
 * @type {HTMLButtonElement}
 */
const optionsButton = document.getElementById("optionsButton");

/**
 * Button to fill the lattice with a predefined pattern.
 * @type {HTMLButtonElement}
 */
const latticeFillButton = document.getElementById("latticeFillButton");

/**
 * Button to randomly fill the lattice.
 * @type {HTMLButtonElement}
 */
const randomFillButton = document.getElementById("randomFillButton");

/**
 * Button to set up the initial conditions of the simulation.
 * @type {HTMLButtonElement}
 */
const setupButton = document.getElementById("setupButton");

/**
 * Button to start the simulation.
 * @type {HTMLButtonElement}
 */
const simulateButton = document.getElementById("simulateButton");

/**
 * Button to reset the simulation without clearing data.
 * @type {HTMLButtonElement}
 */
const voidButton = document.getElementById("voidButton");

/**
 * Button to open the library for saved configurations.
 * @type {HTMLButtonElement}
 */
const libraryButton = document.getElementById("libraryButton");

/**
 * Button to open help or instructions for the simulation.
 * @type {HTMLButtonElement}
 */
const helpButton = document.getElementById("helpButton");

/**
 * Option for random order selection in the library.
 * @type {HTMLInputElement}
 */
const randOrder = document.getElementById("random");

/**
 * Option for left-to-right order selection in the library.
 * @type {HTMLInputElement}
 */
const left2right = document.getElementById("left2right");

/**
 * Option for right-to-left order selection in the library.
 * @type {HTMLInputElement}
 */
const right2left = document.getElementById("right2left");

/**
 * Option for center-outward order selection in the library.
 * @type {HTMLInputElement}
 */
const centerOut = document.getElementById("centerOutward");

/**
 * Option for edges-inward order selection in the library.
 * @type {HTMLInputElement}
 */
const edgesIn = document.getElementById("edgesInward");

/**
 * Option for center-outward reverse order selection in the library.
 * @type {HTMLInputElement}
 */
const centerOutR = document.getElementById("centerOutwardR");

/**
 * Option for edges-inward reverse order selection in the library.
 * @type {HTMLInputElement}
 */
const edgesInR = document.getElementById("edgesInwardR");

/**
 * Input box for the number of skips in the library selection.
 * @type {HTMLInputElement}
 */
const skip = document.getElementById("nSkip");

/**
 * Toggle button for the iteration switch.
 * @type {HTMLInputElement}
 */
const iterationToggleButton = document.getElementById("iterationToggle");

/**
 * Toggle button for the border visibility switch.
 * @type {HTMLInputElement}
 */
const borderToggleButton = document.getElementById("borderToggle");

/**
 * Container for the options side window.
 * @type {HTMLElement}
 */
const optionsWindow = document.getElementById("optionsContainer");

/**
 * Container for the library side window.
 * @type {HTMLElement}
 */
const libraryWindow = document.getElementById("libraryContainer");

/**
 * Container for the help side window.
 * @type {HTMLElement}
 */
const helpWindow = document.getElementById("helpContainer");

/**
 * Slider for adjusting the iteration speed.
 * @type {HTMLInputElement}
 */
const iterationSpeedSlider = document.getElementById("iterationSpeedSlider");

/**
 * Display element for showing the iteration speed value.
 * @type {HTMLSpanElement}
 */
const iterationSpeedValue = document.getElementById("iterationSpeedValue");

/* Global constants connecting HTML/CSS features to JS by class name to implement functionality */

/**
 * NodeList of checkbox elements for selection.
 * @type {NodeListOf<HTMLInputElement>}
 */
const checkboxes = document.querySelectorAll(".checkbox_select");

/**
 * Toggle button for iteration functionality, located within the iteration toggle element.
 * @type {HTMLElement}
 */
const iterationToggle = document.querySelector(
  "#iterationToggle .toggle_button"
);

/**
 * Toggle button for border visibility functionality, located within the border toggle element.
 * @type {HTMLElement}
 */
const borderToggle = document.querySelector("#borderToggle .toggle_button");

/**
 * Close button for the options content window.
 * @type {HTMLElement}
 */
const closeOptions = document.querySelector("#optionsContent .close");

/**
 * NodeList of setup button elements for initializing or configuring the simulation.
 * @type {NodeListOf<HTMLElement>}
 */
const setupItems = document.querySelectorAll(".setup_button");

/**
 * NodeList of standard buttons for general simulation actions, including start and simulation-related buttons.
 * @type {NodeListOf<HTMLElement>}
 */
const standardItems = document.querySelectorAll(
  ".simulation_button, .start_button"
);

/**
 * Close button for the library content window.
 * @type {HTMLElement}
 */
const closeLibrary = document.querySelector("#libraryContent .close");

/**
 * Close button for the help content window.
 * @type {HTMLElement}
 */
const closeHelp = document.querySelector("#helpContent .close");

/**
 * Flag to track whether the mouse is currently pressed down.
 * @type {boolean}
 */
let mouseDown = false;

/**
 * Flag to control whether the setup mode welcome message is displayed on page load.
 * @type {boolean}
 */
let displayWelcome = true;
/**
 * Local variable for the n-skip order setting in the simulation.
 * @type {number}
 */
let nSkip = 2;
/**
 * Global variable to control the number of additional iterations.
 * @type {number}
 */
let addIterations = 10; // Defaults iterations

/**
 * Global flag that tracks whether the iterations should continue running.
 * @type {number}
 */
let run = 0;
/**
 * The time in milliseconds to wait before starting the next iteration.
 * @type {number}
 */
let iterationTime = 750;
/**
 * Flag that controls whether the row ticker is active or not.
 * @type {number}
 */
let tickerToggle = 0;
/**
 * Stores the current scale value for zooming functionality.
 * @type {number}
 */
let scale = 1;
/**
 * Keeps track of the total scroll delta to prevent excessive zooming in or out.
 * @type {number}
 */
let totalDelta = 0;
/**
 * A queue to store messages for logging purposes.
 * @type {Array}
 */
let messageQueue = [];
/**
 * An array to store lattice configuration while in setup mode.
 * @type {Array}
 */
let savedLattice = new Array();

/**
 * setupButton Click Event Handler
 *
 * Summary:
 *   This event listener listens for a click on the `setupButton` and triggers
 *   the setup mode by displaying setup buttons and hiding standard simulation
 *   buttons. It also processes and updates the lattice and its color/number
 *   assignments based on a predefined order array.
 *
 * Features:
 *   - Displays setup buttons and hides standard buttons when the setup button is clicked.
 *   - Updates the lattice colors and numbers based on the `orderArray` and the current lattice state.
 *   - Alters the lattice order and redraws it after modifications.
 *   - Calls a debounce function to prevent multiple rapid executions of the event.
 *
 * @param {Event} event - The click event that triggers the setup functionality.
 *
 * @returns {void} - This function does not return any value. It modifies the lattice
 *   state, updates button visibility, and triggers a redraw of the lattice.
 */
setupButton.addEventListener(
  "click",
  debounce(function () {
    savedLattice = []
    console.log("Begin printing latticeArray");
    for (let i = 0; i < latticeArray[0].length; i++) {
      savedLattice.push(latticeArray[0][i].getColor());
    }
    activateSetup();
    for (let i = 0; i < orderArray.length; i++) {
      latticeArray[0][i].setColor(1);
      latticeArray[0][orderArray[i]].setNumber(i);
    }
    alterTempOrder(orderArray);
    redrawLattice();
  })
);

/**
 * activateSetup
 *
 * Summary:
 *   This function activates setup mode by displaying relevant messages and toggling
 *   the visibility of UI elements. It handles the display of setup buttons, disables
 *   standard simulation buttons, and ensures that the options window is hidden during setup.
 *   It also logs messages and displays a greeting upon first activation.
 *
 * Features:
 *   - Displays a welcome message on the first activation, including a greeting.
 *   - Logs messages to the canvas about entering setup mode and providing instructions.
 *   - Hides the options window and disables standard simulation buttons during setup mode.
 *   - Enables setup-related UI elements and updates the lattice.
 *   - Calls functions to clear the lattice, alter setup functionality, and redraw the lattice.
 *
 * @returns {void} - This function does not return any value. It modifies the UI state,
 *   triggers logging, and updates the lattice display based on setup mode.
 */

function activateSetup() {
  if (displayWelcome) {
    makeLog("Use Help for Assistance", logCanvas, messageQueue);
    makeLog("Please Select Order", logCanvas, messageQueue);
    makeLog("Welcome to Setup Mode", logCanvas, messageQueue);
  } else {
    makeLog("Entered Setup Mode", logCanvas, messageQueue);
  }

  if (optionsWindow.style.display == "block") {
    optionsWindow.style.display = "none";
  }

  standardItems.forEach((item) => {
    item.style.display = "none";
  });

  setupItems.forEach((item) => {
    item.style.display = "inline-block";
  });

  clear(latticeArray, false);
  alterSetup(1);
  redrawLattice();

  if (displayWelcome) {
    ctx.font = "36px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const centerX = canvas.width / 2;

    ctx.fillText(
      "SETUP MODE: Click the cells or use the preset library to",
      centerX,
      80
    );
    ctx.fillText(
      "configure a cell ordering for the sequential algorithm.",
      centerX,
      140
    );
    ctx.fillText(
      "This is required to prepare for the simulation. All",
      centerX,
      200
    );
    ctx.fillText(
      "cells must be ordered; otherwise, the default left",
      centerX,
      260
    );
    ctx.fillText(" to right ordering will be used", centerX, 320);

    displayWelcome = false;

    ctx.font = "10px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }
}

/**
 * simulateButton Click Event Handler
 *
 * Summary:
 *   This event listener listens for a click on the `simulateButton` and triggers the
 *   transition from setup mode to simulation mode. It ensures that setup buttons are hidden,
 *   and standard simulation buttons are displayed. It also checks if the lattice has been ordered
 *   and updates the lattice order accordingly, either by applying the existing order or defaulting
 *   to a left-to-right ordering.
 *
 * Features:
 *   - Toggles visibility of setup and standard simulation buttons when the simulate button is clicked.
 *   - Checks if the lattice cells have been ordered, and either applies the existing order or defaults to left-to-right.
 *   - Logs the transition to simulate mode and displays relevant messages based on the state of the lattice order.
 *   - Clears and updates the lattice after applying changes to the order and setup functionality.
 *
 * @returns {void} - This function does not return any value. It modifies the UI state, updates the lattice,
 *   and logs relevant messages based on the ordering and mode transition.
 */
simulateButton.addEventListener("click", function () {
  standardItems.forEach((item) => {
    item.style.display = "inline-block";
  });

  setupItems.forEach((item) => {
    item.style.display = "none";
  });

  if (!tempOrder.includes(-1)) {
    alterOrder(tempOrder);
    makeLog("Order Set", logCanvas, messageQueue);
  } else {
    makeLog("Defaulting order to L->R", logCanvas, messageQueue);
    makeError("Incomplete Ordering", logCanvas, messageQueue);
    for (let i = 0; i < tempOrder.length; i++) {
      tempOrder[i] = i;
    }
    alterOrder(tempOrder);
  }

  makeLog("Entered Simulate Mode", logCanvas, messageQueue);

  clear(latticeArray, false);
  alterSetup(0);
  if (latticeArray[0].length == savedLattice.length) {
    for (let i = 0; i < savedLattice.length; i++) {
      latticeArray[0][i].setColor(savedLattice[i]);
    }
  }
  redrawLattice();
});

/**
 * voidButton Click Event Handler
 *
 * Summary:
 *   This event listener listens for a click on the `voidButton` and clears the lattice
 *   as well as the current order. It resets the lattice to an empty state and logs the
 *   action of clearing the order.
 *
 * Features:
 *   - Clears the lattice array, removing any existing values or states.
 *   - Clears the current order, resetting the order to its initial state.
 *   - Logs the action of clearing the order to the message queue and canvas.
 *
 * @returns {void} - This function does not return any value. It modifies the lattice state
 *   and logs the clearing action.
 */
voidButton.addEventListener("click", function () {
  clear(latticeArray, false);
  clearOrder();
  makeLog("Order Cleared", logCanvas, messageQueue);
});

/**
 * helpButton Click Event Handler
 *
 * Summary:
 *   This event listener listens for a click on the `helpButton` and displays the help window.
 *   When clicked, the help window's display is set to "block," making it visible to the user.
 *
 * Features:
 *   - Displays the help window when the `helpButton` is clicked.
 *   - Ensures that the help window is shown by setting its display property to "block."
 *
 * @returns {void} - This function does not return any value. It modifies the UI state
 *   by changing the display property of the help window.
 */
helpButton.addEventListener("click", function () {
  helpWindow.style.display = "block";
});

/**
 * closeHelp Click Event Handler
 *
 * Summary:
 *   This event listener listens for a click on the close button (`closeHelp`) in the top-right corner
 *   of the help window. When clicked, it hides the help window by setting its display property to "none."
 *
 * Features:
 *   - Closes the help window when the `closeHelp` button is clicked.
 *   - Hides the help window by setting its display property to "none," effectively removing it from view.
 *
 * @returns {void} - This function does not return any value. It modifies the UI state
 *   by changing the display property of the help window to hide it.
 */
closeHelp.addEventListener("click", function () {
  helpWindow.style.display = "none";
});

/**
 * window Click Event Handler (Close Help Window Outside Click)
 *
 * Summary:
 *   This event listener listens for a click anywhere on the window. If the click occurs
 *   outside of the help window (i.e., on the background), it hides the help window by setting
 *   its display property to "none."
 *
 * Features:
 *   - Closes the help window if the user clicks outside of it.
 *   - Ensures that the help window is hidden by checking if the clicked target is the help window.
 *
 * @param {Event} event - The click event that triggered the function.
 *
 * @returns {void} - This function does not return any value. It modifies the UI state
 *   by changing the display property of the help window to hide it when clicked outside.
 */
window.addEventListener("click", function (event) {
  if (event.target == helpWindow) {
    helpWindow.style.display = "none";
  }
});

/**
 * libraryButton Click Event Handler
 *
 * Summary:
 *   This event listener listens for a click on the `libraryButton` and displays the library window.
 *   When clicked, the library window's display is set to "block," making it visible to the user.
 *
 * Features:
 *   - Displays the library window when the `libraryButton` is clicked.
 *   - Ensures that the library window is shown by setting its display property to "block."
 *
 * @returns {void} - This function does not return any value. It modifies the UI state
 *   by changing the display property of the library window.
 */
libraryButton.addEventListener("click", function () {
  libraryWindow.style.display = "block";
});

/**
 * randOrder Click Event Handler (Generate Random Sequence)
 *
 * Summary:
 *   This event listener listens for a click on the `randOrder` element and generates a random order
 *   for the lattice array. It clears the lattice and order, generates a shuffled sequence, applies it
 *   to the lattice, and updates the display. The library window is then hidden, and a log is generated
 *   indicating that the random order has been set.
 *
 * Features:
 *   - Clears the lattice and order before generating a new random order.
 *   - Creates a shuffled sequence for the lattice array elements using the Fisher-Yates shuffle.
 *   - Updates the lattice cells with the shuffled sequence and redraws them.
 *   - Hides the library window once the random order is set.
 *   - Logs the action of setting the random order to the message queue and canvas.
 *
 * @returns {void} - This function does not return any value. It modifies the lattice array,
 *   updates the display, and logs the action of setting the random order.
 */
randOrder.addEventListener("click", function () {
  clear(latticeArray, false);
  clearOrder();
  let mockLattice = new Array();
  for (let i = 0; i < latticeArray[0].length; i++) {
    mockLattice.push(i);
  }
  for (let i = mockLattice.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mockLattice[i], mockLattice[j]] = [mockLattice[j], mockLattice[i]];
  }
  let neoLatticeArray = latticeArray;
  for (let i = 0; i < latticeArray[0].length; i++) {
    neoLatticeArray[0][i].flipColor();
    latticeArray[0][i].setNumber(mockLattice[i]);
    neoLatticeArray[0][i].drawCell(ctx);
    alterLatticeArray(neoLatticeArray);
  }
  for (let i = 0; i < mockLattice.length; i++) {
    tempOrder[mockLattice[i]] = i;
  }
  libraryWindow.style.display = "none";
  makeLog("Random Order Set", logCanvas, messageQueue);
});

/**
 * left2right Click Event Handler (Generate Left to Right Sequence)
 *
 * Summary:
 *   This event listener listens for a click on the `left2right` element and sets the lattice array
 *   to a left-to-right order. It clears the lattice and order, applies a sequential order (from 0 to n-1),
 *   updates the lattice display, and hides the library window. A log is generated indicating that the
 *   left-to-right order has been set.
 *
 * Features:
 *   - Clears the lattice and order before setting a new left-to-right order.
 *   - Sets a sequential order for the lattice array elements (from 0 to n-1).
 *   - Updates the lattice cells with the sequential order and redraws them.
 *   - Hides the library window once the left-to-right order is set.
 *   - Logs the action of setting the left-to-right order to the message queue and canvas.
 *
 * @returns {void} - This function does not return any value. It modifies the lattice array,
 *   updates the display, and logs the action of setting the left-to-right order.
 */
left2right.addEventListener("click", function () {
  clear(latticeArray, false);
  clearOrder();
  let mockLattice = new Array();
  for (let i = 0; i < latticeArray[0].length; i++) {
    mockLattice.push(i);
  }
  let neoLatticeArray = latticeArray;
  for (let i = 0; i < latticeArray[0].length; i++) {
    neoLatticeArray[0][i].flipColor();
    latticeArray[0][i].setNumber(mockLattice[i]);
    neoLatticeArray[0][i].drawCell(ctx);
    alterLatticeArray(neoLatticeArray);
  }
  for (let i = 0; i < mockLattice.length; i++) {
    tempOrder[mockLattice[i]] = i;
  }
  libraryWindow.style.display = "none";
  makeLog("Left to Right Order Set", logCanvas, messageQueue);
});

/**
 * right2left Click Event Handler (Generate Right to Left Sequence)
 *
 * Summary:
 *   This event listener listens for a click on the `right2left` element and sets the lattice array
 *   to a right-to-left order. It clears the lattice and order, applies a reverse sequential order
 *   (from n-1 to 0), updates the lattice display, and hides the library window. A log is generated indicating that the
 *   right-to-left order has been set.
 *
 * Features:
 *   - Clears the lattice and order before setting a new right-to-left order.
 *   - Sets a reverse sequential order for the lattice array elements (from n-1 to 0).
 *   - Updates the lattice cells with the reverse sequential order and redraws them.
 *   - Hides the library window once the right-to-left order is set.
 *   - Logs the action of setting the right-to-left order to the message queue and canvas.
 *
 * @returns {void} - This function does not return any value. It modifies the lattice array,
 *   updates the display, and logs the action of setting the right-to-left order.
 */

right2left.addEventListener("click", function () {
  clear(latticeArray, false);
  clearOrder();
  let mockLattice = new Array();
  for (let i = 0; i < latticeArray[0].length; i++) {
    mockLattice.push(latticeArray[0].length - (1 + i));
  }
  let neoLatticeArray = latticeArray;
  for (let i = 0; i < latticeArray[0].length; i++) {
    neoLatticeArray[0][i].flipColor();
    latticeArray[0][i].setNumber(mockLattice[i]);
    neoLatticeArray[0][i].drawCell(ctx);
    alterLatticeArray(neoLatticeArray);
  }
  for (let i = 0; i < mockLattice.length; i++) {
    tempOrder[mockLattice[i]] = i;
  }
  libraryWindow.style.display = "none";
  makeLog("Right to Left Order Set", logCanvas, messageQueue);
});

/**
 * centerOut Click Event Handler (Generate Center Outward Sequence)
 *
 * Summary:
 *   This event listener listens for a click on the `centerOut` element and sets the lattice array
 *   to a center-outward order. It first clears the lattice and order, then arranges the lattice elements
 *   in an alternating order starting from the center and expanding outward. Once the new order is applied,
 *   the lattice is updated and redrawn. The library window is hidden, and a log is generated indicating
 *   that the center-outward order has been set.
 *
 * Features:
 *   - Clears the lattice and order before setting the new center-outward order.
 *   - If the length of the lattice is even, elements are alternately placed from the center outwards.
 *   - If the lattice length is odd, the center element is set first, then the surrounding elements alternate.
 *   - Updates the lattice cells with the new center-outward order and redraws them.
 *   - Hides the library window once the center-outward order is set.
 *   - Logs the action of setting the center-outward order to the message queue and canvas.
 *
 * @returns {void} - This function does not return any value. It modifies the lattice array,
 *   updates the display, and logs the action of setting the center-outward order.
 */

centerOut.addEventListener("click", function () {
  clear(latticeArray, false);
  clearOrder();
  let mockLattice = new Array();
  for (let i = 0; i < latticeArray[0].length; i++) {
    mockLattice.push(i);
  }
  if (mockLattice.length % 2 == 0) {
    for (let i = 0; i < mockLattice.length / 2; i++) {
      mockLattice[i] = mockLattice.length - 2 * (i + 1);
      mockLattice[i + mockLattice.length / 2] = 2 * i + 1;
    }
  } else {
    mockLattice[(mockLattice.length - 1) / 2] = 0;
    for (let i = 0; i < (mockLattice.length - 1) / 2; i++) {
      mockLattice[i] = mockLattice.length - 1 - 2 * i;
      mockLattice[(mockLattice.length - 1) / 2 + 1 + i] = (i + 1) * 2 - 1;
    }
  }
  let neoLatticeArray = latticeArray;
  for (let i = 0; i < latticeArray[0].length; i++) {
    neoLatticeArray[0][i].flipColor();
    latticeArray[0][i].setNumber(mockLattice[i]);
    neoLatticeArray[0][i].drawCell(ctx);
    alterLatticeArray(neoLatticeArray);
  }
  for (let i = 0; i < mockLattice.length; i++) {
    tempOrder[mockLattice[i]] = i;
  }
  libraryWindow.style.display = "none";
  makeLog("Center Outward Order Set", logCanvas, messageQueue);
});

/**
 * edgesIn Click Event Handler (Generate Edges Inward Sequence)
 *
 * Summary:
 *   This event listener listens for a click on the `edgesIn` element and sets the lattice array
 *   to an edges-inward order. The lattice is cleared and re-ordered such that the elements start from
 *   the outer edges and gradually move inward. After the new order is applied, the lattice is updated
 *   and redrawn. The library window is hidden, and a log is generated indicating that the edges-inward
 *   order has been set.
 *
 * Features:
 *   - Clears the lattice and order before setting the new edges-inward order.
 *   - For even-length lattices, elements are placed in an alternating inward pattern starting from the edges.
 *   - For odd-length lattices, the center element is placed first, followed by alternating elements
 *     towards the edges.
 *   - Reverses the order of the mock lattice to simulate inward movement, then swaps elements to match
 *     the correct inward sequence.
 *   - Updates the lattice cells with the new edges-inward order and redraws them.
 *   - Hides the library window once the edges-inward order is set.
 *   - Logs the action of setting the edges-inward order to the message queue and canvas.
 *
 * @returns {void} - This function does not return any value. It modifies the lattice array,
 *   updates the display, and logs the action of setting the edges-inward order.
 */

edgesIn.addEventListener("click", function () {
  clear(latticeArray, false);
  clearOrder();
  let mockLattice = new Array();
  for (let i = 0; i < latticeArray[0].length; i++) {
    mockLattice.push(i);
  }
  if (mockLattice.length % 2 == 0) {
    for (let i = 0; i < mockLattice.length / 2; i++) {
      mockLattice[i] = mockLattice.length - 2 * (i + 1);
      mockLattice[i + mockLattice.length / 2] = 2 * i + 1;
    }
  } else {
    mockLattice[(mockLattice.length - 1) / 2] = 0;
    for (let i = 0; i < (mockLattice.length - 1) / 2; i++) {
      mockLattice[i] = mockLattice.length - 1 - 2 * i;
      mockLattice[(mockLattice.length - 1) / 2 + 1 + i] = (i + 1) * 2 - 1;
    }
  }
  for (let i = 0; i < mockLattice.length; i++) {
    mockLattice[i] = mockLattice.length - 1 - mockLattice[i];
  }
  for (let i = 0; i < mockLattice.length / 2; i++) {
    let temp = mockLattice[i];
    mockLattice[i] = mockLattice[mockLattice.length - 1 - i];
    mockLattice[mockLattice.length - 1 - i] = temp;
  }
  let neoLatticeArray = latticeArray;
  for (let i = 0; i < latticeArray[0].length; i++) {
    neoLatticeArray[0][i].flipColor();
    latticeArray[0][i].setNumber(mockLattice[i]);
    neoLatticeArray[0][i].drawCell(ctx);
    alterLatticeArray(neoLatticeArray);
  }
  for (let i = 0; i < mockLattice.length; i++) {
    tempOrder[mockLattice[i]] = i;
  }
  libraryWindow.style.display = "none";
  makeLog("Edges Inward Order Set", logCanvas, messageQueue);
});

/**
 * centerOutR Click Event Handler (Generate Center Out Reverse Sequence)
 *
 * Summary:
 *   This event listener listens for a click on the `centerOutR` element and sets the lattice array
 *   to a center-out reverse order. The lattice is cleared and re-ordered such that the elements are
 *   arranged with the center element first, followed by alternating elements outward. After applying
 *   the new order, the lattice is updated and redrawn. The library window is closed, and a log is created
 *   indicating the center-out reverse order has been set.
 *
 * Features:
 *   - Clears the lattice and order before setting the new center-out reverse order.
 *   - For even-length lattices, elements are placed in a reversed alternating pattern starting from the center.
 *   - For odd-length lattices, the center element is placed first, followed by alternating elements outward.
 *   - Reverses the order of the mock lattice to simulate outward movement from the center.
 *   - Updates the lattice cells with the new center-out reverse order and redraws them.
 *   - Hides the library window once the center-out reverse order is applied.
 *   - Logs the action of setting the center-out reverse order to the message queue and canvas.
 *
 * @returns {void} - This function does not return any value. It modifies the lattice array,
 *   updates the display, and logs the action of setting the center-out reverse order.
 */
centerOutR.addEventListener("click", function () {
  clear(latticeArray, false);
  clearOrder();
  let mockLattice = new Array();
  for (let i = 0; i < latticeArray[0].length; i++) {
    mockLattice.push(i);
  }
  if (mockLattice.length % 2 == 0) {
    for (let i = 0; i < mockLattice.length / 2; i++) {
      mockLattice[i] = mockLattice.length - 2 * (i + 1);
      mockLattice[i + mockLattice.length / 2] = 2 * i + 1;
    }
  } else {
    mockLattice[(mockLattice.length - 1) / 2] = 0;
    for (let i = 0; i < (mockLattice.length - 1) / 2; i++) {
      mockLattice[i] = mockLattice.length - 1 - 2 * i;
      mockLattice[(mockLattice.length - 1) / 2 + 1 + i] = (i + 1) * 2 - 1;
    }
  }
  for (let i = 0; i < mockLattice.length / 2; i++) {
    let temp = mockLattice[i];
    mockLattice[i] = mockLattice[mockLattice.length - 1 - i];
    mockLattice[mockLattice.length - 1 - i] = temp;
  }
  let neoLatticeArray = latticeArray;
  for (let i = 0; i < latticeArray[0].length; i++) {
    neoLatticeArray[0][i].flipColor();
    latticeArray[0][i].setNumber(mockLattice[i]);
    neoLatticeArray[0][i].drawCell(ctx);
    alterLatticeArray(neoLatticeArray);
  }
  for (let i = 0; i < mockLattice.length; i++) {
    tempOrder[mockLattice[i]] = i;
  }
  libraryWindow.style.display = "none";
  makeLog("Center Out Rev Order Set", logCanvas, messageQueue);
});

/**
 * edgesInR Click Event Handler (Generate Edges In Reverse Sequence)
 *
 * Summary:
 *   This event listener listens for a click on the `edgesInR` element and sets the lattice array
 *   to an edges-in reverse order. The lattice is cleared and re-ordered such that the elements start
 *   from the edges and move towards the center, with the order reversed. After applying the new order,
 *   the lattice is updated and redrawn. The library window is closed, and a log is created indicating
 *   the edges-in reverse order has been set.
 *
 * Features:
 *   - Clears the lattice and order before setting the new edges-in reverse order.
 *   - For even-length lattices, elements are placed starting from the edges and moved inward, reversed.
 *   - For odd-length lattices, the center element is placed first, followed by alternating elements inward.
 *   - The mock lattice array is reversed to simulate inward movement from the edges.
 *   - Updates the lattice cells with the new edges-in reverse order and redraws them.
 *   - Hides the library window once the edges-in reverse order is applied.
 *   - Logs the action of setting the edges-in reverse order to the message queue and canvas, and outputs it to the console.
 *
 * @returns {void} - This function does not return any value. It modifies the lattice array,
 *   updates the display, and logs the action of setting the edges-in reverse order.
 */
edgesInR.addEventListener("click", function () {
  clear(latticeArray, false);
  clearOrder();
  let mockLattice = new Array();
  for (let i = 0; i < latticeArray[0].length; i++) {
    mockLattice.push(i);
  }
  if (mockLattice.length % 2 == 0) {
    for (let i = 0; i < mockLattice.length / 2; i++) {
      mockLattice[i] = mockLattice.length - 2 * (i + 1);
      mockLattice[i + mockLattice.length / 2] = 2 * i + 1;
    }
  } else {
    mockLattice[(mockLattice.length - 1) / 2] = 0;
    for (let i = 0; i < (mockLattice.length - 1) / 2; i++) {
      mockLattice[i] = mockLattice.length - 1 - 2 * i;
      mockLattice[(mockLattice.length - 1) / 2 + 1 + i] = (i + 1) * 2 - 1;
    }
  }
  for (let i = 0; i < mockLattice.length; i++) {
    mockLattice[i] = mockLattice.length - 1 - mockLattice[i];
  }
  let neoLatticeArray = latticeArray;
  for (let i = 0; i < latticeArray[0].length; i++) {
    neoLatticeArray[0][i].flipColor();
    latticeArray[0][i].setNumber(mockLattice[i]);
    neoLatticeArray[0][i].drawCell(ctx);
    alterLatticeArray(neoLatticeArray);
  }
  for (let i = 0; i < mockLattice.length; i++) {
    tempOrder[mockLattice[i]] = i;
  }
  libraryWindow.style.display = "none";
  //console.log(tempOrder);
  makeLog("Edges In Rev Order Set", logCanvas, messageQueue);
});

/**
 * skip Click Event Handler (Generate N-Skip Sequence)
 *
 * Summary:
 *   This event listener handles a click on the `skip` element and sets the lattice array to follow
 *   an N-skip order. The lattice is cleared, and elements are set based on an N-skip pattern, where
 *   elements are placed in a sequence with a skip interval defined by the `nSkip` value. After applying
 *   the new order, the lattice is updated, redrawn, and a log is created indicating the N-skip order set.
 *
 * Features:
 *   - Clears the lattice and order before setting the N-skip sequence.
 *   - Loops through the lattice and places elements based on a skip interval defined by `nSkip`.
 *   - The elements are filled with values starting from 0 and incrementing based on the skip interval.
 *   - Updates the lattice cells with the N-skip order and redraws them.
 *   - Hides the library window once the N-skip order is applied.
 *   - Logs the action of setting the N-skip order to the message queue and canvas, including the skip value.
 *
 * @returns {void} - This function does not return any value. It modifies the lattice array,
 *   updates the display, and logs the action of setting the N-skip order with the given skip value.
 */
skip.addEventListener("click", function () {
  clear(latticeArray, false);
  clearOrder();
  let mockLattice = new Array();
  for (let i = 0; i < latticeArray[0].length; i++) {
    mockLattice.push(0);
  }
  let count = 0;
  for (let i = 1; i < nSkip + 1; i++) {
    for (let f = 0; f < mockLattice.length; f++) {
      if ((f + 1) % nSkip == i % nSkip) {
        mockLattice[f] = count;
        count += 1;
      }
    }
  }
  let neoLatticeArray = latticeArray;
  for (let i = 0; i < latticeArray[0].length; i++) {
    neoLatticeArray[0][i].flipColor();
    latticeArray[0][i].setNumber(mockLattice[i]);
    neoLatticeArray[0][i].drawCell(ctx);
    alterLatticeArray(neoLatticeArray);
  }
  for (let i = 0; i < mockLattice.length; i++) {
    tempOrder[mockLattice[i]] = i;
  }
  libraryWindow.style.display = "none";
  makeLog("N-Skip order set | N = " + nSkip, logCanvas, messageQueue);
});

/**
 * closeLibrary Click Event Handler (Close Library Window)
 *
 * Summary:
 *   This event listener handles the click event on the close button (`closeLibrary`).
 *   When the close button in the top-right corner of the window is clicked, it hides the library window
 *   by setting its `display` style property to `"none"`.
 *
 * Features:
 *   - Listens for a click on the `closeLibrary` button.
 *   - When clicked, hides the library window by changing its display style to `"none"`.
 *
 * @returns {void} - This function does not return any value. It modifies the visibility of the `libraryWindow`.
 */

closeLibrary.addEventListener("click", function () {
  libraryWindow.style.display = "none";
});

/**
 * window Click Event Handler (Close Library Window if clicked outside)
 *
 * Summary:
 *   This event listener listens for any click event on the window. If the click occurs outside the library window (on the background),
 *   the library window is hidden by setting its `display` style property to `"none"`.
 *
 * Features:
 *   - Listens for a click anywhere on the window.
 *   - Checks if the click target is the `libraryWindow` (meaning the background area was clicked).
 *   - If true, hides the library window by setting `libraryWindow.style.display` to `"none"`.
 *
 * @param {Event} event - The event object representing the mouse click event.
 * @returns {void} - This function does not return any value, it hides the `libraryWindow` based on the click target.
 */

window.addEventListener("click", function (event) {
  if (event.target == libraryWindow) {
    libraryWindow.style.display = "none";
  }
});

/**
 * Redraws the entire lattice array on the canvas.
 *
 * This function clears the canvas and then redraws the lattice by:
 *   1. Filling the background with a selected dead color.
 *   2. Redrawing each cell in the lattice array by calling the `drawCell` method for each cell.
 *
 * Features:
 *   - Clears the entire canvas before redrawing (`ctx.clearRect`).
 *   - Fills the background with the selected color (`deadColorSel.value`).
 *   - Redraws the lattice by iterating through all the cells in `latticeArray` and calling `drawCell` for each one.
 *
 * @returns {void} - This function does not return anything, it performs visual updates on the canvas.
 */
function redrawLattice() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = deadColorSel.value;
  ctx.fillRect(
    latticeArray[0][0].getXLoc(),
    latticeArray[0][0].getYLoc(),
    latticeArray[0].length * latticeArray[0][0].getHeight(),
    latticeArray.length * latticeArray[0][0].getWidth()
  );
  for (let i = 0; i < latticeArray.length; i++) {
    for (let f = 0; f < latticeArray[i].length; f++) {
      latticeArray[i][f].drawCell(ctx);
    }
  }
  //console.log("Redraw Lattice Called");
}

/**
 * Determines if the mouse cursor is currently within the bounds of the lattice.
 *
 * This function checks whether the mouse cursor's X and Y positions are inside the lattice array's boundaries.
 * It can handle both single-row and multi-row lattices, based on the `oneRow` parameter.
 *
 * Features:
 *   - Checks the X position of the mouse against the boundaries of the first and last cells in the lattice row.
 *   - If the lattice is multi-row, checks the Y position against the top and bottom bounds of the lattice.
 *   - Returns `true` if the cursor is within the lattice; otherwise, returns `false`.
 *
 * @param {number} mouseX - The X-coordinate of the mouse pointer.
 * @param {boolean} [oneRow=true] - A flag indicating whether the lattice is a single row or multiple rows. Default is `true` (single row).
 * @param {number} [mouseY=0] - The Y-coordinate of the mouse pointer. Default is `0`.
 *
 * @returns {boolean} - `true` if the mouse is inside the lattice, `false` otherwise.
 */

function inLattice(mouseX, oneRow = true, mouseY = 0) {
  let inLat = false;
  if (mouseX >= latticeArray[0][0].getXLoc()) {
    if (
      mouseX <=
      latticeArray[0][latticeArray[0].length - 1].getXLoc() +
        latticeArray[0][latticeArray[0].length - 1].getWidth()
    ) {
      if (oneRow) {
        inLat = true;
      } else {
        if (mouseY >= 0) {
          if (
            mouseY <=
            latticeArray[latticeArray.length - 1][0].getYLoc() +
              latticeArray[latticeArray.length - 1][0].getHeight()
          ) {
            inLat = true;
          }
        }
      }
    }
  }
  return inLat;
}

/**
 * Reverts the cell data to its original unscrolled form.
 *
 * This function resets the position and size of each cell in the lattice array. It recalculates the X and Y positions of each cell based on the original layout, as well as resets their height and width.
 * The cells are adjusted to their default size and are positioned in a grid-like manner.
 *
 * Features:
 *   - Sets the size of each cell back to the default `size`.
 *   - Recalculates the X and Y coordinates to place the cells in their unscrolled positions, centering the grid.
 *   - Updates the lattice array with the new positions and sizes.
 *
 * @returns {void} - This function does not return anything; it directly modifies the cell data in the lattice array.
 */
function revertCells() {
  let startX = canvas.width / 2 - (latSize * size) / 2;
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
 * Alters the position and size of a cell based on the mouse position and a scale factor.
 *
 * This function adjusts the dimensions and location of a given cell by calculating the new X and Y positions for its corners, based on the mouse coordinates and a scaling factor. The scaling factor modifies the distance between the mouse and the cell's corners, resulting in a resized and repositioned cell.
 *
 * Features:
 *   - Calculates the new position for each corner of the cell based on the mouse location.
 *   - Applies a scale factor to adjust the cell's size and position relative to the mouse cursor.
 *   - Updates the cell's height, width, and coordinates with the newly calculated values.
 *
 * @param {number} mouseX - The X position of the mouse cursor.
 * @param {object} cell - The cell object whose position and size are being altered.
 * @param {number} scale - The scaling factor that determines how much the cell should be resized.
 * @param {number} [mouseY=0] - The Y position of the mouse cursor (defaults to 0 if not provided).
 *
 * @returns {void} - This function modifies the given cell object, updating its dimensions and location.
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
 * Updates the dead color of all cells in the lattice based on user input.
 *
 * This function listens for an input change in the `deadColorSel` element and updates the color of each cell in the lattice to the selected dead color. It then redraws the lattice to reflect the new color.
 *
 * Features:
 *   - Updates the dead color of every cell in the `latticeArray` by calling the `setDeadColor` method.
 *   - Redraws the lattice after the color change by calling the `drawLattice` function.
 *
 * @returns {void} - This function modifies the color properties of the cells and triggers a redraw of the lattice.
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
 * Updates the alive color of all cells in the lattice based on user input.
 *
 * This function listens for an input change in the `aliveColorSel` element and updates the color of each cell in the lattice to the selected alive color. It then redraws the lattice to reflect the new color.
 *
 * Features:
 *   - Updates the alive color of every cell in the `latticeArray` by calling the `setAliveColor` method.
 *   - Redraws the lattice after the color change by calling the `drawLattice` function.
 *
 * @returns {void} - This function modifies the color properties of the cells and triggers a redraw of the lattice.
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
 * Updates the border color for dead cells in the lattice based on user input.
 *
 * This function listens for an input change in the `deadBorderSel` element and updates the border color of each dead cell in the lattice. It then redraws the lattice to reflect the new border color.
 *
 * Features:
 *   - Updates the border color of dead cells in the `latticeArray` by calling the `setDeadBorder` method.
 *   - Redraws the lattice after the border color change by calling the `drawLattice` function.
 *
 * @returns {void} - This function modifies the border color properties of dead cells and triggers a redraw of the lattice.
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
 * Updates the border color for alive cells in the lattice based on user input.
 *
 * This function listens for an input change in the `aliveBorderSel` element and updates the border color of each alive cell in the lattice. It then redraws the lattice to reflect the new border color.
 *
 * Features:
 *   - Updates the border color of alive cells in the `latticeArray` by calling the `setAliveBorder` method.
 *   - Redraws the lattice after the border color change by calling the `drawLattice` function.
 *
 * @returns {void} - This function modifies the border color properties of alive cells and triggers a redraw of the lattice.
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
 * Handles zooming of the lattice when the mouse wheel is scrolled.
 *
 * This function listens for a "wheel" event on the `tickCanvas` element and applies zooming to the lattice cells based on the user's mouse scroll direction and position.
 * - For a single-row lattice, the function adjusts the size of the cells when zooming in or out, and keeps track of the zoom level with `totalDelta`.
 * - For multi-row lattices, it allows zooming both horizontally and vertically.
 * - The zoom factor changes based on scroll direction and the total accumulated scroll delta, with different zoom scales for efficiency.
 *
 * Features:
 *   - Tracks mouse position to center zoom based on the cursor location.
 *   - Adjusts cell size dynamically when zooming in or out.
 *   - Limits zoom out if the total delta becomes negative, resetting the cells to their original size.
 *   - Efficient zoom handling for large lattices, especially when there are many rows.
 *
 * @param {WheelEvent} event - The mouse wheel event that contains scroll delta and mouse position.
 *
 * @returns {void} - This function alters the lattice cells and triggers a redraw of the lattice.
 */

tickCanvas.addEventListener(
  "wheel",
  function (event) {
    let mouseX, mouseY;
    [mouseX, mouseY] = getMouseLocation(event);
    if (latticeArray.length == 1 && inLattice(mouseX)) {
      let delta = event.deltaY;
      if (delta > 0 && totalDelta > 0) {
        scale = 0.9;
      } else if (delta < 0) {
        scale = 1.1;
      }
      totalDelta -= delta;
      if (totalDelta < 0) {
        revertCells();
        totalDelta = 0;
      } else {
        for (let i = 0; i < latticeArray.length; i++) {
          for (let f = 0; f < latticeArray[i].length; f++) {
            alterCell(mouseX, latticeArray[i][f], scale);
          }
        }
      }
      redrawLattice();
    } else if (latticeArray.length > 1 && inLattice(mouseX, false, mouseY)) {
      let delta = event.deltaY;
      if (delta > 0 && totalDelta > 0) {
        scale = 0.75;
      } else if (delta < 0) {
        scale = 1.25;
      }
      totalDelta -= delta;
      if (totalDelta < 0) {
        revertCells();
        totalDelta = 0;
      } else {
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
 * Handles the rule set change when the "Submit" button is clicked.
 *
 * This function stops the current iteration, clears any reset toggles, and applies the selected rule by calling `setRule` with the current rule value.
 *
 * Features:
 *   - Stops the ongoing iteration using `stopIterating` to ensure a clean transition when changing the rule.
 *   - Clears any reset toggles to reset state before applying the new rule.
 *   - Sets the new rule by calling `setRule` with the updated rule value.
 *
 * @returns {void} - This function alters the rule set and prepares the system for the next iteration with the new rule.
 */
ruleSubmit.addEventListener("click", function () {
  stopIterating();
  clearResetToggle();
  setRule(rule);
});

/**
 * Sets all starting lattices to alive when the "Fill Lattice" button is clicked.
 *
 * This function stops the current iteration, clears any reset toggles, and fills the first row of the lattice with "alive" cells.
 * It then redraws the lattice and logs the action.
 *
 * Features:
 *   - Stops the ongoing iteration with `stopIterating` to ensure no interference while filling the lattice.
 *   - Clears any reset toggles to reset state before making changes.
 *   - Sets the lattice size and clears the current lattice array.
 *   - Fills the first row of the lattice by setting each cell's color to "alive".
 *   - Redraws the updated lattice using `drawLattice`.
 *   - Logs the action of filling the lattice to the log canvas with `makeLog`.
 *
 * @returns {void} - This function updates the lattice to be fully filled with alive cells and logs the action.
 */
latticeFillButton.addEventListener("click", function () {
  stopIterating();
  clearResetToggle();
  clear(latticeArray);
  for (let i = 0; i < latticeArray[0].length; i++) {
    latticeArray[0][i].setColor(1);
  }
  drawLattice(latticeArray);
  makeLog("Filled Lattice", logCanvas, messageQueue);
});

/**
 * Sets random states to all cells in the starting lattice when the "Random Fill" button is clicked.
 *
 * This function stops the current iteration, clears any reset toggles, and randomly sets the state (alive or dead) for all cells in the first row of the lattice.
 * It then redraws the lattice and logs the action.
 *
 * Features:
 *   - Stops the ongoing iteration with `stopIterating` to ensure no interference while filling the lattice.
 *   - Clears any reset toggles to reset state before making changes.
 *   - Sets the lattice size and clears the current lattice array.
 *   - Randomly sets the color of each cell in the first row, choosing between two states (alive or dead).
 *   - Redraws the updated lattice using `drawLattice`.
 *   - Logs the action of randomizing the lattice to the log canvas with `makeLog`.
 *   - Uses `debounce` to ensure the function is not called repeatedly in quick succession.
 *
 * @returns {void} - This function updates the lattice with randomly set cell states and logs the action.
 */
randomFillButton.addEventListener(
  "click",
  debounce(function () {
    stopIterating();
    clearResetToggle();
    clear(latticeArray);
    for (let i = 0; i < latticeArray[0].length; i++) {
      latticeArray[0][i].setColor(Math.floor(Math.random() * 2));
    }
    drawLattice(latticeArray);
    makeLog("Randomized Lattice", logCanvas, messageQueue);
  })
);

/**
 * Initiates the iteration process based on the user-defined number of iterations when the "Iterate" button is clicked.
 *
 * This function first checks if the number of iterations is set correctly, and if not, it logs an error. If the iterations are set,
 * it stops the ongoing iteration, logs the action, and then begins iterating through the lattice based on the current and desired number of iterations.
 * Additionally, it adjusts the button label for resetting the lattice depending on the lattice configuration.
 *
 * Features:
 *   - Checks if the number of iterations is greater than 0 before starting the iteration process.
 *   - Stops any ongoing iterations using `stopIterating` to prevent interference.
 *   - Logs the iteration action and the current rule number to the log canvas.
 *   - Updates the label of the reset button depending on the lattice's structure.
 *   - Calls the `iterate` function to carry out the specified number of iterations.
 *   - Uses `debounce` to prevent multiple rapid clicks from triggering multiple iterations.
 *
 * @returns {void} - This function manages the iteration process and logs relevant information to the log canvas.
 */
iterateButton.addEventListener(
  "click",
  debounce(function () {
    theoHeight = Math.floor(results.height / size) - 1;
    if (addIterations == 0) {
      makeError("Iteration not set", logCanvas, messageQueue);
      return;
    }
    stopIterating();
    makeLog("Used Rule " + ruleNum, logCanvas, messageQueue);
    makeLog("Iterated to " + addIterations, logCanvas, messageQueue);
    if (latticeArray.length == 1) {
      clearResetButton.innerHTML = "Reset";
    }
    if (theoHeight < addIterations) {
      makeError("Hit Max Canvas Height", logCanvas, messageQueue);
      makeLog("Output Truncated", logCanvas, messageQueue);
    }
    iterate(currentIteration, Math.min(addIterations, theoHeight))
    //iterate(currentIteration, addIterations);
  })
);

/**
 * Clears or resets the lattice based on its configuration when the "Clear/Reset" button is clicked.
 *
 * This function stops any ongoing iterations and clears or resets the lattice array depending on its structure. If the lattice consists
 * of only one row, it clears the lattice without any special conditions. If there are multiple rows, it clears the lattice with specific
 * parameters (likely affecting how the clearing operation is done). Additionally, the reset toggle is cleared, and the debounce function
 * ensures that rapid clicks don't trigger multiple resets.
 *
 * Features:
 *   - Stops any ongoing iterations to prevent interference with the clearing process.
 *   - Resets or clears the lattice based on its row count (single-row or multi-row configurations).
 *   - Uses `debounce` to prevent multiple clicks from triggering the reset or clear operation too quickly.
 *
 * @returns {void} - This function clears or resets the lattice and its associated states.
 */
clearResetButton.addEventListener(
  "click",
  debounce(function () {
    stopIterating();
    clearResetToggle();
    if (latticeArray.length == 1) {
      clear(latticeArray);
    } else {
      clear(latticeArray, true);
    }
  })
);

/* Connect UI Functionality to a prebuilt function */

/**
 * Toggles the iteration process on or off when the "Iteration Toggle" button is clicked.
 *
 * This function toggles the state of the `tickerToggle` variable (indicating whether the iteration is active or paused), clears the
 * `tickCanvas` to remove any visual artifacts from the previous iteration, and then calls the `iterationToggleOption` function to
 * update the UI and behavior accordingly. The debounce function ensures that rapid consecutive clicks do not trigger multiple iterations
 * or UI updates.
 *
 * Features:
 *   - Toggles the iteration state by flipping the `tickerToggle` boolean.
 *   - Clears the `tickCanvas` to refresh the iteration visuals.
 *   - Calls `iterationToggleOption` to apply the necessary updates based on the new iteration state.
 *   - Uses `debounce` to limit the frequency of function calls in case of multiple quick clicks.
 *
 * @returns {void} - This function updates the iteration state and the related UI accordingly.
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
 * Toggles the border visibility for cells in the lattice when the "Border Toggle" button is clicked.
 *
 * This function alters the border visibility by calling `alterBorder` with the opposite value of the current border state (as determined
 * by the `getBorder` function). After updating the border state, the lattice is redrawn by calling `drawLattice` to reflect the changes
 * visually. Finally, the `borderToggleOption` function is called to update any UI elements or settings related to the border toggle.
 * The debounce function ensures that multiple quick clicks do not cause excessive updates.
 *
 * Features:
 *   - Toggles the border visibility for cells based on the current state.
 *   - Redraws the lattice to reflect the updated border state.
 *   - Calls `borderToggleOption` to apply necessary changes to the UI or settings.
 *   - Uses `debounce` to prevent rapid multiple executions of the function from occurring.
 *
 * @returns {void} - This function updates the border visibility and the related UI accordingly.
 */
borderToggleButton.addEventListener(
  "click",
  debounce(function () {
    alterBorder(!getBorder());
    drawLattice(latticeArray);
    borderToggleOption();
  })
);

/**
 * Handles the "Iteration Submit" button click event to stop ongoing iterations and set the lattice size.
 *
 * This function first calls `stopIterating` to ensure that any ongoing iterations are stopped before changing the iteration amount.
 * It then calls `setLatticeSize` to adjust the lattice size according to the current settings.
 *
 * Features:
 *   - Stops any ongoing iteration by calling `stopIterating`.
 *   - Updates the lattice size by calling `setLatticeSize`.
 *
 * @returns {void} - This function updates the iteration state and lattice size without returning any value.
 */
iterationSubmit.addEventListener("click", function () {
  stopIterating();
  setLatticeSize();
});

/**
 * Handles the "Lattice Size Submit" button click event to update the lattice size.
 *
 * This function first stops any ongoing iterations by calling `stopIterating` to ensure the lattice size can be safely updated.
 * It clears any reset toggles and checks if the setup is complete. If not, it triggers the setup by clicking the `setupButton`.
 * Finally, it updates the lattice size by calling `updateLatticeSize` with the current canvas.
 *
 * Features:
 *   - Stops any ongoing iteration by calling `stopIterating`.
 *   - Clears reset toggles with `clearResetToggle`.
 *   - Triggers setup if not already completed.
 *   - Updates lattice size by calling `updateLatticeSize` with the canvas.
 *
 * @returns {void} - This function updates the lattice size without returning any value.
 */
latticeSizeSubmit.addEventListener("click", function () {
  stopIterating();
  clearResetToggle();
  if (!getSetup()) setupButton.click();

  updateLatticeSize(canvas);
  clearOrder();
});

/**
 * Handles the "N Submit" button click event to set the value of N.
 *
 * This function calls `setN` to update the value of N when the button is clicked.
 *
 * Features:
 *   - Updates the value of N by calling `setN`.
 *
 * @returns {void} - This function updates the value of N without returning any value.
 */
nSubmit.addEventListener("click", function () {
  setN();
});

/**
 * Handles the "Start/Stop Button" click event for toggling the iteration process.
 *
 * When clicked, this function checks if the `run` variable is set to `1` (indicating that the iteration is running).
 * If `run` is not equal to `1`, it starts the iteration process:
 *   - Sets `run` to `1` to start the iterations.
 *   - Calls `startStopToggle()` to update the UI accordingly.
 *   - If the lattice has only one row (`latticeArray.length == 1`) and there are iterations to be added (`addIterations` is truthy),
 *     it changes the text of `clearResetButton` to "Reset".
 *   - Calls `continouslyIterate()` to begin the iteration process with the specified `iterationTime`.
 *
 * If `run` is already set to `1`, the function stops the iteration:
 *   - Sets `run` to `0` to stop the iterations.
 *   - Calls `startStopToggle()` to update the UI accordingly.
 *
 * @returns {void} - This function toggles the iteration process without returning any value.
 */
startStopButton.addEventListener(
  "click",
  debounce(function () {
    if (run != 1) {
      theoHeight = Math.floor(results.height / size) - 1;
      run = 1;
      startStopToggle();
      if (latticeArray.length == 1) {
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
 * Handles the "mousemove" event on the tickCanvas to update the position of the tick box.
 *
 * This function is triggered whenever the mouse moves over the canvas.
 * It calculates the mouse's position and calls the `makeTickBox()` function to display the tick box at the correct location.
 *
 * @param {Event} event - The mousemove event containing information about the mouse's position.
 * @returns {void} - This function updates the tick box location without returning any value.
 */
tickCanvas.addEventListener("mousemove", function (event) {
  makeTickBox(event, tctx);
});

/**
 * Handles the "mousedown" event on the tickCanvas to flip squares when clicked.
 *
 * This function is triggered whenever the user clicks on the canvas.
 * It disables text selection to avoid unintended text highlight, calculates the mouse click position,
 * and calls the `setCells()` function to flip the cell based on the clicked location.
 *
 * @param {Event} event - The mousedown event containing information about the mouse's position.
 * @returns {void} - This function flips the cells without returning any value.
 */
tickCanvas.addEventListener(
  "mousedown",
  debounce(function (event) {
    document.body.style.userSelect = "none";
    let mouseX, mouseY;
    [mouseX, mouseY] = getMouseLocation(event);
    setCells(latticeArray, mouseX, mouseY);
    mouseDown = true;
  })
);

//tickCanvas.addEventListener("mousedown", function(event){mouseDown = true;});
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
 * Handles keyboard shortcut events for controlling the UI.
 *
 * This function listens for the "keydown" event to execute specific actions based on key presses.
 * When the ALT key is held, it allows quick actions for UI elements like starting/stopping the process,
 * iterating, clearing the canvas, or downloading files. When ALT is not held, it triggers different actions
 * like simulating the process, opening the library, or displaying help. Additionally, the Enter key is handled
 * to submit input fields based on the currently active element.
 *
 * @param {Event} event - The keydown event containing information about the pressed key.
 * @returns {void} - This function triggers specific UI actions based on key presses.
 */
document.addEventListener("keydown", function (event) {
  if (event.altKey) {
    if (setupButton.style.display == "inline-block") {
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
        case event.key == "n":
          downloadPDFButton.click();
          break;
        case event.key == "p":
          downloadPNGButton.click();
          break;
        case event.key == "u":
          setupButton.click();
          break;
        case event.key == "g":
          latticeFillButton.click();
          break;
        case event.key == "m":
          randomFillButton.click();
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
    } else {
      switch (true) {
        case event.key == "Enter":
          simulateButton.click();
          break;
        case event.key == "c":
          voidButton.click();
          break;
        case event.key == "l":
          libraryButton.click();
          break;
        case event.key == "p":
          helpButton.click();
          break;
        case event.key == "w":
          iterationToggleButton.click();
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
 * Updates the size of the lattice based on user input and resizes cells accordingly.
 *
 * This function reads the value entered in the lattice size input box, checks if it's a valid number
 * within the allowed range, and adjusts the lattice size and cell dimensions. If the value is valid,
 * it updates the lattice size, logs the change, and resizes the cells. If the value is invalid, it logs
 * an error message. Additionally, it ensures that cell size does not exceed a maximum limit (45).
 *
 * @param {HTMLCanvasElement} canvas - The canvas element where the lattice is drawn.
 * @returns {void} - Updates the lattice size and cell size based on the input.
 */

function updateLatticeSize(canvas) {
  let newCellNum = parseInt(latticeSizeBox.value);

  if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
    alterLatSize(newCellNum);
    createOrder();
    makeLog("Lattice Size Set to " + newCellNum, logCanvas, messageQueue);
  } else {
    makeError(
      "Invalid Lattice Size: " + latticeSizeBox.value,
      logCanvas,
      messageQueue
    );
  }

  let size = canvas.width / latSize;

  if (size > 45) {
    size = 45;
  }

  alterSize(size);
  clear(latticeArray);
}

/**
 * Generates a tick box at the location of the mouse cursor, displaying the row and column of the lattice cell.
 *
 * This function is triggered by the mousemove event and checks if the mouse is inside the lattice bounds.
 * If it is, it calculates the row and column number, and draws a tick box near the mouse pointer with
 * the row and column number displayed. The tick box is only drawn when the tickerToggle is enabled.
 *
 * @param {MouseEvent} event - The mouse event containing the mouse position.
 * @returns {void} - Draws the tick box at the proper location based on mouse position.
 */

function makeTickBox(event) {
  if (tickerToggle == 1) {
    let [mouseX, mouseY] = getMouseLocation(event);

    let firstCell = latticeArray[0][0];

    tctx.clearRect(0, 0, tickCanvas.width, tickCanvas.height);

    let lineNumber = Math.floor(mouseY / firstCell.getHeight());
    let colNumber = Math.floor(
      (mouseX - firstCell.getXLoc()) / firstCell.getWidth()
    );

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

      tctx.fillText(tickNum, mouseX + 4, mouseY);
    }
  }
}

/**
 * Sets the delay between iterations when running the lattice simulation.
 *
 * This function updates the `iterationTime` variable to control how long the program waits before generating the next lattice.
 * It is typically used to adjust the speed of the iteration process.
 *
 * @param {number} newDelay - The new delay time in milliseconds before the next lattice is generated.
 * @returns {void} - Updates the `iterationTime` to the specified delay.
 */

function setDelay(newDelay) {
  iterationTime = newDelay;
}

/**
 * Continuously iterates the lattice while the `run` flag is set to true.
 *
 * This function sets up a loop using `setTimeout`, where each iteration of the lattice is triggered after a delay defined by `iterationTime`.
 * If the `run` flag is still true after each iteration, it will recursively call itself to keep iterating. If `run` is false, the iteration stops.
 *
 * @param {number} iterationTime - The time delay between iterations, in milliseconds.
 * @returns {void} - Continuously runs the iteration as long as `run` is true. If `run` is false, it stops.
 */

function continouslyIterate(iterationTime) {
  if (run && currentIteration + 1 <= Math.min(theoHeight, addIterations)) {
    setTimeout(function () {
      if (run && currentIteration + 1 <= Math.min(theoHeight, addIterations)) {
        iterate(currentIteration, 1);
      }
      continouslyIterate(iterationTime);
    }, iterationTime);
  } else {
    startStopToggle(currentIteration);
  }
}

/**
 * Sets the value of `nSkip` based on user input for the N-value.
 *
 * This function retrieves the value from the input field `nInputBox`, checks if it is a valid number within the range of 2 and the lattice size (`latSize`),
 * and updates the `nSkip` variable accordingly. If the input is invalid, it logs an error message.
 *
 * @returns {void} - Updates `nSkip` and logs the appropriate message if valid or an error if invalid.
 */
function setN() {
  let newN = parseInt(nInputBox.value);
  if (!isNaN(newN) && newN >= 2 && newN <= latSize) {
    nSkip = newN;
    makeLog("N-value Set to " + newN, logCanvas, messageQueue);
  } else {
    makeError(
      "*Invalid N-value: " + nInputBox.value + "(N >= 2)*",
      logCanvas,
      messageQueue
    );
  }
}

/**
 * Sets the cellular automaton rule based on user input.
 *
 * This function retrieves the rule number from the `ruleInputBox` input field, checks if it's a valid integer
 * within the range of 0 to 255, and then updates the rule accordingly. If the rule is valid, it alters the rule number
 * and the corresponding rule, logs the success message, and clears the lattice. If the rule is invalid, it logs an error.
 *
 * @returns {void} - Updates the rule and clears the lattice if valid or logs an error if invalid.
 */
function setRule() {
  let newRule = parseInt(ruleInputBox.value);
  run = 0;
  if (!isNaN(newRule) && newRule >= 0 && newRule <= 255) {
    alterRuleNum(newRule);
    alterRule(ruleNumToRule(newRule));
    makeLog("Rule Set to " + newRule, logCanvas, messageQueue);
    clear(latticeArray, true);
  } else {
    makeError(
      "Invalid Rule Number: " + ruleInputBox.value,
      logCanvas,
      messageQueue
    );
  }
}

/**
 * Sets the number of iterations for the lattice based on user input.
 *
 * This function retrieves the iteration value from the `iterationInputBox` input field, checks if it's a valid integer
 * within the range of 0 to 10,000, and updates the `addIterations` variable. If the value is valid, it clears the lattice
 * and logs the success message. If the value is invalid, it logs an error.
 *
 * @returns {number} - The updated number of iterations (addIterations) if valid.
 */
function setLatticeSize() {
  let newValue = parseInt(iterationInputBox.value);
  if (!isNaN(newValue) && newValue >= 0 && newValue <= 9000) {
    clear(latticeArray, true);
    addIterations = newValue;
    makeLog("Iterations Set to " + newValue, logCanvas, messageQueue);
  } else {
    makeError(
      "Invalid Iteration Size: " + iterationInputBox.value,
      logCanvas,
      messageQueue
    );
  }
  return addIterations;
}

/**
 * Clears all lattice arrays except the first one and sets all cells to dead (white),
 * with an option to retain the initial lattice configuration.
 *
 * This function resets the lattice by clearing the current array, setting all cells to a default "dead" state,
 * and reinitializes the lattice with new cells. If the `keepInit` flag is true, it preserves the color states
 * of the initial lattice configuration. It also resets iteration values, updates the lattice, and redraws the canvas.
 *
 * @param {Array} latticeArray - The lattice array to be cleared and reset.
 * @param {boolean} [keepInit=false] - Whether to preserve the initial cell states (default is false).
 */

function clear(latticeArray, keepInit = false) {
  totalDelta = 0;
  canvas.height = 400;
  alterNumOfIterations(1);
  alterCurrentIteration(1);
  let clearedLattice = new Array(new Array());
  alterNextLattice(new Array());
  let StartX = canvas.width / 2 - (latSize * size) / 2;
  let neoLatticeArray = latticeArray;
  while (neoLatticeArray.length > 1) {
    neoLatticeArray.pop();
  }
  for (let i = 0; i < latSize; i++) {
    clearedLattice[0][i] = new cell(
      size,
      size,
      StartX + i * size,
      0,
      0,
      getBorder(),
      getSetup()
    );
    clearedLattice[0][i].setAliveColor(aliveColorSel.value);
    clearedLattice[0][i].setDeadColor(deadColorSel.value);
    clearedLattice[0][i].setAliveBorder(aliveBorderSel.value);
    clearedLattice[0][i].setDeadBorder(deadBorderSel.value);
  }

  let latPlusBufferArr = new Array();
  if (keepInit) {
    clearResetButton.innerHTML = "Clear";
    let bufferNum =
      (neoLatticeArray[0].length - clearedLattice[0].slice(0).length) / 2;
    for (let i = bufferNum; i < latSize + bufferNum; i++) {
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

  for (let i = 0; i < latticeArray[0].length; i++) {
    if (tempOrder[i] != -1 && typeof tempOrder[i] !== "undefined") {
      latticeArray[0][tempOrder[i]].setNumber(i);
    }
  }

  alterLatticeArray(neoLatticeArray);
  alterCurrentLattice(latticeArray[0]);
  updateLattice();
}

export function clearOrder() {
  let tempTempOrder = Array();
  for (let i = 0; i < latticeArray[0].length; i++) {
    tempTempOrder.push(-1);
  }
  alterTempOrder(tempTempOrder);
}

/**
 * Takes the mouse click coordinates and calculates where it is in relation to the canvas,
 * updating the lattice array based on the interaction.
 *
 * This function checks which cell the mouse clicked on and, based on whether the mouse is down or not,
 * either flips the color of the cell or sets the color to a specific value. Additionally, it handles setup clicking
 * by adding or removing the clicked cell from a temporary order list.
 *
 * @param {Array} latticeArray - The lattice array representing the grid of cells.
 * @param {number} mouseX - The x-coordinate of the mouse click.
 * @param {number} mouseY - The y-coordinate of the mouse click.
 * @param {boolean} [mouseDown=false] - Whether the mouse is currently pressed (default is false).
 */
function setCells(latticeArray, mouseX, mouseY, mouseDown = false) {
  let neoLatticeArray = latticeArray;
  if (latticeArray.length == 1) {
    for (let i = 0; i < latticeArray[0].length; i++) {
      if (latticeArray[0][i].insideCell(mouseX, mouseY)) {
        if (!mouseDown) {
          neoLatticeArray[0][i].flipColor();
        } else {
          neoLatticeArray[0][i].setColor(1);
        }
        if (
          getSetup() &&
          latticeArray[0][i].getColor() == 1 &&
          !tempOrder.includes(i)
        ) {
          for (let j = 0; j < tempOrder.length; j++) {
            if (tempOrder[j] == -1) {
              tempOrder[j] = i;
              latticeArray[0][i].setNumber(j);
              break;
            }
          }
        } else if (getSetup() && !mouseDown) {
          for (let j = 0; j < tempOrder.length; j++) {
            if (tempOrder[j] == i) {
              tempOrder[j] = -1;
              latticeArray[0][i].setNumber(-2);
              break;
            }
          }
        }
      }

      neoLatticeArray[0][i].drawCell(ctx);
      alterLatticeArray(neoLatticeArray);
    }
  }
}

/**
 * Calculates the mouse position relative to the canvas, considering padding, border, and CSS scaling.
 *
 * This function returns the mouse coordinates in the canvas' coordinate system, accounting for potential differences
 * in CSS styling (like padding, border, and scaling) and ensuring pixel-perfect accuracy for user interactions.
 *
 * @param {MouseEvent} event - The mouse event object, which provides the clientX and clientY coordinates of the mouse.
 * @returns {Array} - An array containing the x and y coordinates of the mouse within the canvas.
 */
function getMouseLocation(event) {
  let bounds = canvas.getBoundingClientRect();

  let cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue("width"));
  let cssHeight = parseFloat(
    getComputedStyle(canvas).getPropertyValue("height")
  );

  let borderWidth = parseInt(getComputedStyle(canvas).borderLeftWidth);

  let paddingLeft = parseFloat(getComputedStyle(canvas).paddingLeft);
  let paddingTop = parseFloat(getComputedStyle(canvas).paddingTop);

  let mouseX =
    ((event.clientX - bounds.left - paddingLeft - borderWidth) * canvas.width) /
    cssWidth;
  let mouseY =
    ((event.clientY - bounds.top - paddingTop - borderWidth) * canvas.height) /
    cssHeight;

  return [mouseX, mouseY];
}

/**
 * Iterates the lattice for a specified number of iterations.
 *
 * This function manages the iteration process, checking if the number of iterations exceeds the allowed limit.
 * It updates the lattice array by removing extra iterations and applies the new iteration count.
 * After each iteration, the lattice is updated and displayed.
 *
 * @param {number} currentIteration - The current iteration count before the function runs.
 * @param {number} newIterations - The number of new iterations to add during this call.
 * @returns {number} - Returns the updated iteration count after the function completes.
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
 * Stops the iteration process by setting the run flag to false.
 *
 * This function checks if the iteration process is currently running, and if so, it stops it by setting
 * the `run` variable to 0. This halts any continuous iteration until explicitly started again.
 *
 * @returns {void}
 */

function stopIterating() {
  if (run) {
    run = 0;
  }
}

// Handle when bound toggle buton is activated: Animate toggle button, display checkboxes, select first checkbox
export function toggleCheckbox() {
  checkboxes[0].checked = true;
  checkboxes[1].checked = false;
  clear(latticeArray, true);
}

/**
 * Handles the activation of the bound toggle button: animates the button, displays checkboxes, and selects the first checkbox.
 *
 * This function toggles the checkbox selection when the button is activated, ensuring that the first checkbox is checked
 * and the second checkbox is unchecked. It also clears the lattice array and resets the lattice state if necessary.
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
 * Handles the activation of the border toggle button, switching between the on and off states.
 *
 * This function toggles the position of the button to visually indicate whether the border is enabled or disabled.
 * It also logs the current state of the border (on or off) to the message queue.
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
 * Toggles the Start/Stop button's appearance and functionality based on the current state.
 *
 * This function checks if the button is currently in the "start" or "stop" state. If it is in the "start" state,
 * it changes the button to "stop", and if it is in the "stop" state, it switches back to "start". It also logs
 * the current state (starting or stopping iterations) to the message queue.
 *
 * @returns {void}
 */
function startStopToggle() {
  if (startStopButton.classList.contains("start_button") && run) {
    startStopButton.innerHTML = "Stop";
    startStopButton.classList.remove("start_button");
    startStopButton.classList.add("stop_button");
    makeLog("Starting Iterations", logCanvas, messageQueue);
  } else if (startStopButton.classList.contains("stop_button") && !run) {
    startStopButton.innerHTML = "Start";
    startStopButton.classList.remove("stop_button");
    startStopButton.classList.add("start_button");
    makeLog("Stopping Iterations", logCanvas, messageQueue);
  }
}

/**
 * Toggles the Clear/Reset button's label and logs the corresponding action.
 *
 * This function checks if the Clear/Reset button is currently labeled "Reset". If it is, the label is changed
 * to "Clear" and a log message for resetting the canvas is generated. If it is labeled "Clear", a log message
 * for clearing the canvas is generated instead.
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
 * Handles checkbox change events for boundary condition settings and ensures only one checkbox can be checked at a time.
 *
 * This function listens for changes on the boundary condition checkboxes. When a checkbox is checked, it unchecks the other checkbox
 * and sets the boundary condition accordingly. If the first checkbox is selected, the boundary condition is set to Periodic (1),
 * and if the second checkbox is selected, it is set to Null (0). It also stops the iterations before changing the condition and clears the canvas.
 *
 * @returns {void}
 */
checkboxes.forEach(function (checkbox) {
  checkboxes[0].checked = true;
  checkbox.addEventListener("change", function () {
    stopIterating();
    if (this.checked) {
      checkboxes.forEach(function (otherCheckbox) {
        if (otherCheckbox != checkbox) {
          otherCheckbox.checked = false;
        }
      });
      if (checkboxes[0].checked) {
        alterBoundaryCon(1);
        makeLog("Periodic Boundary Set", logCanvas, messageQueue);
        clear(latticeArray, true);
      } else {
        alterBoundaryCon(0);
        makeLog("Null Boundary Set", logCanvas, messageQueue);
        clear(latticeArray, true);
      }
    } else {
      this.checked = true;
    }
  });
});

/**
 * Adds an error message to the log with a red color indicator.
 *
 * This function creates a log message with the given error message, sets its color to red,
 * and then adds it to the message queue. The log is then displayed on the log canvas.
 *
 * @param {string} errorMessage - The error message to be logged.
 * @param {HTMLElement} logCanvas - The HTML element representing the log canvas where the message will be displayed.
 * @param {Array} messageQueue - The queue that holds the log messages to be displayed.
 * @returns {void}
 */
function makeError(errorMessage, logCanvas, messageQueue) {
  let tempLog = new logMessage(errorMessage, "red", logCanvas);
  messageQueue.unshift(tempLog);
  displayLog(messageQueue, logCanvas);
}

/**
 * Adds a log message to the message log with a black color indicator.
 *
 * This function creates a log message with the provided message, sets its color to black,
 * and adds it to the message queue. The log is then displayed on the log canvas.
 *
 * @param {string} errorMessage - The log message to be displayed.
 * @param {HTMLElement} logCanvas - The HTML element representing the log canvas where the message will be shown.
 * @param {Array} messageQueue - The queue that holds the log messages to be displayed.
 * @returns {void}
 */
function makeLog(errorMessage, logCanvas, messageQueue) {
  let tempLog = new logMessage(errorMessage, "black", logCanvas);
  messageQueue.unshift(tempLog);
  displayLog(messageQueue, logCanvas);
}

/**
 * Outputs the correct elements of the message log to the canvas.
 *
 * This function clears the canvas using a dummy message and then displays all messages
 * in the message queue on the log canvas by iterating through the queue and calling
 * the display method on each log message.
 *
 * @param {Array} messageQueue - The queue holding the log messages to be displayed.
 * @param {HTMLElement} logCanvas - The HTML element representing the log canvas where the messages will be shown.
 * @returns {void}
 */
function displayLog(messageQueue, logCanvas) {
  let dummyMessage = new logMessage(
    "God Bless Ronald Reagan",
    "red",
    logCanvas
  );
  dummyMessage.clearCanvas();
  for (let i = 0; i < messageQueue.length; i++) {
    messageQueue[i].displayMessage(i);
  }
}

/**
 * Handles the download of the canvas content as a PDF when the download button is clicked.
 *
 * This function extracts the image data from the canvas, calculates the correct aspect ratio for both the canvas
 * and the PDF, and adjusts the image size to fit the PDF page. It then centers the image on the page and saves the
 * PDF with a filename that includes the number of iterations, rule number, and lattice size.
 * Afterward, a log message is added to the message queue indicating that the canvas has been downloaded.
 *
 * @param {MouseEvent} event - The event triggered when the download button is clicked.
 * @returns {void}
 */
downloadPDFButton.addEventListener("click", function () {
  let imgData = canvas.toDataURL("image/png");
  let pdf = new jsPDF("p", "pt", [canvas.width, canvas.height]);
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

  pdf.save(
    "SequentialWNN" +
      "I" +
      numOfIterations +
      "R" +
      ruleNum +
      "L" +
      latSize +
      ".pdf"
  );
  makeLog("Downloaded Canvas", logCanvas, messageQueue);
});

/**
 * Captures the canvas content as a PNG and downloads it when the 'Download PNG' button is clicked.
 *
 * This function retrieves the image data from the canvas in PNG format, creates an anchor element,
 * sets the download URL to the image data, and automatically triggers the download by simulating a click.
 * The file is saved with a filename that includes the number of iterations, rule number, and lattice size.
 * After the download, a log message is added to the message queue indicating that the canvas has been downloaded.
 *
 * @param {MouseEvent} event - The event triggered when the 'Download PNG' button is clicked.
 * @returns {void}
 */
downloadPNGButton.addEventListener("click", function () {
  let image = canvas.toDataURL();
  let link = document.createElement("a");
  link.href = image;
  link.download =
    "SequentialWNN" +
    "I" +
    numOfIterations +
    "R" +
    ruleNum +
    "L" +
    latSize +
    ".png";
  link.click();
  makeLog("Downloaded Canvas", logCanvas, messageQueue);
});

/**
 * Toggles the visibility of the options window when the options button is clicked.
 *
 * This function checks the current display state of the options window. If the window is visible,
 * it hides the window by setting the `display` style to "none". If the window is hidden,
 * it makes the window visible by setting the `display` style to "block".
 * This allows the user to open or close the options window using the options button.
 *
 * @param {MouseEvent} event - The event triggered when the options button is clicked.
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
 * Closes the options window when the close button (x) in the top right is clicked.
 *
 * This function sets the `display` style of the options window to "none",
 * effectively hiding it when the close button is clicked.
 * It ensures that the options window is closed by the user interaction with the close button.
 *
 * @param {MouseEvent} event - The event triggered when the close button is clicked.
 * @returns {void}
 */
closeOptions.addEventListener("click", function () {
  optionsWindow.style.display = "none";
});

/**
 * Updates the current iteration speed value and sets the delay based on the slider value.
 *
 * This function updates the displayed iteration speed value whenever the slider is dragged,
 * and adjusts the iteration delay based on the new slider value. The `setDelay` function
 * is called to apply the updated speed.
 *
 * @param {InputEvent} event - The event triggered when the slider value changes.
 * @returns {void}
 */
iterationSpeedSlider.oninput = function () {
  iterationSpeedValue.innerHTML = this.value;
  setDelay(this.value);
};

/**
 * Debounces a function call to ensure it is only triggered after a specified delay.
 *
 * This function ensures that the `callback` function is only called once after a specified
 * delay (25ms) has passed since the last invocation. It clears any previous timeouts
 * to prevent multiple rapid calls to the callback within a short time span.
 *
 * @param {Function} callback - The function to be debounced, which will be executed after the delay.
 * @returns {Function} - A debounced version of the callback function that accepts an event object.
 */
function debounce(callback) {
  let timeoutId;

  return function (event) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(event);
    }, 25);
  };
}

/**
 * A short debounce function for sliding events to update a temporary array before the next cell can be clicked.
 *
 * This function ensures that the `callback` is executed only after a small delay (5ms) has passed
 * since the last event, allowing the temporary array to be updated without firing too many function calls
 * in quick succession during sliding actions.
 *
 * @param {Function} callback - The function to be debounced, executed after the short delay.
 * @returns {Function} - A debounced version of the callback function that accepts an event object.
 */
function shortDebounce(callback) {
  let timeoutId;

  return function (event) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(event);
    }, 5);
  };
}

/* Initialize toggle buttons to x position 0px to enable x translation in functions */
iterationToggle.style.transform = "translateX(0px)";
borderToggle.style.transform = "translateX(0px)";
iterationSpeedValue.innerHTML = 750;
outputIteration.innerHTML = "Iteration Count: 0";

activateSetup();
