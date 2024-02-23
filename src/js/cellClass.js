
class cell {


	constructor(height, width, XLocation, YLocation, color)
	{
		this.height = height;
		this.width = width;
		this.XLocation = XLocation;
		this.YLocation = YLocation;
		this.color = color;
	}

	drawCell(ctx)
	{

      		ctx.fillStyle = "black";

		ctx.fillRect(this.XLocation, this.YLocation , this.height, this.width);


      		if(this.color == 0)
      		{
      			ctx.fillStyle = "white";
      		}

		ctx.fillRect(this.XLocation + 1, this.YLocation + 1, this.height - 2, this.width - 2);
	}

	insideCell(MouseX, MouseY)
	{
		//console.log("Location X:", this.XLocation, "Location Y:", this.YLocation);
		if ((MouseX >= this.XLocation && MouseX <= this.XLocation + this.width) && (MouseY >= this.YLocation && MouseY <= this.YLocation + this.height))
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	setColor(color)
	{
		this.color = color;
	}

	flipColor()
	{
		if(this.color ==  1)
		{this.color = 0}
		else
		{this.color = 1}
	}

	getColor()
	{
		return this.color;
	}

}
