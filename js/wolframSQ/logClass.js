/**
 * logClass.js
 *
 * Summary:
 *   Defines the logMessage class, which handles the creation, display, and management of log messages
 *   on a canvas. The class allows for updating, clearing, and positioning log messages in a specified area.
 *
 * Features:
 *   - Creates and displays log messages on a canvas.
 *   - Allows for adjusting the position of messages based on index.
 *   - Provides methods for clearing the canvas and updating the displayed messages.
 *   - Handles the color of messages for different log types (e.g., error or info).
 *
 * Class:
 *   - logMessage: Represents a log message with methods for displaying and updating it on a canvas.
 *
 * Functions:
 *   - Constructor: Initializes the logMessage with a message, color, and canvas element.
 *   - changeIndex: Updates the index of the message, affecting its position in the log.
 *   - clearCanvas: Clears the canvas to remove previously displayed messages.
 *   - displayMessage: Displays the message at a given index, ensuring it doesn't overlap other messages.
 *
 * Authors:
 *   - Dustin O'Brien
 */

export class logMessage {
  /**
   * Constructor for creating a log message object that can be displayed on a canvas.
   * This constructor sets up the message, its color, and the canvas on which it will be rendered.
   *
   * @constructor
   *
   * - Parameters
   * @param {string} message - The message text to be displayed in the log.
   * @param {string} color - The color of the message text (e.g., 'red', 'green').
   * @param {HTMLCanvasElement} canvas - The canvas element where the message will be displayed.
   */
  constructor(message, color, canvas) {
    this.message = message;
    this.color = color;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  /**
   * Changes the index for the log message to adjust its position in the log.
   * This allows the message to move up as new messages are added.
   *
   * @param {number} newIndex - The new index to move the message to.
   * @returns {void}
   */
  changeIndex(newIndex) {
    this.index = newIndex;
  }

  /**
   * Clears the canvas, removing any previously displayed messages.
   * This is used to refresh the log area before displaying new messages.
   *
   * @returns {void}
   */
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Displays the log message on the canvas at the given index.
   * The message is drawn with the specified color and positioned to avoid overlap.
   *
   * @param {number} index - The index position to place the message on the canvas.
   * @returns {void}
   */
  displayMessage(index) {
    this.context.font = "13px Arial";
    this.context.fillStyle = this.color;
    if (index < 3) {
      this.context.fillText(
        this.message,
        5,
        (index * this.canvas.height) / 3 + 10.2
      );
    }
  }
}
