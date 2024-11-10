/*
cellClass.js
Authors: Dustin O'Brien
Class: cell
Functions: Constructor that takes in height, width, X Location and Y Location of top corner, and color.
drawCell which draws in individual cell to the canvas and takes ctx as parameter.
insideCell which takes in mouse position to determine if the mouse in inside of a cell.
setColor which sets a new color for the cell that takes new color as parameter.
flipColor swaps a cell visually from dead to alive and vice versa
getColor is an accessor for cell color.
*/

import { latSize } from "./displayLattice.js";
/**
 * - Class Properties
 * @property {number} height - The height of the cell.
 * @property {number} width - The width of the cell.
 * @property {number} XLocation - The X-axis location of the cell.
 * @property {number} YLocation - The Y-axis location of the cell.
 * @property {string} color - The color of the cell (black for alive, white for dead).
 * @property {string} border - The color of the border around the cell.
 * @property {string} deadCell - Default color for dead cells (white).
 * @property {string} deadBord - Default border color for dead cells (black).
 * @property {string} aliveCell - Default color for alive cells (black).
 * @property {string} aliveBord - Default border color for alive cells (grey).
 * @property {boolean} setupMode - determines whether the program will display as if it were in setup mode
 * @property {number} number - Number stored and displayed when in setup mode
 */
export class cell {
  /**
   *  Basic constructor for creating a cell object with specific dimensions, location, color, and border.
   * This constructor is used to define the properties of individual cells in a grid, such as their size,
   * position on the grid, color (alive or dead), and border color. The cell can represent a state in a
   * simulation or grid-based system.
   *
   * @constructor
   *
   * - Parameters
   * @param {number} height - The height of the cell.
   * @param {number} width - The width of the cell.
   * @param {number} XLocation - The X-axis location of the cell.
   * @param {number} YLocation - The Y-axis location of the cell.
   * @param {string} color - The color of the cell (e.g., 'black' or 'white').
   * @param {string} border - The color of the border around the cell.
   * @param {boolean} setupMode - determines whether the program will display as if it were in setup mode
   *
   */
  constructor(height, width, XLocation, YLocation, color, border, setupMode) {
    //holds the height and width of the cell this should be the same but can allow for rectangles if needed
    this.height = height;
    this.width = width;
    //Holds location of the cell based on X and Y
    this.XLocation = XLocation;
    this.YLocation = YLocation;
    //Sets the color of the cell to black or white
    this.color = color;
    this.border = border;

    this.deadCell = "#FFFFFF";
    this.deadBord = "#000000";

    this.aliveCell = "#000000";
    this.aliveBord = "#808080";

    this.setupMode = setupMode;

    this.number = -2; //Displays one above this number
  }

  // Function used to draw the cell in its proper location
  /**
   * Draws the Cell onto Canvas
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  drawCell(ctx) {
    if (this.XLocation + this.width > 0 && this.XLocation < ctx.canvas.width && this.YLocation + this.height > 0 && this.YLocation < ctx.canvas.height && (this.color || this.height > 10) /*&& (this.color || border)*/) {
      //Draws the Box Outline as long as Cells arent too small
      if (this.height >= 15 && this.border) {
        //Sets outline to be inverse of color of cell so you can see it
        if (!this.setupMode) {
          if (this.color == 1) {
            ctx.fillStyle = this.aliveBord;
          } else {
            ctx.fillStyle = this.deadBord;
          }
        } else {
          if (this.color == 1) {
            ctx.fillStyle = "#000000";
          } else {
            ctx.fillStyle = "#000000";
          }
        }
        // Draws the main section outside of the square
        ctx.fillRect(this.XLocation, this.YLocation, this.width + 1, this.height + 2);
      }
      //Sets color for the main part of the cell
      if (!this.setupMode) {
        if (this.color == 1) {
          ctx.fillStyle = this.aliveCell;
        } else {
          ctx.fillStyle = this.deadCell;
        }
      } else {
        if (this.color == 1) {
          ctx.fillStyle = "#808080";
        } else {
          ctx.fillStyle = "#FFFFFF";
        }
      }

      //Draws Inside of Cell and sets to proper size depending on  if their is or isnt an outline
      if (this.height >= 10 && this.border) {
        ctx.fillRect(this.XLocation + 1, this.YLocation + 1, this.width - 2, this.height - 2);
      } else {
        ctx.fillRect(this.XLocation, this.YLocation, this.width + 1, this.height + 1);
      }

      if (this.color == 1 && this.setupMode) {
        if (Math.trunc(Math.log(latSize) / Math.log(10)) + 1 >= 2) ctx.font = this.height / ((Math.trunc(Math.log(latSize) / Math.log(10)) + 1) * 0.54) - 2 + "px Arial";
        else ctx.font = this.height / (Math.trunc(Math.log(latSize) / Math.log(10)) + 1) + "px Arial";

        ctx.fillStyle = "black";

        ctx.fillText(this.number + 1, this.XLocation, this.YLocation + this.height); //Plus 1 to stop 0 indexing
      }
    }
  }

  /**
   * Sets the border status for the cell.
   * @param {boolean} newBorder - The new border status for the cell (true or false).
   * @returns {void}
   */
  setBorder(newBorder) {
    this.border = newBorder;
  }

  /**
   * Gets the current border status of the cell.
   * @returns {boolean} - Returns the current border status (true if border is on, false if off).
   */
  getBorder() {
    return this.border;
  }

  /**
   * Checks if the given mouse coordinates are inside the cell boundaries.
   * @param {number} MouseX - The X coordinate of the mouse position.
   * @param {number} MouseY - The Y coordinate of the mouse position.
   * @returns {boolean} - Returns true if the mouse is inside the cell; otherwise, false.
   */
  insideCell(MouseX, MouseY) {
    // Tests if location is inside if cell
    if (MouseX >= this.XLocation && MouseX <= this.XLocation + this.width && MouseY >= this.YLocation && MouseY <= this.YLocation + this.height) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Sets the cell color to a specified value.
   * @param {string} color - New color for the cell (e.g., 'black' or 'white' or a numeric value).
   * @returns {void}
   */
  setColor(color) {
    this.color = color;
  }

  /**
   * Toggles the color of the cell between "alive" and "dead" states.
   * @returns {void}
   */
  flipColor() {
    if (this.color == 1) {
      this.color = 0;
    } else {
      this.color = 1;
    }
  }

  /**
   * Retrieves the current color of the cell.
   * @returns {string} - The current color of the cell.
   */
  getColor() {
    return this.color;
  }
  /**
   * Gets the height of the cell.
   * @returns {number} - The height of the cell.
   */
  getHeight() {
    return this.height;
  }

  /**
   * Sets the height of the cell.
   * @param {number} Val - The new height of the cell.
   * @returns {void}
   */
  setHeight(Val) {
    this.height = Val;
  }

  /**
   * Gets the width of the cell.
   * @returns {number} - The width of the cell.
   */
  getWidth() {
    return this.width;
  }

  /**
   * Sets the width of the cell.
   * @param {number} Val - The new width of the cell.
   * @returns {void}
   */
  setWidth(Val) {
    this.width = Val;
  }

  /**
   * Gets the X location of the top left corner of the cell.
   * @returns {number} - The X location of the cell.
   */
  getXLoc() {
    return this.XLocation;
  }

  /**
   * Sets the X location of the top left corner of the cell.
   * @param {number} Val - The new X location of the cell.
   * @returns {void}
   */
  setXLoc(Val) {
    this.XLocation = Val;
  }

  /**
   * Gets the Y location of the top left corner of the cell.
   * @returns {number} - The Y location of the cell.
   */
  getYLoc() {
    return this.YLocation;
  }

  /**
   * Sets the Y location of the top left corner of the cell.
   * @param {number} Val - The new Y location of the cell.
   * @returns {void}
   */
  setYLoc(Val) {
    this.YLocation = Val;
  }

  /**
   * Sets the color of a dead cell.
   * @param {string} color - The new color for dead cells.
   * @returns {void}
   */
  setDeadColor(color) {
    this.deadCell = color;
  }

  /**
   * Sets the border color of a dead cell.
   * @param {string} color - The new border color for dead cells.
   * @returns {void}
   */
  setDeadBorder(color) {
    this.deadBord = color;
  }

  /**
   * Sets the color of an alive cell.
   * @param {string} color - The new color for alive cells.
   * @returns {void}
   */
  setAliveColor(color) {
    this.aliveCell = color;
  }

  /**
   * Sets the border color of an alive cell.
   * @param {string} color - The new border color for alive cells.
   * @returns {void}
   */
  setAliveBorder(color) {
    this.aliveBord = color;
  }

  /**
   * Updates the current Mode of a cell.
   * @param {string} color - The new border color for alive cells.
   * @returns {void}
   */
  setSetup(setup) {
    this.setupMode = setup;
  }

  /**
   * Sets the visible Number of a cell for use in setup mode
   * @param {string} color - The new border color for alive cells.
   * @returns {void}
   */
  setNumber(num) {
    this.number = num;
  }

  /**
   * Returns the number contained in the cell for setup mode
   * @param {string} color - The new border color for alive cells.
   * @returns {void}
   */
  getNumber() {
    return this.number;
  }
}
