import React, { Component } from 'react';
import { get, isEqual }     from 'lodash';
import prettyBytes          from 'pretty-byte';

export default class MemoryInfo extends React.Component {
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
        const total     = get(payload, 'memory:virtual:total', false);
        const available = get(payload, 'memory:virtual:available', false);
        const used      = get(payload, 'memory:virtual:used', false);

        return {
            total:     total     !== false ? prettyBytes(total)     : false,
            available: available !== false ? prettyBytes(available) : false,
            used:      used      !== false ? prettyBytes(used)      : false
        }
    };

    render() {
        const { total, available, used, buffered, cached } = this.state;
        const visible = total !== false || available !== false || used !== false;
        return (
            visible
                ? <div className="inner-content memory">
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
                    <h3 className="title">Memory</h3>
                    <div className="memory-info">
                        { total     !== false && <div className="total"><span className="label">Total</span><span className="value">{ total }</span></div>             }
                        { available !== false && <div className="available"><span className="label">Available</span><span className="value">{ available }</span></div> }
                        { used      !== false && <div className="used"><span className="label">Used</span><span className="value">{ used }</span></div>                }
                    </div>
                </div>
                : null
        )
    }

}