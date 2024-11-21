/**
 * cellClass.js
 *
 * Summary:
 *   Defines the Cell class, which represents individual cells in a grid-based system. The class provides
 *   functionalities for drawing cells, checking if a position is within a cell, setting colors, and toggling
 *   states (e.g., alive or dead).
 *
 * Features:
 *   - Draws cells to the canvas based on provided context.
 *   - Detects if a given position (such as the mouse) is inside the cell.
 *   - Allows setting and flipping of cell colors to represent states.
 *   - Provides accessor for retrieving cell color.
 *
 * Class:
 *   - Cell: Represents a cell with methods to draw, set, and toggle its state.
 *
 *  Functions:
 *   - Constructor: Initializes the cell with height, width, X and Y location, color, and border properties.
 *   - drawCell: Draws the cell on the canvas, requires a canvas context (`ctx`) as a parameter.
 *   - setBorder: Updates the cell’s border color.
 *   - getBorder: Returns the current border color of the cell.
 *   - insideCell: Checks if a given (X, Y) position is inside the cell (e.g., for mouse interactions).
 *   - setColor: Sets a new color for the cell.
 *   - flipColor: Toggles the cell color between "alive" and "dead".
 *   - getColor: Gets the current color of the cell.
 *   - getHeight / setHeight: Accessor and mutator for the cell’s height.
 *   - getWidth / setWidth: Accessor and mutator for the cell’s width.
 *   - getXLoc / setXLoc: Accessor and mutator for the cell’s X-axis location.
 *   - getYLoc / setYLoc: Accessor and mutator for the cell’s Y-axis location.
 *   - setDeadColor: Sets the color for dead cells.
 *   - setDeadBorder: Sets the border color for dead cells.
 *   - setAliveColor: Sets the color for alive cells.
 *   - setAliveBorder: Sets the border color for alive cells.
 *
 * Authors:
 *   - Dustin O'Brien
 */

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
   *
   */
  constructor(height, width, XLocation, YLocation, color, border) {
        this.height = height;
    this.width = width;
        this.XLocation = XLocation;
    this.YLocation = YLocation;
        this.color = color;
    this.border = border;

        this.deadCell = "#FFFFFF";
    this.deadBord = "#000000";

        this.aliveCell = "#000000";
    this.aliveBord = "#808080";
  }

    /**
   * Draws the Cell onto Canvas
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  drawCell(ctx) {
        if (this.XLocation + this.width > 0 && this.XLocation < ctx.canvas.width && this.YLocation + this.height > 0 && this.YLocation < ctx.canvas.height && (this.color || this.height > 10) /*&& (this.color || border)*/) {
      let border = this.border;
      if (this.height <= 10) {
        border = false;
      }

        if (border) {
           if (this.color == 1) {
          ctx.fillStyle = this.aliveBord;
        } else {
          ctx.fillStyle = this.deadBord;
        }

                ctx.fillRect(this.XLocation, this.YLocation, this.width + 1, this.height + 1);
      }

            if (this.color == 1) {
        ctx.fillStyle = this.aliveCell;
      } else {
        ctx.fillStyle = this.deadCell;
      }

        if (border) {
        ctx.fillRect(this.XLocation + 1, this.YLocation + 1, this.width - 2, this.height - 2);
      } else {
        ctx.fillRect(this.XLocation, this.YLocation, this.width + 1, this.height + 1);
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
}
