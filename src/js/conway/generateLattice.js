const canvas = document.getElementById('latticeRegion');


//let cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue('width'));
//let cssHeight = parseFloat(getComputedStyle(canvas).getPropertyValue('height'));

intialCanvas();

// Calculates Height and Width cooresponding to CSS setting of Canvas
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;
const buffer = 100;
let visLatticeWidth = 500; // canvasWidth / size of a cell = visLatticeHeight * canvasWidth / size of a cell
let visLatticeHeight = (visLatticeWidth + 1) * canvasHeight / canvasWidth ; // canvas.height / visLatticeHeight // Size of a cell

//let cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue('width'));
//let cssHeight = parseFloat(getComputedStyle(canvas).getPropertyValue('height'));

let cellSize = canvasHeight / visLatticeHeight;

let visBounds = new Array(buffer, buffer, buffer + visLatticeWidth, buffer + visLatticeHeight);
let visLatticeArray = new Array(new Array());
let latticeArray = new Array(new Array());
let bufferArray = new Array(new Array());

let bounds = new Array(visLatticeWidth + (2 * buffer), visLatticeHeight + (2 * buffer));

import { saveReset } from "./UIFunctionality.js";
import { cell } from "./cellClass.js"
import { intialCanvas } from "./displayLattice.js";
import { buildGlider } from "./presets.js";
import {iterationCount} from "./UIFunctionality.js"

createInit();

export { visLatticeArray, visBounds, latticeArray, bounds };

//This function creates the intitial lattice. This one is not made up of cell classes for storage purposes, a parallel structure
//of cells will be made that displays a certain subset of this lattice using cells.
export function createInit() {
    for (let i = 0; i < bounds[1]; i++) {
        let dummyArr = new Array();
        let dummyArr2 = new Array();
        for (let f = 0; f < bounds[0]; f++) {
            dummyArr.push(0);
            dummyArr2.push(0);
        }
        latticeArray.push(dummyArr);
        bufferArray.push(dummyArr2);
    }
    latticeArray.shift();
}

//This function uses the current lattice array and visible boundary to create the current cell lattice to be displayed.
export function createVisInit() {
    let newLat = new Array(new Array());
    let xOffset = (window.innerWidth * .9 - (visBounds[2] - visBounds[0]) * cellSize) / 2; //Calculates offset need to center canvas although size is hard coded
    for (let i = visBounds[1]; i < visBounds[3]; i++) {
        let posY = i - visBounds[1];
        let dummyArr = new Array();
        for (let f = visBounds[0]; f < visBounds[2]; f++) {
            let posX = f - visBounds[0]
            dummyArr.push(new cell(cellSize, cellSize, posX * cellSize + xOffset, posY * cellSize, latticeArray[i][f], true));
        }
        newLat.push(dummyArr);
    }
    newLat.shift();
    visLatticeArray = newLat;
}

export function createVis(xOffset = 0, yOffset = 0) {
    for (let i = 0; i < visBounds[3] - visBounds[1]; i++) {
        for (let f = 0; f < visBounds[2] - visBounds[0]; f++) {
            visLatticeArray[i][f].setXLoc(visLatticeArray[i][f].getXLoc() + xOffset);
            visLatticeArray[i][f].setYLoc(visLatticeArray[i][f].getYLoc() + yOffset);
            visLatticeArray[i][f].setColor(latticeArray[i + visBounds[1]][f + visBounds[0]])
        }
    }
}

function incrementCell(x,y)
{
    if(x > 0 && x < bounds[1] && y > 0 && y < bounds[0])
        bufferArray[x][y] += 1
}


//This function updates the lattice array for each timestep.
export function iterate() {

    if (iterationCount == 0)
    {
        saveReset();
    }
    
    for (let i = 0; i < bounds[1]; i++) {
        for (let f = 0; f < bounds[0]; f++) {
            bufferArray[i][f] = 0;
        }
    }

    for (let i = 0; i < bounds[1]; i++) {
        for (let f = 0; f < bounds[0]; f++) {
            if(latticeArray[i][f] == 1)
            {
                incrementCell(i - 1, f - 1);
                incrementCell(i, f - 1);
                incrementCell(i + 1, f - 1);

                incrementCell(i - 1, f);
                //incrementCell(i, f);
                incrementCell(i + 1, f);

                incrementCell(i - 1, f + 1);
                incrementCell(i, f + 1);
                incrementCell(i + 1, f + 1);
            }
        }
    }

    for (let i = 0; i < bounds[1]; i++) {
        for (let f = 0; f < bounds[0]; f++) {
            if(bufferArray[i][f] == 3 && latticeArray[i][f] == 0)
            {
                latticeArray[i][f] = 1;
            }
            else if((bufferArray[i][f] == 3 || bufferArray[i][f] == 2) && latticeArray[i][f] == 1)
            {
                latticeArray[i][f] = 1;
            }
            else
            {
                latticeArray[i][f] = 0;
            }
        }
    }

    //latticeArray = newLat;
    createVis();
    //createVisInit();

    return latticeArray;
}

export function boundaryCollide() {
    let collide = false;
    for (let i = 0; i < bounds[0]; i++) {
        if (latticeArray[0][i] == 1 || latticeArray[latticeArray.length - 1][i] == 1) {
            collide = true;
        }
    }
    for (let i = 0; i < bounds[1]; i++) {
        if (latticeArray[i][0] == 1 || latticeArray[i][latticeArray[i].length - 1] == 1) {
            collide = true;
        }
    }
    return collide;
}