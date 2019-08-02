import React                         from 'react';
import Component                     from '../base/Component';
import Frame                         from './Frame';
import { isEmpty, isEqual, forEach } from 'lodash';

export default class GpuInfo extends Component {
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
            for (x=0;x < 21;x++) {
                data.push({label: 'AMD', temperature: '56 C', fan: '45%', memory: '50%', power: '90%', watt: '124W'});
            }
        }
        else {
            forEach(payload, (value, key) => {
                let index = false,
                    label = false,
                    x = false,
                    y = false,
                    suffix = false;

                if (key.indexOf('gpu:fan:') !== -1) {
                    x = key.replace('gpu:fan:', '').split(':');
                    label = x[0];
                    index = x[1];
                    y = 'fan';
                    suffix = '%';
                }

                if (key.indexOf('gpu:core:') !== -1) {
                    x = key.replace('gpu:core:', '').split(':');
                    label = x[0];
                    index = x[1];
                    y = 'core';
                    suffix = '%';
                }

                if (key.indexOf('gpu:watt:') !== -1) {
                    x = key.replace('gpu:watt:', '').split(':');
                    label = x[0];
                    index = x[1];
                    y = 'watt';
                    suffix = 'W';
                }

                if (key.indexOf('gpu:power:') !== -1) {
                    x = key.replace('gpu:power:', '').split(':');
                    label = x[0];
                    index = x[1];
                    y = 'power';
                    suffix = '%';
                }

                if (key.indexOf('gpu:memory:') !== -1) {
                    x = key.replace('gpu:memory:', '').split(':');
                    label = x[0];
                    index = x[1];
                    y = 'memory';
                    suffix = '%';
                }

                if (key.indexOf('gpu:temperature:') !== -1) {
                    x = key.replace('gpu:temperature:', '').split(':');
                    label = x[0];
                    index = x[1];
                    y = 'temperature';
                    suffix = 'C';
                }

                if (index && !data[index]) {
                    data[index] = {};
                }

                if (index && y) {
                    data[index][y] = value + ' ' + suffix;
                }

                if (index && label) {
                    data[index]['label'] = label;
                }
            });
        }

        return data;
    }

    render() {
        const { data } = this.state;
        const tableProps = {
            columns: [
                {Header: 'GPU', accessor: 'label'},
                {Header: 'Temp', accessor: 'temperature'},
                {Header: 'Fan', accessor: 'fan'},
                {Header: 'Core', accessor: 'memory'},
                {Header: 'Mem', accessor: 'memory'},
                {Header: 'Pwr', accessor: 'power'},
                {Header: 'Watt', accessor: 'watt'}
            ],
            data: data,
            minRows: 0,
            loading: false,
            showPagination: false,
            showPageSizeOptions: false,
            showPageJump: false,
            sortable: false,
            multiSort: false,
            collapseOnSortingChange: false,
            collapseOnPageChange: false,
            collapseOnDataChange: false,
            loadingText: ''
        };

        return (
            !isEmpty(data)
                ? <Frame frameType="frame-d" className="gpu" title="GPU Information" table={ tableProps }/>
                : null
        )
    }

}