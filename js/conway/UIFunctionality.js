/**
 * UIFunctionality.js
 *
 * Summary:
 *   This script handles all user interface functionality for the Game of Life simulation.
 *   It processes button clicks, user inputs, mouse actions, and updates to the lattice and cell states.
 *   The script also manages iterations, simulation modifications, and communicates with utility files.
 *
 * Features:
 *   - Manages user interactions with the simulation, such as button clicks and mouse actions.
 *   - Updates the lattice and cell configurations in response to UI changes.
 *   - Controls the flow of iterations and updates the display.
 *   - Interfaces with other modules to modify simulation parameters.
 *
 * Functions:
 *   - inLattice(xLoc, yLoc): Checks if the given coordinates are within the bounds of the lattice.
 *   - startStopToggle(): Toggles the simulation between running and stopped.
 *   - alterCell(cell, scale, mouseY, mouseX): Alters a specific cell based on the scaling factor and mouse position.
 *   - setDelay(newDelay): Sets a new delay for the iteration process.
 *   - getMouseLocation(event): Calculates the mouse position within the canvas, adjusting for canvas padding, borders, and scaling.
 *   - continouslyIterate(): Continuously runs the iteration process, updating the simulation and redrawing the lattice.
 *   - debounce(callback): Limits the frequency of function calls, typically used for handling UI input events.
 *   - reset(): Resets the lattice to its initial state and updates the simulation.
 *   - updateOutput(increment = false): Updates the iteration count display on the HTML page. Optionally increments the iteration count.
 *   - redrawLattice(xOffset = 0, yOffset = 0): Redraws the entire lattice array on the canvas, adjusting for offsets.
 *   - alterLattice(scale, mouseY = canvas.height / 2, mouseX = canvas.width / 2): Alters the lattice based on the scaling factor and mouse position.
 *   - saveReset(): Saves the current lattice state for future resets.
 *   - clear(): Clears the lattice, resets the iteration count, and updates the grid display.
 *
 * Dependencies:
 *   - latticeArray, recountNeighbors, visBounds from './generateLattice.js'
 *   - createVis, visLatticeArray from './generateLattice.js'
 *   - displayLattice from './displayLattice.js'
 *   - resetLattice from './generateLattice.js'
 *   - zoomSlider, zoomValue from './UIFunctionality.js'
 *
 * Authors:
 *   - Kyle Tranfaglia
 *   - Timmy McKirgan
 *   - Dustin O'Brien
 */

/* Import utility and variables from other JS files */
import { canvas, ctx, displayLattice } from "./displayLattice.js";
import {
  visLatticeArray,
  visBounds,
  latticeArray,
  iterate,
  createVisInit,
  boundaryCollide,
  recountNeighbors,
  changeNeighbor,
} from "./generateLattice.js";
import { cell } from "./cellClass.js";
import {
  build101,
  build295,
  build119,
  build1234,
  buildGlider,
  setLattice,
  buildGtoG,
  build60P,
  buildAK94,
  buildTrigger,
  buildSnail,
  buildTub,
} from "./presets.js";

/* Global constants connecting HTML buttons to JS by ID to impliment functionality */

/**
 * @type {HTMLElement}
 * @description Represents the button used to start or stop the simulation.
 */
const startStopButton = document.getElementById("startStopButton");

/**
 * @type {HTMLElement}
 * @description Represents the button used to iterate the simulation by one step.
 */
const iterateButton = document.getElementById("iterateButton");

/**
 * @type {HTMLElement}
 * @description Represents the button used to clear or reset the simulation grid.
 */
const clearResetButton = document.getElementById("clearResetButton");

/**
 * @type {HTMLElement}
 * @description Represents the button used to open the library of preset patterns.
 */
const libraryButton = document.getElementById("libraryButton");

/**
 * @type {HTMLElement}
 * @description Represents the button used to display information about the simulation or project.
 */
const aboutButton = document.getElementById("aboutButton");

/* Connect sliders */
/**
 * @type {HTMLElement}
 * @description Represents the slider used to control the iteration speed of the simulation.
 */
const iterationSpeedSlider = document.getElementById("iterationSpeedSlider");

/**
 * @type {HTMLElement}
 * @description Represents the display element showing the current value of the iteration speed.
 */
const iterationSpeedValue = document.getElementById("iterationSpeedValue");

/**
 * @type {HTMLElement}
 * @description Represents the slider used to control the zoom level of the simulation grid.
 */
const zoomSlider = document.getElementById("zoomSlider");

/**
 * @type {HTMLElement}
 * @description Represents the display element showing the current value of the zoom level.
 */
const zoomValue = document.getElementById("zoomValue");

/* Connect Windows */
/**
 * @type {HTMLElement}
 * @description Represents the container element for the "About" window.
 */
const aboutWindow = document.getElementById("aboutContainer");
/**
 * @type {HTMLElement}
 * @description Represents the close button for the "About" window, used to trigger window closure.
 */
const closeAbout = document.querySelector("#aboutContent .close");
/**
 * @type {HTMLElement}
 * @description Represents the container element for the "Library" window.
 */
const libraryWindow = document.getElementById("libraryContainer");
/**
 * @type {HTMLElement}
 * @description Represents the close button for the "Library" window, used to trigger window closure.
 */
const closeLibrary = document.querySelector("#libraryContent .close");

/* Connect Library Buttons */
/**
 * @type {HTMLElement}
 * @description Represents the button for the "101" pattern in the library.
 */
const library101 = document.getElementById("library101");

/**
 * @type {HTMLElement}
 * @description Represents the button for the "119P4H1V0" pattern in the library.
 */
const library119P4H1V0 = document.getElementById("library119P4H1V0");

/**
 * @type {HTMLElement}
 * @description Represents the button for the "1234" pattern in the library.
 */
const library1234 = document.getElementById("library1234");

/**
 * @type {HTMLElement}
 * @description Represents the button for the "295P5H1V1" pattern in the library.
 */
const library295P5H1V1 = document.getElementById("library295P5H1V1");

/**
 * @type {HTMLElement}
 * @description Represents the button for the "4gto5gReaction" pattern in the library.
 */
const library4gto5gReaction = document.getElementById("library4gto5gReaction");

/**
 * @type {HTMLElement}
 * @description Represents the button for the "60P312" pattern in the library.
 */
const library60P312 = document.getElementById("library60P312");

/**
 * @type {HTMLElement}
 * @description Represents the button for the "AK94Gun" pattern in the library.
 */
const libraryAK94Gun = document.getElementById("libraryAK94Gun");

/**
 * @type {HTMLElement}
 * @description Represents the button for the "Trigger" pattern in the library.
 */
const libraryTrigger = document.getElementById("libraryTrigger");

/**
 * @type {HTMLElement}
 * @description Represents the button for the "Snail" pattern in the library.
 */
const librarySnail = document.getElementById("librarySnail");

/**
 * @type {HTMLElement}
 * @description Represents the button for the "Tubstretcher" pattern in the library.
 */
const libraryTubstretcher = document.getElementById("libraryTubstretcher");

/**
 * Array of library button elements and their corresponding build functions.
 * Each object in the array contains a button element and the build function
 * that should be executed when the button is clicked.
 *
 * @type {Array<{element: HTMLElement, build: Function}>}
 */
const libraries = [
  { element: library101, build: build101 },
  { element: library119P4H1V0, build: build119 },
  { element: library1234, build: build1234 },
  { element: library295P5H1V1, build: build295 },
  { element: library4gto5gReaction, build: buildGtoG },
  { element: library60P312, build: build60P },
  { element: libraryAK94Gun, build: buildAK94 },
  { element: librarySnail, build: buildSnail },
  { element: libraryTrigger, build: buildTrigger },
  { element: libraryTubstretcher, build: buildTub },
];

/**
 * @type {HTMLElement}
 * @description Represents the HTML element that displays the current iteration output.
 */
let outputIteration = document.getElementById("iterationOutput");

/* Global variables for iteration */
/** @description Keeps track of whether the simulation is running or not. @type {number} */
let run = 0;

/** @description Represents the delay time between each iteration. @type {number} */
let currentDelay = 125;

/** @description Tracks the number of iterations performed. @type {number} */
let iterationCount = 0;

/** @description Indicates whether the mouse is being held down for scribbling on the canvas. @type {boolean} */
let scribble = false;

/** @description Keeps track of whether the Shift key is being held down for shifting the canvas. @type {boolean} */
let shift = false;

/** @description Stores the starting X position of the cursor when dragging. @type {number} */
let mouseXPos = 0;

/** @description Stores the starting Y position of the cursor when dragging. @type {number} */
let mouseYPos = 0;

/** @description Stores the ending X position of the cursor when dragging. @type {number} */
let shiftX = 0;

/** @description Stores the ending Y position of the cursor when dragging. @type {number} */
let shiftY = 0;

/** @description Sets the displayed default iteration speed value. @type {number} */
iterationSpeedValue.innerHTML = 125;

/** @description Sets the displayed default zoom value. @type {number} */
zoomValue.innerHTML = 75;

/** @description Sets the default zoom value. @type {number} */
zoomValue.value = 75;

/**
 * @description Creates an array holding values in reverse order from 100 to 1.
 * @type {number[]}
 */
let reverse = new Array();
for (let i = 100; i > 0; i--) {
  reverse.push(i);
}

/**
 * @description Holds the current reset state. If not equal to 1, the lattice will be cleared.
 * @type {number}
 */
let currentReset = 1;

/**
 * @description Holds the lattice state to reset to.
 * @type {Array}
 */
let resetLattice = new Array();

/**
 * @description Stops all functionality from working until the canvas is fully loaded.
 * @event document#DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", function () {
  alterLattice(100 / reverse[zoomValue.value - 1]);
  redrawLattice();
  buildGlider();

  /* Handle button clicks for all primary toolbar buttons */

  /**
   * Starts or stops continuous iterations based on the button click event.
   *
   * This function listens for a click event on the `startStopButton`. When clicked, it will toggle
   * between starting and stopping continuous iterations of the cellular automaton. If iterations are
   * already running, it will stop them; if they are not running, it will start the iteration process.
   *
   * It ensures that boundary collisions are checked before starting, and also toggles between the
   * start and stop states. The `run` variable keeps track of the state of the iteration process (running or stopped).
   *
   * @function
   * @listens click
   * @param {Event} event - The click event triggered by the `startStopButton`.
   *
   * @output {void} No return value.
   * - Triggers continuous iterations when `run` is toggled to true.
   */
  startStopButton.addEventListener(
    "click",
    debounce(function () {
      if (!boundaryCollide() || run) {
        clearResetToggle(true);
        startStopToggle();
        run = !run;
        if (run) {
          continouslyIterate();
        }
      }
    })
  );

  /**
   * Iterates the lattice by one timestep when the iterate button is clicked.
   *
   * This function listens for a click event on the `iterateButton`. When clicked, it will trigger
   * a single iteration of the lattice if continuous iterations are not running and no boundary collisions exist.
   * The `iterate()` function is called to perform the iteration, and the canvas is updated to reflect the new lattice state.
   * The output of the current state is updated as well, and the canvas is cleared before redrawing the lattice.
   *
   * @function
   * @listens click
   * @param {Event} event - The click event triggered by the `iterateButton`.
   *
   * @output {void} No return value.
   * - Iterates the lattice once.
   * - Updates the output display and canvas with the new lattice state.
   */
  iterateButton.addEventListener(
    "click",
    debounce(function () {
      if (!run && !boundaryCollide()) {
        clearResetToggle(true);
        iterate();
        updateOutput(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        displayLattice(visLatticeArray);
      }
    })
  );

  /**
   * Clears the canvas or resets it to the initial state based on the current mode.
   *
   * This function listens for a click event on the `clearResetButton`. If the button is in "clear" mode (indicated by
   * `currentReset` being 1), it will clear the canvas. If the button is in "reset" mode (indicated by `currentReset`
   * not being 1), it will stop any ongoing iterations, reset the lattice to its initial state, and update the button's
   * mode accordingly.
   *
   * @function
   * @listens click
   * @param {Event} event - The click event triggered by the `clearResetButton`.
   *
   * @output {void} No return value.
   * - Clears the canvas or resets it to the initial state.
   * - Stops any ongoing iterations if needed and updates the button's state.
   */
  clearResetButton.addEventListener(
    "click",
    debounce(function () {
      if (currentReset == 1) {
        clear();
      } else {
        if (run) {
          startStopToggle();
          run = false;
        } else {
          clearResetToggle(false);
        }
        reset();
      }
    })
  );

  /**
   * Listens for the release of the Shift key and stops canvas dragging if the key is released.
   *
   * This function listens for the `keyup` event and checks if the released key is the Shift key. If the Shift key is
   * released, the function sets the `shift` boolean to `false`, stopping the ability to click and drag across the canvas.
   * It also resets the local shift variables (`shiftX` and `shiftY`) to 0 if dragging was in progress.
   *
   * @function
   * @listens keyup
   * @param {Event} event - The `keyup` event triggered when a key is released.
   * - Checks if the Shift key was released.
   *
   * @output {void} No return value.
   * - Resets the `shift` boolean and shift position variables (`shiftX`, `shiftY`) when the Shift key is released.
   */
  document.addEventListener("keyup", function (event) {
    if (event.key == "Shift") {
      setTimeout(function () {
        if (shift) {
          shift = false;
          shiftX = 0;
          shiftY = 0;
        }
      }, 10);
    }
  });

  /**
   * Stops the scribble action and resets shift position variables when the mouse leaves the canvas.
   *
   * This function listens for the `mouseleave` event on the canvas. When the mouse leaves the canvas, it checks if the
   * `scribble` boolean is true (indicating the mouse was being held down for scribbling). If true, the function sets the
   * `scribble` boolean to `false` and resets the local shift position variables (`shiftX`, `shiftY`) to 0, stopping any
   * active scribbling and dragging behavior.
   *
   * @function
   * @listens mouseleave
   * @output {void} No return value.
   * - Resets the `scribble` boolean and local shift position variables (`shiftX`, `shiftY`) when the mouse leaves the canvas.
   */
  canvas.addEventListener("mouseleave", function () {
    setTimeout(function () {
      if (scribble) {
        scribble = false;
        shiftX = 0;
        shiftY = 0;
      }
    }, 10);
  });

  /**
   * Handles keyboard shortcuts for controlling the application.
   *
   * This function listens for `keydown` events on the document, specifically for key presses while holding down the `Shift`
   * or `Alt` keys. When a key is pressed, it checks the key combination and performs an associated action (e.g., triggering
   * button clicks, focusing sliders, or showing/hiding elements).
   *
   * - **Shift Key**: If the shift key is held down and the `scribble` action is active, it captures the mouse position.
   * - **Alt Key**: When the `Alt` key is pressed, a specific key press performs the corresponding button action (such as
   *   starting/stopping iterations, opening the library, or focusing sliders).
   * - **Enter Key**: If the `Enter` key is pressed and no other modifiers are active, the function triggers form submission.
   *
   * @function
   * @listens keydown
   * @output {void} No return value.
   * - Updates `shift` status and tracks mouse position if needed.
   * - Triggers actions based on specific key presses (e.g., button clicks, focusing inputs).
   */
  document.addEventListener("keydown", function (event) {
    if (event.shiftKey) {
      setTimeout(function () {
        if (!shift) {
          shift = true;
          if (scribble && shift) {
            [mouseXPos, mouseYPos] = getMouseLocation(event);
          }
        }
      }, 10);
    }
    if (event.altKey) {
      switch (true) {
        case event.key == "Enter":
          startStopButton.click();
          break;
        case event.key == "i":
          iterateButton.click();
          break;
        case event.key == "c":
          clearButton.click();
          break;
        case event.key == "l":
          libraryButton.click();
          break;
        case event.key == "a":
          aboutButton.click();
          break;
        case event.key == "y":
          iterationSpeedSlider.focus();
          break;
        case event.key == "z":
          zoomSlider.focus();
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
      iterationSubmit.click();
    }
  });

  /**
   * Handles mouse down events for drawing or interacting with the lattice on the canvas.
   *
   * This function listens for `mousedown` events on the canvas, checking if the mouse is clicked and performs actions based
   * on the current state of the `shift` key. If `shift` is false, it allows the user to draw on the canvas by flipping the
   * state of cells in the lattice array and updating their visual representation.
   *
   * - **Shift Key**: When `shift` is not active, the user can draw by clicking on cells in the lattice and flipping their state.
   * - **Mouse Location**: The function determines the location of the mouse click on the canvas and checks if it intersects with
   *   any lattice cells. If a cell is clicked, it flips the color of the cell and updates the lattice's state.
   * - **Neighbor Updates**: The lattice state is updated based on the flipped cell, affecting neighboring cells by changing their
   *   neighbors' states accordingly.
   *
   * @function
   * @listens mousedown
   * @param {MouseEvent} event - The mouse event triggered by the user's click.
   * @output {void} No return value.
   * - Updates the lattice by flipping cell states and redrawing them.
   * - Changes the state of neighboring cells in the lattice.
   */
  canvas.addEventListener("mousedown", function (event) {
    let mouseX, mouseY;
    [mouseX, mouseY] = getMouseLocation(event);
    if (!shift) {
      for (let i = 0; i < visLatticeArray.length; i++) {
        for (let j = 0; j < visLatticeArray[i].length; j++) {
          if (visLatticeArray[i][j].insideCell(mouseX, mouseY)) {
            visLatticeArray[i][j].flipColor(ctx);
            visLatticeArray[i][j].drawCell(ctx, true);
            if (latticeArray[i + visBounds[1]][j + visBounds[0]] == 1) {
              changeNeighbor(j + visBounds[0], i + visBounds[1], -1);
            } else {
              changeNeighbor(j + visBounds[0], i + visBounds[1], 1);
            }
            latticeArray[i + visBounds[1]][j + visBounds[0]] =
              !latticeArray[i + visBounds[1]][j + visBounds[0]];
          }
        }
      }
    }
  });

  /**
   * Handles mouse movement events on the canvas, enabling either shifting the lattice or drawing on the canvas.
   *
   * This function listens for `mousemove` events and performs actions based on the current state of the `scribble` and `shift` keys.
   * - **Shift + Scribble**: When both `shift` and `scribble` are active, the function will shift the lattice by updating its position on the canvas based on the mouse movement.
   * - **Scribble**: If only `scribble` is active, the function allows the user to "draw" on the canvas by flipping the state of lattice cells under the cursor and updating their visual representation.
   *
   * @function
   * @listens mousemove
   * @param {MouseEvent} event - The mouse event triggered by the user's movement.
   * @output {void} No return value.
   * - Updates the lattice by flipping cell states and redrawing them.
   * - Shifts the lattice across the canvas when `shift` is held down.
   */
  canvas.addEventListener("mousemove", function (event) {
    let mouseX, mouseY;
    [mouseX, mouseY] = getMouseLocation(event);
    if (scribble && shift) {
      let offSetX = mouseX - mouseXPos;
      let offsetY = mouseY - mouseYPos;
      redrawLattice(offSetX, offsetY);
    } else if (scribble) {
      for (let i = 0; i < visLatticeArray.length; i++) {
        for (let j = 0; j < visLatticeArray[i].length; j++) {
          if (
            visLatticeArray[i][j].insideCell(mouseX, mouseY) &&
            visLatticeArray[i][j].getColor() == 0
          ) {
            visLatticeArray[i][j].flipColor(ctx);
            visLatticeArray[i][j].drawCell(ctx, true);
            if (latticeArray[i + visBounds[1]][j + visBounds[0]] == 1) {
              changeNeighbor(j + visBounds[0], i + visBounds[1], -1);
            } else {
              changeNeighbor(j + visBounds[0], i + visBounds[1], 1);
            }
            latticeArray[i + visBounds[1]][j + visBounds[0]] =
              !latticeArray[i + visBounds[1]][j + visBounds[0]];
          }
        }
      }
    }
  });

  /**
   * Handles the mouse down event on the canvas, enabling scribbling or setting up the canvas for shifting.
   *
   * This function listens for a `mousedown` event, which occurs when the user presses the mouse button.
   * - **Scribble Mode**: If the user clicks the canvas and scribble mode is not already active, it is enabled. This allows the user to draw on the canvas.
   * - **Shift + Scribble**: If both `shift` and `scribble` are active, the function records the initial mouse location to enable accurate shifting of the canvas during subsequent mouse movements.
   * - **Disable Text Selection**: The function also prevents text selection globally while the mouse button is down to improve user interaction with the canvas.
   *
   * @function
   * @listens mousedown
   * @param {MouseEvent} event - The mouse event triggered by the user's click.
   * @output {void} No return value.
   * - Activates scribble mode if it isn't already active.
   * - Sets the initial mouse position if `shift` and `scribble` are both active.
   */
  canvas.addEventListener("mousedown", function (event) {
    document.body.style.userSelect = "none";
    setTimeout(function () {
      if (!scribble) {
        scribble = true;
        if (scribble && shift) {
          [mouseXPos, mouseYPos] = getMouseLocation(event);
        }
      }
    }, 10);
  });

  /**
   * Handles the mouse up event on the canvas, disabling scribbling and resetting shift variables.
   *
   * This function listens for a `mouseup` event, which occurs when the user releases the mouse button.
   * - **Disable Scribble Mode**: When the mouse button is released, scribble mode is disabled (if it was previously active).
   * - **Reset Shift Variables**: The function also resets the `shiftX` and `shiftY` variables to `0` to stop the shift action.
   * - **Enable Text Selection**: The text selection is re-enabled globally once the mouse button is released, allowing the user to select text again.
   *
   * @function
   * @listens mouseup
   * @param {MouseEvent} event - The mouse event triggered by the user's mouse button release.
   * @output {void} No return value.
   * - Disables scribble mode and resets shift variables.
   * - Enables text selection globally.
   */
  canvas.addEventListener("mouseup", function () {
    document.body.style.userSelect = "auto";
    setTimeout(function () {
      if (scribble) {
        scribble = false;
        shiftX = 0;
        shiftY = 0;
      }
    }, 10);
  });

  /**
   * Handles mouse wheel scroll events to zoom in or out on the canvas.
   *
   * This function listens for the `wheel` event on the canvas. It calculates the mouse position, determines if it is inside the lattice,
   * and adjusts the zoom level accordingly. The zoom level is controlled using the `zoomSlider`, and the lattice is either zoomed in or out
   * based on the mouse wheel scroll direction.
   *
   * - **Zooming**: The zoom level is adjusted based on the mouse wheel scroll. Zoom is limited between values 1 and 100.
   * - **Zoom Center**: The zoom is applied around the point where the mouse cursor is located, allowing for dynamic zooming.
   * - **Lattice Adjustment**: After zooming, the lattice is either resized or redrawn depending on the zoom level.
   * - **Zoom Reset**: When the zoom level reaches its minimum (1), the lattice is reset to its initial state.
   *
   * @function
   * @listens wheel
   * @param {WheelEvent} event - The wheel event triggered by mouse scroll, containing details like the scroll direction and amount.
   * @output {void} No return value.
   * - Adjusts the zoom level and modifies the lattice display accordingly.
   */
  canvas.addEventListener(
    "wheel",
    function (event) {
      let mouseX, mouseY;
      [mouseX, mouseY] = getMouseLocation(event);
      let testLoc = inLattice(mouseX, mouseY);
      if (testLoc) {
        let delta = event.deltaY;
        let change = false;
        let currentScale = 100 / reverse[zoomSlider.value - 1];
        if (delta < 0 && zoomSlider.value < 100) {
          zoomSlider.value++;
          zoomValue.innerHTML++;
          change = true;
        } else if (delta > 0 && zoomSlider.value > 1) {
          zoomSlider.value--;
          zoomValue.innerHTML--;
          change = true;
        }
        if (change) {
          let newScale = 100 / reverse[zoomSlider.value - 1];
          let scale = newScale / currentScale;
          if (scale != 1) {
            alterLattice(scale, mouseY, mouseX);
          }
          redrawLattice();
        } else if (zoomSlider.value == 1) {
          createVisInit();
          redrawLattice();
        }
        event.preventDefault();
      }
    },
    false
  );

  /**
   * Loops through each library button and adds a click event listener.
   * When a button is clicked, the corresponding build function is called,
   * and the library is closed by triggering a click on the closeLibrary button.
   *
   * @function
   * @param {Object} library - An object containing the button element and its build function.
   * @param {HTMLElement} library.element - The button element that triggers the event.
   * @param {Function} library.build - The function to be executed when the button is clicked.
   */
  libraries.forEach(({ element, build }) => {
    element.addEventListener("click", () => {
      build();
      closeLibrary.click();
    });
  });
});

/**
 * Checks if a given point (xLoc, yLoc) is inside the visible lattice area.
 * The lattice area is defined by the bounds of the first and last cells
 * in the `visLatticeArray`.
 *
 * @param {number} xLoc - The x-coordinate of the point to check.
 * @param {number} yLoc - The y-coordinate of the point to check.
 *
 * @returns {boolean} - Returns `true` if the point is inside the lattice area,
 *                      `false` otherwise.
 */
function inLattice(xLoc, yLoc) {
  let xMin = visLatticeArray[0][0].getXLoc();
  let xMax =
    visLatticeArray[0][visLatticeArray[0].length - 1].getXLoc() +
    visLatticeArray[0][visLatticeArray[0].length - 1].getWidth();
  let yMin = visLatticeArray[0][0].getYLoc();
  let yMax =
    visLatticeArray[visLatticeArray.length - 1][0].getYLoc() +
    visLatticeArray[visLatticeArray.length - 1][0].getHeight();
  if (xLoc >= xMin && xLoc <= xMax && yLoc >= yMin && yLoc <= yMax) {
    return true;
  } else {
    return false;
  }
}

/**
 * Toggles the state of the Start/Stop button in the user interface.
 * Changes the button's text and class based on whether the process is running or stopped.
 *
 * If the process is not running, it switches the button to "Stop" state.
 * If the process is running, it switches the button to "Start" state.
 *
 * @returns {void} - This function does not return any value.
 */
function startStopToggle() {
  if (startStopButton.classList.contains("start_button") && !run) {
    startStopButton.innerHTML = "Stop";
    startStopButton.classList.remove("start_button");
    startStopButton.classList.add("stop_button");
  } else {
    startStopButton.innerHTML = "Start";
    startStopButton.classList.remove("stop_button");
    startStopButton.classList.add("start_button");
  }
}

/**
 * Toggles the state of the Clear/Reset button in the user interface.
 * Changes the button's text and updates the internal state based on the provided `reset` flag.
 *
 * If `reset` is true, the button text changes to "Reset" and the internal state is set to 0.
 * If `reset` is false, the button text changes to "Clear" and the internal state is set to 1.
 *
 * @param {boolean} reset - Determines whether to set the button to "Reset" or "Clear".
 * @returns {void} - This function does not return any value.
 */
function clearResetToggle(reset) {
  if (reset) {
    currentReset = 0;
    clearResetButton.innerHTML = "Reset";
  } else if (!reset) {
    currentReset = 1;
    clearResetButton.innerHTML = "Clear";
  }
}

/* Handle open and closing of about and library window */

/**
 * Event listener for the About button click event.
 * Displays the About window by setting its display style to "block" when the button is clicked.
 *
 * @returns {void} - This function does not return any value.
 */
aboutButton.addEventListener("click", function () {
  aboutWindow.style.display = "block";
});

/**
 * Event listener for the close button (x) in the top-right of the About window.
 * Hides the About window by setting its display style to "none" when the close button is clicked.
 *
 * @returns {void} - This function does not return any value.
 */
closeAbout.addEventListener("click", function () {
  aboutWindow.style.display = "none";
});

/**
 * Event listener for clicks anywhere on the window.
 * If the About window is clicked (outside the text frame), it will close by setting its display style to "none".
 *
 * @param {MouseEvent} event - The mouse event triggered when the user clicks anywhere on the window.
 * @returns {void} - This function does not return any value.
 */
window.addEventListener("click", function (event) {
  if (event.target == aboutWindow) {
    aboutWindow.style.display = "none";
  }
});

/**
 * Event listener for the library button click.
 * Displays the library window by setting its display style to "block".
 *
 * @returns {void} - This function does not return any value, but changes the display style of the library window.
 */
libraryButton.addEventListener("click", function () {
  libraryWindow.style.display = "block";
});

/**
 * Event listener for the close button (x) in the top right of the library window.
 * Hides the library window by setting its display style to "none".
 *
 * @returns {void} - This function does not return any value, but changes the display style of the library window.
 */
closeLibrary.addEventListener("click", function () {
  libraryWindow.style.display = "none";
});

/**
 * Event listener for clicking anywhere on the window.
 * Checks if the click target is the library window and hides it if so.
 *
 * @param {Event} event - The click event triggered by the user interaction.
 * @returns {void} - This function does not return any value, but modifies the display style of the library window.
 */
window.addEventListener("click", function (event) {
  if (event.target == libraryWindow) {
    libraryWindow.style.display = "none";
  }
});

/**
 * Event handler for updating the iteration speed slider value upon user interaction.
 * Updates the displayed value and sets the delay based on the current slider value.
 *
 * @param {Event} event - The input event triggered when the slider is adjusted.
 * @returns {void} - This function does not return any value, but it updates the UI and adjusts the iteration delay.
 */
iterationSpeedSlider.oninput = function () {
  iterationSpeedValue.innerHTML = this.value;
  setDelay(this.value);
};

/**
 * Alters the position and size of a given cell based on the mouse's position and a scaling factor.
 * The cell's position is adjusted relative to the mouse coordinates, and its width and height are scaled accordingly.
 *
 * @param {cell} cell - The cell to be altered.
 * @param {number} scale - The scaling factor to apply to the cell's size and position.
 * @param {number} mouseY - The Y-coordinate of the mouse (cursor) position.
 * @param {number} mouseX - The X-coordinate of the mouse (cursor) position.
 * @returns {void} - This function modifies the properties of the `cell` object directly, it does not return any value.
 */
function alterCell(cell, scale, mouseY, mouseX) {
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

/**
 * Updates the zoom level of the lattice when the zoom slider is adjusted.
 * It recalculates the scale based on the slider's value, reinitializes the visualization,
 * and redraws the lattice with the new zoom level.
 *
 * @listens input#zoomSlider - Triggers when the user drags the zoom slider.
 *
 * @this {HTMLInputElement} zoomSlider - The zoom slider DOM element.
 */
zoomSlider.oninput = function () {
  zoomValue.innerHTML = this.value;
  let scale = 100 / reverse[this.value - 1];
  createVisInit();
  if (scale != 1) {
    alterLattice(scale);
  }
  redrawLattice();
};

/**
 * Sets the delay value for the current operation.
 * This function updates the global delay setting used for controlling the speed of iterations.
 *
 * @param {number} newDelay - The new delay value to set, typically in milliseconds.
 * @returns {void} - This function modifies the `currentDelay` variable but does not return any value.
 */
function setDelay(newDelay) {
  currentDelay = newDelay;
}

/**
 * Calculates the mouse's position relative to the canvas, accounting for CSS styles, borders, and padding.
 * This function provides pixel-perfect mouse coordinates for interacting with the canvas elements.
 *
 * @param {MouseEvent} event - The mouse event object containing the mouse's current position.
 * @returns {number[]} An array containing the calculated X and Y coordinates of the mouse relative to the canvas.
 *    - The first value is the X-coordinate.
 *    - The second value is the Y-coordinate.
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
 * Continuously iterates the process at a specified delay, as long as certain conditions are met.
 * This function runs the iteration process in a loop, updating the output and redrawing the canvas,
 * while checking for boundary collisions and controlling the start/stop toggle.
 *
 * @returns {void} This function does not return any value. It modifies the program state by iterating and updating the canvas.
 */
function continouslyIterate() {
  if (run) {
    setTimeout(function () {
      if (run && !(shift && scribble) && !boundaryCollide()) {
        iterate();
        updateOutput(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redrawLattice();
      }
      if (!boundaryCollide()) {
        continouslyIterate();
      } else {
        startStopToggle();
        run = false;
      }
    }, currentDelay);
  }
}

/**
 * Creates a debounced version of a function that delays the invocation until after a specified amount of time
 * has passed since the last time the debounced function was invoked. This is useful for limiting the frequency
 * of expensive operations such as handling scroll or input events.
 *
 * @param {Function} callback - The function to be debounced. This function will be invoked after the specified delay.
 * @returns {Function} - A new function that can be called, but will invoke the original callback only after the delay.
 * @example
 * const debouncedFunction = debounce(myFunction);
 * element.addEventListener('scroll', debouncedFunction);
 */
function debounce(callback) {
  let timeoutId;

  return function (event) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(event);
    }, 100);
  };
}

/**
 * Resets the lattice to its initial state and updates the output display.
 * This function resets the lattice array to its default values and refreshes the output.
 *
 * @returns {void} - This function does not return any value. It directly modifies the lattice and output.
 * @example
 * reset();  */
function reset() {
  setLattice(resetLattice);
  updateOutput();
}

/**
 * Updates the iteration count displayed on the HTML page.
 * If the `increment` flag is true, the iteration count is increased by 1;
 * otherwise, it is reset to 0. The updated count is then displayed in the
 * corresponding HTML element.
 *
 * @param {boolean} [increment=false] - A flag to indicate whether to increment the iteration count
 *                                      (defaults to false, which resets the count).
 * @returns {void} - This function does not return any value. It modifies the `iterationCount`
 *                   and updates the displayed content in the HTML.
 * @example
 * updateOutput(true);   * updateOutput();       */
function updateOutput(increment = false) {
  if (increment) {
    iterationCount++;
  } else {
    iterationCount = 0;
  }
  outputIteration.innerHTML = "Iteration Count: " + iterationCount.toString();
}

/**
 * Redraws the entire lattice array on the canvas with optional offsets.
 * This function clears the current canvas, applies any provided offsets to
 * the lattice cells, and redraws them at their new positions. It ensures that
 * the lattice cells remain within the canvas bounds by constraining the
 * offsets.
 *
 * @param {number} [xOffset=0] - The horizontal offset to apply to the lattice cells.
 *                                Defaults to 0 if not provided.
 * @param {number} [yOffset=0] - The vertical offset to apply to the lattice cells.
 *                                Defaults to 0 if not provided.
 * @returns {void} - This function does not return any value. It directly modifies the
 *                   canvas by clearing it and redrawing the lattice with any offset.
 *
 * @example
 * redrawLattice(10, 20);   * redrawLattice();         */
export function redrawLattice(xOffset = 0, yOffset = 0) {
  let trueOffsetX = xOffset - shiftX;
  let trueOffsetY = yOffset - shiftY;
  if (trueOffsetX != 0 || trueOffsetY != 0) {
    let maxOffsetX =
      canvas.width -
      (visLatticeArray[0][visLatticeArray[0].length - 1].getXLoc() +
        visLatticeArray[0][visLatticeArray[0].length - 1].getWidth()) -
      5 * visLatticeArray[0][0].getWidth();
    let minOffsetX =
      -1 *
      (visLatticeArray[0][0].getXLoc() - 5 * visLatticeArray[0][0].getWidth());
    let maxOffsetY =
      canvas.height -
      (visLatticeArray[visLatticeArray.length - 1][0].getYLoc() +
        visLatticeArray[visLatticeArray.length - 1][0].getHeight()) -
      5 * visLatticeArray[0][0].getHeight();
    let minOffsetY =
      -1 *
      (visLatticeArray[0][0].getYLoc() - 5 * visLatticeArray[0][0].getHeight());

    if (trueOffsetX > 0) {
      if (trueOffsetX > minOffsetX) {
        trueOffsetX = minOffsetX;
      }
    } else {
      if (trueOffsetX < maxOffsetX) {
        trueOffsetX = maxOffsetX;
      }
    }
    if (trueOffsetY > 0) {
      if (trueOffsetY > minOffsetY) {
        trueOffsetY = minOffsetY;
      }
    } else {
      if (trueOffsetY < maxOffsetY) {
        trueOffsetY = maxOffsetY;
      }
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let offSetLat = visLatticeArray;
  for (let i = 0; i < visLatticeArray.length; i++) {
    for (let f = 0; f < visLatticeArray[i].length; f++) {
      if (trueOffsetX != 0 || trueOffsetY != 0) {
        let curCell = visLatticeArray[i][f];
        offSetLat[i][f] = new cell(
          curCell.getHeight(),
          curCell.getWidth(),
          curCell.getXLoc() + trueOffsetX,
          curCell.getYLoc() + trueOffsetY,
          curCell.getColor(),
          curCell.getBorder()
        );
      }
      offSetLat[i][f].drawCell(ctx);
    }
  }
  shiftX = xOffset;
  shiftY = yOffset;
}

/**
 * Alters the position and size of all cells in the lattice array based on a scaling factor and optional mouse coordinates.
 * This function loops through each cell in the lattice and adjusts its size and position relative to the given mouse
 * coordinates and scaling factor.
 *
 * @param {number} scale - The scaling factor to apply to the lattice cells. A value greater than 1 increases the size,
 *                          while a value less than 1 reduces the size.
 * @param {number} [mouseY=canvas.height / 2] - The Y-coordinate of the mouse position to center the scaling around.
 *                                               Defaults to the center of the canvas if not provided.
 * @param {number} [mouseX=canvas.width / 2] - The X-coordinate of the mouse position to center the scaling around.
 *                                               Defaults to the center of the canvas if not provided.
 * @returns {void} - This function modifies the properties of the lattice cells directly, it does not return any value.
 *
 * @example
 * alterLattice(1.5);                 * alterLattice(0.8, 200, 150);       */
export function alterLattice(
  scale,
  mouseY = canvas.height / 2,
  mouseX = canvas.width / 2
) {
  for (let i = 0; i < visLatticeArray.length; i++) {
    for (let j = 0; j < visLatticeArray[i].length; j++) {
      alterCell(visLatticeArray[i][j], scale, mouseY, mouseX);
    }
  }
}

/**
 * Saves the current state of the lattice array into a separate array for later resetting.
 * This function creates a deep copy of the `latticeArray` and stores it in the `resetLattice` variable.
 * It essentially captures the lattice's current configuration before any changes are made,
 * allowing the system to reset to this state later.
 *
 * @returns {void} - This function does not return any value. It modifies the `resetLattice` array by saving a deep copy
 *                   of the `latticeArray` into it.
 *
 * @example
 * saveReset();   */
export function saveReset() {
  resetLattice.length = 0;
  for (let i = 0; i < latticeArray.length; i++) {
    let tempRow = new Array();
    for (let j = 0; j < latticeArray[0].length; j++) {
      tempRow.push(latticeArray[i][j]);
    }
    resetLattice.push(tempRow);
  }
}

/**
 * Clears the lattice, resets the iteration count, and updates the visual representation of the grid.
 * This function resets all cells in the `latticeArray` to 0, recalculates the neighbors, and
 * reinitializes the lattice's visual representation. It also resets the zoom slider to 75 and
 * clears the canvas for a fresh display.
 *
 * @returns {void} - This function does not return any value. It modifies the `latticeArray`, updates the output display,
 *                   and refreshes the lattice visualization on the canvas.
 *
 * @example
 * clear();   */
export function clear() {
  updateOutput();
  for (let i = 0; i < latticeArray.length; i++) {
    for (let j = 0; j < latticeArray[0].length; j++) {
      latticeArray[i][j] = 0;
    }
  }
  recountNeighbors(true);
  createVisInit();
  alterLattice(100 / 26);
  redrawLattice();
  zoomSlider.value = 75;
  zoomValue.innerHTML = 75;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  displayLattice(visLatticeArray);
}

updateOutput(); // Display initial count of 0
export { iterationCount };
