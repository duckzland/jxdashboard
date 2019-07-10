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

    state   = { payload: '', connected: false, data: Config.storage };
    port    = window.jxdashboard.port;
    host    = window.jxdashboard.host;
    monitor = false;
    root    = false;

    constructor(props) {
        super(props);
        this.monitor = new Network(this.host, this.port, 'monitor:server', this.update, this.disconnected, this.disconnected);
        this.monitor.send();
        this.root = props.root;
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
        const { payload, data } = this.state;
        return get(data, 'config.machine.gpu_miner.enable', false)
            ? get(payload, 'miner:hashrate:gpu:0', false)
            : get(data, 'config.machine.cpu_miner.enable', false) ? get(payload, 'miner:hashrate:cpu', false) : false;
    };

    extractPowerRate = () => {
        const { payload, data } = this.state;
        return get(payload, 'gpu:total_watt', false);
    };

    extractTempRate = () => {
        const { payload, data } = this.state;
        return get(payload, 'temperature:highest',  false);
    };

    render() {
        const { connection, extractHashRate, extractPowerRate, extractTempRate } = this;

        const { connected } = this.state;
        const hashRate      = extractHashRate();
        const tempRate      = extractTempRate();
        const powerRate     = extractPowerRate();

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

        return (
            <div className="panels">
                <ScrollArea { ...sidebarProps }>
                    <MachineInfo { ...this.state } />
                    <MemoryInfo  { ...this.state } />
                    <DiskInfo    { ...this.state } />
                    <NetworkInfo { ...this.state } />
                    <FanInfo     { ...this.state } />
                    <CpuInfo     { ...this.state } />
                    <GpuInfo     { ...this.state } />
                </ScrollArea>
                <ScrollArea { ...contentProps }>
                    <div className="inner-content statusbar-info">
                        <div className="status">
                            Status: { connected ? 'Connected' : 'Disconnected' }
                        </div>
                        <div className="action">
                            { connected
                                ? <button type="button" className="form-button" onClick={ () => { connection('stop')    } }>Stop</button>
                                : <button type="button" className="form-button" onClick={ () => { connection('connect') } }>Start</button>
                            }
                        </div>
                    </div>
                    <div className="inner-content infobar">
                        <InfoBar { ...this.state } />
                    </div>
                    <div className="inner-content graph">
                        { hashRate  !== false && <Graph title="Hash Rate"   labelX="" labelY="" payload={ String(hashRate ).replace(/[^0-9.]/g, "") } connected={ connected }/> }
                        { tempRate  !== false && <Graph title="Temperature" labelX="" labelY="" payload={ String(tempRate ).replace(/[^0-9.]/g, "") } connected={ connected }/> }
                        { powerRate !== false && <Graph title="Power Usage" labelX="" labelY="" payload={ String(powerRate).replace(/[^0-9.]/g, "") } connected={ connected }/> }
                    </div>
                    <div className="inner-content tabs">
                        <TabLogs { ...this.state }/>
                    </div>
                </ScrollArea>
            </div>
        )
    }
}
