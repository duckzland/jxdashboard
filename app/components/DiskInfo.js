import React, { Component } from 'react';
import { get, isEqual } from 'lodash';
import prettyBytes from 'pretty-byte';

export default class DiskInfo extends React.Component {
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
            total:     prettyBytes(get(payload, 'disk:usage:total', 0)),
            available: prettyBytes(get(payload, 'disk:usage:free', 0)),
            used:      prettyBytes(get(payload, 'disk:usage:used', 0))
        }
    };

    render() {
        const { total, available, used } = this.state;
        return (
            <div className="inner-content disk">
                <h3 className="title">Disk</h3>
                <div className="disk-info">
                    { total     && <div className="total"><span className="label">Total</span> { total }</div>             }
                    { available && <div className="available"><span className="label">Available</span> { available }</div> }
                    { used      && <div className="used"><span className="label">Used</span> { used }</div>                }
                </div>
            </div>
        )
    }

}