
//lattice = {{lattice | tojson}};

var canvas = document.getElementById("latticeRegion");
var ctx = canvas.getContext("2d"); // gets the lattice display region

console.log("lattice:", lattice);

drawLattice(lattice);
//JSON.parse(lattice);

function drawLattice(lattice){
	for (let i = 0; i < lattice.length; i++)
	{
		var size = 30;
		var XIndent = 40;
		var YIndent = 10;
	
		if(lattice[i] == 1)
		{
			ctx.fillStyle = "black"
		}
		else
		{
			ctx.fillStyle = "#89CFF0"
		}

		ctx.fillRect(XIndent + size * i + i, YIndent, size, size);
	}
}


