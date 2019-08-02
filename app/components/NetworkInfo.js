import React                from 'react';
import Component            from '../base/Component';
import Frame                from './Frame';
import { get, isEqual }     from 'lodash';
import prettyBytes          from 'pretty-byte';

export default class NetworkInfo extends Component {
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
                ? <Frame frameType="frame-d" className="network" title="Network">
                    <div className="network-info">
                        { sent    !== false && <div className="sent"><span className="label">Sent</span><span className="value">{ sent }</span></div>           }
                        { receive !== false && <div className="receive"><span className="label">Received</span><span className="value">{ receive }</span></div> }
                    </div>
                </Frame>
                : null
        )
    }

}