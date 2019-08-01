import React, { Component } from 'react';
import { get, isEqual } from 'lodash';
import prettyBytes from 'pretty-byte';

export default class DiskInfo extends React.Component {
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

        const total     = get(payload, 'disk:usage:total', false);
        const available = get(payload, 'disk:usage:free', false);
        const used      = get(payload, 'disk:usage:used', false);

        return {
            total:     total     !== false ? prettyBytes(total)     : false,
            available: available !== false ? prettyBytes(available) : false,
            used:      used      !== false ? prettyBytes(used)      : false
        }
    };

    render() {
        const { total, available, used } = this.state;
        const visible = total !== false || available !== false || used !== false;
        return (
            visible
                ? <div className="inner-content disk">
                    <svg className="svg-frame"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 23.738 22.944"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M4.551 22.808l-2.129.004L.983 21.49l.032-9.94-.883-.456.018-7.056.934-.669.053-1.99L2.487.159l2.07.006M19.1 22.801l2.245-.003 1.18-1.002.045-3.269 1.035-.77-.033-5.778-1.133-.668.053-9.945L21.288.144 19.407.132"/>
                        <path className="orange-line" d="M22.466 17.058l-.695-.395.006-3.585M1.515 4.993l.566.319-.007 3.585"/>
                    </svg>
                    <h3 className="title">Disk</h3>
                    <div className="disk-info">
                        { total     !== false && <div className="total"><span className="label">Total</span><span className="value">{ total }</span></div>             }
                        { available !== false && <div className="available"><span className="label">Available</span><span className="value">{ available }</span></div> }
                        { used      !== false && <div className="used"><span className="label">Used</span><span className="value">{ used }</span></div>                }
                    </div>
                </div>
                : null
        )
    }

}