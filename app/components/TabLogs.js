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
        const visible   = cpuMiner || gpuMiner || serverLog;
        return (
            visible
                ? <div className="tabbed-content">
                    <svg className="svg-frame"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 69.393 35.638"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M69.257 30.954l.004 2.13-1.322 1.438L58 34.49l-.982 1.016h-6.615l-1.323-1.324H1.455L.132 32.859v-2.646"/>
                        <path className="orange-line" d="M69.189 5.079V2.432l-.794-1.323h-3.44l-.764-.977-5.777.033-.602.944H1.455L.132 2.432v2.646"/>
                        <path className="orange-line" d="M63.35 1.292l-.394.695-3.585-.006"/>
                        <path className="orange-line" d="M51.75 33.799l.32-.566 3.584.007"/>
                    </svg>
                    <div className="inner-content">
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
                </div>
                : null
        )
    }

}