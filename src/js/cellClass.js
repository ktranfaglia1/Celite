
class cell {

	height: number;
	width: number;
	XLocation: number;
	YLocation: number;
	color: color;

	constructor(height, width, XLocation, YLocation, color)
	{
		this.height = height;
		this.width = width;
		this.XLocation = XLocation;
		this.YLocation = YLocation;
		this.color = color;
	}

	drawCell(height, width, XLocation, YLocation, color)
	{
		
	}

	getColor()
	{
		return this.color;
	}

}
