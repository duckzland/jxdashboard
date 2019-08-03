import React                from 'react';
import Component            from '../base/Component';
import Frame                from './Frame';
import InfoLine             from './InfoLine';
import { get, isEqual }     from 'lodash';
import prettyBytes          from 'pretty-byte';

export default class DiskInfo extends Component {
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
                ? <Frame frameType="frame-b" className="disk" title="Disk">
                    <div className="disk-info">
                        { total     !== false && <InfoLine className="total" label="Total" value={ total }/>             }
                        { available !== false && <InfoLine className="available" label="Available" value={ available }/> }
                        { used      !== false && <InfoLine className="used" label="Used" value={ used }/>                }
                    </div>
                </Frame>
                : null
        )
    }

}