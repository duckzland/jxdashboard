import React, { Component } from 'react';
import { isEmpty, isEqual, forEach } from 'lodash';

export default class FanInfo extends React.Component {
    state = {
        data: {}
    };

    locked      = false;
    svgElement  = false;
    debug       = false;

    constructor(props) {
        super(props);
        this.state.data = 'payload' in props ? this.processPayload(props.payload) : {};
    }

    shouldComponentUpdate() {
        return !this.locked;
    }

    componentWillReceiveProps(nextProps) {
        const nextPayload = this.processPayload(nextProps.payload);

        if (!isEqual(nextPayload, this.state.data)) {
            this.locked = false;
            this.setState({ data: nextPayload });
        }
    }

    componentDidMount() {
        this.locked = true;
    }

    componentDidUpdate() {
        this.locked = true;
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
            ? <div className="inner-content fans">
                <svg className="svg-frame"
                     ref={ref => (this.svgElement = ref)}
                     viewBox="0 0 41.612 14.471"
                     xmlns="http://www.w3.org/2000/svg"
                     vector-effect="non-scaling-stroke"
                     preserveAspectRatio="none">
                    <path className="orange-line" d="M41.475 9.788l.004 2.129-1.321 1.438-9.94-.032-.982 1.016h-6.614l-1.323-1.323H1.455L.132 11.693V9.047M41.407 5.078V2.433l-.793-1.323h-3.44L36.41.133l-5.778.033-.602.944H1.455L.132 2.433v2.645"/>
                    <path className="orange-line" d="M35.57 1.292l-.395.695-3.585-.006M23.969 12.632l.319-.565 3.585.006"/>
                </svg>
                <h3 className="title">Fans</h3>
                <div className="fan-info">
                    { data.map((fan) => {
                        return (
                            <div key={ 'fan-element-' + fan.label } className="fan"><span className="label">{ fan.label }</span><span className="value">{ fan.speed }</span></div>
                        )
                    }) }
                </div>
            </div>
            : null
        )
    }

}