import React, { Component } from 'react';
import { get, isEqual } from 'lodash';

export default class InfoBar extends React.Component {
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
            temp:   get(payload, 'temperature:highest', false),
            disk:   get(payload, 'disk:usage:percent', false),
            memory: get(payload, 'memory:virtual:percent', false),
            watt:   get(payload, 'gpu:total_watt', false)
        }
    };

    render() {
        const { temp, disk, memory, watt } = this.state;
        return (
            <div className="infobar-info">
                { (temp !== false)   && <div className="temp"  ><span className="label">Temperature</span> { parseInt(temp, 0)   }C</div> }
                { (disk !== false)   && <div className="disk"  ><span className="label">Disk       </span> { parseInt(disk, 0)   }%</div> }
                { (memory !== false) && <div className="memory"><span className="label">Memory     </span> { parseInt(memory, 0) }%</div> }
                { (watt !== false)   && <div className="watt"  ><span className="label">Watt       </span> { parseInt(watt, 0)   }W</div> }
            </div>
        )
    }

}