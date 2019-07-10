import React, { Component } from 'react';
import { get, isEqual } from 'lodash';
import prettyBytes from 'pretty-byte';

export default class NetworkInfo extends React.Component {
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
                    <h3 className="title">Network</h3>
                    <div className="network-info">
                        { sent    !== false && <div className="sent"><span className="label">Sent</span> { sent }</div>           }
                        { receive !== false && <div className="receive"><span className="label">Received</span> { receive }</div> }
                    </div>
                </div>
                : null
        )
    }

}