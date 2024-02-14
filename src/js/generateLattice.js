
function generateLattice(currentLattice)
{
	newLattice = new Array();
	for(i = 0; i < currentLattice.length; i++)
	{
		newLattice[(i + 1) % currentLattice.length] = currentLattice[i];
	}
	return newLattice;
}
