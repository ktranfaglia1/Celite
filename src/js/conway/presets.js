import {latticeArray, visBounds} from './generateLattice.js';
import {createVis, visLatticeArray } from './generateLattice.js';
import {canvas, displayLattice} from "./displayLattice.js";
//import { clear } from './UIFunctionality.js';


//This function creates the intitial configuration array to be used for setting
export function createNewConfig() {
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
export function setLattice(newLattice)
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

    createVis();
    displayLattice(visLatticeArray)

    return latticeArray;
}

export function yCenter()
{return  Math.floor(visBounds[3] / 2);}

export function xCenter()
{return Math.floor(visBounds[2] / 2);}

//Makes a Simple Glider
export function buildGlider()
{
    //Makes the intial blank Lattice
    let newLattice = createNewConfig();

    //Sets each of the indexes of the new lattice
    newLattice[yCenter() + 1][xCenter()] = 1;
    newLattice[yCenter() ][xCenter() + 1] = 1;
    newLattice[yCenter() + 1][xCenter() + 1] = 1;
    newLattice[yCenter() + 1][xCenter() - 1] = 1;
    newLattice[yCenter() - 1][xCenter()] = 1;

    //sets display lattice to new lattice
    setLattice(newLattice);
}

//Makes a 101 from another GOL
export function build101()
{
    //Makes the intial blank Lattice
    let newLattice = createNewConfig();

    //Sets each of the indexes of the new lattice
    // The O
    newLattice[yCenter() + 1][xCenter()] = 1;
    newLattice[yCenter()][xCenter() + 1] = 1;
    newLattice[yCenter() + 1][xCenter + 1] = 1;
    newLattice[yCenter() + 1][xCenter() - 1] = 1;
    newLattice[yCenter() - 1][xCenter() + 1] = 1;
    newLattice[yCenter() - 2][xCenter()] = 1;
    newLattice[yCenter() - 2][xCenter() - 1] = 1;
    newLattice[yCenter() - 1][xCenter() - 2] = 1;
    newLattice[yCenter()][xCenter() - 2] = 1;

    // Left |
    newLattice[yCenter() - 1][xCenter() - 4] = 1;
    newLattice[yCenter() - 2][xCenter() - 4] = 1;
    newLattice[yCenter()][xCenter() - 4] = 1;
    newLattice[yCenter() + 1][xCenter() - 4] = 1;
    
    // Right |
    newLattice[yCenter() - 1][xCenter() + 3] = 1;
    newLattice[yCenter() - 2][xCenter() + 3] = 1;
    newLattice[yCenter()][xCenter() + 3] = 1;
    newLattice[yCenter() + 1][xCenter() + 3] = 1;
 
    // Left {
        //Top Left <
        newLattice[yCenter() - 5][xCenter() - 4] = 1;
        newLattice[yCenter() - 6][xCenter() - 4] = 1;
        newLattice[yCenter() - 6][xCenter() - 5] = 1;

        //Right |
        newLattice[yCenter() - 5][xCenter() - 6] = 1;
        newLattice[yCenter() - 4][xCenter() - 6] = 1;
        newLattice[yCenter() - 3][xCenter() - 6] = 1;
        newLattice[yCenter() - 2][xCenter() - 6] = 1;
        newLattice[yCenter() - 1][xCenter() - 6] = 1;
        newLattice[yCenter() - 0][xCenter() - 6] = 1;
        newLattice[yCenter() + 1][xCenter() - 6] = 1;
        newLattice[yCenter() + 2][xCenter() - 6] = 1;
        newLattice[yCenter() + 3][xCenter() - 6] = 1;
        newLattice[yCenter() + 4][xCenter() - 6] = 1;

        //Bottom Right <
        newLattice[yCenter() + 4][xCenter() - 4] = 1;
        newLattice[yCenter() + 5][xCenter() - 4] = 1;
        newLattice[yCenter() + 5][xCenter() - 5] = 1;
        
    //Top Left []
    newLattice[yCenter() - 3][xCenter() - 8] = 1;
    newLattice[yCenter() - 2][xCenter() - 8] = 1;
    newLattice[yCenter() - 3][xCenter() - 9] = 1;
    newLattice[yCenter() - 2][xCenter() - 9] = 1;

    //Bottom Left []
    newLattice[yCenter() + 1][xCenter() - 8] = 1;
    newLattice[yCenter() + 2][xCenter() - 8] = 1;
    newLattice[yCenter() + 1][xCenter() - 9] = 1;
    newLattice[yCenter() + 2][xCenter() - 9] = 1;


     // Right }
        //Top Left >
        newLattice[yCenter() - 5][xCenter() + 3] = 1;
        newLattice[yCenter() - 6][xCenter() + 3] = 1;
        newLattice[yCenter() - 6][xCenter() + 4] = 1;

        //Left |
        newLattice[yCenter() - 5][xCenter() + 5] = 1;
        newLattice[yCenter() - 4][xCenter() + 5] = 1;
        newLattice[yCenter() - 2][xCenter() + 5] = 1;
        newLattice[yCenter() - 3][xCenter() + 5] = 1;
        newLattice[yCenter() - 1][xCenter() + 5] = 1;
        newLattice[yCenter() - 0][xCenter() + 5] = 1;
        newLattice[yCenter() + 1][xCenter() + 5] = 1;
        newLattice[yCenter() + 2][xCenter() + 5] = 1;
        newLattice[yCenter() + 3][xCenter() + 5] = 1;
        newLattice[yCenter() + 4][xCenter() + 5] = 1;

        //Bottom Left <
        newLattice[yCenter() + 4][xCenter() + 3] = 1;
        newLattice[yCenter() + 5][xCenter() + 3] = 1;
        newLattice[yCenter() + 5][xCenter() + 4] = 1;
        
    //Top Right []
    newLattice[yCenter() - 3][xCenter() + 7] = 1;
    newLattice[yCenter() - 2][xCenter() + 7] = 1;
    newLattice[yCenter() - 3][xCenter() + 8] = 1;
    newLattice[yCenter() - 2][xCenter() + 8] = 1;

    //Bottom Right []
    newLattice[yCenter() + 1][xCenter() + 7] = 1;
    newLattice[yCenter() + 2][xCenter() + 7] = 1;
    newLattice[yCenter() + 1][xCenter() + 8] = 1;
    newLattice[yCenter() + 2][xCenter() + 8] = 1;


    setLattice(newLattice);
}

//Builds 
export function build119()
{
    let newLattice = createNewConfig();

    //Makes cap <
    newLattice[yCenter()][xCenter() - 28] = 1;
    newLattice[yCenter() + 1][xCenter() - 27] = 1;
    newLattice[yCenter() - 1][xCenter() - 27] = 1;
    newLattice[yCenter() + 2][xCenter() - 27] = 1;
    newLattice[yCenter() - 2][xCenter() - 27] = 1;

    //Makes Head [
        //Top Ear
        newLattice[yCenter() - 2][xCenter() - 24] = 1;
        newLattice[yCenter() - 3][xCenter() - 24] = 1;
        newLattice[yCenter() - 1][xCenter() - 24] = 1;
        newLattice[yCenter() - 3][xCenter() - 23] = 1;
        newLattice[yCenter() - 2][xCenter() - 23] = 1;

        //Bottom Ear
        newLattice[yCenter() + 3][xCenter() - 24] = 1;
        newLattice[yCenter() + 2][xCenter() - 24] = 1;
        newLattice[yCenter() + 1][xCenter() - 24] = 1;
        newLattice[yCenter() + 3][xCenter() - 23] = 1;
        newLattice[yCenter() + 2][xCenter() - 23] = 1;


    //Makes Shoulders
        //Top Shoulder
        newLattice[yCenter() + 5][xCenter() - 22] = 1;
        newLattice[yCenter() + 6][xCenter() - 22] = 1;
        newLattice[yCenter() + 7][xCenter() - 22] = 1;

        //Bottom Shoulder
        newLattice[yCenter() - 5][xCenter() - 22] = 1;
        newLattice[yCenter() - 6][xCenter() - 22] = 1;
        newLattice[yCenter() - 7][xCenter() - 22] = 1;

        //Fingers
        newLattice[yCenter() - 7][xCenter() - 20] = 1;
        newLattice[yCenter() + 7][xCenter() - 20] = 1;

    //Makes Chest
        //Top Rib
        newLattice[yCenter() - 5][xCenter() - 20] = 1;
        newLattice[yCenter() - 5][xCenter() - 19] = 1;
        newLattice[yCenter() - 4][xCenter() - 19] = 1;
        newLattice[yCenter() - 5][xCenter() - 18] = 1;
        newLattice[yCenter() - 5][xCenter() - 17] = 1;
        newLattice[yCenter() - 5][xCenter() - 16] = 1;
        newLattice[yCenter() - 5][xCenter() - 15] = 1;
        newLattice[yCenter() - 6][xCenter() - 17] = 1;
        newLattice[yCenter() - 5][xCenter() - 14] = 1;
        newLattice[yCenter() - 5][xCenter() - 13] = 1;
        newLattice[yCenter() - 4][xCenter() - 13] = 1;

        //Bottom Rib
        newLattice[yCenter() + 5][xCenter() - 20] = 1;
        newLattice[yCenter() + 5][xCenter() - 19] = 1;
        newLattice[yCenter() + 4][xCenter() - 19] = 1;
        newLattice[yCenter() + 5][xCenter() - 18] = 1;
        newLattice[yCenter() + 5][xCenter() - 17] = 1;
        newLattice[yCenter() + 5][xCenter() - 16] = 1;
        newLattice[yCenter() + 5][xCenter() - 15] = 1;
        newLattice[yCenter() + 6][xCenter() - 17] = 1;
        newLattice[yCenter() + 5][xCenter() - 14] = 1;
        newLattice[yCenter() + 5][xCenter() - 13] = 1;
        newLattice[yCenter() + 4][xCenter() - 13] = 1;
    
        //Pecs
        newLattice[yCenter() - 2][xCenter() - 15] = 1;
        newLattice[yCenter() - 2][xCenter() - 14] = 1;
        newLattice[yCenter() + 2][xCenter() - 14] = 1;
        newLattice[yCenter() + 2][xCenter() - 15] = 1;
    
        //Makes Hands
        newLattice[yCenter() - 6][xCenter() - 12] = 1;
        newLattice[yCenter() - 7][xCenter() - 13] = 1;
        newLattice[yCenter() - 8][xCenter() - 12] = 1;

        newLattice[yCenter() + 6][xCenter() - 12] = 1;
        newLattice[yCenter() + 7][xCenter() - 13] = 1;
        newLattice[yCenter() + 8][xCenter() - 12] = 1;

        //Makes Hips
            //Top Hip
            newLattice[yCenter() - 6][xCenter() - 10] = 1;
            newLattice[yCenter() - 6][xCenter() - 9] = 1;
            newLattice[yCenter() - 6][xCenter() - 8] = 1;
            newLattice[yCenter() - 6][xCenter() - 7] = 1;
            newLattice[yCenter() - 7][xCenter() - 7] = 1;
            newLattice[yCenter() - 7][xCenter() - 6] = 1;
            newLattice[yCenter() - 6][xCenter() - 6] = 1;
            newLattice[yCenter() - 6][xCenter() - 5] = 1;

            //Bottom Hip
            newLattice[yCenter() + 6][xCenter() - 10] = 1;
            newLattice[yCenter() + 6][xCenter() - 9] = 1;
            newLattice[yCenter() + 6][xCenter() - 8] = 1;
            newLattice[yCenter() + 6][xCenter() - 7] = 1;
            newLattice[yCenter() + 7][xCenter() - 7] = 1;
            newLattice[yCenter() + 7][xCenter() - 6] = 1;
            newLattice[yCenter() + 6][xCenter() - 6] = 1;
            newLattice[yCenter() + 6][xCenter() - 5] = 1;

        //Makes Quads
            //Top Quad
            newLattice[yCenter() - 4][xCenter() - 5] = 1;
            newLattice[yCenter() - 3][xCenter() - 5] = 1;
            newLattice[yCenter() - 2][xCenter() - 5] = 1;
            newLattice[yCenter() - 4][xCenter() - 4] = 1;
            newLattice[yCenter() - 3][xCenter() - 4] = 1;
            newLattice[yCenter() - 2][xCenter() - 4] = 1;
            newLattice[yCenter() - 4][xCenter() - 3] = 1;
            newLattice[yCenter() - 3][xCenter() - 3] = 1;
            newLattice[yCenter() - 4][xCenter() - 2] = 1;
            newLattice[yCenter() - 5][xCenter() - 2] = 1;
            newLattice[yCenter() - 3][xCenter() - 1] = 1;

            //Bottom Quad
            newLattice[yCenter() + 4][xCenter() - 5] = 1;
            newLattice[yCenter() + 3][xCenter() - 5] = 1;
            newLattice[yCenter() + 2][xCenter() - 5] = 1;
            newLattice[yCenter() + 4][xCenter() - 4] = 1;
            newLattice[yCenter() + 3][xCenter() - 4] = 1;
            newLattice[yCenter() + 2][xCenter() - 4] = 1;
            newLattice[yCenter() + 4][xCenter() - 3] = 1;
            newLattice[yCenter() + 3][xCenter() - 3] = 1;
            newLattice[yCenter() + 4][xCenter() - 2] = 1;
            newLattice[yCenter() + 5][xCenter() - 2] = 1;
            newLattice[yCenter() + 3][xCenter() - 1] = 1;


        //Makes Legs
            //Knee caps
                newLattice[yCenter() - 6][xCenter() ] = 1;
                newLattice[yCenter() - 6][xCenter() + 1] = 1;
                newLattice[yCenter() - 5][xCenter() + 1] = 1;

                newLattice[yCenter() + 6][xCenter() ] = 1;
                newLattice[yCenter() + 6][xCenter() + 1] = 1;
                newLattice[yCenter() + 5][xCenter() + 1] = 1;

            //Top Heel
                newLattice[yCenter() - 5][xCenter() + 3] = 1;
                newLattice[yCenter() - 4][xCenter() + 3] = 1;
                newLattice[yCenter() - 5][xCenter() + 4] = 1;
                newLattice[yCenter() - 4][xCenter() + 4] = 1;
                newLattice[yCenter() - 5][xCenter() + 5] = 1;
                newLattice[yCenter() - 4][xCenter() + 5] = 1;


            //Bottom Heel
                newLattice[yCenter() + 5][xCenter() + 3] = 1;
                newLattice[yCenter() + 4][xCenter() + 3] = 1;
                newLattice[yCenter() + 5][xCenter() + 4] = 1;
                newLattice[yCenter() + 4][xCenter() + 4] = 1;
                newLattice[yCenter() + 5][xCenter() + 5] = 1;
                newLattice[yCenter() + 4][xCenter() + 5] = 1;

            //Toes
                newLattice[yCenter() - 7][xCenter() + 3] = 1;
                newLattice[yCenter() - 8][xCenter() + 4] = 1;
                newLattice[yCenter() - 9][xCenter() + 5] = 1;
                newLattice[yCenter() - 8][xCenter() + 6] = 1;

                newLattice[yCenter() + 7][xCenter() + 3] = 1;
                newLattice[yCenter() + 8][xCenter() + 4] = 1;
                newLattice[yCenter() + 9][xCenter() + 5] = 1;
                newLattice[yCenter() + 8][xCenter() + 6] = 1;
            

    setLattice(newLattice);
}