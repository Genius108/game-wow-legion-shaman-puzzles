'use strict';

import $private from 'yyf-core/lib/private';
import {DIRECTIONS} from '../constants';
const $p = $private();

function getHash(totems) {
    return totems.map( row => row.join('')).join('');
}

function isExists(totems, x, y) {
    return y >= 0 && y < totems.length && x >=0 && x < totems[y].length;
}

function getFitness(hash) {
    return hash.replace(/1/g,'').length / hash.length;
}

function flipTotem(totems, x, y) {
    if ( isExists(totems, x, y) ) {
        totems[y][x] = +!totems[y][x];
    }
}

function cloneTotems(totems) {
    return totems.slice().map( row => row.slice() );
}

export default class Totems {
    fromString(input) {
        const totems = input.trim().split('\n').map( row => Array.from(row.trim()).map(Number) );
        return new Totems(totems);
    }
    constructor(totems = [], changes = []) {
        const hash = getHash(totems);
        const fitness = getFitness(hash);
        const count = hash.length;
        const changesSize = changes.length;
        $p(this, {
            totems,
            hash,
            fitness,
            changes,
            changesSize,
            count
        });
    }
    flip(x, y) {
        const {totems, changes} = $p(this);
        let result = cloneTotems(totems);
        DIRECTIONS.forEach( direction => {
            const fx = x + direction.x;
            const fy = y + direction.y;
            flipTotem(result, fx, fy);
        });
        return new Totems(result, [...changes, {x,y}] );
    }
    has(x, y) {
        return isExists($p(this).totems, x, y);
    }
    set(x, y, value) {
        const {totems, changes} = $p(this);
        let result = cloneTotems(totems);
        result[y][x] = value;
        return new Totems(result, changes);
    }
    get(x, y) {
        return $p(this).totems[y][x];
    }
    get hash() {
        return $p(this).hash;
    }
    get count() {
        return $p(this).count;
    }
    get fitness() {
        return $p(this).fitness;
    }
    get changesSize() {
        return $p(this).changesSize;
    }
    get values() {
        return cloneTotems($p(this).totems);
    }
    copy() {
        return new Totems($p(this).totems);
    }
    forEach(callback) {
        const {totems} = $p(this);
        totems.forEach( (row, y) => {
            row.forEach( (value, x) => callback(x, y, value));
        })
    }
    toObject() {
        const {hash, changes, fitness} = $p(this);
        return {
            hash,
            changes,
            fitness
        };
    }
}