import React, { Component } from 'react';
import { get, isEqual } from 'lodash';
import prettyBytes from 'pretty-byte';

export default class MemoryInfo extends React.Component {
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
            total:     prettyBytes(get(payload, 'memory:virtual:total', 0)),
            available: prettyBytes(get(payload, 'memory:virtual:available', 0)),
            used:      prettyBytes(get(payload, 'memory:virtual:used', 0))
        }
    };

    render() {
        const { total, available, used, buffered, cached } = this.state;
        const visible = total || available || used || buffered || cached;
        return (
            visible
                ? <div className="inner-content memory">
                    <h3 className="title">Memory</h3>
                    <div className="memory-info">
                        { total     && <div className="total"><span className="label">Total</span> { total }</div>             }
                        { available && <div className="available"><span className="label">Available</span> { available }</div> }
                        { used      && <div className="used"><span className="label">Used</span> { used }</div>                }
                    </div>
                </div>
                : null
        )
    }

}