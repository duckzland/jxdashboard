import React                         from 'react';
import Component                     from '../base/Component';
import Frame                         from './Frame';
import InfoLine                      from './InfoLine';
import { isEmpty, isEqual, forEach } from 'lodash';

export default class FanInfo extends Component {
    state = {
        data: {}
    };

    locked      = false;
    debug       = false;

    constructor(props) {
        super(props);
        this.state.data = 'payload' in props ? this.processPayload(props.payload) : {};
    }

    componentWillReceiveProps(nextProps) {
        const nextPayload = this.processPayload(nextProps.payload);

        if (!isEqual(nextPayload, this.state.data)) {
            this.locked = false;
            this.setState({ data: nextPayload });
        }
    }

    processPayload(payload) {
        let data = [], x = 0;
        if (this.debug) {
            for (x=0;x < 10;x++) {
                data.push({ label: 'fan1', speed: '100%' });
            }
        }
        else {
            forEach(payload, (value, key) => {
                if (key.indexOf('fan:speed:') !== -1) {
                    data.push({
                        label: key.replace('fan:speed:', ''),
                        speed: value + ' %'
                    });
                }
            });
        }

        return data;
    }

    render() {
        const { data } = this.state;
        return (
        !isEmpty(data)
            ? <Frame frameType="frame-d" className="fans" title="Fans">
                <div className="fan-info">
                    { data.map((fan) => {
                        return ( <InfoLine key={ 'fan-element-' + fan.label } className="fan" label={ fan.label } value={ fan.speed }/> )
                    }) }
                </div>
            </Frame>
            : null
        )
    }

}