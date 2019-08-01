import React        from 'react';
import ReactTable   from 'react-table';
import { isEmpty, isEqual, forEach } from 'lodash';

export default class GpuInfo extends React.Component {
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
                ? <div className="inner-content gpu">
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
                    <h3 className="title">GPU Information</h3>
                    <ReactTable { ...tableProps }/>
                </div>
                : null
        )
    }

}