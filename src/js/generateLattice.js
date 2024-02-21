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
  if (BoundaryCon == 1)
  	{ 

		for(i = 0; i < currentLattice.length; i++)
		{
			newLattice.push(new cell (size, size, i * size + i + XIndent, YIndent * rowIndex + rowIndex * size, 0))
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
			newLattice.push(new cell (size, size, i * size + i + XIndent, YIndent * rowIndex + rowIndex * size, 0))
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
