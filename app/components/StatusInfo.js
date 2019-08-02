import React                from 'react';
import Component            from '../base/Component';
import Frame                from './Frame';
import { get, isEqual }     from 'lodash';

export default class StatusInfo extends Component {
    state = {
        connected: false
    };
    locked = false;

    constructor(props) {
        super(props);
        this.state.connected = 'connected' in props ? props.connected : false ;
    }

    componentWillReceiveProps(nextProps) {
        const { connected } = nextProps;

        if (!isEqual(connected, this.state.connected)) {
            this.locked = false;
            this.setState({ connected: connected });
        }

    }

    render() {
        const { connected }  = this.state;
        const { handleClick } =  this.props;
        const visible = true;
        return (
            visible
                ? <Frame frameType="frame-d" className="statusbar-info" title="Status">
                    <div className="statusbar">
                        <div className="status">
                            { connected ? 'Connected' : 'Disconnected' }
                        </div>
                        <div className="action">
                            { connected
                                ? <button type="button" className="form-button" onClick={ () => { handleClick('stop')    } }>Stop</button>
                                : <button type="button" className="form-button" onClick={ () => { handleClick('connect') } }>Start</button>
                            }
                        </div>
                    </div>
                </Frame>
                : null
        )
    }

}