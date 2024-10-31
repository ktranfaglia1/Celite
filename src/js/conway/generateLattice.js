const canvas = document.getElementById('latticeRegion');


//let cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue('width'));
//let cssHeight = parseFloat(getComputedStyle(canvas).getPropertyValue('height'));

intialCanvas();

// Calculates Height and Width cooresponding to CSS setting of Canvas
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;
const buffer = 200;
let visLatticeWidth = 1000; // canvasWidth / size of a cell = visLatticeHeight * canvasWidth / size of a cell
let visLatticeHeight = (visLatticeWidth + 1) * canvasHeight / canvasWidth ; // canvas.height / visLatticeHeight // Size of a cell

//let cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue('width'));
//let cssHeight = parseFloat(getComputedStyle(canvas).getPropertyValue('height'));

let cellSize = canvasHeight / visLatticeHeight;

let visBounds = new Array(buffer, buffer, buffer + visLatticeWidth, buffer + visLatticeHeight);
let visLatticeArray = new Array(new Array());
let latticeArray = new Array(new Array());

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
        for (let f = 0; f < bounds[0]; f++) {
            dummyArr.push(0);
        }
        latticeArray.push(dummyArr);
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
    //let newLat = new Array(new Array());
    for (let i = 0; i < visBounds[3] - visBounds[1]; i++) {
        //let dummyArr = new Array();
        for (let f = 0; f < visBounds[2] - visBounds[0]; f++) {
            /*let height = visLatticeArray[i][f].getHeight();
            let xCord = visLatticeArray[i][f].getXLoc() + xOffset;
            let yCord = visLatticeArray[i][f].getYLoc() + yOffset;
            dummyArr.push(new cell(height, height, xCord, yCord, latticeArray[i + visBounds[1]][f + visBounds[0]], true));*/
            visLatticeArray[i][f].setXLoc(visLatticeArray[i][f].getXLoc() + xOffset);
            visLatticeArray[i][f].setYLoc(visLatticeArray[i][f].getYLoc() + yOffset);
            visLatticeArray[i][f].setColor(latticeArray[i + visBounds[1]][f + visBounds[0]])
        }
        //newLat.push(dummyArr);
    }
    //visLatticeArray.shift()
    /*newLat.shift();
    visLatticeArray = newLat;
    console.log(visLatticeArray)*/
}

//This function counts the number of living neighbors around any given cell.
export function livingNeighbors(x, y) {
    let alive = 0;
    for (let i = -1; i < 2; i++) {
        if (i != 0) {
            for (let f = -1; f < 2; f++) {
                if (((y + f) < bounds[1]) && ((y + f) >= 0) && ((x + i) >= 0) && ((x + i) < bounds[0])) {
                    if (latticeArray[y + f][x + i] == 1) {
                        alive++;
                    }
                }
            }
        }
        else {
            if (((y + 1) < bounds[1]) && ((y + 1) >= 0)) {
                if (latticeArray[y + 1][x] == 1) {
                    alive++;
                }
            }
            if (((y - 1) < bounds[1]) && ((y - 1) >= 0)) {
                if (latticeArray[y - 1][x] == 1) {
                    alive++;
                }
            }
        }
    }
    return alive;
}

//This function updates the lattice array for each timestep.
export function iterate() {

    if (iterationCount == 0)
    {
        saveReset();
    }
    
    let newLat = new Array(new Array());
    for (let i = 0; i < bounds[1]; i++) {
        let dummyArr = new Array();
        for (let f = 0; f < bounds[0]; f++) {
            let currentState = latticeArray[i][f];
            let numNeighbors = livingNeighbors(f, i);

            if (currentState == 0) {
                if (numNeighbors == 3) {
                    dummyArr.push(1);
                }
                else {
                    dummyArr.push(0);
                }
            }
            else {
                if (numNeighbors == 2 || numNeighbors == 3) {
                    dummyArr.push(1);
                }
                else {
                    dummyArr.push(0);
                }
            }

        }
        newLat[i] = dummyArr;
    }
    latticeArray = newLat;
    console.time("create Vis")
    createVis();
    console.timeEnd("create Vis");
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