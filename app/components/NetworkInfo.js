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
                         viewBox='0 0 100 40'
                         xmlns='http://www.w3.org/2000/svg'
                         preserveAspectRatio="none">
                        <path className="orange-line" d='M0,10 L0,0 L10,0'/>
                        <path className="orange-line" d='M90,0 L100,0 L100,10'/>
                        <path className="orange-line" d='M10,40 L0,40 L0,30'/>
                        <path className="orange-line" d='M100,30 L100,40 L90,40'/>
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