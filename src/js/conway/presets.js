import {latticeArray, visBounds} from './generateLattice.js';
import {createVis, visLatticeArray } from './generateLattice.js';
import {canvas, displayLattice} from "./displayLattice.js";
import { clear } from './UIFunctionality.js';


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
    clear();

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

export function build1234()
{
    let newLattice = createNewConfig();

    //Windows
    newLattice[yCenter()][xCenter()] = 1;
    newLattice[yCenter() - 2][xCenter()] = 1;

    //Top
    newLattice[yCenter() - 3][xCenter() - 1] = 1;
    newLattice[yCenter() - 3][xCenter() - 1] = 1;
    newLattice[yCenter() - 4][xCenter()] = 1;
    newLattice[yCenter() - 3][xCenter() + 1] = 1;

    //Walls
        //Left Wall
        newLattice[yCenter() - 2][xCenter() - 2] = 1;
        newLattice[yCenter() - 1][xCenter() - 2] = 1;
        newLattice[yCenter() - 0][xCenter() - 2] = 1;

        //Right Wall
        newLattice[yCenter() - 0][xCenter() + 2] = 1;
        newLattice[yCenter() - 2][xCenter() + 2] = 1;
        newLattice[yCenter() - 1][xCenter() + 2] = 1;

    //Wings
        //Left Fin
        newLattice[yCenter() + 1][xCenter() - 3] = 1;
        newLattice[yCenter()][xCenter() - 4] = 1;
        newLattice[yCenter()][xCenter() - 5] = 1;
        newLattice[yCenter() + 1][xCenter() - 5] = 1;

        //Right Fin
        newLattice[yCenter() + 1][xCenter() + 3] = 1;
        newLattice[yCenter() + 0][xCenter() + 4] = 1;
        newLattice[yCenter() + 0][xCenter() + 5] = 1;
        newLattice[yCenter() + 1][xCenter() + 5] = 1;

        //Bottom Sail
        newLattice[yCenter() + 2][xCenter() + 2] = 1;
        newLattice[yCenter() + 2][xCenter() + 1] = 1;
        newLattice[yCenter() + 2][xCenter() + 0] = 1;
        newLattice[yCenter() + 2][xCenter() - 1] = 1;
        newLattice[yCenter() + 2][xCenter() - 2] = 1;
 
    //Bottom Booper
    newLattice[yCenter() + 4][xCenter()] = 1;
    newLattice[yCenter() + 6][xCenter()] = 1;
    newLattice[yCenter() + 5][xCenter() - 1] = 1;
    newLattice[yCenter() + 5][xCenter() + 1] = 1;

    setLattice(newLattice);
}

//Screw Kyle for this one
export function build295()
{
    let newLattice = createNewConfig();

    //Hat
        newLattice[yCenter() - 20][xCenter() - 20] = 1;
        newLattice[yCenter() - 19][xCenter() - 20] = 1;
        newLattice[yCenter() - 20][xCenter() - 19] = 1;

        newLattice[yCenter() - 21][xCenter() - 19] = 1;
        newLattice[yCenter() - 21][xCenter() - 18] = 1;
        newLattice[yCenter() - 21][xCenter() - 17] = 1;
        newLattice[yCenter() - 22][xCenter() - 17] = 1;
        newLattice[yCenter() - 22][xCenter() - 18] = 1;

        newLattice[yCenter() - 19][xCenter() - 21] = 1;
        newLattice[yCenter() - 18][xCenter() - 21] = 1;
        newLattice[yCenter() - 17][xCenter() - 21] = 1;
        newLattice[yCenter() - 18][xCenter() - 22] = 1;
        newLattice[yCenter() - 17][xCenter() - 22] = 1;

    //Beetle
        //Left Beetle Head
            newLattice[yCenter() - 17][xCenter() - 19] = 1;
            newLattice[yCenter() - 16][xCenter() - 19] = 1;
            newLattice[yCenter() - 15][xCenter() - 18] = 1;
            newLattice[yCenter() - 15][xCenter() - 17] = 1;
            newLattice[yCenter() - 15][xCenter() - 16] = 1;
            newLattice[yCenter() - 14][xCenter() - 16] = 1;
            newLattice[yCenter() - 14][xCenter() - 17] = 1;
            newLattice[yCenter() - 13][xCenter() - 17] = 1;
            newLattice[yCenter() - 12][xCenter() - 17] = 1;

        //Right Beetle Head
            newLattice[yCenter() - 16][xCenter() - 15] = 1;
            newLattice[yCenter() - 16][xCenter() - 14] = 1;
            newLattice[yCenter() - 17][xCenter() - 15] = 1;
            newLattice[yCenter() - 17][xCenter() - 14] = 1;
            newLattice[yCenter() - 18][xCenter() - 15] = 1;
            newLattice[yCenter() - 17][xCenter() - 13] = 1;
            newLattice[yCenter() - 17][xCenter() - 12] = 1;
            newLattice[yCenter() - 19][xCenter() - 16] = 1;
            newLattice[yCenter() - 19][xCenter() - 17] = 1;
        
        //Left Beetle Body
            newLattice[yCenter() - 11][xCenter() - 16] = 1;
            newLattice[yCenter() - 11][xCenter() - 15] = 1;
            newLattice[yCenter() - 11][xCenter() - 14] = 1;
            newLattice[yCenter() - 11][xCenter() - 13] = 1;
            newLattice[yCenter() - 11][xCenter() - 12] = 1;
            newLattice[yCenter() - 12][xCenter() - 14] = 1;
        
        //Right Beetle Body
            newLattice[yCenter() - 12][xCenter() - 11] = 1;
            newLattice[yCenter() - 13][xCenter() - 11] = 1;
            newLattice[yCenter() - 14][xCenter() - 11] = 1;
            newLattice[yCenter() - 15][xCenter() - 11] = 1;
            newLattice[yCenter() - 16][xCenter() - 11] = 1;
            newLattice[yCenter() - 14][xCenter() - 12] = 1;
        
        //Left Beetle Foot
            newLattice[yCenter() - 10][xCenter() - 16] = 1;
            newLattice[yCenter() - 9][xCenter() - 15] = 1;
            newLattice[yCenter() - 8][xCenter() - 14] = 1;
            newLattice[yCenter() - 8][xCenter() - 16] = 1;

        //Right Beetle Foot
            newLattice[yCenter() - 16][xCenter() - 10] = 1;
            newLattice[yCenter() - 15][xCenter() - 9] = 1;
            newLattice[yCenter() - 14][xCenter() - 8] = 1;
            newLattice[yCenter() - 16][xCenter() - 8] = 1;

    
    //Wings
        //Left Wing
            newLattice[yCenter() - 12][xCenter() - 19] = 1;
            newLattice[yCenter() - 12][xCenter() - 20] = 1;
            newLattice[yCenter() - 12][xCenter() - 21] = 1;
            newLattice[yCenter() - 12][xCenter() - 22] = 1;

            newLattice[yCenter() - 11][xCenter() - 20] = 1;
            newLattice[yCenter() - 11][xCenter() - 21] = 1;
            newLattice[yCenter() - 11][xCenter() - 22] = 1;

            newLattice[yCenter() - 9][xCenter() - 21] = 1;
            newLattice[yCenter() - 10][xCenter() - 21] = 1;
            newLattice[yCenter() - 10][xCenter() - 23] = 1;
            newLattice[yCenter() - 9][xCenter() - 22] = 1;
            newLattice[yCenter() - 9][xCenter() - 23] = 1;
        
        //Left Glitter
            newLattice[yCenter() - 9][xCenter() - 19] = 1;
            newLattice[yCenter() - 7][xCenter() - 22] = 1;

        //Right Wing
        newLattice[ yCenter() + -22 ][ xCenter() + -11 ] = 1; 
    newLattice[ yCenter() + -21 ][ xCenter() + -11 ] = 1; 
    newLattice[ yCenter() + -20 ][ xCenter() + -11 ] = 1; 
    newLattice[ yCenter() + -23 ][ xCenter() + -10 ] = 1; 
    newLattice[ yCenter() + -23 ][ xCenter() + -9 ] = 1; 
    newLattice[ yCenter() + -22 ][ xCenter() + -9 ] = 1; 
    newLattice[ yCenter() + -21 ][ xCenter() + -9 ] = 1; 
    newLattice[ yCenter() + -21 ][ xCenter() + -10 ] = 1; 
    newLattice[ yCenter() + -22 ][ xCenter() + -7 ] = 1; 
    newLattice[ yCenter() + -19 ][ xCenter() + -9 ] = 1;

    newLattice[ yCenter() + -19 ][ xCenter() + -12 ] = 1; 
    newLattice[ yCenter() + -20 ][ xCenter() + -12 ] = 1; 
    newLattice[ yCenter() + -21 ][ xCenter() + -12 ] = 1; 
    newLattice[ yCenter() + -22 ][ xCenter() + -12 ] = 1;
    newLattice[ yCenter() + -7 ][ xCenter() + -18 ] = 1; 
    newLattice[ yCenter() + -6 ][ xCenter() + -19 ] = 1; 
    newLattice[ yCenter() + -5 ][ xCenter() + -20 ] = 1; 
    newLattice[ yCenter() + -4 ][ xCenter() + -18 ] = 1; 
    newLattice[ yCenter() + -3 ][ xCenter() + -18 ] = 1; 
    newLattice[ yCenter() + -18 ][ xCenter() + -7 ] = 1; 
    newLattice[ yCenter() + -19 ][ xCenter() + -6 ] = 1; 
    newLattice[ yCenter() + -20 ][ xCenter() + -5 ] = 1; 
    newLattice[ yCenter() + -18 ][ xCenter() + -4 ] = 1; 
    newLattice[ yCenter() + -18 ][ xCenter() + -3 ] = 1;

    newLattice[ yCenter() + -9 ][ xCenter() + -11 ] = 1; 
    newLattice[ yCenter() + -8 ][ xCenter() + -11 ] = 1; 
    newLattice[ yCenter() + -7 ][ xCenter() + -11 ] = 1; 
    newLattice[ yCenter() + -6 ][ xCenter() + -11 ] = 1; 
    newLattice[ yCenter() + -5 ][ xCenter() + -11 ] = 1; 
    newLattice[ yCenter() + -4 ][ xCenter() + -11 ] = 1; 
    newLattice[ yCenter() + -3 ][ xCenter() + -11 ] = 1; 
    newLattice[ yCenter() + -7 ][ xCenter() + -12 ] = 1; 
    newLattice[ yCenter() + -2 ][ xCenter() + -10 ] = 1; 
    newLattice[ yCenter() + -1 ][ xCenter() + -10 ] = 1; 
    newLattice[ yCenter() + -1 ][ xCenter() + -11 ] = 1; 
    newLattice[ yCenter() + -5 ][ xCenter() + -10 ] = 1; 
    newLattice[ yCenter() + -5 ][ xCenter() + -9 ] = 1; 
    newLattice[ yCenter() + -4 ][ xCenter() + -9 ] = 1; 
    newLattice[ yCenter() + -3 ][ xCenter() + -9 ] = 1; 
    newLattice[ yCenter() + -3 ][ xCenter() + -8 ] = 1; 
    newLattice[ yCenter() + -2 ][ xCenter() + -8 ] = 1; 
    newLattice[ yCenter() + -2 ][ xCenter() + -7 ] = 1; 
    newLattice[ yCenter() + -2 ][ xCenter() + -6 ] = 1; 
    newLattice[ yCenter() + -2 ][ xCenter() + -5 ] = 1; 
    newLattice[ yCenter() + -1 ][ xCenter() + -7 ] = 1; 
    newLattice[ yCenter() + -1 ][ xCenter() + -6 ] = 1; 
    newLattice[ yCenter() + 0 ][ xCenter() + -6 ] = 1; 
    newLattice[ yCenter() + -1 ][ xCenter() + -4 ] = 1; 
    newLattice[ yCenter() + -3 ][ xCenter() + -4 ] = 1; 
    newLattice[ yCenter() + -4 ][ xCenter() + -3 ] = 1; 
    newLattice[ yCenter() + -5 ][ xCenter() + -2 ] = 1; 
    newLattice[ yCenter() + -6 ][ xCenter() + -2 ] = 1; 
    newLattice[ yCenter() + -7 ][ xCenter() + -2 ] = 1; 
    newLattice[ yCenter() + -8 ][ xCenter() + -2 ] = 1; 
    newLattice[ yCenter() + -7 ][ xCenter() + -1 ] = 1; 
    newLattice[ yCenter() + -6 ][ xCenter() + -1 ] = 1; 
    newLattice[ yCenter() + -6 ][ xCenter() + 0 ] = 1; 
    newLattice[ yCenter() + -4 ][ xCenter() + -1 ] = 1; 
    newLattice[ yCenter() + -8 ][ xCenter() + -3 ] = 1; 
    newLattice[ yCenter() + -9 ][ xCenter() + -3 ] = 1; 
    newLattice[ yCenter() + -9 ][ xCenter() + -4 ] = 1; 
    newLattice[ yCenter() + -9 ][ xCenter() + -5 ] = 1; 
    newLattice[ yCenter() + -10 ][ xCenter() + -5 ] = 1; 
    newLattice[ yCenter() + -11 ][ xCenter() + -3 ] = 1; 
    newLattice[ yCenter() + -11 ][ xCenter() + -4 ] = 1; 
    newLattice[ yCenter() + -11 ][ xCenter() + -5 ] = 1; 
    newLattice[ yCenter() + -11 ][ xCenter() + -6 ] = 1; 
    newLattice[ yCenter() + -11 ][ xCenter() + -7 ] = 1; 
    newLattice[ yCenter() + -11 ][ xCenter() + -8 ] = 1; 
    newLattice[ yCenter() + -11 ][ xCenter() + -9 ] = 1; 
    newLattice[ yCenter() + -12 ][ xCenter() + -7 ] = 1; 
    newLattice[ yCenter() + -10 ][ xCenter() + -2 ] = 1; 
    newLattice[ yCenter() + -10 ][ xCenter() + -1 ] = 1; 
    newLattice[ yCenter() + -11 ][ xCenter() + -1 ] = 1;
    newLattice[ yCenter() +  -2 ][ xCenter() +  -1 ] = 1;
    newLattice[ yCenter() +  1 ][ xCenter() +  -3 ] = 1;
    newLattice[ yCenter() +  -3 ][ xCenter() +  1 ] = 1;
    newLattice[ yCenter() +  2 ][ xCenter() +  -6 ] = 1;
    newLattice[ yCenter() +  2 ][ xCenter() +  -7 ] = 1;
    newLattice[ yCenter() +  3 ][ xCenter() +  -5 ] = 1;
    newLattice[ yCenter() +  4 ][ xCenter() +  -7 ] = 1;
    newLattice[ yCenter() +  4 ][ xCenter() +  -6 ] = 1;
    newLattice[ yCenter() +  5 ][ xCenter() +  -6 ] = 1;
    newLattice[ yCenter() +  6 ][ xCenter() +  -6 ] = 1;
    newLattice[ yCenter() +  -5 ][ xCenter() +  3 ] = 1;
    newLattice[ yCenter() +  -6 ][ xCenter() +  2 ] = 1;
    newLattice[ yCenter() +  -7 ][ xCenter() +  2 ] = 1;
    newLattice[ yCenter() +  -7 ][ xCenter() +  4 ] = 1;
    newLattice[ yCenter() +  -6 ][ xCenter() +  4 ] = 1;
    newLattice[ yCenter() +  -6 ][ xCenter() +  5 ] = 1;
    newLattice[ yCenter() +  -6 ][ xCenter() +  6 ] = 1;
    newLattice[ yCenter() +  2 ][ xCenter() +  -1 ] = 1;
    newLattice[ yCenter() +  1 ][ xCenter() +  0 ] = 1;
    newLattice[ yCenter() +  0 ][ xCenter() +  1 ] = 1;
    newLattice[ yCenter() +  -1 ][ xCenter() +  2 ] = 1;
    newLattice[ yCenter() +  2 ][ xCenter() +  2 ] = 1;
    newLattice[ yCenter() +  -1 ][ xCenter() +  -2 ] = 1;        
    newLattice[ yCenter() +  4 ][ xCenter() +  -1 ] = 1;
    newLattice[ yCenter() +  5 ][ xCenter() +  -1 ] = 1;
    newLattice[ yCenter() +  6 ][ xCenter() +  -1 ] = 1;
    newLattice[ yCenter() +  6 ][ xCenter() +  0 ] = 1;
    newLattice[ yCenter() +  5 ][ xCenter() +  0 ] = 1;
    newLattice[ yCenter() +  4 ][ xCenter() +  0 ] = 1;
    newLattice[ yCenter() +  5 ][ xCenter() +  -2 ] = 1;
    newLattice[ yCenter() +  8 ][ xCenter() +  -2 ] = 1;
    newLattice[ yCenter() +  7 ][ xCenter() +  1 ] = 1;
    newLattice[ yCenter() +  8 ][ xCenter() +  1 ] = 1;
    newLattice[ yCenter() +  0 ][ xCenter() +  4 ] = 1;
    newLattice[ yCenter() +  -1 ][ xCenter() +  4 ] = 1;
    newLattice[ yCenter() +  -1 ][ xCenter() +  5 ] = 1;
    newLattice[ yCenter() +  -1 ][ xCenter() +  6 ] = 1;
    newLattice[ yCenter() +  0 ][ xCenter() +  6 ] = 1;
    newLattice[ yCenter() +  0 ][ xCenter() +  5 ] = 1;
    newLattice[ yCenter() +  -2 ][ xCenter() +  5 ] = 1;
    newLattice[ yCenter() +  1 ][ xCenter() +  7 ] = 1;
    newLattice[ yCenter() +  1 ][ xCenter() +  8 ] = 1;
    newLattice[ yCenter() +  -2 ][ xCenter() +  8 ] = 1;
    newLattice[ yCenter() +  0 ][ xCenter() +  10 ] = 1;
    newLattice[ yCenter() +  0 ][ xCenter() +  11 ] = 1;
    newLattice[ yCenter() +  0 ][ xCenter() +  12 ] = 1;
    newLattice[ yCenter() +  3 ][ xCenter() +  9 ] = 1;
    newLattice[ yCenter() +  4 ][ xCenter() +  9 ] = 1;
    newLattice[ yCenter() +  5 ][ xCenter() +  9 ] = 1;
    newLattice[ yCenter() +  6 ][ xCenter() +  9 ] = 1;
    newLattice[ yCenter() +  7 ][ xCenter() +  10 ] = 1;
    newLattice[ yCenter() +  8 ][ xCenter() +  10 ] = 1;
    newLattice[ yCenter() +  9 ][ xCenter() +  3 ] = 1;
    newLattice[ yCenter() +  9 ][ xCenter() +  4 ] = 1;
    newLattice[ yCenter() +  9 ][ xCenter() +  5 ] = 1;
    newLattice[ yCenter() +  9 ][ xCenter() +  6 ] = 1;
    newLattice[ yCenter() +  10 ][ xCenter() +  7 ] = 1;
    newLattice[ yCenter() +  10 ][ xCenter() +  8 ] = 1;
    newLattice[ yCenter() +  10 ][ xCenter() +  0 ] = 1;
    newLattice[ yCenter() +  11 ][ xCenter() +  0 ] = 1;
    newLattice[ yCenter() +  12 ][ xCenter() +  0 ] = 1;
    newLattice[ yCenter() +  14 ][ xCenter() +  2 ] = 1;
    newLattice[ yCenter() +  13 ][ xCenter() +  2 ] = 1;
    newLattice[ yCenter() +  13 ][ xCenter() +  3 ] = 1;
    newLattice[ yCenter() +  13 ][ xCenter() +  5 ] = 1;
    newLattice[ yCenter() +  11 ][ xCenter() +  5 ] = 1;
    newLattice[ yCenter() +  5 ][ xCenter() +  11 ] = 1;
    newLattice[ yCenter() +  5 ][ xCenter() +  13 ] = 1;
    newLattice[ yCenter() +  3 ][ xCenter() +  13 ] = 1;
    newLattice[ yCenter() +  2 ][ xCenter() +  13 ] = 1;
    newLattice[ yCenter() +  2 ][ xCenter() +  14 ] = 1;
    newLattice[ yCenter() +  15 ][ xCenter() +  5 ] = 1;
    newLattice[ yCenter() +  15 ][ xCenter() +  6 ] = 1;
    newLattice[ yCenter() +  15 ][ xCenter() +  7 ] = 1;
    newLattice[ yCenter() +  14 ][ xCenter() +  7 ] = 1;
    newLattice[ yCenter() +  13 ][ xCenter() +  7 ] = 1;
    newLattice[ yCenter() +  16 ][ xCenter() +  6 ] = 1;
    newLattice[ yCenter() +  15 ][ xCenter() +  9 ] = 1;
    newLattice[ yCenter() +  16 ][ xCenter() +  9 ] = 1;
    newLattice[ yCenter() +  16 ][ xCenter() +  10 ] = 1;
    newLattice[ yCenter() +  15 ][ xCenter() +  10 ] = 1;
    newLattice[ yCenter() +  16 ][ xCenter() +  12 ] = 1;
    newLattice[ yCenter() +  15 ][ xCenter() +  13 ] = 1;
    newLattice[ yCenter() +  13 ][ xCenter() +  15 ] = 1;
    newLattice[ yCenter() +  12 ][ xCenter() +  16 ] = 1;
    newLattice[ yCenter() +  10 ][ xCenter() +  16 ] = 1;
    newLattice[ yCenter() +  10 ][ xCenter() +  15 ] = 1;
    newLattice[ yCenter() +  9 ][ xCenter() +  15 ] = 1;
    newLattice[ yCenter() +  9 ][ xCenter() +  16 ] = 1;
    newLattice[ yCenter() +  7 ][ xCenter() +  13 ] = 1;
    newLattice[ yCenter() +  7 ][ xCenter() +  14 ] = 1;
    newLattice[ yCenter() +  7 ][ xCenter() +  15 ] = 1;
    newLattice[ yCenter() +  6 ][ xCenter() +  15 ] = 1;
    newLattice[ yCenter() +  5 ][ xCenter() +  15 ] = 1;
    newLattice[ yCenter() +  6 ][ xCenter() +  16 ] = 1;
    newLattice[ yCenter() +  18 ][ xCenter() +  11 ] = 1;
    newLattice[ yCenter() +  20 ][ xCenter() +  10 ] = 1;
    newLattice[ yCenter() +  20 ][ xCenter() +  9 ] = 1;
    newLattice[ yCenter() +  19 ][ xCenter() +  8 ] = 1;
    newLattice[ yCenter() +  11 ][ xCenter() +  18 ] = 1;
    newLattice[ yCenter() +  10 ][ xCenter() +  20 ] = 1;
    newLattice[ yCenter() +  9 ][ xCenter() +  20 ] = 1;
    newLattice[ yCenter() +  8 ][ xCenter() +  19 ] = 1;
    newLattice[ yCenter() +  18 ][ xCenter() +  13 ] = 1;
    newLattice[ yCenter() +  18 ][ xCenter() +  14 ] = 1;
    newLattice[ yCenter() +  19 ][ xCenter() +  14 ] = 1;
    newLattice[ yCenter() +  17 ][ xCenter() +  14 ] = 1;
    newLattice[ yCenter() +  17 ][ xCenter() +  15 ] = 1;
    newLattice[ yCenter() +  18 ][ xCenter() +  16 ] = 1;
    newLattice[ yCenter() +  18 ][ xCenter() +  17 ] = 1;
    newLattice[ yCenter() +  17 ][ xCenter() +  18 ] = 1;
    newLattice[ yCenter() +  16 ][ xCenter() +  18 ] = 1;
    newLattice[ yCenter() +  18 ][ xCenter() +  19 ] = 1;
    newLattice[ yCenter() +  19 ][ xCenter() +  18 ] = 1;
    newLattice[ yCenter() +  15 ][ xCenter() +  17 ] = 1;
    newLattice[ yCenter() +  14 ][ xCenter() +  17 ] = 1;
    newLattice[ yCenter() +  14 ][ xCenter() +  18 ] = 1;
    newLattice[ yCenter() +  14 ][ xCenter() +  19 ] = 1;
    newLattice[ yCenter() +  13 ][ xCenter() +  18 ] = 1;
    newLattice[ yCenter() +  15 ][ xCenter() +  21 ] = 1;
    newLattice[ yCenter() +  16 ][ xCenter() +  22 ] = 1;
    newLattice[ yCenter() +  17 ][ xCenter() +  22 ] = 1;
    newLattice[ yCenter() +  18 ][ xCenter() +  22 ] = 1;
    newLattice[ yCenter() +  18 ][ xCenter() +  23 ] = 1;
    newLattice[ yCenter() +  15 ][ xCenter() +  23 ] = 1;
    newLattice[ yCenter() +  15 ][ xCenter() +  24 ] = 1;
    newLattice[ yCenter() +  16 ][ xCenter() +  25 ] = 1;
    newLattice[ yCenter() +  20 ][ xCenter() +  23 ] = 1;
    newLattice[ yCenter() +  20 ][ xCenter() +  24 ] = 1;
    newLattice[ yCenter() +  21 ][ xCenter() +  24 ] = 1;
    newLattice[ yCenter() +  21 ][ xCenter() +  23 ] = 1;
    newLattice[ yCenter() +  22 ][ xCenter() +  23 ] = 1;
    newLattice[ yCenter() +  22 ][ xCenter() +  22 ] = 1;
    newLattice[ yCenter() +  23 ][ xCenter() +  22 ] = 1;
    newLattice[ yCenter() +  23 ][ xCenter() +  21 ] = 1;
    newLattice[ yCenter() +  23 ][ xCenter() +  20 ] = 1;
    newLattice[ yCenter() +  24 ][ xCenter() +  21 ] = 1;
    newLattice[ yCenter() +  24 ][ xCenter() +  20 ] = 1;
    newLattice[ yCenter() +  23 ][ xCenter() +  18 ] = 1;
    newLattice[ yCenter() +  22 ][ xCenter() +  18 ] = 1;
    newLattice[ yCenter() +  22 ][ xCenter() +  17 ] = 1;
    newLattice[ yCenter() +  22 ][ xCenter() +  16 ] = 1;
    newLattice[ yCenter() +  23 ][ xCenter() +  15 ] = 1;
    newLattice[ yCenter() +  24 ][ xCenter() +  15 ] = 1;
    newLattice[ yCenter() +  25 ][ xCenter() +  16 ] = 1;
    newLattice[ yCenter() +  21 ][ xCenter() +  15 ] = 1;
    newLattice[ yCenter() +  26 ][ xCenter() +  19 ] = 1;
    newLattice[ yCenter() +  27 ][ xCenter() +  18 ] = 1;
    newLattice[ yCenter() +  28 ][ xCenter() +  19 ] = 1;
    newLattice[ yCenter() +  28 ][ xCenter() +  20 ] = 1;
    newLattice[ yCenter() +  26 ][ xCenter() +  22 ] = 1;
    newLattice[ yCenter() +  22 ][ xCenter() +  26 ] = 1;
    newLattice[ yCenter() +  19 ][ xCenter() +  26 ] = 1;
    newLattice[ yCenter() +  18 ][ xCenter() +  27 ] = 1;
    newLattice[ yCenter() +  19 ][ xCenter() +  28 ] = 1;
    newLattice[ yCenter() +  20 ][ xCenter() +  28 ] = 1;
                    


    setLattice(newLattice);
}

export function buildGtoG()
{
    let newLattice = createNewConfig();

    newLattice[ yCenter() + 19 ][ xCenter() + 24 ] = 1; 
    newLattice[ yCenter() + 17 ][ xCenter() + 23 ] = 1; 
    newLattice[ yCenter() + 18 ][ xCenter() + 23 ] = 1; 
    newLattice[ yCenter() + 18 ][ xCenter() + 22 ] = 1; 
    newLattice[ yCenter() + 19 ][ xCenter() + 22 ] = 1; 
    newLattice[ yCenter() + 18 ][ xCenter() + 1 ] = 1; 
    newLattice[ yCenter() + 17 ][ xCenter() + 2 ] = 1; 
    newLattice[ yCenter() + 18 ][ xCenter() + 0 ] = 1; 
    newLattice[ yCenter() + 17 ][ xCenter() + 0 ] = 1; 
    newLattice[ yCenter() + 16 ][ xCenter() + 0 ] = 1; 
    newLattice[ yCenter() + 17 ][ xCenter() + -3 ] = 1; 
    newLattice[ yCenter() + 16 ][ xCenter() + -3 ] = 1; 
    newLattice[ yCenter() + 15 ][ xCenter() + -3 ] = 1; 
    newLattice[ yCenter() + 17 ][ xCenter() + -4 ] = 1; 
    newLattice[ yCenter() + 16 ][ xCenter() + -5 ] = 1; 
    newLattice[ yCenter() + -8 ][ xCenter() + -18 ] = 1; 
    newLattice[ yCenter() + -9 ][ xCenter() + -18 ] = 1; 
    newLattice[ yCenter() + -8 ][ xCenter() + -19 ] = 1; 
    newLattice[ yCenter() + -7 ][ xCenter() + -19 ] = 1; 
    newLattice[ yCenter() + -9 ][ xCenter() + -20 ] = 1;

    setLattice(newLattice);
    
}