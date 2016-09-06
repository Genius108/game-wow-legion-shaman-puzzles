'use strict';

import React from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import Options from '../Options';
import TotemsField from '../TotemsField';
import TurnList from '../TurnList';
import {optionsDisplay} from '../../actions'
import './index.styl';


const App = React.createClass({
    render(){
        const {optionsDisplay} = this.props;
        return <div className="layout">
            <AppBar
                iconElementLeft={<IconButton onClick={() => optionsDisplay(true)}><SettingsIcon /></IconButton>}
                title="Title"
            />
            <Options />
            <div className="layout-content">
                <TurnList />
                <TotemsField />
            </div>
        </div>
    }
});

function mapStateToProps() {
    return {};
}

const mapDispatchToProps = {
    optionsDisplay
};

export default connect(mapStateToProps, mapDispatchToProps)(App);