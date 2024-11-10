/** 
 * displayLattice.js
 * 
 * Summary:
 *   This script is responsible for initializing and drawing the lattice grid on a canvas. It sets up the grid 
 *   structure, adapts the canvas size to the window dimensions, and allows for interaction with the lattice.
 * 
 * Features:
 *   - Dynamically adjusts the canvas size according to the window's dimensions.
 *   - Prepares the canvas context for drawing.
 *   - Renders the lattice grid based on the provided visual lattice array.
 * 
 * Functions:
 *   - initalCanvas: Initializes the canvas with the appropriate width and height based on the window's size.
 *   - displayLattice: Iterates through the visual lattice array and draws the lattice grid on the canvas.
 * 
 * Dependencies:
 *   - createVisInit: Initializes the lattice for visualization.
 *   - visLatticeArray: A 2D array representing the visual lattice, used for rendering on the canvas.
 * 
 * Authors:
 *   - Dustin O'Brien
 *   - Timothy McKirgan
 */


// Imports in Needed Function
import { visLatticeArray, createVisInit } from "./generateLattice.js";

/** 
 * Canvas HTML Object: The canvas element used for rendering the lattice.
 * @type {HTMLCanvasElement} 
 */
const canvas = document.getElementById('latticeRegion');

/** 
 * Canvas Context: Allows for interaction with the canvas to draw elements.
 * @type {CanvasRenderingContext2D} 
 */
const ctx = canvas.getContext('2d');

// Clear the canvas and prepare for new drawing.
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Initialize the visual lattice and draw it.
createVisInit();
displayLattice(visLatticeArray);

/**
 * Initializes the canvas by setting its width and height to a percentage of the window size.
 * This function is typically called when setting up the page.
 */
export function intialCanvas() {
    const canvas = document.getElementById('latticeRegion');

    // Set canvas width to 90% of the window width
    canvas.width = .9 * window.innerWidth;

    // Set canvas height to 82% of the window height
    canvas.height = .82 * window.innerHeight;
}

/**
 * Basic method to draw the lattice onto the canvas.
 * Iterates over the visual lattice array and draws each cell using its `drawCell` method.
 * 
 * @param {Array} visLatticeArray - A 2D array of cells representing the visual lattice.
 */
export function displayLattice(visLatticeArray) {
    // Set the background color to white
    ctx.fillStyle = '#FFFFFF';

    // Draw a white rectangle covering the entire canvas (this acts as the background)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Iterate over the lattice array and draw each individual cell
    for (let i = 0; i < visLatticeArray.length; i++) {
        for (let j = 0; j < visLatticeArray[0].length; j++) {
            visLatticeArray[i][j].drawCell(ctx); // Draw each cell to the canvas
        }
    }
}

//Exports canvas and ctx for use in other modules or components.
export { canvas, ctx };
