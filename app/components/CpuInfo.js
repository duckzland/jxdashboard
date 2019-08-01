import React, { Component }               from 'react';
import { isEmpty, isEqual, forEach, get } from 'lodash';
import ReactTable                         from 'react-table';

export default class CpuInfo extends React.Component {
    state = {
        data: {},
        headers: {},
    };

    locked      = false;
    svgElement  = false;
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
        this.state.headers = {};
        let data = [], x = 0;

        if (this.debug) {
            for (x=0;x < 21;x++) {
                data.push({label: 'CPU1', freq: '2000mhz', usage: '100%', temp: '60C'});
            }
            this.state.headers = {
                label: true,
                freq: true,
                usage: true,
                temp: true,
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
                    { data.length < 14
                        && <svg className="svg-frame"
                                ref={ref => (this.svgElement = ref)}
                                viewBox="0 0 41.612 25.584"
                                xmlns="http://www.w3.org/2000/svg"
                                vector-effect="non-scaling-stroke"
                                preserveAspectRatio="none">
                            <path className="orange-line" d="M41.476 20.9l.004 2.13-1.322 1.438-9.939-.032-.982 1.015h-6.615l-1.323-1.322H1.456L.133 22.806V20.16"/>
                            <path className="orange-line" d="M41.408 5.079V2.432l-.794-1.323h-3.44L36.41.132l-5.777.033-.602.944H1.456L.133 2.432v2.646"/>
                            <path className="orange-line" d="M35.569 1.292l-.394.695-3.585-.006"/>
                            <path className="orange-line" d="M23.969 23.745l.32-.566 3.584.006"/>
                        </svg> }
                    { data.length > 13
                        && <svg className="svg-frame"
                                ref={ref => (this.svgElement = ref)}
                                viewBox="0 0 69.393 35.638"
                                xmlns="http://www.w3.org/2000/svg"
                                vector-effect="non-scaling-stroke"
                                preserveAspectRatio="none">
                            <path className="orange-line" d="M69.257 30.954l.004 2.13-1.322 1.438L58 34.49l-.982 1.016h-6.615l-1.323-1.324H1.455L.132 32.859v-2.646"/>
                            <path className="orange-line" d="M69.189 5.079V2.432l-.794-1.323h-3.44l-.764-.977-5.777.033-.602.944H1.455L.132 2.432v2.646"/>
                            <path className="orange-line" d="M63.35 1.292l-.394.695-3.585-.006"/>
                            <path className="orange-line" d="M51.75 33.799l.32-.566 3.584.007"/>
                        </svg> }
                    <h3 className="title">CPU Information</h3>
                    <ReactTable { ...tableProps }/>
                </div>
                : null
        )
    }

}