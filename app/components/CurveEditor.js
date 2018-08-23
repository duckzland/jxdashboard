import React from 'react';
import { isEmpty, findIndex, isEqual } from 'lodash';
import { LineChart } from 'react-easy-chart';


export default class CurveEditor extends React.Component {
    state = {
        data: [
            { x: 0, y: 0 },
            { x: 10, y: 10 },
            { x: 30, y: 30 },
            { x: 50, y: 50 },
            { x: 60, y: 60 },
            { x: 80, y: 80 },
            { x: 100, y: 100 }
        ]
    };

    yRatio = 0;
    xRatio = 0;
    ySpace = 0;
    xSpace = 0;
    yMax   = 0;

    constructor(props) {
        super(props);
        this.state.data = 'data' in props && props.data.length ? props.data : this.state.data;
        const initialWidth = window.innerWidth > 0 ? window.innerWidth : 200;
        this.state.windowWidth = Math.max(200, ((initialWidth - 140)) - 20);
        this.element = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.state.data, nextProps.data) && !isEmpty(nextProps.data)) {
            this.state.data = nextProps.data;
            this.setState(this.state);
        }
    }

    componentDidMount() {
        const el = this.element.current;
        const Points = el.querySelectorAll('.data-point');
        const domain = el.querySelector('.y.axis > .domain').getBoundingClientRect();
        const box = el.getBoundingClientRect();
        const { handleResize, handleStartDragging } =  this;

        window.addEventListener('resize', handleResize);
        Points.forEach((point, index) => {
            point.addEventListener('mousedown', (e) => { handleStartDragging(e, index) }, true);
        });

        this.yMax   = box.height;
        this.yRatio = domain.height / 100;
        this.xRatio = domain.width / 100;
        this.ySpace = box.height - domain.height;
        this.xSpace = box.width - domain.width - 20;
    }


    componentWillUnmount() {
        const Points = this.element.current.querySelectorAll('.data-point');
        const { handleResize, handleStartDragging } = this;
        window.removeEventListener('resize', handleResize);
        Points.forEach((point, index) => {
            point.removeEventListener('mousedown', (e) => { handleStartDragging(e, index) }, true);
        });
    }


    handleStartDragging = (e, index) => {
        const { handleDragging, handleStopDragging } = this;

        e.preventDefault();
        this.setState({
            drag: true,
            index: index
        });

        window.addEventListener('mousemove', handleDragging,     true);
        window.addEventListener('mouseup',   handleStopDragging, true);
    };


    handleDragging = (e) => {

        const { xSpace, xRatio, ySpace, yRatio, yMax, state } = this;
        const { drag, index, data } = state;
        const { offsetX, offsetY } = e;

        e.preventDefault();

        if (drag && index >= 0) {

            let x = (offsetX - xSpace) / xRatio;
            if (x < 0) {
                x = 0
            }
            if (x > 100) {
                x = 100;
            }

            let y = (yMax - offsetY - ySpace + 20) / yRatio;
            if (y < 0) {
                y = 0;
            }

            if (y > 100) {
                y = 100;
            }

            if (data[index - 1]) {
                if (x < data[index - 1]['x']) {
                    x = data[index - 1]['x'];
                }
            }

            if (data[index + 1]) {
                if (x > data[index + 1]['x']) {
                    x = data[index + 1]['x'];
                }
            }

            this.state.data[index] = { x: x, y: y };
            this.setState( this.state );
        }
    };

    handleStopDragging = (e) => {
        const { handleDragging, handleStopDragging, getCurve } = this;
        const { onChange } = this.props;

        window.removeEventListener('mousemove', handleDragging,     true);
        window.removeEventListener('mouseup',   handleStopDragging, true);

        this.setState({ drag: false, index: -1, x: 0, y: 0 });
        onChange && onChange(getCurve());
    };

    handleResize = () => {
        const initialWidth = window.innerWidth > 0 ? window.innerWidth : 200;
        this.setState({ windowWidth: Math.max(200, ((initialWidth - 140)) - 20) });
    };

    getCurve = () => {
        let curves = [];
        this.state.data && this.state.data.map((c) => {
            curves.push(Math.ceil(c.x) + '|' + Math.ceil(c.y));
        });
        return curves.join(', ');
    };

    render() {
        return (
            <div ref={ this.element } className="graph-content">
                <LineChart
                    data={ [this.state.data] }
                    xTicks={ this.state.data.length }
                    yTicks={ this.state.data.length }
                    width={ this.state.windowWidth }
                    height={ this.state.windowWidth / 2 }
                    axisLabels={{x: 'Fan Speed (%)', y: 'Detected Temperature (c)'}}
                    yDomainRange={[0, 100]}
                    xDomainRange={[0, 100]}
                    dataPoints
                    axes
                    grid
                    style={{
                      '.line0': {
                        stroke: 'green'
                      },
                      'circle.data-point': {
                        transition: 'none !important'
                      }
                    }}
                    />
            </div>
        )
    }

}