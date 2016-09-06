'use strict';

import React from 'react';
import {connect} from 'react-redux';
import Totem from './Totem';

import './index.styl';

const TotemRow = React.createClass({
    render() {
        const {row, y} = this.props;
        return <div>
            {row.map( (value, x) => <Totem key={x} x={x} y={y} />)}
        </div>
    }
});

const TotemsField = React.createClass({
    render() {
        const {totems} = this.props;
        return <div>
            {totems.values.map( (row, y) => <TotemRow key={y} row={row} y={y} /> )}
        </div>;
    }
});

function mapStateToProps(state) {
    const {totems} = state;
    return {
        totems
    };
}

export default connect(mapStateToProps)(TotemsField);