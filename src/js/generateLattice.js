function ruleNumToRule(RuleNum)
{
  Rule = new Array();
  for(var i = 0; i < 8; i++)
  {
    Rule[i] = RuleNum % 2;
    RuleNum = Math.floor(RuleNum / 2);
  }
  return Rule
}

function generateLattice(currentLattice, Rule, BoundaryCon, rowIndex, size, XIndent, YIndent)
{
  	newLattice = new Array();
  	var StartDif = (LatSize * size) / 2;
  	var center = canvas.width / 2;
  	var StartX = center - StartDif;
    if (BoundaryCon == 1)
  	{
		/*
		var StartDif = (LatSize * size) / 2;
		var center = canvas.width / 2;
		var StartX = center - StartDif;
	
		for (i = 0; i < LatSize; i++)
		{
			currentLattice.push(new cell (size, size, StartX + i * size, 0, 0))
		}
		*/
		for(i = 0; i < currentLattice.length; i++)
		{
			newLattice.push(new cell (size, size, StartX + i * size, rowIndex * size, 0))
			if (i == 0)
			{
				newLattice[i].setColor(Rule[(currentLattice[currentLattice.length - 1].color * 4) + (currentLattice[i].color * 2) + currentLattice[i + 1].color]);
			}
			else if (i == (currentLattice.length - 1))
			{
				newLattice[i].setColor(Rule[(currentLattice[i - 1].color * 4) + (currentLattice[i].color * 2) + currentLattice[0].color]);
			}
			else
			{
				newLattice[i].setColor(Rule[(currentLattice[i - 1].color * 4) + (currentLattice[i].color * 2) + currentLattice[i + 1].color]);
			}
		}
	}
	else
	{
		for(i = 0; i < currentLattice.length; i++)
		{
			//newLattice.push(new cell (size, size, i * size + i + XIndent, YIndent * rowIndex + rowIndex * size, 0))
			newLattice.push(new cell (size, size, StartX + i * size, rowIndex * size, 0));
			if (i == 0)
			{
				newLattice[i].setColor(Rule[(currentLattice[i].color * 2) + currentLattice[i + 1].color]);
			}
			else if (i == (currentLattice.length - 1))
			{
				newLattice[i].setColor(Rule[(currentLattice[i - 1].color * 4) + (currentLattice[i].color * 2)]);
			}
			else
			{
				newLattice[i].setColor(Rule[(currentLattice[i - 1].color * 4) + (currentLattice[i].color * 2) + currentLattice[i + 1].color]);
			}
		}
	}
  return newLattice;
}
