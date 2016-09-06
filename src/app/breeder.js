'use strict';

import Totems from './classes/Totems';
import { DIRECTIONS } from './constants';

const defaultOptions = {
    maxGenerations: 100,
    maxPopulationSize: 500,
    onProgress: () => {
    }
};

const PROGRESS_MUTATION = 'mutation';
const PROGRESS_GENERATION = 'generation';

function mutating(populations, options, selectedPopulations) {
    const { onProgress } = options;
    return populations.reduce( (result, totems, i) => {
        totems.forEach( (x, y) => {
            DIRECTIONS.forEach( direction => {
                const nextX = x + direction.x;
                const nextY = y + direction.y;
                if ( totems.has( nextX, nextY ) ) {
                    const nextTotems = totems.flip( nextX, nextY );
                    if ( nextTotems.hash in selectedPopulations && selectedPopulations[nextTotems.hash] <= nextTotems.changesSize ) return;
                    result.push( nextTotems );
                    selectedPopulations[nextTotems.hash] = nextTotems.changesSize;
                    onProgress( PROGRESS_MUTATION, nextTotems, populations.length, i );
                }
            } );
        } );

        return result;
    }, [] )
}

function surviving(populations, options) {
    const { maxPopulationSize } = options;
    return populations.sort( (a, b) => {
        return b.fitness - a.fitness;
    } ).slice( 0, maxPopulationSize );
}

function resolver(totems, options = {}) {
    options = { ...defaultOptions, ...options };
    const { maxGenerations, onProgress } = options;
    const selectedPopulations = {
        [totems.hash]: totems
    };
    var populations = [totems];
    var generation = 0;
    while ( generation++ < maxGenerations && populations[0].fitness !== 1 ) {
        populations = mutating( populations, options, selectedPopulations );
        populations = surviving( populations, options );
        onProgress( PROGRESS_GENERATION, populations, generation );
    }
    return populations[0];
}

function onProgress(type, ...args) {
    switch ( type ) {
        case PROGRESS_GENERATION:
            const [populations, generation] = args;
            self.postMessage( {
                type: 'progress',
                bestFitness: populations[0].fitness,
                populationCount: populations.length,
                generation
            } );
            break;
    }
}

self.addEventListener( 'message', function (e) {
    const { command, ...args } = e.data;
    switch ( command ) {
        case 'run':
            const { totems, options } = args;
            const result = resolver( new Totems( totems ), {
                ...options,
                onProgress
            } );
            self.postMessage( {
                type: 'result',
                ...result.toObject()
            } );
            break;
        default:
            throw new Error( `Unknown command '${command}'` );
    }
}, false );
