import {latticeArray, visBounds} from './generateLattice.js';
import { createVis, visLatticeArray } from './generateLattice.js';
import {canvas, displayLattice} from "./displayLattice.js";
//import { clear } from './UIFunctionality.js';


//This function creates the intitial configuration array to be used for setting
function createNewConfig() {
    let newLattice = new Array(new Array());
    for (let i = 0; i < visBounds[3]; i++) {
        let dummyArr = new Array();
        for (let f = 0; f < visBounds[2]; f++) {
            dummyArr.push(0);
            newLattice[i] = dummyArr;
        }
    }

    console.log(visBounds[3])
    return newLattice;
}

//Sets the visual lattice to the new lattice you created and displays it
function setLattice(newLattice)
{
    //clear();

    //Iterates through every lattice and sets to the same value as the new lattice
    for(let i = 0; i < newLattice.length; i++)
    {
        for (let j = 0; j < newLattice[0].length; j++)
        {
            latticeArray[i + visBounds[0]][j + visBounds[1]] = newLattice[i][j];
        }
    }

    displayLattice(visLatticeArray)

    return latticeArray;
}

//Makes a simple glider
export function buildGlider()
{
    //Makes the intial blank Lattice
    let newLattice = createNewConfig();

    //Sets each of the indexes of the new lattice
    newLattice[Math.floor(visBounds[3] / 2) + 1][Math.floor(visBounds[2] / 2)] = 1;
    newLattice[Math.floor(visBounds[3] / 2) ][Math.floor(visBounds[2] / 2) + 1] = 1;
    newLattice[Math.floor(visBounds[3] / 2) + 1][Math.floor(visBounds[2] / 2) + 1] = 1;
    newLattice[Math.floor(visBounds[3] / 2) + 1][Math.floor(visBounds[2] / 2) - 1] = 1;
    newLattice[Math.floor(visBounds[3] / 2) - 1][Math.floor(visBounds[2] / 2)] = 1;

    //sets display lattice to new lattice
    setLattice(newLattice);
}