'use strict';

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {totemsFlip, totemsFlipOne} from '../../actions';
import {MODE_EDIT} from '../../constants';
import './Totem.styl';

const totemProps = {
    '0': { },
    '1': {
        secondary: true,
        style: {
            transform: 'rotateY(180deg)'
        }
    },
};

const Totem = React.createClass({
    propTypes: {
        x: PropTypes.number,
        y: PropTypes.number,
        value: PropTypes.number
    },
    onClick() {
        const {blockInput, options, x, y, totemsFlip, totemsFlipOne} = this.props;
        if (blockInput) return;
        if (options.mode === MODE_EDIT) {
            totemsFlipOne(x, y);
        } else {
            totemsFlip(x, y);
        }
    },
    render() {
        const {value} = this.props;

        return <FloatingActionButton className="totem" {...totemProps[value]} onClick={this.onClick} />;
    }
});

function mapStateToProps(state, ownProps) {
    const {x, y} = ownProps;
    const {global, options} = state;
    const {blockInput} = global;
    return {
        blockInput,
        options,
        value: state.totems.get(x, y)
    };
}

const mapDispatchToProps = {
    totemsFlip,
    totemsFlipOne
};

export default connect(mapStateToProps, mapDispatchToProps)(Totem);