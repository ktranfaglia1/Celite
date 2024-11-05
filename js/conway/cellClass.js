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

export class cell {

	//Basic Constructor for the each cell
	constructor(height, width, XLocation, YLocation, color, border) {
		//holds the height and width of the cell this should be the same but can allow for rectangles if needed
		this.height = height;
		this.width = width;
		//Holds location of the cell based on X and Y
		this.XLocation = XLocation;
		this.YLocation = YLocation;
		//Sets the color of the cell to black or white
		this.color = color;
		this.border = border;

		this.deadCell = '#FFFFFF';
		this.deadBord = '#000000';

		this.aliveCell = '#000000';
		this.aliveBord = '#808080';

	}

	// Function used to draw the cell in its proper location
	drawCell(ctx) {
		//Checks if the cell in question is within the current canvas. No need to run draw commands on anything outside canvas.
		if(this.XLocation + this.width > 0 && this.XLocation < ctx.canvas.width && this.YLocation + this.height > 0 && this.YLocation < ctx.canvas.height && (this.color || this.height > 10 )/*&& (this.color || border)*/) {
			let border = true;
			//If the height of the cell is less then or equal to ten, dont draw cell borders
			if(this.height <= 10) {
				border = false;
			}

			//Draws the Box Outline as long as Cells arent too small
			if(border) {
				//Sets outline to be inverse of color of cell so you can see it
				if(this.color == 1) {
					ctx.fillStyle = this.aliveBord;
				}
				else {
					ctx.fillStyle = this.deadBord;
				}

				// Draws the main section outside of the square
				ctx.fillRect(this.XLocation, this.YLocation , this.width + 1, this.height + 1);
			}

			//Sets color for the main part of the cell
			if(this.color == 1) {
				ctx.fillStyle = this.aliveCell;
			}
			else {
				ctx.fillStyle = this.deadCell;
			}
			
			//Draws Inside of Cell and sets to proper size depending on  if their is or isnt an outline
			if(border) {
				ctx.fillRect(this.XLocation + 1, this.YLocation + 1, this.width - 2, this.height - 2);
			}
			else {
				ctx.fillRect(this.XLocation, this.YLocation, this.width + 1, this.height + 1);
			}
		}
	}

	//Sets border status
	setBorder(newBorder) {
		this.border = newBorder;
	}

	//This is used to get if the border is on or not
	getBorder() {
		return this.border;
	}

	//Tests if given a mouses X and Y location if that is inside of the cell
	insideCell(MouseX, MouseY) {
		// Tests if location is inside if cell
		if ((MouseX >= this.XLocation && MouseX <= this.XLocation + this.width) && (MouseY >= this.YLocation && MouseY <= this.YLocation + this.height)) {
			return true;
		}
		else {
			return false;
		}
	}

	//sets color to given input
	setColor(color) {
		this.color = color;
	}

	//Flips the color of the cell
	flipColor() {
		if(this.color ==  1) {
			this.color = 0;
		}
		else {
			this.color = 1;
	}
	}

	//Returns color value of the cell
	getColor() {
		return this.color;
	}

	//Returns height of the cell
	getHeight() {
		return this.height;
	}

	//Sets height of the cell
	setHeight(Val) {
		this.height = Val;
	}

	//Returns width of the cell
	getWidth() {
		return this.width;
	}

	//Sets width of the cell
	setWidth(Val) {
		this.width = Val;
	}

	//Returns X Location of top left corner of cell
	getXLoc() {
		return this.XLocation;
	}

	//Sets X location of top left corner of cell
	setXLoc(Val) {
		this.XLocation = Val;
	}

	//Returns Y location of top left corner of cell
	getYLoc() {
		return this.YLocation;
	}

	//Sets Y location of top left corner of cell
	setYLoc(Val) {
		this.YLocation = Val;
	}

	//Sets color of a dead cell
	setDeadColor(color) {
		this.deadCell = color;
	}

	//Sets color of a border of a dead cell
	setDeadBorder(color) {
		this.deadBord = color;
	}

	//Sets color of alive cell
	setAliveColor(color) {
		this.aliveCell = color;
	}

	//Sets color of border of alive cell
	setAliveBorder(color) {
		this.aliveBord = color;
	}
}