'use strict';

import React from 'react';
import {connect} from 'react-redux';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';

import {optionsDisplay, optionsSet} from '../../actions'
import {MODE_EDIT, MODE_PLAY} from '../../constants';
import './index.styl';

const Options = React.createClass({
    onModeChange(event, value) {
        const {optionsSet} = this.props;
        optionsSet({
            mode: value ? MODE_EDIT : MODE_PLAY
        });
    },
    onWidthChange(event, value) {
        const {optionsSet} = this.props;
        optionsSet({width: value});
    },
    onHeightChange(event, value) {
        const {optionsSet} = this.props;
        optionsSet({height: value});
    },
    onMaxPopulationSizeChange(event, value) {
        const {blockInput, optionsSet} = this.props;
        if (blockInput) return;
        optionsSet({maxPopulationSize: value});
    },
    render() {
        const {options, optionsDisplay} = this.props;
        const {mode, display, width, height, maxPopulationSize} = options;
        return <Drawer
            docked={false}
            width={300}
            open={display}
            onRequestChange={display => optionsDisplay(display)}
            className="options"
        >
            <div className="options-title">
                Options
            </div>
            <Divider />
            <MenuItem>
                <Toggle
                    label="Edit mode"
                    defaultToggled={mode === MODE_EDIT}
                    onToggle={this.onModeChange}
                />
            </MenuItem>
            <MenuItem
                primaryText={<Slider
                    id="width"
                    value={width}
                    max={20}
                    min={1}
                    step={1}
                    disabled={true}
                    onChange={this.onWidthChange}
                />}
                secondaryText={`Width: ${width}`}
            />
            <MenuItem
                primaryText={<Slider
                    id="height"
                    value={height}
                    max={20}
                    min={1}
                    step={1}
                    disabled={true}
                    onChange={this.onHeightChange}
                />}
                secondaryText={`Height: ${height}`}
            />
            <MenuItem
                primaryText={<Slider
                    id="maxPopulationSize"
                    value={maxPopulationSize}
                    max={12500}
                    min={25}
                    step={1}
                    onChange={this.onMaxPopulationSizeChange}
                />}
                secondaryText={`Max Population Size: ${maxPopulationSize}`}
            />
        </Drawer>

    }
});

function mapStateToProps(state) {
    const {global, options} = state;
    const {blockInput} = global;
    return {
        blockInput,
        options
    };
}

const mapDispatchToProps = {
    optionsDisplay,
    optionsSet
};

export default connect(mapStateToProps, mapDispatchToProps)(Options);