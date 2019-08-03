import React                from 'react';
import Component            from '../base/Component';
import Frame                from './Frame';
import { get, isEqual }     from 'lodash';
import Typist               from 'react-typist';


export default class StatusInfo extends Component {
    state = {
        connected: false
    };
    locked = false;

    constructor(props) {
        super(props);
        this.state.connected = 'connected' in props ? props.connected : false;
        this.buttonRef = React.createRef();
        this.fader.push(this.buttonRef);
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
                ? <Frame frameType="frame-d" className="statusbar-info fader" title="Status">
                    <div className="statusbar">
                        <div className="status">
                            { connected
                                ? <Typist key="statusbar-connected" avgTypingDelay="1" stdTypingDelay="1" startDelay={ Frame.svgCount * 100 } cursor={{ show: false }}>Connected</Typist>
                                : <Typist key="statusbar-disconnected" avgTypingDelay="1" stdTypingDelay="1" startDelay={ Frame.svgCount * 100 } cursor={{ show: false }}>Disconnected</Typist>
                            }
                        </div>
                        <div className="action">
                            { connected
                                ? <button ref={ this.buttonRef } type="button" className="form-button fader" onClick={ () => { handleClick('stop')    } }>Stop</button>
                                : <button ref={ this.buttonRef } type="button" className="form-button fader" onClick={ () => { handleClick('connect') } }>Start</button>
                            }
                        </div>
                    </div>
                </Frame>
                : null
        )
    }

}