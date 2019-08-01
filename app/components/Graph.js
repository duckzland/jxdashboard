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
        this.element
            && this.element.current
            && this.element.current.clientWidth
            && this.setState({windowWidth: this.element.current.clientWidth - 10})
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
                <svg className="svg-frame"
                 ref={ref => (this.svgElement = ref)}
                 viewBox="0 0 69.393 35.638"
                 xmlns="http://www.w3.org/2000/svg"
                 vector-effect="non-scaling-stroke"
                 preserveAspectRatio="none">
                    <path className="orange-line" d="M69.257 30.954l.004 2.13-1.322 1.438L58 34.49l-.982 1.016h-6.615l-1.323-1.324H1.455L.132 32.859v-2.646"/>
                    <path className="orange-line" d="M69.189 5.079V2.432l-.794-1.323h-3.44l-.764-.977-5.777.033-.602.944H1.455L.132 2.432v2.646"/>
                    <path className="orange-line" d="M63.35 1.292l-.394.695-3.585-.006"/>
                    <path className="orange-line" d="M51.75 33.799l.32-.566 3.584.007"/>
                </svg>
                { !(title && width) && <div className="graph-not-ready">Loading data...</div> }
                { (title && width) && <h1 className="title">{ title }</h1> }
                { (title && width) && <AreaChart
                    datePattern={ '%d-%b-%y %H:%M:%S' }
                    width={ width - 40 }
                    height={ width / 2 }
                    xType={'time'}
                    axisLabels={ {x: labelX, y: labelY} }
                    areaColors={['#ff7700', '#000000']}
                    yDomainRange={ [0, this.highest * 1.5] }
                    interpolate={ false }
                    xTicks={ this.buffers.length }
                    yTicks={ 5 }
                    axes
                    grid
                    dataPoints
                    style={{
                        '.Area0': {
                            stroke: '#ff7700'
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