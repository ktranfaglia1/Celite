import {visLatticeArray, visBounds, latticeArray, createVis, createVisInit} from "./generateLattice.js";


document.addEventListener("DOMContentLoaded", function() {
const canvas = document.getElementById('latticeRegion');
const ctx = canvas.getContext('2d');
ctx.clearRect(0,0, canvas.width, canvas.height);
createVisInit(canvas);
displayLattice(visLatticeArray);
})

export function intialCanvas()
{
    const canvas = document.getElementById('latticeRegion');
    const ctx = canvas.getContext('2d')
    canvas.width = .9 * window.innerWidth;
    canvas.height = .82 * window.innerHeight;
}

export function displayLattice(visLatticeArray)
{
    //createVisInit(canvas);
    for(let i = 0; i < visLatticeArray.length; i++)
    {
        for(let j = 0; j < visLatticeArray[0].length; j++)
        {
            visLatticeArray[i][j].drawCell(ctx)
        }
    }
}

