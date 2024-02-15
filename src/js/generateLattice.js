function ruleNumToRule(RuleNum)
{
  Rule = new Array();
  for(i = 0; i < 8; i++)
  {
    Rule[i] = RuleNum % 2;
    RuleNum = Math.floor(RuleNum / 2);
  }
  return Rule
}

function generateLattice(currentLattice, Rule)
{
  newLattice = new Array();
  for(i = 0; i < currentLattice.length; i++)
  {
    if (i == 0)
    {
      newLattice[i] = Rule[(currentLattice[currentLattice.length - 1] * 4) + (currentLattice[i] * 2) + currentLattice[i + 1]];
    }
    else if (i == (currentLattice.length - 1))
    {
      newLattice[i] = Rule[(currentLattice[i - 1] * 4) + (currentLattice[i] * 2) + currentLattice[0]];
    }
    else
    {
      newLattice[i] = Rule[(currentLattice[i - 1] * 4) + (currentLattice[i] * 2) + currentLattice[i + 1]];
    }
  }
  return newLattice;
}