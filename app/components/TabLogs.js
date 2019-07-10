import React, { Component } from 'react';
import { get, isEqual }     from 'lodash';
import Logs                 from './Logs';
import Config               from '../modules/Config';

export default class TabLogs extends React.Component {
    state = {
        activeTab: 'gpu',
        data: Config.storage,
        payload: {}
    };

    locked = false;

    constructor(props) {
        super(props);
        this.state.payload = 'payload' in props ? props.payload : {};

        if (!get(this.state.data, 'config.machine.gpu_miner.enable', false)) {
            this.state.activeTab = 'cpu';
            if (!get(this.state.data, 'config.machine.cpu_miner.enable', false)) {
                this.state.activeTab = 'server';
            }
        }
    }

    shouldComponentUpdate() {
        return !this.locked;
    }

    componentWillReceiveProps(nextProps) {

        const oldPayload = this.state.payload;
        const newPayload = nextProps.payload;
        const oldActive  = this.state.activeTab;

        let key = false;
        switch (this.state.activeTab) {
            case 'gpu':
                key = 'miner:logs:gpu:0';
                break;
            case 'cpu':
                key = 'miner:logs:cpu';
                break;
            case 'server':
                key = 'serverlog';
                break;
        }

        if (key && !isEqual(get(oldPayload, key, {}), get(newPayload, key, {}))) {
            this.locked = false;
            this.setState({ payload: newPayload });
        }
    }

    componentDidMount() {
        this.locked = true;
    }

    componentDidUpdate() {
        this.locked = true;
    }

    changeTab = (type) => {
        this.locked = false;
        this.setState({ activeTab: type });
    };

    isActive = (type) => {
        return this.state.activeTab === type;
    };

    render() {

        const { isActive, changeTab } = this;

        const cpuMiner  = get(this.state.payload, 'miner:logs:cpu', false);
        const gpuMiner  = get(this.state.payload, 'miner:logs:gpu:0', false);
        const serverLog = get(this.state.payload, 'serverlog', false);

        return (
            <div className="tabbed-content">
                <div className={ 'tab-headers tab-active-' + this.state.activeTab }>
                    { serverLog && <div className="tab server" onClick={ () => changeTab('server') }>Server Logs</div> }
                    { gpuMiner  && <div className="tab gpu" onClick={ () => changeTab('gpu')    }>GPU Miner</div> }
                    { cpuMiner  && <div className="tab cpu" onClick={ () => changeTab('cpu')    }>CPU Miner</div> }
                </div>
                <div className="tab-content">
                    { serverLog && isActive('server') && <div className="content active"><Logs logs={ serverLog.split("\n") } /></div> }
                    { gpuMiner  && isActive('gpu')    && <div className="content active"><Logs logs={ gpuMiner } /></div> }
                    { cpuMiner  && isActive('cpu')    && <div className="content active"><Logs logs={ cpuMiner } /></div> }
                </div>
            </div>
        )
    }

}