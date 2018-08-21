import React        from 'react';
import ReactTable   from 'react-table';
import { isEmpty, isEqual, forEach } from 'lodash';

export default class GpuInfo extends React.Component {
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
                {Header: 'Fan', accessor: 'fan'},
                {Header: 'Power', accessor: 'power'},
                {Header: 'Memory', accessor: 'memory'},
                {Header: 'Temp', accessor: 'temperature'},
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
            <div className="inner-content gpu">
                { !isEmpty(data) && <h3 className="title">GPU Information</h3> }
                { !isEmpty(data) && <ReactTable { ...tableProps }/> }
            </div>
        )
    }

}