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
export class logMessage
{
	constructor(message, color, index, canvas, context) //Constructor for a message
	{
		this.message = message;
		this.color = color;
		this.index = index;
		this.canvas = canvas
		this.context = context

	}

	changeIndex(newIndex) //Allows for changing indexes so the messages can move up as they age
	{this.index = newIndex;}

	displayMessage()
	{
		this.canvas.font = "15px Arial";
		this.canvas.fillStyle = this.color; //sets color to be error color or default color

		console.log(this.canvas.fillStyle);


		if(this.index < 3) //Doesnt print over 3 messages so dont print after this point
		{
			this.context.fillText(this.message, 5, this.index * 14 + 5)//outputs text and arranges the y to stop overrlap
		}
	}
}
