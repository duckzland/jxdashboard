import React, { Component } from 'react';
import { get, isEqual } from 'lodash';

export default class MachineInfo extends React.Component {
    state = {};
    locked = false;
    svgElement = false;

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
                ? <div className="inner-content machine">
                    <svg className="svg-frame"
                         ref={ref => (this.svgElement = ref)}
                         viewBox='0 0 100 40'
                         xmlns='http://www.w3.org/2000/svg'
                         preserveAspectRatio="none">
                        <path className="orange-line" d='M0,10 L0,0 L10,0'/>
                        <path className="orange-line" d='M90,0 L100,0 L100,10'/>
                        <path className="orange-line" d='M10,40 L0,40 L0,30'/>
                        <path className="orange-line" d='M100,30 L100,40 L90,40'/>
                    </svg>
                    { title !== false && <h1 className="title">{ title } </h1> }
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
                </div>
                : null
        )
    }

}