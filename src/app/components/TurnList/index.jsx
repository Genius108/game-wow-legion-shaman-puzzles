'use strict';

import React from 'react';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import If from 'react-snippets/lib/If';
import {globalBlockInput, resolverStart, resolverSetProgress, resolverDone, totemsFlip} from '../../actions';
import './index.styl';

const TurnList = React.createClass({
    onResolveStart() {
        const {globalBlockInput, blockInput, totems, options, resolverStart, resolverSetProgress, resolverDone} = this.props;
        if (blockInput) return;

        const {maxPopulationSize, maxGenerations} = options;
        const worker = new Worker('breeder.js');
        globalBlockInput(true);
        resolverStart(true);
        worker.addEventListener('message', function(e) {
            const {type, ...args} = e.data;
            switch (type) {
                case 'progress':
                    resolverSetProgress(args);
                    break;
                case 'result':
                    resolverDone(args);
                    globalBlockInput(false);
                    break;
            }
        }, false);
        worker.addEventListener('error', function(e) {
            resolverDone(null);
            globalBlockInput(false);
        }, false);

        worker.postMessage({
            command: 'run',
            totems: totems.values,
            options: {
                maxPopulationSize,
                maxGenerations
            }
        });
    },
    onRunTurns() {
        const {globalBlockInput, blockInput, resolver, totemsFlip, resolverDone} = this.props;
        if (blockInput) return;

        const {changes} = resolver.result;
        if (!changes.length) return;
        globalBlockInput(true);
        const timerId = setInterval(() => {
            const {x,y} = changes.shift();
            totemsFlip(x,y);
            resolverDone(resolver.result);
            if (!changes.length) {
                clearInterval(timerId);
                globalBlockInput(false);
            }
        }, 1000);
    },
    render() {
        const {resolver, blockInput} = this.props;
        const {result = {}, progress, started} = resolver;

        return <div className="turn-list">
            <RaisedButton label="Resolve" disabled={blockInput} primary={true} onClick={this.onResolveStart} />
            <If is={!!started}
                render={ () => <ListItem
                    primaryText={`Generation: ${progress.generation|0}`}
                    secondaryText={`Best fitness: ${progress.bestFitness|0}\nPopulation size: ${progress.populationCount|0}`}
                    secondaryTextLines={2}
                    />
                }
                elseRender={ () =>
                    <List>
                        {result.changes.map( ({x, y}, i) => <ListItem key={i} primaryText={`X: ${x + 1}; Y:${y + 1}`} /> ) }
                        <If is={result.fitness === 1}
                            render={ () => <RaisedButton disabled={blockInput} label="Run" onClick={this.onRunTurns} />}
                            elseRender={ () => <ListItem>Not resolved</ListItem> }
                        />
                    </List>
                }
            />
        </div>
    }
});

function mapStateToProps(state) {
    const {global, options, totems, resolver} = state;
    const {blockInput} = global;
    return {
        blockInput,
        options,
        totems,
        resolver
    };
}

const mapDispatchToProps = {
    resolverStart,
    resolverSetProgress,
    resolverDone,
    totemsFlip,
    globalBlockInput
};

export default connect(mapStateToProps, mapDispatchToProps)(TurnList);