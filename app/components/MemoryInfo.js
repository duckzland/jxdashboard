import React                from 'react';
import Component            from '../base/Component';
import Frame                from './Frame';
import { get, isEqual }     from 'lodash';
import prettyBytes          from 'pretty-byte';

export default class MemoryInfo extends Component {
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
        const total     = get(payload, 'memory:virtual:total', false);
        const available = get(payload, 'memory:virtual:available', false);
        const used      = get(payload, 'memory:virtual:used', false);

        return {
            total:     total     !== false ? prettyBytes(total)     : false,
            available: available !== false ? prettyBytes(available) : false,
            used:      used      !== false ? prettyBytes(used)      : false
        }
    };

    render() {
        const { total, available, used, buffered, cached } = this.state;
        const visible = total !== false || available !== false || used !== false;
        return (
            visible
                ? <Frame frameType="frame-a" className="memory" title="Memory">
                    <div className="memory-info">
                        { total     !== false && <div className="total"><span className="label">Total</span><span className="value">{ total }</span></div>             }
                        { available !== false && <div className="available"><span className="label">Available</span><span className="value">{ available }</span></div> }
                        { used      !== false && <div className="used"><span className="label">Used</span><span className="value">{ used }</span></div>                }
                    </div>
                </Frame>
                : null
        )
    }

}