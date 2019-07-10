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
                    <h3 className="title">Disk</h3>
                    <div className="disk-info">
                        { total     !== false && <div className="total"><span className="label">Total</span> { total }</div>             }
                        { available !== false && <div className="available"><span className="label">Available</span> { available }</div> }
                        { used      !== false && <div className="used"><span className="label">Used</span> { used }</div>                }
                    </div>
                </div>
                : null
        )
    }

}