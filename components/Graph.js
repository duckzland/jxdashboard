import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { AreaChart } from 'react-easy-chart';
import moment from 'moment';

export default class Graph extends React.Component {
    state = {
        payload: '',
        data: []
    };

    locked = false;
    timer = false;
    buffers = [];
    highest = 0;
    element = false;

    constructor(props) {
        super(props);
        this.state.payload = 'payload' in props ? props.payload : 0;
        this.state.size = 'size' in props ? props.size : 1;
        this.highest = this.state.payload;

        'connected' in props && props.connected && this.update() && this.ticker();

        this.element = React.createRef();
        this.state.windowWidth = false;
    }

    shouldComponentUpdate() {
        return !this.locked;
    }

    componentWillReceiveProps(nextProps) {
        this.state.payload = nextProps.payload;
        if (!this.state.windowWidth) {
            this.handleResize();
        }
        if (nextProps.connected && !this.timer) {
            this.ticker();
        }
        if (!nextProps.connected) {
            clearTimeout(this.timer);
            this.timer = false;
            this.buffers = [];
            this.locked = false;
            this.setState({
                data: []
            });
        }

    }

    componentDidMount() {
        this.locked = true;
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate() {
        this.locked = true;
    }

    handleResize = () => {
        this.setState({windowWidth: this.element.current.clientWidth - 10})
    };

    ticker = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.update();
            this.ticker();
        }, 5000);

    };

    update = () => {
        this.buffers.push({
            x: moment().format('D-MMM-YY h:mm:ss'),
            y: this.state.payload ? parseInt(this.state.payload, 0) : 0
        });

        if (this.buffers.length > 10) {
            this.buffers.shift();
        }

        if (this.highest < this.state.payload) {
            this.highest = this.state.payload;
        }

        this.locked = false;
        this.setState({
            data: this.buffers
        });
    };

    render() {
        const { title, labelX, labelY } = this.props;
        const width = this.state.windowWidth;
        return (
            <div ref={ this.element } className="graph-content">
                { (title && width) && <h1 className="title">{ title }</h1> }
                { (title && width) && <AreaChart
                    datePattern={ '%d-%b-%y %H:%M:%S' }
                    width={ width }
                    height={ width / 2 }
                    xType={'time'}
                    axisLabels={ {x: labelX, y: labelY} }
                    areaColors={['#005565']}
                    yDomainRange={ [0, this.highest * 1.5] }
                    interpolate={ false }
                    xTicks={ this.buffers.length }
                    yTicks={ 5 }
                    axes
                    grid
                    dataPoints
                    style={{
                        '.Area0': {
                            stroke: '#072c47'
                        },
                        'circle.data-point': {
                            transition: 'none !important'
                        }
                    }}
                    data={ [ this.state.data ]}
                    /> }
            </div>
        )
    }

}