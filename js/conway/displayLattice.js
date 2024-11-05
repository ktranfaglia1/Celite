/*
displayLattice is used to initialize the canvas and holds some functionality for drawing on canvas
Author: Dustin O'Brien and Timothy McKirgan
*/

//IMPORTS
import {visLatticeArray, createVisInit} from "./generateLattice.js";

//DECLARATIONS
const canvas = document.getElementById('latticeRegion');
const ctx = canvas.getContext('2d');
ctx.clearRect(0,0, canvas.width, canvas.height);
createVisInit();
displayLattice(visLatticeArray);

//EXPORTS
export {canvas, ctx};

//Grabs Canvas and Context Data of the Canvas
export function intialCanvas()
{
    const canvas = document.getElementById('latticeRegion');
    const ctx = canvas.getContext('2d');
    canvas.width = .9 * window.innerWidth;
    canvas.height = .82 * window.innerHeight;
}

//Basic method to draw lattice to canvas
export function displayLattice(visLatticeArray)
{
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //Iterates over the visual lattice array drawing each cell
    for(let i = 0; i < visLatticeArray.length; i++)
    {
        for(let j = 0; j < visLatticeArray[0].length; j++)
        {
            visLatticeArray[i][j].drawCell(ctx);
        }
    }
}