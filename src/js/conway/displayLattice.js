
import {visLatticeArray} from "../conway/generateLattice";


displayLattice(visLatticeArray)
{
    for(let i = 0; i < visLatticeArray.length; i++)
    {
        for(let j = 0; j < visLatticeArray[0].length; j++)
        {
            visLatticeArray[i][j].drawCell()
        }
    }
}