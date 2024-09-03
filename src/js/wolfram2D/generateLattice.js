import { intialCanvas } from "./displayLattice.js";

intialCanvas();
createVisInit();

const canvas = document.getElementById('latticeRegion');
let bounds = new Array(500, 500);

// Calculates Height and Width cooresponding to CSS setting of Canvas
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;

let visLatticeHeight = 110; // canvas.height / visLatticeHeight // Size of a cell
let visLatticeWidth = canvasWidth * visLatticeHeight / canvasHeight - 1; // canvasWidth / size of a cell = visLatticeHeight * canvasWidth / size of a cell

let cellSize = canvasHeight / visLatticeHeight;

let visBounds = new Array(0, 0, visLatticeWidth, visLatticeHeight);
let visLatticeArray = new Array(new Array());
let latticeArray = new Array(new Array());

export {visBounds, visLatticeArray, latticeArray}

//This function uses the current lattice array and visible boundary to create the current cell lattice to be displayed.
export function createVisInit() {
    let newLat = new Array(new Array());
    //cellSize = (.64 * window.innerHeight) / visBounds[3]; /* Window Calculation / number of cells gives the optimal size to fit screen */
    let xOffset = (window.innerWidth * .9 - (visBounds[2] - visBounds[0]) * cellSize) / 2; //Calculates offset neeed to center canvas although size is hard coded
    for (let i = visBounds[1]; i < visBounds[3]; i++) {
        let posY = i - visBounds[1];
        let dummyArr = new Array();
        for (let f = visBounds[0]; f < visBounds[2]; f++) {
            let posX = f - visBounds[0]
            dummyArr.push(new cell(cellSize, cellSize, posX * cellSize + xOffset, posY * cellSize, latticeArray[i][f], true));
        }
        newLat[i] = dummyArr;
    }
    visLatticeArray = newLat;
}

export function createVis(xOffset = 0, yOffset = 0) {
    let newLat = new Array(new Array());
    //cellSize = (.64 * window.innerHeight) / visBounds[3]; /* Window Calculation / number of cells gives the optimal size to fit screen */
    //let borders = true;
    for (let i = visBounds[1]; i < visBounds[3]; i++) {
        let posY = i - visBounds[1];
        let dummyArr = new Array();
        for (let f = visBounds[0]; f < visBounds[2]; f++) {
            let posX = f - visBounds[0]
            let height = visLatticeArray[posY][posX].getHeight();
            let xCord = visLatticeArray[posY][posX].getXLoc() + xOffset;
            let yCord = visLatticeArray[posY][posX].getYLoc() + yOffset;
            dummyArr.push(new cell(height, height, xCord, yCord, latticeArray[i][f], true));
        }
        newLat[i] = dummyArr;
    }
    visLatticeArray = newLat;
}
