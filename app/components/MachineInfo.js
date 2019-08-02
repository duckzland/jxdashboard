import React, { Component } from 'react';
import { get, isEqual }     from 'lodash';
import Frame                from './Frame';

export default class MachineInfo extends React.Component {
    state = {};
    locked = false;

    constructor(props) {
        super(props);
        this.state = 'payload' in props ? this.processPayload(props.payload) : {};
    }

    shouldComponentUpdate() {
        return !this.locked;
    }

    componentWillReceiveProps(nextProps) {
        const { payload } = nextProps;
        const newPayload = this.processPayload(payload);

        if (!isEqual(newPayload, this.state)) {
            this.locked = false;
            this.setState(newPayload);
        }

    }

    componentDidMount() {
        this.locked = true;
    }

    componentDidUpdate() {
        this.locked = true;
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
                        { (gpuCoin !== false)     && <div className="coin"><span className="label">Coin</span><span className="value">{ gpuCoin }</span></div>             }
                        { (gpuPool !== false)     && <div className="pool"><span className="label">Pool</span><span className="value">{ gpuPool }</span></div>             }
                        { (gpuHashrate !== false) && <div className="hashrate"><span className="label">Hash</span><span className="value">{ gpuHashrate }</span></div>     }
                        { (gpuShares !== false)   && <div className="shares"><span className="label">Shares</span><span className="value">{ gpuShares }</span></div>       }
                        { (gpuDiff !== false)     && <div className="diff"><span className="label">Diff</span><span className="value">{ gpuDiff }</span></div>             }
                    </div> }
                    { cpuCoin !== false && <div className="miners cpu">
                        { (cpuCoin !== false)     && <div className="coin"><span className="label">Coin</span><span className="value">{ cpuCoin }</span></div>             }
                        { (cpuPool !== false)     && <div className="pool"><span className="label">Pool</span><span className="value">{ cpuPool }</span></div>             }
                        { (cpuHashrate !== false) && <div className="hashrate"><span className="label">Hash</span><span className="value">{ cpuHashrate }</span></div>     }
                        { (cpuShares !== false)   && <div className="shares"><span className="label">Shares</span><span className="value">{ cpuShares }</span></div>       }
                        { (cpuDiff !== false)     && <div className="diff"><span className="label">Diff</span><span className="value">{ cpuDiff }</span></div>             }
                    </div> }
                </Frame>

                : null
        )
    }

}