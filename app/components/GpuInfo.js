import React        from 'react';
import ReactTable   from 'react-table';
import { isEmpty, isEqual, forEach } from 'lodash';

export default class GpuInfo extends React.Component {
    state = {
        data: {}
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
                    <h3 className="title">GPU Information</h3>
                    <ReactTable { ...tableProps }/>
                </div>
                : null
        )
    }

}