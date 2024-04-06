/*
 * logClass.js
 *
 * Authors: Dustin O'Brien,
 *
 * Functions:
 * constructor
 * changeIndex
 * clearCanvas
 * displayMessage
 */
export class logMessage {
	constructor(message, color, canvas) //Constructor for a message
	{
		this.message = message;
		this.color = color;
		//this.index = index;
		this.canvas = canvas;
		this.context = canvas.getContext("2d");

	}

	changeIndex(newIndex) //Allows for changing indexes so the messages can move up as they age
	{ this.index = newIndex; }

	clearCanvas() //used to erase the log box canvas so that we dont have to include context as a parameter to remove it
	{this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);}

	displayMessage(index) {
		// this.context.height = "100%";
		this.context.font = "13px Arial"; //sets font
		this.context.fillStyle = this.color; //sets color to be error color or default color


		if (index < 3) //Doesnt print over 3 messages so dont print after this point
		{
			this.context.fillText(this.message, 5, index * this.canvas.height / 3 + 10.2)//outputs text and arranges the y to stop overrlap
		}
	}
}
