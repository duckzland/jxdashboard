import React                from 'react';
import Component            from '../base/Component';
import Frame                from './Frame';
import InfoLine             from './InfoLine';
import { get, isEqual }     from 'lodash';

export default class MachineInfo extends React.Component {
    state = {};
    locked = false;

    constructor(props) {
        super(props);
        this.state = 'payload' in props ? this.processPayload(props.payload) : {};
    }

    componentWillReceiveProps(nextProps) {
        const { payload } = nextProps;
        const newPayload = this.processPayload(payload);

        if (!isEqual(newPayload, this.state)) {
            this.locked = false;
            this.setState(newPayload);
        }

    }

    processPayload = (payload) => {
        return {
            title: get(payload, 'general:boxname', false),
            gpuPool: get(payload, 'general:active:gpu:pool', false),
            gpuCoin: get(payload, 'general:active:gpu:coin', false),
            gpuHashrate: get(payload, 'miner:hashrate:gpu:0', false),
            gpuShares: get(payload, 'miner:shares:gpu:0', false),
            gpuDiff: get(payload, 'miner:diff:gpu:0', false),
            cpuPool: get(payload, 'general:active:cpu:pool', false),
            cpuCoin: get(payload, 'general:active:cpu:coin', false),
            cpuHashrate: get(payload, 'miner:hashrate:cpu', false),
            cpuShares: get(payload, 'miner:shares:cpu', false),
            cpuDiff: get(payload, 'miner:diff:cpu', false)
        }
    };

    render() {
        const { title, gpuPool, gpuCoin, gpuHashrate, gpuShares, gpuDiff, cpuPool, cpuCoin, cpuHashrate, cpuShares, cpuDiff } = this.state;
        const visible = title !== false || gpuCoin !== false || cpuCoin !== false;

        return (
            visible
                ? <Frame frameType="frame-d" className="machine" title={ title }>
                    { gpuCoin !== false && <div className="miners gpu">
                        { (gpuCoin !== false)     && <InfoLine className="coin" label="Coin" value={ gpuCoin }/>             }
                        { (gpuPool !== false)     && <InfoLine className="pool" label="Pool" value={ gpuPool }/>             }
                        { (gpuHashrate !== false) && <InfoLine className="hashrate" label="Hash" value={ gpuHashrate }/>     }
                        { (gpuShares !== false)   && <InfoLine className="shares" label="Shares" value={ gpuShares }/>       }
                        { (gpuDiff !== false)     && <InfoLine className="diff" label="Diff" value={ gpuDiff }/>             }
                    </div> }
                    { cpuCoin !== false && <div className="miners cpu">
                        { (cpuCoin !== false)     && <InfoLine className="coin" label="Coin" value={ cpuCoin }/>             }
                        { (cpuPool !== false)     && <InfoLine className="pool" label="Pool" value={ cpuPool }/>             }
                        { (cpuHashrate !== false) && <InfoLine className="hashrate" label="Hash" value={ cpuHashrate }/>     }
                        { (cpuShares !== false)   && <InfoLine className="shares" label="Shares" value={ cpuShares }/>       }
                        { (cpuDiff !== false)     && <InfoLine className="diff" label="Diff" value={ cpuDiff }/>             }
                    </div> }
                </Frame>

                : null
        )
    }

}