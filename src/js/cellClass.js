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

import {latSize} from './displayLattice.js';

export class cell {

	//Basic Constructor for the each cell
	constructor(height, width, XLocation, YLocation, color)
	{
		//holds the height and width of the cell this should be the same but can allow for rectangles if needed
		this.height = height;
		this.width = width;
		//Holds location of the cell based on X and Y
		this.XLocation = XLocation;
		this.YLocation = YLocation;
		//Sets the color of the cell to black or white
		this.color = color;
	}

	// Function used to draw the cell in its proper location
	drawCell(ctx)
	{

		//Draws the Box Outline as long as Cells arent too small
		if(latSize[0] <= 200)
		{
			//Sets outline to be inverse of color of cell so you can see it
			if(this.color == 1)
			{
      			ctx.fillStyle = "grey";
			}
			else
			{
      			ctx.fillStyle = "black";
			}

			// Draws the main section outside of the square
			ctx.fillRect(this.XLocation, this.YLocation , this.height, this.width);
		}

		//Sets color for the main part of the cell
      		if(this.color == 0)
      		{
      		ctx.fillStyle = "white";
      		}
		else
		{
		ctx.fillStyle = "black"
		}
		
		//Draws Inside of Cell and sets to proper size depending on  if their is or isnt an outline
		if(latSize[0] <= 200)
		{
		ctx.fillRect(this.XLocation + 1, this.YLocation + 1, this.height - 2, this.width - 2);
		}
		else
		{
		ctx.fillRect(this.XLocation, this.YLocation, this.height, this.width);
		}
		
	}

	//Tests if given a mouses X and Y location if that is inside of the cell
	insideCell(MouseX, MouseY)
	{
		// Tests if location is inside if cell
		if ((MouseX >= this.XLocation && MouseX <= this.XLocation + this.width) && (MouseY >= this.YLocation && MouseY <= this.YLocation + this.height))
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	//sets color to given input
	setColor(color)
	{
		this.color = color;
	}

	//Flips the color of the cell
	flipColor()
	{
		if(this.color ==  1)
		{this.color = 0}
		else
		{this.color = 1}
	}

	//Returns color value of the cell
	getColor()
	{
		return this.color;
	}
}
