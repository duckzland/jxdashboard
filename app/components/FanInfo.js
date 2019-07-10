import React, { Component } from 'react';
import { isEmpty, isEqual, forEach } from 'lodash';

export default class FanInfo extends React.Component {
    state = {
        data: {}
    };

    locked = false;

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
        let data = [];
        forEach(payload, (value, key) => {
            if (key.indexOf('fan:speed:') !== -1) {
                data.push({
                    label: key.replace('fan:speed:', ''),
                    speed: value + ' %'
                });
            }
        });

        return data;
    }

    render() {
        const { data } = this.state;
        return (
        !isEmpty(data)
            ? <div className="inner-content fans">
                <h3 className="title">Fans</h3>
                <div className="fan-info">
                    { data.map((fan) => {
                        return (
                            <div key={ 'fan-element-' + fan.label } className="coin"><span className="label">{ fan.label }</span> { fan.speed }</div>
                        )
                    }) }
                </div>
            </div>
            : null
        )
    }

}