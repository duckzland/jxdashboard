import React        from 'react';
import ScrollArea   from 'react-scrollbar';
import { get }      from 'lodash';
import TabLogs      from '../components/TabLogs';
import Network      from '../modules/Network';
import InfoBar      from '../components/InfoBar';
import Graph        from '../components/Graph';
import MachineInfo  from '../components/MachineInfo';
import NetworkInfo  from '../components/NetworkInfo';
import MemoryInfo   from '../components/MemoryInfo';
import DiskInfo     from '../components/DiskInfo';
import FanInfo      from '../components/FanInfo';
import CpuInfo      from '../components/CpuInfo';
import GpuInfo      from '../components/GpuInfo';
import Config       from '../modules/Config';

export default class PageDashboard extends React.Component {

    state   = { payload: '', connected: false };
    port    = window.jxdashboard.port;
    host    = window.jxdashboard.host;
    monitor = false;
    debug   = false;

    constructor(props) {
        super(props);
        this.monitor = new Network(this.host, this.port, 'monitor:server', this.update, this.disconnected, this.disconnected);
        this.monitor.send();
    }

    componentWillUnmount() {
        this.monitor.close();
    }

    update = (network, buffers) => {
        let payload = false;
        try {
            payload = JSON.parse(buffers.slice(-1).pop());
        }
        catch(err) {
            this.setState({
                payload     : '',
                connected   : false
            });
        }

        if (payload) {
            this.setState({
                payload     : payload,
                connected   : true
            });
        }
    };

    connection = (state) => {
        const { close, send } = this.monitor;
        switch (state) {
            case 'connect':
                send();
                this.forceUpdate();
                break;
            case 'stop':
                close();
                this.forceUpdate();
                break;
        }
    };

    disconnected = () => {
        this.setState({
            payload     : '',
            connected   : false
        });
    };

    extractHashRate = () => {
        const { payload } = this.state;
        const data = Config.storage;
        return get(data, 'config.machine.gpu_miner.enable', false)
            ? get(payload, 'miner:hashrate:gpu:0', false)
            : get(data, 'config.machine.cpu_miner.enable', false) ? get(payload, 'miner:hashrate:cpu', false) : false;
    };

    extractPowerRate = () => {
        const { payload } = this.state;
        return get(payload, 'gpu:total_watt', false);
    };

    extractTempRate = () => {
        const { payload } = this.state;
        return get(payload, 'temperature:highest',  false);
    };

    render() {
        const { debug, connection, extractHashRate, extractPowerRate, extractTempRate } = this;

        const { connected } = this.state;
        const hashRate      = extractHashRate();
        const tempRate      = extractTempRate();
        const powerRate     = extractPowerRate();
        const hasGraph      = hashRate || tempRate || powerRate;

        const sidebarProps = {
            key: 'sidebar-element',
            speed: 0.8,
            className: 'side-panels panel large',
            contentClassName: 'content',
            horizontal: false,
            vertical: true
        };

        const contentProps = {
            key: 'content-element',
            speed: 0.8,
            className: 'main-panels panel',
            contentClassName: 'content',
            horizontal: false,
            vertical: true
        };

        const panelProps = {
            key: 'main-panel',
            className: 'panels ' + (connected ? 'server-connected' : 'server-disconnected')
        };

        return (
            <div {...panelProps}>
                { connected && <ScrollArea { ...sidebarProps }>
                    <MachineInfo { ...this.state } />
                    <MemoryInfo  { ...this.state } />
                    <DiskInfo    { ...this.state } />
                    <NetworkInfo { ...this.state } />
                    <FanInfo     { ...this.state } />
                    <CpuInfo     { ...this.state } />
                    <GpuInfo     { ...this.state } />
                </ScrollArea> }
                <ScrollArea { ...contentProps }>
                    <div className="inner-content wrappedbar">
                        <div className="statusbar-info">
                            <svg className="svg-frame"
                                 ref={ref => (this.svgElement = ref)}
                                 viewBox="0 0 69.393 14.471"
                                 xmlns="http://www.w3.org/2000/svg"
                                 vector-effect="non-scaling-stroke"
                                 preserveAspectRatio="none">
                                <path className="orange-line" d="M69.257 9.788l.004 2.129-1.322 1.438L58 13.324l-.982 1.015h-6.615l-1.323-1.323H1.455L.132 11.693V9.047"/>
                                <path className="orange-line" d="M69.189 5.079V2.432l-.794-1.323h-3.44l-.764-.977-5.777.033-.602.944H1.455L.132 2.432v2.646"/>
                                <path className="orange-line" d="M63.35 1.292l-.394.695-3.585-.006"/>
                                <path className="orange-line" d="M51.75 12.632l.32-.565 3.584.006"/>
                            </svg>
                            <div className="inner-content">
                                <h3 className="title">Status</h3>
                                <div className="statusbar">
                                    <div className="status">
                                        { connected ? 'Connected' : 'Disconnected' }
                                    </div>
                                    <div className="action">
                                        { connected
                                            ? <button type="button" className="form-button" onClick={ () => { connection('stop')    } }>Stop</button>
                                            : <button type="button" className="form-button" onClick={ () => { connection('connect') } }>Start</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        { connected && <InfoBar { ...this.state } /> }
                    </div>
                    { connected && hasGraph && <div className="inner-content graph">
                        { hashRate  !== false && <Graph title="Hash Rate"   labelX="" labelY="" payload={ String(hashRate ).replace(/[^0-9.]/g, "") } connected={ connected }/> }
                        { debug     !== false && <Graph title="Hash Rate"   labelX="" labelY="" payload={ String(hashRate ).replace(/[^0-9.]/g, "") } connected={ connected }/> }
                        { debug     !== false && <Graph title="Hash Rate"   labelX="" labelY="" payload={ String(hashRate ).replace(/[^0-9.]/g, "") } connected={ connected }/> }
                        { tempRate  !== false && <Graph title="Temperature" labelX="" labelY="" payload={ String(tempRate ).replace(/[^0-9.]/g, "") } connected={ connected }/> }
                        { powerRate !== false && <Graph title="Power Usage" labelX="" labelY="" payload={ String(powerRate).replace(/[^0-9.]/g, "") } connected={ connected }/> }
                    </div> }
                    { connected && <div className="inner-content tabs">
                        <TabLogs { ...this.state }/>
                    </div> }
                </ScrollArea>
            </div>
        )
    }
}
