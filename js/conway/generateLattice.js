/*
generateLattice is used to perform operations relating to the updating of the lattice in any way
Authors: Timothy McKirgan and Dustin O'Brien
*/

//IMPORTS
import { saveReset } from "./UIFunctionality.js";
import { cell } from "./cellClass.js"
import { intialCanvas } from "./displayLattice.js";
import { iterationCount } from "./UIFunctionality.js"

//DECLARATIONS
const canvas = document.getElementById('latticeRegion');
const buffer = 160;
intialCanvas();

// Calculates Height and Width cooresponding to CSS setting of Canvas
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;
let visLatticeWidth = 800; // canvasWidth / size of a cell = visLatticeHeight * canvasWidth / size of a cell
let visLatticeHeight = (visLatticeWidth + 1) * canvasHeight / canvasWidth ; // canvas.height / visLatticeHeight // Size of a cell
let cellSize = canvasHeight / visLatticeHeight;
let visBounds = new Array(buffer, buffer, buffer + visLatticeWidth, buffer + visLatticeHeight);
//Initialize 2D arrays used to calculate and display lattice over each timestep
let visLatticeArray = new Array(new Array());
let latticeArray = new Array(new Array());
let bufferArray = new Array(new Array());
let bounds = new Array(visLatticeWidth + (2 * buffer), visLatticeHeight + (2 * buffer));

createInit();

//incrementCell
function alterNeighborCount(x, y, num) {
    //Checks if coordinates are within cell boundaries
    if(x >= 0 && x < bounds[1] && y >= 0 && y < bounds[0]) {
        bufferArray[y][x] += num;
    }
}

//EXPORTS
export { visLatticeArray, visBounds, latticeArray, bounds };

//This function alters the neighbor count of each neighboring cell should a cell switch states
export function changeNeighbor(x, y, num) {
    //Checks if coordinates are within cell boundaries
    if(x >= 0 && x < bounds[1] && y >= 0 && y < bounds[0]) {
        alterNeighborCount(x + 1, y + 1, num);
        alterNeighborCount(x + 1, y - 1, num);
        alterNeighborCount(x - 1, y + 1, num);
        alterNeighborCount(x - 1, y - 1, num);
        alterNeighborCount(x + 1, y, num);
        alterNeighborCount(x - 1, y, num);
        alterNeighborCount(x, y + 1, num);
        alterNeighborCount(x, y - 1, num);
    }
}

export function recountNeighbors(clear = false) {
    for (let i = 0; i < bufferArray.length; i++) {
        for (let f = 0; f < bufferArray[i].length; f++) {
            bufferArray[i][f] = 0
        }
    }
    if (!clear) {
        for (let i = 0; i < latticeArray.length; i++) {
            for (let f = 0; f < latticeArray[i].length; f++) {
                if (latticeArray[i][f] == 1) {
                    changeNeighbor(f, i, 1);
                }
            }
        }
    }
}

//This function creates the intitial lattice. This one is not made up of cell classes for storage purposes, a parallel structure
//of cells will be made that displays a certain subset of this lattice using cells.
export function createInit() {
    latticeArray = new Array(new Array());
    bufferArray = new Array(new Array());
    //Iterate over number of rows in the calculated array
    for (let i = 0; i < bounds[1]; i++) {
        let dummyArr = new Array();
        let dummyArr2 = new Array();
        //Iterate over number of columns in the calculated array
        for (let f = 0; f < bounds[0]; f++) {
            dummyArr.push(0);
            dummyArr2.push(0);
        }
        latticeArray.push(dummyArr);
        bufferArray.push(dummyArr2);
    }
    bufferArray.shift();
    latticeArray.shift();
}

//This function uses the initial lattice array and visible boundary to create the initial cell lattice to be displayed.
export function createVisInit() {
    let newLat = new Array(new Array());
    let xOffset = (window.innerWidth * .9 - (visBounds[2] - visBounds[0]) * cellSize) / 2; //Calculates offset need to center canvas although size is hard coded
    //Iterate over number of rows in the visible array
    for (let i = visBounds[1]; i < visBounds[3]; i++) {
        let posY = i - visBounds[1];
        let dummyArr = new Array();
        //Iterate over number of columns in visible array
        //Create cells for visible lattice
        for (let f = visBounds[0]; f < visBounds[2]; f++) {
            let posX = f - visBounds[0];
            dummyArr.push(new cell(cellSize, cellSize, posX * cellSize + xOffset, posY * cellSize, latticeArray[i][f], true));
        }
        newLat.push(dummyArr);
    }
    newLat.shift();
    visLatticeArray = newLat;
}

//This function uses current lattice array and visible boundary to create the next cell lattice to be displayed
export function createVis(xOffset = 0, yOffset = 0) {
    //Iterate over number of rows in the visible array
    for (let i = 0; i < visBounds[3] - visBounds[1]; i++) {
        //Iterate over number of columns in visible array
        //Only changes X and Y positions to take offset into account if necassary and change cell color if need be
        for (let f = 0; f < visBounds[2] - visBounds[0]; f++) {
            visLatticeArray[i][f].setXLoc(visLatticeArray[i][f].getXLoc() + xOffset);
            visLatticeArray[i][f].setYLoc(visLatticeArray[i][f].getYLoc() + yOffset);
            visLatticeArray[i][f].setColor(latticeArray[i + visBounds[1]][f + visBounds[0]]);
        }
    }
}

//This function updates the lattice array for each timestep.
export function iterate() {
    let neighborInstructions = new Array();
    //If no iterations have happened yet, save the lattice so that reset button can bring lattice back to original state
    if (iterationCount == 0) {
        saveReset();
    }

    //Use the number of living neighbors count in buffer array to determine what happens to each cell
    //RULES:
    //If there are three cells neighboring a dead one, make the cell alive
    //If there are two or three cells neighboring a live one, keep it alive
    //Under all other conditions, the cell should die or stay dead
    //Iterate over all cells applying these rules
    for (let i = 0; i < bounds[1]; i++) {
        for (let f = 0; f < bounds[0]; f++) {
            if(latticeArray[i][f] == 0 && bufferArray[i][f] == 3) {
                latticeArray[i][f] = 1;
                neighborInstructions.push(new Array(f, i, 1));
            }
            else if(latticeArray[i][f] == 1 && (bufferArray[i][f] < 2 || bufferArray[i][f] > 3)) {
                latticeArray[i][f] = 0;
                neighborInstructions.push(new Array(f, i, -1));
            }
        }
    }
    for (let i = 0; i < neighborInstructions.length; i++) {
        changeNeighbor(neighborInstructions[i][0], neighborInstructions[i][1], neighborInstructions[i][2]);
    }
    createVis();
    return latticeArray;
}

//Tests whether or not a living cell has hit the calculated boundary. Returns boolean true if so, false if not.
export function boundaryCollide() {
    let collide = false;
    //Iterate over left and right edge to check for living cells. If there is a living cell, set collide to true
    for (let i = 0; i < bounds[0]; i++) {
        if (latticeArray[0][i] == 1 || latticeArray[latticeArray.length - 1][i] == 1) {
            collide = true;
        }
    }
    //Iterate over top and bottom edge to check for living cells. If there is a living cell, set collide to true
    for (let i = 0; i < bounds[1]; i++) {
        if (latticeArray[i][0] == 1 || latticeArray[i][latticeArray[i].length - 1] == 1) {
            collide = true;
        }
    }
    return collide;
}