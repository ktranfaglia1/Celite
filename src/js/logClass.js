/*
 * logClass.js
 *
 * Authors: Dustin O'Brien,
 *
 * Functions:
 * constructor
 * changeIndex
 * displayMessage
 */
export class logMessage {
	constructor(message, color, index, canvas, context) //Constructor for a message
	{
		this.message = message;
		this.color = color;
		this.index = index;
		this.canvas = canvas
		this.context = context

	}

	changeIndex(newIndex) //Allows for changing indexes so the messages can move up as they age
	{ this.index = newIndex; }

	displayMessage() {
		// this.context.height = "100%";
		this.context.font = "13px Arial"; //sets font
		this.context.fillStyle = this.color; //sets color to be error color or default color


		if (this.index < 3) //Doesnt print over 3 messages so dont print after this point
		{
			this.context.fillText(this.message, 5, this.index * this.canvas.height / 3 + 10.2)//outputs text and arranges the y to stop overrlap
		}
	}
}
