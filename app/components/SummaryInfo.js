import React                from 'react';
import Component            from '../base/Component';
import Frame                from './Frame';
import { get, isEqual }     from 'lodash';

export default class SummaryInfo extends Component {
    state = {};
    locked = false;

    constructor(props) {
        super(props);
        this.state = 'payload' in props ? this.processPayload(props.payload) : {};
    }

    componentWillReceiveProps(nextProps) {
        const { payload } = nextProps;
        const newPayload = this.processPayload(payload);

        if (!isEqual(newPayload, this.state)) {
            this.locked = false;
            this.setState(newPayload);
        }

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
                ? <Frame frameType="frame-d" className="infobar-info" title="Statistics">
                    <div className="infobar">
                        { (temp !== false)   && <div className="temp"><span className="label">Temperature</span><span className="value">{ parseInt(temp, 0)   }C</span></div> }
                        { (disk !== false)   && <div className="disk"><span className="label">Disk       </span><span className="value">{ parseInt(disk, 0)   }%</span></div> }
                        { (memory !== false) && <div className="memory"><span className="label">Memory   </span><span className="value">{ parseInt(memory, 0) }%</span></div> }
                        { (watt !== false)   && <div className="watt"><span className="label">Watt       </span><span className="value">{ parseInt(watt, 0)   }W</span></div> }
                    </div>
                </Frame>
                : null
        )
    }

}