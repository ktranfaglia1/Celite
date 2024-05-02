import {latticeArray, bounds} from './generateLattice.js';
import { createVis, visLatticeArray } from './generateLattice.js';
import {canvas, displayLattice} from "./displayLattice.js";


//This function creates the intitial configuration array to be used for setting
function createNewConfig() {
    let newLattice = new Array(new Array());
    for (let i = 0; i < bounds[1]; i++) {
        let dummyArr = new Array();
        for (let f = 0; f < bounds[0]; f++) {
            dummyArr.push(0);
            newLattice[i] = dummyArr;
        }
    }
    return newLattice;
}

//Sets the visual lattice to the new lattice you created and displays it
function setLattice(newLattice)
{
    for(let i = 0; i < newLattice.length; i++)
    {
        for (let j = 0; j < newLattice[0].length; j++)
        {
            latticeArray[i][j] = newLattice[i][j];
        }
    }

    createVis(canvas);
    setLattice(newLattice);
    displayLattice(visLatticeArray)
    //console.log(latticeArray);
    return latticeArray;
}

//Makes a simple glider
export function buildGlider()
{
    let newLattice = createNewConfig();
    newLattice[Math.floor(newLattice.length / 2)][Math.floor(newLattice[0].length / 2)] = 1;

    //console.log(newLattice[250][250]);
}