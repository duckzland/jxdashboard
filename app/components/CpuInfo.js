import React, { Component } from 'react';
import { isEmpty, isEqual, forEach } from 'lodash';
import ReactTable from 'react-table';

export default class CpuInfo extends React.Component {
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
            let index = false,
                label = false,
                suffix = '';

            if (key.indexOf('cpu:temp:label') !== -1) {
                index = key.replace('cpu:temp:label:', '');
                label = 'label';
                suffix = '';
            }

            if (key.indexOf('cpu:temp:current') !== -1) {
                index = key.replace('cpu:temp:current:', '');
                label = 'temp';
                suffix = ' C';
            }

            if (key.indexOf('cpu:freq:current') !== -1) {
                index = key.replace('cpu:freq:current:', '');
                label = 'freq';
                suffix = ' GHz';
                value = (parseInt(value) / 1000).toFixed(2);
            }

            if (key.indexOf('cpu:usage') !== -1) {
                index = key.replace('cpu:usage:', '');
                label = 'usage';
                suffix = ' %';
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
        const { data } = this.state;
        const tableProps = {
            columns: [
                {Header: 'CPU', accessor: 'label'},
                {Header: 'Speed', accessor: 'freq'},
                {Header: 'Load', accessor: 'usage'},
                {Header: 'Temp', accessor: 'temp'}
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
            <div className="inner-content cpu">
                { !isEmpty(data) && <h3 className="title">CPU Information</h3> }
                { !isEmpty(data) && <ReactTable { ...tableProps }/> }
            </div>
        )
    }

}