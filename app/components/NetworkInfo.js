import React, { Component } from 'react';
import { get, isEqual } from 'lodash';
import prettyBytes from 'pretty-bytes';

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
        return {
            sent: prettyBytes(get(payload, 'network:status:bytes_sent', 0)),
            receive: prettyBytes(get(payload, 'network:status:bytes_recv', 0))
        }
    };

    render() {
        const { sent, receive } = this.state;
        return (
            <div className="inner-content network">
                <h3 className="title">Network</h3>
                <div className="network-info">
                    { sent    && <div className="sent"><span className="label">Sent</span> { sent }</div>           }
                    { receive && <div className="receive"><span className="label">Received</span> { receive }</div> }
                </div>
            </div>
        )
    }

}