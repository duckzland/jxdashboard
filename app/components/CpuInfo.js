import React, { Component }               from 'react';
import { isEmpty, isEqual, forEach }      from 'lodash';
import Frame                              from './Frame';

export default class CpuInfo extends React.Component {
    state = {
        data: {},
        headers: {}
    };

    locked      = false;
    debug       = false;

    constructor(props) {
        super(props);
        this.state.data = 'payload' in props ? this.processPayload(props.payload) : {};
        this.state.headers = {};
    }

    shouldComponentUpdate() {
        return !this.locked;
    }

    componentWillReceiveProps(nextProps) {
        const oldHeaders = this.state.headers;
        const nextPayload = this.processPayload(nextProps.payload);
        if (!isEqual(nextPayload, this.state.data) || !isEqual(oldHeaders, this.state.headers)) {
            this.locked = false;
            this.state.data = nextPayload;
            this.setState(this.state);
        }
    }

    componentDidMount() {
        this.locked = true;
    }

    componentDidUpdate() {
        this.locked = true;
    }

    processPayload(payload) {
        this.state.headers = {};
        let data = [], x = 0;

        if (this.debug) {
            for (x=0; x < 21; x++) {
                data.push({label: 'CPU1', freq: '2000mhz', usage: '100%', temp: '60C'});
            }
            this.state.headers = {
                label: true,
                freq: true,
                usage: true,
                temp: true
            }
        }
        else {
            forEach(payload, (value, key) => {
                let index = false,
                    label = false,
                    suffix = '';

                if (key.indexOf('cpu:temp:label') !== -1) {
                    index = key.replace('cpu:temp:label:', '');
                    label = 'label';
                    suffix = '';
                    this.state.headers['label'] = true;
                }

                if (key.indexOf('cpu:temp:current') !== -1) {
                    index = key.replace('cpu:temp:current:', '');
                    label = 'temp';
                    suffix = ' C';
                    this.state.headers['temp'] = true;
                }

                if (key.indexOf('cpu:freq:current') !== -1) {
                    index = key.replace('cpu:freq:current:', '');
                    label = 'freq';
                    suffix = ' GHz';
                    value = (parseInt(value) / 1000).toFixed(2);
                    this.state.headers['freq'] = true;
                }

                if (key.indexOf('cpu:usage') !== -1) {
                    index = key.replace('cpu:usage:', '');
                    label = 'usage';
                    suffix = ' %';
                    this.state.headers['usage'] = true;
                }

                if (index && !data[index]) {
                    data[index] = {};
                }

                if (index && label) {
                    data[index][label] = value + suffix;
                }
            });
        }

        return data;
    }

    render() {

        const { data, headers } = this.state;
        const { label, freq, usage, temp } = headers;
        const columns = [];

        label && columns.push({Header: 'CPU',   accessor: 'label'});
        freq  && columns.push({Header: 'Speed', accessor: 'freq' });
        usage && columns.push({Header: 'Load',  accessor: 'usage'});
        temp  && columns.push({Header: 'Temp',  accessor: 'temp' });

        const tableProps = {
            columns: columns,
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
                ? <Frame frameType="frame-d" className="cpu" title="CPU Information" table={ tableProps } />
                : null
        )
    }

}