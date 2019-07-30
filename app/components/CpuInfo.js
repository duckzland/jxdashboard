import React, { Component }               from 'react';
import { isEmpty, isEqual, forEach, get } from 'lodash';
import ReactTable                         from 'react-table';

export default class CpuInfo extends React.Component {
    state = {
        data: {},
        headers: {},
    };

    locked = false;
    svgElement = false;

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
        this.state.headers = {};
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

        return data;
    }

    render() {
        const { data, headers } = this.state;
        const columns = [];

        get(headers, 'label', false) && columns.push({Header: 'CPU',   accessor: 'label'});
        get(headers, 'freq',  false) && columns.push({Header: 'Speed', accessor: 'freq' });
        get(headers, 'usage', false) && columns.push({Header: 'Load',  accessor: 'usage'});
        get(headers, 'temp',  false) && columns.push({Header: 'Temp',  accessor: 'temp' });

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
                ? <div className="inner-content cpu">
                    <svg className="svg-frame"
                         ref={ref => (this.svgElement = ref)}
                         viewBox='0 0 100 40'
                         xmlns='http://www.w3.org/2000/svg'
                         preserveAspectRatio="none">
                        <path className="orange-line" d='M0,10 L0,0 L10,0'/>
                        <path className="orange-line" d='M90,0 L100,0 L100,10'/>
                        <path className="orange-line" d='M10,40 L0,40 L0,30'/>
                        <path className="orange-line" d='M100,30 L100,40 L90,40'/>
                    </svg>
                    <h3 className="title">CPU Information</h3>
                    <ReactTable { ...tableProps }/>
                </div>
                : null
        )
    }

}