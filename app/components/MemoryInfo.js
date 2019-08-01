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
                         viewBox="0 0 23.738 22.944"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M19.186 22.808l2.13.004 1.438-1.322-.032-9.94.883-.456-.017-7.056-.934-.669-.053-1.99L21.25.159l-2.07.006M4.638 22.801l-2.246-.003-1.179-1.002-.045-3.269-1.035-.77.033-5.778 1.133-.668-.053-9.945L2.45.144 4.331.132"/>
                        <path className="orange-line" d="M1.271 17.058l.695-.395-.006-3.585m20.263-8.085l-.566.319.006 3.585"/>
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