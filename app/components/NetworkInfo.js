import React, { Component } from 'react';
import { get, isEqual } from 'lodash';
import prettyBytes from 'pretty-byte';

export default class NetworkInfo extends React.Component {
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

        const sent    = get(payload, 'network:status:bytes_sent', false);
        const receive = get(payload, 'network:status:bytes_recv', false);

        return {
            sent:    sent     !== false ? prettyBytes(sent)    : false,
            receive: receive  !== false ? prettyBytes(receive) : false
        }
    };

    render() {
        const { sent, receive } = this.state;
        const visible = sent !== false || receive !== false;
        return (
            visible
                ? <div className="inner-content network">
                    <svg className="svg-frame"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 41.612 14.471"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M41.475 9.788l.004 2.129-1.321 1.438-9.94-.032-.982 1.016h-6.614l-1.323-1.323H1.455L.132 11.693V9.047M41.407 5.078V2.433l-.793-1.323h-3.44L36.41.133l-5.778.033-.602.944H1.455L.132 2.433v2.645"/>
                        <path className="orange-line" d="M35.57 1.292l-.395.695-3.585-.006M23.969 12.632l.319-.565 3.585.006"/>
                    </svg>
                    <h3 className="title">Network</h3>
                    <div className="network-info">
                        { sent    !== false && <div className="sent"><span className="label">Sent</span><span className="value">{ sent }</span></div>           }
                        { receive !== false && <div className="receive"><span className="label">Received</span><span className="value">{ receive }</span></div> }
                    </div>
                </div>
                : null
        )
    }

}