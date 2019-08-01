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
        const visible = temp || disk || memory || watt;
        
        return (
            visible
                ? <div className="infobar-info">
                    <svg className="svg-frame"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 69.393 14.471"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M69.257 9.788l.004 2.129-1.322 1.438L58 13.324l-.982 1.015h-6.615l-1.323-1.323H1.455L.132 11.693V9.047"/>
                        <path className="orange-line" d="M69.189 5.079V2.432l-.794-1.323h-3.44l-.764-.977-5.777.033-.602.944H1.455L.132 2.432v2.646"/>
                        <path className="orange-line" d="M63.35 1.292l-.394.695-3.585-.006"/>
                        <path className="orange-line" d="M51.75 12.632l.32-.565 3.584.006"/>
                    </svg>
                    <div className="inner-content">
                        <h3 className="title">Statistics</h3>
                        <div className="infobar">
                            { (temp !== false)   && <div className="temp"><span className="label">Temperature</span><span className="value">{ parseInt(temp, 0)   }C</span></div> }
                            { (disk !== false)   && <div className="disk"><span className="label">Disk       </span><span className="value">{ parseInt(disk, 0)   }%</span></div> }
                            { (memory !== false) && <div className="memory"><span className="label">Memory   </span><span className="value">{ parseInt(memory, 0) }%</span></div> }
                            { (watt !== false)   && <div className="watt"><span className="label">Watt       </span><span className="value">{ parseInt(watt, 0)   }W</span></div> }
                        </div>
                    </div>
                </div>
                : null
        )
    }

}